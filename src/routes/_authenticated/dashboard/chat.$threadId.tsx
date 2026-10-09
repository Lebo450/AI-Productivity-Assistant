import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { getConversation } from "@/lib/workspace.functions";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/site-config";
import { readableError } from "@/lib/ai/error-message";
import { toast } from "sonner";


const threadOptions = (id: string) =>
  queryOptions({
    queryKey: ["conversation", id],
    queryFn: () => getConversation({ data: { id } }),
  });
export const Route = createFileRoute("/_authenticated/dashboard/chat/$threadId")({
  head: () =>
    pageHead("Conversation", "A private conversation with the Connect Digital AI assistant."),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(threadOptions(params.threadId)),
  component: Thread,
});
function Thread() {
  const { threadId } = Route.useParams();
  const { data } = useSuspenseQuery(threadOptions(threadId));
  return (
    <ChatWindow
      key={threadId}
      id={threadId}
      initialMessages={data.messages as unknown as UIMessage[]}
    />
  );
}
const suggestions = [
  "Help me write a professional email.",
  "Summarise these meeting notes.",
  "Help me plan my workday.",
  "Create a website project checklist.",
  "Help me improve my business website.",
];
function ChatWindow({ id, initialMessages }: { id: string; initialMessages: UIMessage[] }) {
  const [input, setInput] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const query = useQueryClient();
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai",
        body: { kind: "chat", conversationId: id },
        headers: async () => {
          const { data } = await supabase.auth.getSession();
          return { Authorization: `Bearer ${data.session?.access_token || ""}` };
        },
      }),
    [id],
  );
  const { messages, sendMessage, status, error, stop } = useChat({
    id,
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message),
    onFinish: () => {
      query.invalidateQueries({ queryKey: ["workspace"] });
      query.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => {
    if (!busy) ref.current?.focus();
  }, [id, busy]);
  function send(text: string) {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput("");
    ref.current?.focus();
  }
  return (
    <div className="chat-window">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <div className="chat-empty">
              <span className="brand-mark">
                <span />
                <span />
              </span>
              <h2>What can we work on together?</h2>
              <div className="chat-suggestions">
                {suggestions.map((s) => (
                  <Button key={s} variant="outline" onClick={() => send(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent>
                  {m.parts.map((part, i) =>
                    part.type === "text" ? (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    ) : part.type === "reasoning" ? (
                      <details className="reasoning" key={i}>
                        <summary>Thinking</summary>
                        <p>{part.text}</p>
                      </details>
                    ) : null,
                  )}
                </MessageContent>
                {m.role === "assistant" && (
                  <MessageActions>
                    <MessageAction
                      tooltip="Copy response"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            m.parts
                              .filter((p) => p.type === "text")
                              .map((p) => p.text)
                              .join("\n"),
                          );
                          toast.success("Copied response");
                        } catch {
                          toast.error(
                            "Unable to copy. Please select and copy the response manually.",
                          );
                        }
                      }}
                    >
                      <Copy size={14} />
                    </MessageAction>
                  </MessageActions>
                )}
              </Message>
            ))
          )}
          {status === "submitted" && <Shimmer>Thinking…</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      {error && (
        <div className="error-alert" role="alert">
          {error.message}
        </div>
      )}
      <div className="chat-composer">
        <PromptInput onSubmit={({ text }) => send(text)}>
          <PromptInputTextarea
            ref={ref}
            aria-label="Message Connect Digital"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you like a hand with?"
          />
          <PromptInputFooter className="justify-end">
            <span className="chat-private">Private to your account</span>
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={!input.trim() && !busy}
              aria-label={busy ? "Stop response" : "Send message"}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
