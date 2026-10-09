import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageIntro } from "@/components/site/layout";
import { pageHead, siteConfig } from "@/lib/site-config";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      "Contact us",
      "Tell Connect Digital about your business and request a personalised website quote.",
    ),
  component: Contact,
});
function Contact() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
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
              <p>{siteConfig.phone || "Phone number — to be added"}</p>
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
                ? `Your request could not be submitted: ${error.message}`
                : "Your request has been received securely. Thank you for contacting Connect Digital.",
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
          <Button size="lg" disabled={busy}>
            {busy ? "Submitting…" : "Request a Quote"}
            <ArrowRight />
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}
