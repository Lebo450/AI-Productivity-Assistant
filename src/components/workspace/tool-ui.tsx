import { useRef, useState, type ReactNode } from "react";
import { Copy, Check, ShieldCheck, Code2, LoaderCircle, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateTool } from "@/lib/ai/client";
import { toast } from "sonner";
export function ToolHeading({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="tool-heading">
      <span className="tool-icon teal">{icon}</span>
      <div>
        <span className="eyebrow">YOUR AI TOOLKIT</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Copied to clipboard");
          setTimeout(() => setCopied(false), 2000);
        } catch {
          toast.error("Clipboard unavailable. Select the text and copy it manually.");
        }
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : label}
    </Button>
  );
}
export function PromptPreview({ kind, inputs }: { kind: string; inputs: Record<string, unknown> }) {
  return (
    <details className="prompt-preview">
      <summary>
        <Code2 size={15} />
        Structured prompt preview
      </summary>
      <p>
        {kind === "meeting"
          ? "Summarise only these notes. Do not invent missing decisions, responsibilities, or deadlines."
          : kind === "email"
            ? "Draft an email using the purpose, recipient, facts, tone, length, and language below."
            : "Suggest a practical plan using the goal, priority, available time, and supplied deadline. Estimates are not guarantees."}
      </p>
      <dl>
        {Object.entries(inputs).map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{Array.isArray(value) ? value.join(", ") : String(value || "Not specified")}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
export function ToolNotice() {
  return (
    <div className="tool-notice">
      <ShieldCheck size={16} />
      <span>
        Review your output. Don't include passwords, sensitive personal information, or confidential
        business information.
      </span>
    </div>
  );
}
export function useGeneration<T>(kind: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState<T | null>(null);
  const abort = useRef<AbortController | null>(null);
  async function generate(inputs: Record<string, unknown>) {
    abort.current = new AbortController();
    setBusy(true);
    setError("");
    try {
      const result = (await generateTool(kind, inputs, abort.current.signal)) as T;
      setOutput(result);
      return result;
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") setError(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  return {
    busy,
    error,
    output,
    setOutput,
    generate,
    stop: () => abort.current?.abort(),
    clear: () => {
      abort.current?.abort();
      setOutput(null);
      setError("");
    },
  };
}
export function GenerateButton({
  busy,
  stop,
  label,
}: {
  busy: boolean;
  stop: () => void;
  label: string;
}) {
  return busy ? (
    <Button type="button" variant="outline" onClick={stop}>
      <Square />
      Stop generation
    </Button>
  ) : (
    <Button type="submit">
      {label}
      <Check size={15} />
    </Button>
  );
}
export function LoadingOutput() {
  return (
    <div className="output-empty" role="status">
      <LoaderCircle className="animate-spin" />
      <h3>Working on your draft…</h3>
      <p>Good ideas deserve a little thought.</p>
    </div>
  );
}
