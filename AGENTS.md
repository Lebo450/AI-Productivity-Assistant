<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep public pages and protected workspace pages in TanStack file routes; this preserves direct links and account access boundaries.
- Keep AI providers, prompts and credentials in server-only modules; browsers only submit inputs and render outputs.
- Store conversations and saved plans with owner-scoped database policies; private records must never be accessible across accounts.
- Use AI Elements for chat rendering and route-derived conversation IDs; switching conversations must remount the chat window.
- Keep brand copy and configurable business details centralized; missing business information must remain clearly identified.
