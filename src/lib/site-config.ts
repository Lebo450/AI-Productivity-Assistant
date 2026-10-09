export const siteConfig = {
  name: "Connect Digital",
  email: "",
  phone: "",
  socialUrl: "",
  biography:
    "Company story placeholder — add your background, founding story, and team information here.",
};
export const responsibleNotice =
  "Responsible AI Notice — Prepared by Lebohang April. AI-generated content may contain errors or omissions. Please review and verify all outputs before using or sharing them. Do not enter passwords, sensitive personal information, or confidential business information. Users remain responsible for the final content and decisions.";
export const pageHead = (title: string, description: string) => ({
  meta: [
    { title: `${title} | Connect Digital` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | Connect Digital` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
export const services = [
  {
    title: "Small Business Website Design",
    description: "A professional home for your business, built around what makes you different.",
    benefits: [
      "Custom design for your business",
      "Clear services and contact details",
      "A great first impression",
    ],
    icon: "Globe",
  },
  {
    title: "One-Page Websites",
    description: "Everything your customers need, in one beautifully focused page.",
    benefits: ["Simple, focused navigation", "A clear call to action", "Easy to keep up to date"],
    icon: "PanelTop",
  },
  {
    title: "Multi-Page Business Websites",
    description: "Room to tell your story, showcase your services, and grow your presence.",
    benefits: ["Dedicated service pages", "A clear content structure", "Built to grow with you"],
    icon: "Layers",
  },
  {
    title: "Website Redesign",
    description: "Give your existing website a fresh look and a more intuitive experience.",
    benefits: ["Modern visual identity", "Improved usability", "Mobile-friendly layouts"],
    icon: "RefreshCw",
  },
  {
    title: "Landing Page Design",
    description: "A dedicated page that turns interest in your offer into the next step.",
    benefits: ["Campaign-focused design", "Compelling content structure", "Clear enquiry forms"],
    icon: "MousePointer2",
  },
  {
    title: "Basic Search Engine Optimisation",
    description: "A practical foundation to help search engines understand your website.",
    benefits: ["Page titles and descriptions", "Clean heading structure", "Search-friendly setup"],
    icon: "Search",
  },
];
