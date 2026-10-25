import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Phone, MessageSquare, CheckCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageIntro } from "@/components/site/layout";
import { pageHead, siteConfig } from "@/lib/site-config";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "Contact Us for a Website Quote",
      "Call or WhatsApp 084 898 7801, or send your project details to request a personalised website quote from Connect Digital. No pressure, no jargon.",
      "/contact",
    ),
  component: Contact,
});
function Contact() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="LET'S CONNECT"
        title="Your next chapter starts with a conversation."
        description="Tell us about your business and the website you have in mind. We'll take it from there."
      />
      <section className="container contact-grid section-topless section">
        <div>
          <h2>Let's bring your ideas to life.</h2>
          <p>
            No pressure. No complicated jargon.
            <br />
            Just a conversation about your business.
          </p>
          <div className="contact-item">
            <Mail />
            <div>
              <strong>Email us</strong>
              <p>{siteConfig.email || "Email address — to be added"}</p>
            </div>
          </div>
          <div className="contact-item">
            <Phone />
            <div>
              <strong>Give us a call</strong>
              <p>
                <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
              </p>
            </div>
          </div>
          <div className="contact-item">
            <MessageSquare />
            <div>
              <strong>WhatsApp us</strong>
              <p>
                <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                  Send a WhatsApp message
                </a>
              </p>
            </div>
          </div>
          <div className="contact-item">
            <MapPin />
            <div>
              <strong>Where we are</strong>
              <p>{siteConfig.address}</p>
            </div>
          </div>
          <div className="soft-callout">
            <MessageSquare />
            <h3>Not sure what you need?</h3>
            <p>
              Share a little about your business. We can help you find the right starting point.
            </p>
          </div>
        </div>
        <form
          className="form-panel"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            setBusy(true);
            setStatus("");
            const f = new FormData(e.currentTarget);
            const val = (k: string) => String(f.get(k) || "").trim();
            const text = [
              "Hi Connect Digital, I'd like a quote for a website.",
              "",
              `Name: ${val("full_name")}`,
              `Business: ${val("business_name")}`,
              `Email: ${val("email")}`,
              val("phone") && `Phone: ${val("phone")}`,
              `Website type: ${val("website_type")}`,
              val("budget") && `Budget: ${val("budget")}`,
              `Project: ${val("description")}`,
            ]
              .filter((l) => l !== "")
              .join("\n")
              .replace(/\n\n/, "\n\n");
            const url = `https://wa.me/27848987801?text=${encodeURIComponent(text)}`;
            setWaUrl(url);
            // Open straight away (while the click still counts) so browsers don't block it.
            window.open(url, "_blank", "noopener,noreferrer");
            const { error } = await supabase.from("contact_requests").insert({
              full_name: val("full_name"),
              business_name: val("business_name"),
              email: val("email"),
              phone: val("phone") || null,
              website_type: val("website_type"),
              budget: val("budget") || null,
              description: val("description"),
            });
            setStatus(
              error
                ? `We couldn't save a copy of your request, but you can still send it on WhatsApp.`
                : "Your request has been received. Press Send in WhatsApp so it reaches us.",
            );
            setBusy(false);
            if (!error) form.reset();
          }}
        >
          <h2>Tell us about your project</h2>
          <p className="form-subtitle">A few details to help us get started.</p>
          <div className="form-grid">
            <label>
              Full name <span>*</span>
              <input
                name="full_name"
                required
                minLength={2}
                maxLength={200}
                placeholder="Your full name"
              />
            </label>
            <label>
              Business name <span>*</span>
              <input
                name="business_name"
                required
                maxLength={200}
                placeholder="Your business name"
              />
            </label>
            <label>
              Email address <span>*</span>
              <input
                name="email"
                required
                type="email"
                maxLength={320}
                placeholder="you@yourbusiness.com"
              />
            </label>
            <label>
              Phone number <small>(optional)</small>
              <input name="phone" type="tel" placeholder="Your phone number" />
            </label>
            <label>
              Type of website <span>*</span>
              <select name="website_type" required defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                <option>Small business website</option>
                <option>One-page website</option>
                <option>Multi-page website</option>
                <option>Website redesign</option>
                <option>Landing page</option>
                <option>Basic SEO</option>
                <option>I'm not sure yet</option>
              </select>
            </label>
            <label>
              Estimated budget <small>(optional)</small>
              <input name="budget" placeholder="Budget and currency" />
            </label>
          </div>
          <label>
            Tell us about your project <span>*</span>
            <textarea
              name="description"
              minLength={10}
              maxLength={10000}
              required
              rows={5}
              placeholder="What does your business do, and what would you like your website to achieve?"
            />
          </label>
          <p className="privacy-note">Your details are used only to respond to your enquiry.</p>
          {status && (
            <div
              role="status"
              className={status.startsWith("Your request has") ? "success-alert" : "error-alert"}
            >
              {status.startsWith("Your request has") && <CheckCircle size={18} />} {status}
            </div>
          )}
          {waUrl && (
            <p className="privacy-note">
              WhatsApp didn't open?{" "}
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                Tap here to send your quote request on WhatsApp
              </a>
              .
            </p>
          )}
          <Button size="lg" disabled={busy}>
            {busy ? "Submitting…" : "Request a Quote"}
            <ArrowRight />
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}
