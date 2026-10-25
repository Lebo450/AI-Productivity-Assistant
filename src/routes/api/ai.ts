import { createFileRoute } from "@tanstack/react-router";
import { handleAI } from "@/lib/ai/service.server";
export const Route = createFileRoute("/api/ai")({
  staticData: { sitemap: false },
  server: { handlers: { POST: ({ request }) => handleAI(request) } },
});
