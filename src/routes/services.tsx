import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageIntro, QuoteCTA } from "@/components/site/layout";
import { ServiceGrid } from "@/components/site/service-grid";
import { pageHead } from "@/lib/site-config";
export const Route = createFileRoute("/services")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "Website Design Services",
      "Small business websites, one-page and multi-page sites, website redesigns, landing pages and basic SEO. Request a free website quote from Connect Digital.",
      "/services",
    ),
  component: () => (
    <SiteLayout>
      <PageIntro
        eyebrow="OUR SERVICES"
        title="The right website. For your business."
        description="Thoughtful design, practical features, and a professional presence built around your goals."
      />
      <section className="container section section-topless">
        <ServiceGrid detailed />
      </section>
      <QuoteCTA />
    </SiteLayout>
  ),
});
