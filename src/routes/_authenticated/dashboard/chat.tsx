import { createFileRoute, Link, useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessagesSquare, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { workspaceOptions } from "./route";
import { createConversation } from "@/lib/workspace.functions";
import { pageHead } from "@/lib/site-config";
import { toast } from "sonner";
import { useState } from "react";
export const Route = createFileRoute("/_authenticated/dashboard/chat")({
  head: () => pageHead("AI Chat", "Your private AI conversations, saved securely to your account."),
  component: ChatLayout,
});
function ChatLayout() {
  const { data } = useSuspenseQuery(workspaceOptions);
  const create = useServerFn(createConversation);
  const query = useQueryClient();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [busy, setBusy] = useState(false);
  async function newChat() {
    setBusy(true);
    try {
      const c = await create();
      await query.invalidateQueries({ queryKey: ["workspace"] });
      await navigate({ to: "/dashboard/chat/$threadId", params: { threadId: c.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Conversation could not be created.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="chat-page-title">
        <div>
          <span className="eyebrow">YOUR THINKING PARTNER</span>
          <h1>AI Chat</h1>
          <p>A conversation can be a good place to start.</p>
        </div>
        <Button onClick={newChat} disabled={busy}>
          <Plus />
          New Chat
        </Button>
      </div>
      <div className="chat-layout">
        <aside className="thread-list">
          <h3>Your conversations</h3>
          {data.conversations.length ? (
            data.conversations.map((c) => (
              <Link
                to="/dashboard/chat/$threadId"
                params={{ threadId: c.id }}
                key={c.id}
                className={path.endsWith(c.id) ? "active" : ""}
              >
                <MessagesSquare size={15} />
                <span>{c.title}</span>
              </Link>
            ))
          ) : (
            <p>No conversations yet.</p>
          )}
        </aside>
        {path === "/dashboard/chat" ? (
          <div className="chat-start">
            <span className="brand-mark">
              <span />
              <span />
            </span>
            <h2>A little help goes a long way.</h2>
            <p>Start a conversation. Your chats are saved privately.</p>
            <Button onClick={newChat} disabled={busy}>
              Start your first chat <ArrowRight />
            </Button>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </>
  );
}
