import { createOpenAI } from "@ai-sdk/openai";
import { APICallError } from "ai";

import { createLovableAiGatewayRunIdFetch } from "./run-id.ts";

export function errorDetails(error: unknown) {
  if (APICallError.isInstance(error)) {
    let message = error.message;
    try {
      const body = JSON.parse(error.responseBody || "{}");
      message = body.error?.message || body.message || message;
    } catch {
      // Preserve the original safe error when the response is not JSON.
    }
    return { status: error.statusCode || 500, message };
  }
  return {
    status: 500,
    message:
      error instanceof Error ? error.message : "The AI request failed. Please try again later.",
  };
}

export async function gateway(request: Request) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key)
    throw new Error("AI setup requires the workspace AI key. Ask the owner to enable Lovable AI.");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const blocked = await supabaseAdmin
    .from("ai_access_state")
    .select("*")
    .eq("id", "gateway")
    .maybeSingle();
  if (blocked.error) throw new Error("AI availability could not be checked.");
  if (blocked.data?.blocked)
    throw new Error(
      blocked.data.reason || "AI access is paused. A workspace administrator must restore access.",
    );
  const run = createLovableAiGatewayRunIdFetch(
    request.headers.get("X-Lovable-AIG-Run-ID") || undefined,
  );
  let upstreamError: { status: number; message: string } | undefined;
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const response = await run.fetch(input, init);
      if (!response.ok) {
        let body: { message?: string; error?: { message?: string } } = {};
        try {
          body = await response.clone().json();
        } catch {
          // Preserve the status-derived error for non-JSON responses.
        }
        upstreamError = {
          status: response.status,
          message: body.error?.message || body.message || `AI request failed (${response.status}).`,
        };
        if (response.status === 402 || response.status === 403) {
          const r = await supabaseAdmin.from("ai_access_state").upsert({
            id: "gateway",
            blocked: true,
            reason: upstreamError.message,
            status: response.status,
            updated_at: new Date().toISOString(),
          });
          if (r.error)
            throw new Error("AI access was denied and the paused state could not be stored.");
        }
      }
      return response;
    },
  });
  return { run, model: provider.responses("openai/gpt-6-astra"), getError: () => upstreamError };
}

export const gatewayOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
};
