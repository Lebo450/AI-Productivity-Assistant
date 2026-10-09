import type { ZodType } from "zod";
import {
  NoObjectGeneratedError,
  Output,
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";
import { createClient } from "@supabase/supabase-js";
import { withLovableAiGatewayRunIdHeader } from "./run-id.ts";
import { errorDetails, gateway, gatewayOptions as options } from "./gateway.server.ts";
import { emailSchema, meetingSchema, planSchema } from "./schemas";
import { baseInstructions, toolInstructions } from "./prompts.server";
import type { Database, Json } from "@/integrations/supabase/types";

export async function handleAI(request: Request) {
  try {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    const auth = request.headers.get("authorization");
    if (!url || !key)
      return Response.json({ error: "Accounts require Cloud configuration." }, { status: 503 });
    if (!auth?.startsWith("Bearer "))
      return Response.json({ error: "Sign in to use AI tools." }, { status: 401 });
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: { Authorization: auth },
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data: userData, error: authError } = await client.auth.getUser(auth.slice(7));
    if (authError || !userData.user)
      return Response.json(
        { error: "Your session has expired. Please sign in again." },
        { status: 401 },
      );
    const body = await request.json();
    if (body.kind === "chat") {
      const id = body.conversationId;
      if (typeof id !== "string")
        return Response.json({ error: "Choose a conversation first." }, { status: 400 });
      const { data: conversation, error } = await client
        .from("conversations")
        .select("*")
        .eq("id", id)
        .eq("user_id", userData.user.id)
        .single();
      if (error) return Response.json({ error: "Conversation not found." }, { status: 404 });
      const incoming = body.messages as UIMessage[];
      if (!Array.isArray(incoming) || incoming.at(-1)?.role !== "user")
        return Response.json({ error: "A user message is required." }, { status: 400 });
      const last = incoming.at(-1);
      if (!last || !last.parts.some((p) => p.type === "text" && p.text.trim()))
        return Response.json({ error: "Enter a message." }, { status: 400 });
      const history = (conversation.messages as unknown as UIMessage[]).concat(last);
      if (JSON.stringify(history).length > 100000)
        return Response.json(
          { error: "This conversation is too long. Start a new chat." },
          { status: 400 },
        );
      const title =
        conversation.title === "New conversation"
          ? last.parts
              .filter((p) => p.type === "text")
              .map((p) => p.text)
              .join(" ")
              .slice(0, 70)
          : conversation.title;
      const saved = await client
        .from("conversations")
        .update({
          messages: history as unknown as Json,
          title,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", userData.user.id);
      if (saved.error)
        return Response.json(
          { error: "Your message could not be saved. Please try again." },
          { status: 500 },
        );
      const g = await gateway(request);
      const result = streamText({
        model: g.model,
        instructions: baseInstructions,
        messages: await convertToModelMessages(history),
        providerOptions: options,
        maxRetries: 0,
        abortSignal: request.signal,
      });
      const response = result.toUIMessageStreamResponse({
        originalMessages: history,
        sendReasoning: true,
        onError: (error) => g.getError()?.message || errorDetails(error).message,
        onFinish: async ({ messages }) => {
          const r = await client
            .from("conversations")
            .update({ messages: messages as unknown as Json, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("user_id", userData.user.id);
          if (r.error)
            throw new Error(
              "The response was generated but could not be saved. Please copy it before leaving.",
            );
        },
      });
      const wrapped = await withLovableAiGatewayRunIdHeader(response, g.run);
      const denied = g.getError();
      if (denied)
        return Response.json(
          { error: denied.message },
          { status: denied.status, headers: wrapped.headers },
        );
      return wrapped;
    }
    if (
      !["email", "meeting", "plan"].includes(body.kind) ||
      !body.inputs ||
      typeof body.inputs !== "object"
    )
      return Response.json({ error: "Valid tool inputs are required." }, { status: 400 });
    const input = JSON.stringify(body.inputs);
    if (input.length > 35000)
      return Response.json(
        { error: "Please shorten your input to under 35,000 characters." },
        { status: 400 },
      );
    const required =
      body.kind === "email"
        ? ["purpose", "recipient", "points"]
        : body.kind === "meeting"
          ? ["notes"]
          : ["description", "goal"];
    if (required.some((k) => typeof body.inputs[k] !== "string" || !body.inputs[k].trim()))
      return Response.json({ error: "Please complete the required fields." }, { status: 400 });
    const g = await gateway(request);
    const schema: ZodType<unknown> =
      body.kind === "email" ? emailSchema : body.kind === "meeting" ? meetingSchema : planSchema;
    const result = streamText({
      model: g.model,
      instructions: toolInstructions(body.kind),
      messages: [
        { role: "user", content: `Actual user inputs:\n${input}\nKeep the result concise.` },
      ],
      output: Output.object({ schema }),
      providerOptions: options,
      maxRetries: 0,
      abortSignal: request.signal,
    });
    const stream = new ReadableStream({
      async start(controller) {
        const encode = (v: unknown) =>
          controller.enqueue(new TextEncoder().encode(JSON.stringify(v) + "\n"));
        try {
          for await (const delta of result.textStream) {
            encode({ type: "progress", text: delta });
          }
          let output;
          try {
            output = await result.output;
          } catch (error) {
            if (NoObjectGeneratedError.isInstance(error)) {
              try {
                output = schema.parse(JSON.parse(error.text || ""));
              } catch {
                throw new Error("AI output could not be structured. No result was saved.");
              }
            } else throw error;
          }
          if (!output) throw new Error("AI returned no usable output.");
          encode({ type: "result", output });
        } catch (error) {
          encode({ type: "error", message: g.getError()?.message || errorDetails(error).message });
        } finally {
          controller.close();
        }
      },
      cancel() {},
    });
    const wrapped = await withLovableAiGatewayRunIdHeader(
      new Response(stream, {
        headers: { "content-type": "application/x-ndjson", "cache-control": "no-cache" },
      }),
      g.run,
    );
    const failed = g.getError();
    return failed ? Response.json({ error: failed.message }, { status: failed.status }) : wrapped;
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    const e = errorDetails(error);
    return Response.json({ error: e.message }, { status: e.status });
  }
}
