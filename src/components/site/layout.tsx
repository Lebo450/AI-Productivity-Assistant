import { ClientOnly, Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowUpRight, Menu, X, Mail, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./brand";
import { PUBLIC_CHAT_OPEN_EVENT, PublicChatWidget } from "./chat-widget";

import { siteConfig } from "@/lib/site-config";
const links = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/about", "About Us"],
  ["/contact", "Contact"],
] as const;
export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useLocation().pathname;
  return (
    <>
      <header className="site-header">
        <div className="container nav-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([to, label]) => (
              <Link to={to} key={to} className={pathname === to ? "nav-active" : ""}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">
                Client dashboard <ArrowUpRight />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
            <Button asChild>
              <a href={siteConfig.phoneHref}>
                <Phone /> {siteConfig.phone}
              </a>
            </Button>
          </div>
          <Button
            className="mobile-menu"
            variant="ghost"
            size="icon"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav className="mobile-nav">
            {links.map(([to, label]) => (
              <Link onClick={() => setOpen(false)} key={to} to={to}>
                {label}
              </Link>
            ))}
            <a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a>
            <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </a>
            <Link to="/dashboard">Client dashboard</Link>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <section className="call-band" aria-label="Call or WhatsApp us">
        <div className="container call-band-inner">
          <div>
            <h2>Ready for a website that brings in customers?</h2>
            <p>Call or WhatsApp us for a free, no-pressure chat about your business.</p>
          </div>
          <div className="call-band-actions">
            <Button size="lg" asChild>
              <a href={siteConfig.phoneHref}>
                <Phone /> Call {siteConfig.phone}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> WhatsApp us
              </a>
            </Button>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Brand />
            <p>
              Small business. Big possibilities.
              <br />
              Let's build your online presence.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            {links.map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h3>Your workspace</h3>
            <Link to="/dashboard">AI productivity tools</Link>
            <Link to="/auth">Client login</Link>
            <Link to="/responsible-ai">Responsible AI</Link>
            <button
              className="footer-chat"
              onClick={() => window.dispatchEvent(new Event(PUBLIC_CHAT_OPEN_EVENT))}
            >
              Ask our AI assistant
            </button>
          </div>

          <div>
            <h3>Get in touch</h3>
            {siteConfig.email ? (
              <a href={`mailto:${siteConfig.email}`}>
                <Mail />
                {siteConfig.email}
              </a>
            ) : (
              <p>Email address — to be added</p>
            )}
            <a href={siteConfig.phoneHref}>
              <Phone />
              {siteConfig.phone}
            </a>
            <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
              WhatsApp us
            </a>
            <Link to="/contact">
              Request a quote <ArrowUpRight />
            </Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Connect Digital. All rights reserved.</span>
          <div>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms of service</Link>
          </div>
        </div>
      </footer>
      <div className="mobile-contact-bar">
        <a href={siteConfig.phoneHref}>
          <Phone size={18} /> Call now
        </a>
        <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} /> WhatsApp
        </a>
      </div>
      <ClientOnly>
        <PublicChatWidget />
      </ClientOnly>
    </>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro container">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function QuoteCTA() {
  return (
    <section className="quote-band">
      <div className="container">
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2>Ready to connect with more customers?</h2>
        <p>Let's turn your ideas into a website you're proud to share.</p>
        <Button size="lg" asChild>
          <Link to="/contact">
            Let's build your website <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
