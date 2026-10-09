import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, ArrowUpRight } from "lucide-react";
import { ToolHeading } from "@/components/workspace/tool-ui";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/site-config";
export const Route = createFileRoute("/_authenticated/dashboard/help")({
  head: () =>
    pageHead("Help & Support", "Find answers and support for your Connect Digital workspace."),
  component: () => (
    <>
      <ToolHeading
        title="Help & Support"
        description="A little guidance when you need it."
        icon={<LifeBuoy />}
      />
      <section className="help-section">
        {[
          [
            "How is my work saved?",
            "Your AI conversations are saved automatically. In the task planner, use Save Changes to store your editable plan in your account. Emails and meeting summaries are not saved permanently; copy your result before leaving.",
          ],
          [
            "What should I share with AI?",
            "Only information needed for the task. Do not enter passwords, sensitive personal information, or confidential business information.",
          ],
          [
            "What if generation fails?",
            "Your input remains available. Read the displayed error. Credit and access problems require a workspace administrator; failed requests are not automatically replayed.",
          ],
          [
            "Can I trust every result?",
            "AI can make mistakes. Verify facts, deadlines, responsibilities and wording before using or sharing any output.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
        <Button asChild>
          <Link to="/contact">
            Contact Connect Digital <ArrowUpRight />
          </Link>
        </Button>
        <Button variant="link" asChild>
          <Link to="/responsible-ai">Responsible AI notice</Link>
        </Button>
      </section>
    </>
  ),
});
