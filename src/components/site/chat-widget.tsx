import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Copy, MessageSquareText, Plus, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";


const STORAGE_KEY = "connect-digital-public-chat";
export const PUBLIC_CHAT_OPEN_EVENT = "connect-digital:open-chat";

const suggestions = [
  "Can you build a website for my small business?",
  "What is a one-page website?",
  "How do I request a quote?",
];

function readStoredMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function PublicChatWidget() {
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [stored] = useState<UIMessage[]>(() => readStoredMessages());
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/public/chat" }),
    [],
  );
  const { messages, sendMessage, status, error, stop, setMessages } = useChat({
    id: "public-chat",
    messages: stored,
    transport,
    onError: (e) => toast.error(e.message),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    const show = () => {
      setRevealed(true);
      setOpen(true);
    };
    window.addEventListener(PUBLIC_CHAT_OPEN_EVENT, show);
    return () => window.removeEventListener(PUBLIC_CHAT_OPEN_EVENT, show);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // A full or blocked browser storage area must not break the conversation.
    }
  }, [messages]);

  useEffect(() => {
    if (open && !busy) ref.current?.focus();
  }, [open, busy]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput("");
    ref.current?.focus();
  }

  function startNewChat() {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing stored, so there is nothing left to clear.
    }
    setInput("");
    ref.current?.focus();
  }

  return (
    <>
      {revealed && (
        <div className={`chat-panel${open ? "" : " chat-panel-hidden"}`} role="dialog" aria-label="Chat with Connect Digital">
          <div className="chat-panel-head">
            <div className="chat-panel-title">
              <span className="brand-mark">
                <span />
                <span />
              </span>
              <div>
                <strong>Ask Connect Digital</strong>
                <span>Website questions, answered plainly.</span>
              </div>
            </div>
            <div className="chat-panel-tools">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={startNewChat}
                aria-label="Start a new chat"
                title="Start a new chat"
              >
                <Plus />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                title="Close chat"
              >
                <X />
              </Button>
            </div>
          </div>
          <Conversation className="chat-panel-body">
            <ConversationContent className="chat-panel-messages">
              {messages.length === 0 ? (
                <div className="chat-panel-empty">
                  <h2>How can we help?</h2>
                  <p>Ask about websites, pages or getting started. No account needed.</p>
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
                              toast.error("Unable to copy. Please select and copy manually.");
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
          <div className="chat-panel-composer">
            <PromptInput onSubmit={({ text }) => send(text)}>
              <PromptInputTextarea
                ref={ref}
                aria-label="Message the Connect Digital assistant"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your website…"
              />
              <PromptInputFooter className="justify-end">
                <span className="chat-private">
                  AI answers can be wrong —{" "}
                  <Link to="/responsible-ai" onClick={() => setOpen(false)}>
                    see how we use AI
                  </Link>
                </span>
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
      )}
      {!open && (
        <button
          className="chat-bubble"
          onClick={() => {
            setRevealed(true);
            setOpen(true);
          }}
          aria-label="Chat with Connect Digital"
        >
          <MessageSquareText size={18} />
          <span>Ask us</span>
        </button>
      )}
    </>
  );
}
