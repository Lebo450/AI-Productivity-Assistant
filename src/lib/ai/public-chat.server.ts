import { z } from "zod";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { withLovableAiGatewayRunIdHeader } from "./run-id.ts";
import { errorDetails, gateway, gatewayOptions } from "./gateway.server.ts";
import { publicChatInstructions } from "./prompts.server";

export const PUBLIC_CHAT_WINDOW_MINUTES = 15;
export const PUBLIC_CHAT_MAX_PER_WINDOW = 12;
export const PUBLIC_CHAT_MAX_PER_DAY = 60;
export const PUBLIC_CHAT_RETENTION_DAYS = 3;
const HASH_SALT = "connect-digital-public-chat-v1";
const MAX_HISTORY_CHARS = 40000;

const bodySchema = z.object({
  messages: z.array(z.unknown()).min(1).max(30),
});

export function sameOrigin(request: Request) {
  const host = new URL(request.url).host;
  const source = request.headers.get("origin") || request.headers.get("referer");
  if (!source) return false;
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

export function clientIp(request: Request) {
  const direct = request.headers.get("cf-connecting-ip");
  if (direct) return direct;
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function hashIp(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${HASH_SALT}:${value}`),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function handlePublicChat(request: Request) {
  try {
    if (!sameOrigin(request))
      return Response.json(
        { error: "This assistant is only available from the Connect Digital website." },
        { status: 403 },
      );

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success)
      return Response.json({ error: "A chat message is required." }, { status: 400 });

    const incoming = parsed.data.messages as UIMessage[];
    const last = incoming.at(-1);
    if (
      !last ||
      last.role !== "user" ||
      !last.parts?.some((part) => part.type === "text" && part.text.trim())
    )
      return Response.json({ error: "Enter a message." }, { status: 400 });
    if (JSON.stringify(incoming).length > MAX_HISTORY_CHARS)
      return Response.json(
        { error: "This conversation is too long. Start a new chat." },
        { status: 400 },
      );

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ipHash = await hashIp(clientIp(request));
    const dayStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const windowStart = new Date(
      Date.now() - PUBLIC_CHAT_WINDOW_MINUTES * 60 * 1000,
    ).toISOString();
    const [day, window] = await Promise.all([
      supabaseAdmin
        .from("public_chat_usage")
        .select("*", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", dayStart),
      supabaseAdmin
        .from("public_chat_usage")
        .select("*", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", windowStart),
    ]);
    if (day.error || window.error)
      return Response.json(
        { error: "The assistant is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    if (
      (window.count ?? 0) >= PUBLIC_CHAT_MAX_PER_WINDOW ||
      (day.count ?? 0) >= PUBLIC_CHAT_MAX_PER_DAY
    )
      return Response.json(
        {
          error:
            "You've reached the free assistant limit. Please wait a few minutes, or use the contact form and we'll reply properly.",
        },
        { status: 429 },
      );

    const inserted = await supabaseAdmin
      .from("public_chat_usage")
      .insert({ ip_hash: ipHash });
    if (inserted.error)
      return Response.json(
        { error: "The assistant is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    void supabaseAdmin
      .from("public_chat_usage")
      .delete()
      .lt(
        "created_at",
        new Date(Date.now() - PUBLIC_CHAT_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      );

    const g = await gateway(request);
    const result = streamText({
      model: g.model,
      instructions: publicChatInstructions,
      messages: await convertToModelMessages(incoming),
      providerOptions: gatewayOptions,
      maxRetries: 0,
      abortSignal: request.signal,
    });
    const response = result.toUIMessageStreamResponse({
      originalMessages: incoming,
      sendReasoning: true,
      onError: (error) => g.getError()?.message || errorDetails(error).message,
    });
    const wrapped = await withLovableAiGatewayRunIdHeader(response, g.run);
    const denied = g.getError();
    if (denied)
      return Response.json(
        { error: denied.message },
        { status: denied.status, headers: wrapped.headers },
      );
    return wrapped;
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    const e = errorDetails(error);
    return Response.json({ error: e.message }, { status: e.status });
  }
}
