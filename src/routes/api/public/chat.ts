import { createFileRoute } from "@tanstack/react-router";
import { handlePublicChat } from "@/lib/ai/public-chat.server";

export const Route = createFileRoute("/api/public/chat")({
  server: { handlers: { POST: ({ request }) => handlePublicChat(request) } },
});
