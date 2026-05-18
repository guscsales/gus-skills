---
name: create-product-task
description: "Generates well-structured Linear tasks in markdown, optimized for execution with Claude Code in plan mode. Use this skill ALWAYS when the user mentions creating a task, writing a Linear ticket, drafting an issue, planning a feature, breaking down work, 'criar uma task', 'criar uma tarefa', 'tarefa pro Linear', 'issue pro Linear', 'preciso de uma task', 'monta uma tarefa', 'task pro Claude Code', or asks to formalize work-to-be-done into a structured ticket. Trigger even when the user describes work casually ('preciso adicionar X', 'tenho que arrumar Y') — if the intent is to capture work as a Linear task, use this skill. Output is always English-first markdown ready to paste into Linear, structured as Title, Why, Context, What to build, Acceptance Criteria, Out of Scope, and How to Verify. Accepts input in PT-BR or EN; always converts content to EN."
---

# Create Product Task

Generate Linear-ready tasks for execution with Claude Code in plan mode.

## When to use

Trigger when the user wants to formalize work into a Linear task. Common phrasings:

- "Cria uma task pra X" / "Create a task for X"
- "Preciso de uma tarefa pro Linear sobre Y"
- "Monta uma issue de Z"
- "Preciso adicionar/arrumar/refatorar X" (with intent to track in Linear)
- After a discussion about what to build, when the user says "agora gera a task"

If the user just wants a quick reminder note (not a structured task), don't use this skill — give them a simple bullet instead.

## Output format

Always English. Always this exact structure. All sections are mandatory.

```markdown
# [Verb in imperative] [What] [Where, if relevant]

## Why
1–3 sentences. Product/business motivation. Why does this exist? What problem does it solve? Connect to Inventra's growth plan when relevant (e.g., "blocks objection X for prospects", "unblocks Y for client Z").

## Context
Current state relevant to execution:
- Repo / app paths (e.g., `apps/web/src/...`)
- Stack hints (e.g., Next.js 15, App Router, Tailwind v4)
- Prior decisions or constraints
- Existing components/utilities to reuse or avoid duplicating
Use bullets or short prose — whichever is clearer.

## What to build
Concrete artifacts to produce. Use checkboxes (Linear renders them as interactive sub-tasks):
- [ ] File/component/function to create or edit, with path
  - Sub-bullets for props, signatures, key details
- [ ] Next concrete artifact
- [ ] Integration point (e.g., "import and use in `home.tsx`")

This section is the "build map" — what Claude Code will produce. Be specific with paths and names when known.

## Acceptance Criteria
Observable behavior. Use checkboxes:
- [ ] When [condition], [observable outcome]
- [ ] [State that must be true when done]
- [ ] Responsive / accessible / performant requirement (when applicable)

This is the contract. If a criterion can't be observed or measured, rewrite it.

## Out of Scope
What NOT to do in this task. Use bullets:
- No [related-but-separate concern]
- Don't refactor [adjacent area]
- Skip [feature] for now (will be tracked separately)

Infer this from the conversation context. If unsure, include a conservative list and let the user adjust.

## How to Verify
Numbered, sequential steps to confirm it works:
1. Run command (e.g., `pnpm dev` in `apps/web`)
2. Navigate to specific URL or trigger specific action
3. Observe specific outcome
4. Edge case to check (mobile, error state, etc.)
```

## Rules

### Language
- Input can be PT-BR or EN. **Output content is always English.** Section headers are always English.
- Translate naturally — don't be literal. Adapt to the conventions of EN technical writing.

### Inferring Out of Scope
Don't ask the user explicitly. Infer from the conversation:
- If the task is "add a component", out of scope likely includes: building a system around it, adding it to other pages not mentioned, creating tests if testing wasn't discussed.
- If the task is "fix bug X", out of scope likely includes: refactoring adjacent code, changing the API contract.
- If you genuinely can't infer, include a placeholder like `- [TODO: confirm what's intentionally not in this task]` rather than omitting the section.

### When to ask for more info
If the user gives only a one-liner with no context (e.g., "cria uma task pra adicionar testimonial"), ask before generating. Specifically ask about:
1. **Where it lives** — which repo/app, which page or file
2. **The why** — what motivated this, what problem it solves
3. **Acceptance** — how the user will know it's done

Don't ask more than 3 questions in one round. If the user has already provided rich context in the conversation (e.g., a long discussion preceded the task request), skip asking and infer.

### Style of writing
- **Title**: imperative verb, concrete object. ✅ "Add testimonial component to home and Press page". ❌ "Testimonial work" / "Testimonials".
- **Why**: avoid generic "improve UX" — be specific about the business/product reason.
- **What to build**: paths and names whenever possible. Vague checkboxes ("create the component") are weak; concrete ones (`apps/web/src/components/testimonial.tsx` with props `quote, name, role, link?`) are strong.
- **Acceptance Criteria**: observable. "Component looks good" is not an AC. "Component renders quote, name, and role; matches design tokens; is responsive at 375px and 1280px" is.
- **How to Verify**: pretend you're handing this to someone who's never seen the codebase. Be explicit about commands and URLs.

### Length
Keep tasks concise. A typical task fits in ~30–50 lines of markdown. If a task balloons past that, suggest splitting it into multiple tasks.

## Example output

Given the user input: "preciso criar uma task pra adicionar o depoimento da Mavy no site, na home e na página do Press, com componente reutilizável":

```markdown
# Add testimonial component to home and Press page

## Why
Mavy is the first paying client and publicly validated the quality of Inventra Press. Adding her testimonial as social proof addresses the "AI writes generic content" objection that comes up with every prospect.

## Context
- Site: `apps/web` (Next.js 15, App Router, Tailwind v4)
- Home: `apps/web/src/app/page.tsx`
- Press page: `apps/web/src/app/press/page.tsx`
- No testimonial component exists yet
- Design tokens defined in `apps/web/src/app/globals.css`

## What to build
- [ ] Create `<Testimonial />` at `apps/web/src/components/testimonial.tsx`
  - Props: `quote: string`, `name: string`, `role: string`, `link?: string`
  - Use existing tokens (colors, typography, spacing)
  - Mobile-first, semantic HTML (`<blockquote>`, `<cite>`)
- [ ] Add instance to home page below the features section
- [ ] Add instance to Press page above the final CTA

## Acceptance Criteria
- [ ] Component renders quote, name, role, and optional link
- [ ] Visual style matches existing site tokens (no hardcoded colors/fonts)
- [ ] Layout works at 375px and 1280px viewports
- [ ] Reusable: accepts any testimonial via props (no hardcoded content)

## Out of Scope
- No carousel or multi-testimonial system
- No avatar/photo (decided: name + role only for now)
- No dedicated "Testimonials" page
- No CMS-driven testimonials (hardcoded is fine for now)

## How to Verify
1. Run `pnpm dev` in `apps/web`
2. Open `localhost:3000` → testimonial appears below features section
3. Open `localhost:3000/press` → testimonial appears above final CTA
4. Resize to 375px → layout doesn't break, text remains readable
5. Inspect element → uses CSS variables from `globals.css`, not hardcoded values
```

## After generating

After generating the task, briefly:
1. Tell the user the task is ready to paste into Linear
2. Note any assumption you made (especially in Out of Scope) so they can correct
3. Don't add commentary inside the markdown block itself — keep it clean for copy-paste
