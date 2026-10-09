import { describe, it, expect } from "vitest";
import {
  handlePublicChat,
  PUBLIC_CHAT_MAX_PER_WINDOW,
  PUBLIC_CHAT_MAX_PER_DAY,
} from "@/lib/ai/public-chat.server";
import { publicChatInstructions } from "@/lib/ai/prompts.server";

const chatRequest = (body: unknown, origin = "http://localhost:8080") =>
  new Request("http://localhost:8080/api/public/chat", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify(body),
  });

describe("Public visitor chat rules", () => {
  it("refuses requests that do not come from this website", async () => {
    const response = await handlePublicChat(
      chatRequest({ messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }] }, "https://not-connect-digital.test"),
    );
    expect(response.status).toBe(403);
  });
  it("refuses a request with no messages", async () => {
    expect((await handlePublicChat(chatRequest({ messages: [] }))).status).toBe(400);
  });
  it("refuses a request whose last message is not from the visitor", async () => {
    const response = await handlePublicChat(
      chatRequest({
        messages: [{ id: "1", role: "assistant", parts: [{ type: "text", text: "hello" }] }],
      }),
    );
    expect(response.status).toBe(400);
  });
  it("refuses an empty message", async () => {
    const response = await handlePublicChat(
      chatRequest({ messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "   " }] }] }),
    );
    expect(response.status).toBe(400);
  });
  it("keeps the free assistant within a bounded number of messages", () => {
    expect(PUBLIC_CHAT_MAX_PER_WINDOW).toBeLessThan(30);
    expect(PUBLIC_CHAT_MAX_PER_DAY).toBeLessThan(200);
    expect(PUBLIC_CHAT_MAX_PER_WINDOW).toBeLessThan(PUBLIC_CHAT_MAX_PER_DAY);
  });
  it("does not invent prices, results or testimonials", () => {
    expect(publicChatInstructions).toContain("Never invent prices");
    expect(publicChatInstructions).toContain("testimonials");
  });
});
