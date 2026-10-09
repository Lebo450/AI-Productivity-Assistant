# Connect & Create

PROJECT: CONNECT DIGITAL — PROFESSIONAL BUSINESS WEBSITE & AI DASHBOARD

Act as an expert full-stack developer, UI/UX designer, SaaS product designer, and responsible AI specialist.

Build a modern, responsive, professional web application called Connect Digital.

Connect Digital is a business that helps small businesses, startups, entrepreneurs, and local service providers establish a professional online presence by building attractive, affordable, mobile-friendly websites.

The application should have a clean SaaS-style dashboard and a professional public-facing website that explains our services and encourages potential customers to contact us.

The application must be easy to use for beginners, fast, visually appealing, and simple to maintain.

1. DESIGN AND BRAND IDENTITY

Create a clean, modern, minimalist design that feels trustworthy and professional.

Use comfortable, soft, muted colours that are easy on the eyes while maintaining excellent readability and contrast.

Suggested colour palette:

- Primary colour: Muted navy blue (#334155)
- Secondary colour: Soft teal (#5F9E9A)
- Main background: Off-white (#F8FAFC)
- Card background: White (#FFFFFF)
- Primary text: Dark slate (#1E293B)
- Secondary text: Muted grey (#64748B)
- Borders: Light grey (#E2E8F0)
- Accent colour: Soft blue (#DBEAFE)

Use consistent typography, generous spacing, rounded cards, subtle shadows, simple line icons, and accessible buttons.

Avoid excessively bright colours, unnecessary animations, clutter, and overwhelming gradients.

The website should look like a premium SaaS platform rather than a generic template.

2. PUBLIC-FACING WEBSITE

Create the following public pages:

Homepage

Include:

- A professional navigation bar with the Connect Digital logo.
- Navigation links: Home, Services, About Us, Contact.
- A prominent hero headline: "Your Business Deserves a Better Website."
- Supporting text: "We help small businesses build a professional online presence with modern, affordable websites designed to attract customers."
- A primary call-to-action button: "Get Your Website."
- A secondary button: "Explore Our Services."
- A visual preview of a modern business website displayed inside a laptop or browser mockup.
- A section explaining why businesses need a website.
- A services section featuring website design, mobile-friendly websites, landing pages, website redesigns, and basic SEO setup.
- A simple three-step process: Tell Us About Your Business, We Build Your Website, Launch Your Online Presence.
- A section highlighting the benefits of working with Connect Digital.
- A frequently asked questions section.
- A final call to action encouraging visitors to request a quote.
- A professional footer with contact details placeholders, navigation links, privacy policy, and terms of service.

Do not invent customer testimonials, client logos, business results, or awards. Use clearly labelled placeholders until genuine information is provided.

Services Page

Present our services in attractive cards:

1. Small Business Website Design.
2. One-Page Websites.
3. Multi-Page Business Websites.
4. Website Redesign.
5. Landing Page Design.
6. Basic Search Engine Optimisation.

Each service card must contain a short description, key benefits, and a "Request a Quote" button.

Do not advertise fixed prices unless they are provided by the business owner.

About Us Page

Explain that Connect Digital helps businesses improve their online presence through practical, professional website solutions.

Include a mission statement, our approach, and a section explaining how we work with clients.

Use editable placeholder content for any personal biography or company history that has not yet been provided.

Contact Page

Include a working contact form with:

- Full name.
- Business name.
- Email address.
- Phone number (optional).
- Type of website required.
- Estimated budget (optional).
- Project description.
- Submit button.

Validate required fields and display a clear success or error message.

Connect the form to a real backend or form-processing service when configured. Never pretend a message has been sent if the submission failed. If no backend is configured, clearly explain that the form requires configuration and provide a usable email contact fallback.

Use placeholders for email address, phone number, and social media links.

3. PRIVATE SAAS-STYLE DASHBOARD

Create a separate dashboard at /dashboard with a modern sidebar navigation.

The sidebar must include:

- Dashboard Home.
- Smart Email Generator.
- Meeting Notes Summarizer.
- AI Task Planner.
- AI Chat.
- Settings.
- Help & Support.

Include the Connect Digital logo at the top of the sidebar and a profile area at the bottom.

On mobile devices, convert the sidebar into a collapsible navigation drawer.

The dashboard home page should include:

- A welcoming heading: "Welcome to Connect Digital."
- A short description of the available AI productivity tools.
- Four feature cards linking to each tool.
- A simple recent activity section.
- Helpful empty states for new users.
- A quick-access section for frequently used tools.

Do not display fabricated usage statistics or pretend that AI tasks have been completed.

4. SMART EMAIL GENERATOR

Build a functional Smart Email Generator page.

Users should be able to enter:

- Email purpose.
- Recipient.
- Main points to communicate.
- Preferred tone.
- Desired email length.
- Language.

Include tone options such as:

- Professional.
- Friendly.
- Persuasive.
- Formal.
- Apologetic.
- Follow-up.

Include a structured prompt preview showing how the user's inputs are used to generate the email.

Provide buttons for:

- Generate Email.
- Regenerate.
- Copy Email.
- Clear Form.

Display the generated email in an editable text editor or textarea.

Allow users to modify the subject line and email body before copying the result.

The tool must produce a genuine AI-generated result when an AI provider is configured. Do not hardcode a fake generated response and present it as live AI.

5. MEETING NOTES SUMMARIZER

Build a Meeting Notes Summarizer.

Allow users to paste raw meeting notes into a large text area.

Provide options to generate:

- A short summary.
- Key discussion points.
- Decisions made.
- Action items.
- Assigned responsibilities, when stated in the notes.
- Deadlines, when stated in the notes.
- Follow-up questions.

Include a structured prompt preview.

Display the results in clearly separated sections with editable text fields.

Provide buttons for:

- Summarize Notes.
- Copy Summary.
- Copy Action Items.
- Regenerate.
- Clear Notes.

Never invent meeting decisions, deadlines, attendees, or assigned responsibilities. If information is missing, state that it was not specified.

6. AI TASK PLANNER

Build an AI Task Planner that helps users organise their work.

Include input fields for:

- Task description.
- Main goal.
- Priority.
- Deadline.
- Available time.
- Additional context.

Allow users to generate a structured plan containing:

- Main objective.
- Step-by-step tasks.
- Suggested priorities.
- Estimated durations where reasonable.
- Suggested deadlines based on user-provided constraints.
- Potential obstacles.
- Recommended next action.

Allow users to edit task names, descriptions, priorities, and deadlines.

Include checkboxes to mark tasks as completed and a progress indicator calculated from the actual completed tasks.

Provide buttons for:

- Generate Plan.
- Add Task.
- Save Changes.
- Clear Plan.

Persist saved plans for authenticated users using a configured database. If persistence is unavailable, clearly communicate that changes will not be saved permanently.

Do not promise that the AI can guarantee deadlines or outcomes.

7. AI CHATBOT INTERFACE

Create a modern AI Chat interface with a clean conversational layout.

Include:

- A message history area.
- A text input field.
- A Send button.
- A New Chat button.
- Loading indicators while a response is being generated.
- Clear error messages when a request fails.
- Copy buttons for AI responses.
- Suggested prompts displayed when starting a conversation.

Suggested prompts:

- Help me write a professional email.
- Summarise these meeting notes.
- Help me plan my workday.
- Create a website project checklist.
- Help me improve my business website.

The interface must support multi-turn conversations where the configured AI provider allows it.

Do not expose API keys in frontend code. Route AI requests through a secure backend or server-side function.

If no AI service has been connected, display a clear setup message instead of pretending to provide live AI responses.

8. AI INTEGRATION AND STRUCTURED PROMPTS

Use a real AI provider through secure server-side functions.

Keep the AI provider configurable so it can be connected later without rebuilding the entire application.

For each AI tool:

- Validate user input.
- Construct a structured prompt using the user's actual inputs.
- Separate system instructions from user-provided content.
- Request clear, organised output.
- Handle errors and loading states.
- Allow the user to edit generated content.
- Provide copy functionality.
- Avoid sending unnecessary personal or confidential information.
- Never expose API keys or secret credentials in the browser.

If an AI API key or provider is not configured, clearly indicate which setup step is required.

Do not build a fake AI experience using hardcoded responses.

9. RESPONSIBLE AI DISCLAIMER

Display the following responsible AI disclaimer in the dashboard footer and where appropriate within the AI tools:

"Responsible AI Notice — Prepared by Lebohang April. AI-generated content may contain errors or omissions. Please review and verify all outputs before using or sharing them. Do not enter passwords, sensitive personal information, or confidential business information. Users remain responsible for the final content and decisions."

Include a link to a simple Responsible AI page that explains:

- AI outputs may be inaccurate.
- Users should review generated content.
- Sensitive information should not be entered unnecessarily.
- AI outputs should not replace qualified professional advice where appropriate.
- Users control whether they copy, edit, or share generated content.

Do not imply that naming the disclaimer author certifies or independently verifies the AI system.

10. AUTHENTICATION AND USER SETTINGS

Provide an authentication-ready structure for the dashboard.

If authentication is implemented, use a secure authentication service such as Supabase Auth.

Include:

- Sign-up.
- Login.
- Logout.
- Password reset.
- Protected dashboard routes.
- User-specific data access.

Users must not be able to access another user's saved tasks, notes, or private data.

If Supabase is used, implement appropriate Row Level Security policies for private user data.

Do not collect unnecessary personal information.

If authentication or the database has not been configured, explain the required setup and do not claim that user accounts or saved data are operational.

11. TECHNICAL REQUIREMENTS

Use:

- React.
- TypeScript.
- Tailwind CSS.
- A reusable component architecture.
- Lucide icons.
- Supabase where a database or authentication service is required.
- Secure server-side functions for AI integrations.

Build reusable components for navigation, buttons, forms, cards, alerts, modals, and page layouts.

Use clean, maintainable code and a consistent design system.

Ensure all routes work correctly.

The application must be responsive across desktop, tablet, and mobile screens.

Include:

- Accessible labels.
- Keyboard navigation.
- Good colour contrast.
- Form validation.
- Loading states.
- Empty states.
- Error handling.
- Confirmation messages.
- Appropriate page titles.
- Basic SEO metadata for public pages.

Do not add unnecessary dependencies or complex features that are not required.

12. FUNCTIONALITY AND TESTING

All visible buttons and navigation links must perform their intended actions.

Verify:

- Public pages load correctly.
- Navigation works.
- Dashboard navigation works.
- Forms validate input.
- Email generation works when AI is configured.
- Meeting summarisation works when AI is configured.
- Task planning works when AI is configured.
- Chat works when AI is configured.
- Copy buttons work.
- Generated outputs can be edited.
- Task checkboxes update progress.
- Errors are displayed clearly.
- Mobile layouts work correctly.
- Authentication and database permissions work if configured.

Do not mark any feature as complete unless it actually works.

13. FINAL DESIGN GOAL

Deliver a polished, modern business website for Connect Digital together with a practical SaaS-style AI productivity dashboard.

Prioritise simplicity, professionalism, accessibility, usability, and maintainability.

Build the application in a way that allows a beginner business owner to customise the text, logo, contact details, services, and colours without needing to rebuild the entire application.

Start by implementing the public website and dashboard shell, then build and test each AI tool. Clearly identify any integrations that still require API keys or account configuration.

The final result should look professional enough to demonstrate to potential business clients while remaining simple enough for a beginner to manage.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8859dea4-d714-4508-9c06-7d5573ff37d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
