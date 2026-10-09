import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPen, RotateCcw, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ToolHeading,
  CopyButton,
  PromptPreview,
  ToolNotice,
  useGeneration,
  GenerateButton,
  LoadingOutput,
} from "@/components/workspace/tool-ui";
import { pageHead } from "@/lib/site-config";
export const Route = createFileRoute("/_authenticated/dashboard/notes")({
  head: () =>
    pageHead(
      "Meeting Notes Summarizer",
      "Turn raw meeting notes into summaries, decisions and action items without inventing missing details.",
    ),
  component: Notes,
});
const sections = {
  summary: "Short summary",
  discussion: "Key discussion points",
  decisions: "Decisions made",
  actions: "Action items",
  responsibilities: "Assigned responsibilities",
  deadlines: "Deadlines",
  questions: "Follow-up questions",
};
function Notes() {
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState(Object.keys(sections));
  const g = useGeneration<Record<string, string>>("meeting");
  const inputs = { notes, sections: selected.map((s) => sections[s as keyof typeof sections]) };
  return (
    <>
      <ToolHeading
        title="Meeting Notes Summarizer"
        description="Less sifting through notes. More clarity on what comes next."
        icon={<NotebookPen />}
      />
      <div className="tool-columns">
        <form
          className="tool-input-panel"
          onSubmit={(e) => {
            e.preventDefault();
            g.generate(inputs);
          }}
        >
          <h2>Bring your notes together.</h2>
          <label>
            Raw meeting notes <span>*</span>
            <textarea
              required
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your meeting notes here…"
            />
          </label>
          <fieldset className="summary-options">
            <legend>Include in your summary</legend>
            {Object.entries(sections).map(([k, t]) => (
              <label key={k}>
                <input
                  type="checkbox"
                  checked={selected.includes(k)}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? [...selected, k] : selected.filter((s) => s !== k),
                    )
                  }
                />
                {t}
              </label>
            ))}
          </fieldset>
          <PromptPreview kind="meeting" inputs={inputs} />
          {g.error && (
            <div className="error-alert" role="alert">
              {g.error}
            </div>
          )}
          <div className="tool-actions">
            <GenerateButton busy={g.busy} stop={g.stop} label="Summarize Notes" />
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setNotes("");
                g.clear();
              }}
            >
              <Eraser />
              Clear Notes
            </Button>
          </div>
        </form>
        <section className="tool-output-panel">
          <div className="output-title">
            <h2>Your meeting, made clear.</h2>
          </div>
          {g.busy ? (
            <LoadingOutput />
          ) : g.output ? (
            <>
              {Object.entries(sections)
                .filter(([k]) => selected.includes(k))
                .map(([k, t]) => (
                  <label key={k}>
                    {t}
                    <textarea
                      rows={k === "summary" ? 4 : 3}
                      value={g.output?.[k] || ""}
                      onChange={(e) =>
                        g.setOutput(g.output ? { ...g.output, [k]: e.target.value } : null)
                      }
                    />
                  </label>
                ))}
              <div className="tool-actions">
                <CopyButton
                  text={Object.entries(sections)
                    .filter(([k]) => selected.includes(k))
                    .map(([k, t]) => `${t}\n${g.output?.[k] || ""}`)
                    .join("\n\n")}
                  label="Copy Summary"
                />
                <CopyButton text={g.output["actions"] || ""} label="Copy Action Items" />
                <Button variant="ghost" onClick={() => g.generate(inputs)}>
                  <RotateCcw />
                  Regenerate
                </Button>
              </div>
            </>
          ) : (
            <div className="output-empty">
              <NotebookPen />
              <h3>Find the signal in your notes.</h3>
              <p>Decisions and deadlines appear only when specified.</p>
            </div>
          )}
          <ToolNotice />
        </section>
      </div>
    </>
  );
}
