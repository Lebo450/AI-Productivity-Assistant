import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ArrowRight,
  Clock3,
  FileText,
  ShieldCheck,
  Globe,
  MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { tools } from "@/components/workspace/layout";
import { workspaceOptions } from "./route";
import { pageHead } from "@/lib/site-config";
import studio from "@/assets/business-studio.jpg";
export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () =>
    pageHead(
      "Dashboard home",
      "Welcome to Connect Digital. Get started with your AI productivity tools.",
    ),
  component: DashboardHome,
});
function DashboardHome() {
  const { data } = useSuspenseQuery(workspaceOptions);
  const activity = [
    ...data.conversations.map((c) => ({
      id: c.id,
      title: c.title,
      kind: "Conversation",
      date: c.updated_at,
    })),
    ...data.plans.map((p) => ({
      id: p.id,
      title: p.title,
      kind: "Saved plan",
      date: p.updated_at,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  return (
    <>
      <div className="dashboard-welcome">
        <span className="eyebrow">A LITTLE MORE CLARITY. A LITTLE LESS BUSYWORK.</span>
        <h1>
          Welcome to Connect Digital<span>.</span>
        </h1>
        <p>Your ideas, a helping hand, and the tools to move forward.</p>
      </div>
      <section className="workspace-banner">
        <div>
          <span className="banner-label">YOUR EVERYDAY PRODUCTIVITY PARTNER</span>
          <h2>
            Make room for the
            <br />
            work that matters.
          </h2>
          <p>
            Write with confidence. Bring clarity to your notes.
            <br />
            Turn your next big idea into a practical plan.
          </p>
          <Button variant="default" asChild>
            <Link to="/dashboard/email">
              Start with an email <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="banner-illustration" aria-hidden="true">
          <div className="illustration-mail">
            <MailGraphic />
          </div>
          <div className="illustration-note">
            <span className="illustration-line" />
            <span className="illustration-line short" />
            <span className="illustration-task">
              <CheckGraphic />
              Your next step
            </span>
            <span className="illustration-task">
              <CheckGraphic />A little more clarity
            </span>
            <span className="illustration-line short" />
          </div>
        </div>
      </section>
      <div className="dash-section-title">
        <h2>Your AI toolkit</h2>
        <span>Good ideas start here.</span>
      </div>
      <div className="tool-card-grid">
        {tools.map(({ to, title, description, icon: Icon, color }) => (
          <Link to={to} className="tool-card" key={to}>
            <div className="tool-card-top">
              <span className={`tool-icon ${color}`}>
                <Icon />
              </span>
              <ArrowUpRight size={17} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <span className="tool-card-link">
              Open tool <ArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>
      <div className="dashboard-lower">
        <section>
          <div className="dash-section-title">
            <h2>Recent activity</h2>
            <Clock3 size={16} />
          </div>
          <div className="activity-panel">
            {activity.length ? (
              activity.map((a) => (
                <div className="activity-row" key={a.id}>
                  <FileText size={18} />
                  <div>
                    <strong>{a.title}</strong>
                    <span>
                      {a.kind} · {new Date(a.date).toLocaleDateString()}
                    </span>
                  </div>
                  {a.kind === "Conversation" ? (
                    <Link to="/dashboard/chat/$threadId" params={{ threadId: a.id }}>
                      <ArrowUpRight size={16} />
                    </Link>
                  ) : (
                    <Link to="/dashboard/planner">
                      <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-activity">
                <span>
                  <Clock3 />
                </span>
                <h3>A fresh start.</h3>
                <p>
                  Your saved plans and conversations will appear here.
                  <br />
                  Choose a tool to create something useful.
                </p>
                <Button variant="link" asChild>
                  <Link to="/dashboard/planner">
                    Plan your first task <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
        <section>
          <div className="dash-section-title">
            <h2>Quick access</h2>
          </div>
          <div className="quick-access">
            {[
              { to: "/dashboard/email", title: "Write a professional email", icon: FileText },
              { to: "/dashboard/planner", title: "Plan your workday", icon: Clock3 },
              { to: "/dashboard/chat", title: "Ask your AI assistant", icon: MessagesSquare },
            ].map(({ to, title, icon: Icon }) => (
              <Link to={to} key={to}>
                <span>
                  <Icon size={17} />
                </span>
                {title}
                <ChevronGraphic />
              </Link>
            ))}
          </div>
          <div className="review-note">
            <ShieldCheck />
            <div>
              <strong>AI assists. You decide.</strong>
              <p>Always review generated content before using or sharing it.</p>
              <Link to="/responsible-ai">
                Our responsible AI approach <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <section className="website-promo">
        <div>
          <span className="eyebrow">YOUR BUSINESS, BETTER CONNECTED</span>
          <h2>A website you're proud to share.</h2>
          <p>Modern, affordable websites built around your business.</p>
          <Button variant="outline" asChild>
            <Link to="/services">
              Explore our website services <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <img
          src={studio}
          width={1536}
          height={1024}
          loading="lazy"
          alt="Modern small business website on a laptop"
        />
      </section>
    </>
  );
}
function MailGraphic() {
  return (
    <svg viewBox="0 0 90 70" fill="none">
      <rect x="3" y="4" width="84" height="62" rx="7" />
      <path d="m5 10 40 30 40-30M5 63l29-26m51 26L56 37" />
    </svg>
  );
}
function CheckGraphic() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="3" />
      <path d="m4 8 3 3 5-6" />
    </svg>
  );
}
function ChevronGraphic() {
  return <ArrowRight size={14} />;
}
