---
name: create-landing-page-execution-guide
description: "Creates a step-by-step execution guide for building Inventra client sites using Claude Code. Use this skill whenever the user mentions: execution guide, build plan, step-by-step plan, build the site, how to build the site, implement the site, create the client site, implementation guide, 'how do I start coding', 'give me the prompts', Claude Code prompts, prompts for Claude Code, deploy guide, or similar variations. Also trigger when context indicates the user already has the design ready (Paper exports) and wants the next step, which is actually building it. This skill is the FINAL STEP of the Inventra site creation pipeline — it comes after brand research, site content, design system in Paper, and landing page design in Paper."
---

# Execution Guide — Step-by-step Build Guide for Client Sites

Generates a complete, practical execution guide for building client sites using Claude Code. The output is a Markdown file with ready-to-paste prompts, checklists, estimated times, and technical notes. The operator (Gus or future team) follows the guide and builds the entire site in ~1-2 hours.

## Position in the Pipeline

This skill is **step 5** (final) of the Inventra site creation pipeline:
1. **Brand Research + Visual Reference Analysis** (skill `brand-research`) → generates brand strategy, positioning, palette direction, fonts, tone. **Includes analysis of 2-4 reference site URLs** provided by the operator — Claude fetches each site, extracts design patterns (palette, typography, spacing, layout, atmosphere, component patterns), and includes a structured visual analysis in the brand strategy output. This visual analysis feeds directly into the DS and screen briefings.
2. **Site Content** → text for all pages (manual or with skill `seo-content-writer`)
3. **Design System in Paper** (skill `design-system-creation`) → generates DS briefing informed by the visual reference analysis → operator runs in Paper → exports palette, typography, spacing, base components as PNG
4. **Landing Page Design in Paper** (skill `inventra-app-design`) → generates screen briefing informed by the visual reference analysis → operator runs in Paper with DS loaded → exports all screens mobile-first as PNG
5. **Execution Guide** (this skill) → step-by-step guide to build the site with Claude Code, using Paper exports as the primary visual reference

**Why Paper comes before code:** Claude Code produces dramatically better results when it has actual designed screens to match, rather than vague descriptions or screenshots of other sites. The Paper exports serve as a pixel-level visual contract — Claude Code sees exactly what the final result should look like. This eliminates the back-and-forth of "make it more premium" or "spacing feels off" because the design decisions are already locked.

## Prerequisites: What Must Exist Before

Before generating the guide, verify that these inputs exist:

1. **Brand strategy with visual reference analysis** (required) — Output of skill `brand-research`, which includes:
   - Brand positioning, palette direction, fonts, tone of voice
   - **Structured visual analysis of 2-4 reference sites** — the operator provides URLs of sites that represent the desired visual direction (competitor sites, aspirational references, or sites the client sent). During brand research, Claude fetches each URL, analyzes the design (palette, typography, spacing, layout patterns, atmosphere, component styles), and produces a structured visual summary. This analysis is what informs the DS and screen briefings in Paper.
   
   **The reference URLs are collected at the start of the brand research step.** Ask the operator: "Send me 2-4 URLs of sites that represent the visual direction you want for this project — competitor sites, sites the client admires, or aspirational references from any industry." Claude will fetch and analyze each one.

2. **Site content document** (required) — Markdown with all text for all pages, section by section. Format: `[CompanyName]_Website_Content_[language].md`

3. **Design System exports from Paper** (required) — PNG exports of the design system created in Paper via skill `design-system-creation` (informed by the visual reference analysis from step 1). These include:
   - Color palette with hex codes and roles
   - Typographic scale and font pairing
   - Spacing and radius tokens
   - Base components (buttons, inputs, cards, etc.) with states
   
   Save exports in `/docs/design-system/` (e.g., `ds-palette.png`, `ds-typography.png`, `ds-components.png`)

4. **Landing page screen exports from Paper** (required) — PNG exports of all screens designed in Paper via skill `inventra-app-design` (informed by the visual reference analysis from step 1). These are the **primary visual reference** for Claude Code. They include:
   - Every page, designed mobile-first (375px viewport)
   - Desktop adaptations for key pages (at minimum: Home, Services)
   - All sections with final copy, colors, typography, spacing, and layout locked
   
   Save exports in `/docs/screens/` (e.g., `home-mobile.png`, `home-desktop.png`, `about-mobile.png`, `services-mobile.png`)
   
   **These Paper exports replace the old workflow of capturing screenshots from third-party sites.** The design is done before the code — Claude Code implements what Paper designed, not what it improvises from vague references.

5. **Technical information** (ask if unknown):
   - How many pages does the site have?
   - Does it have a blog? If so, will Inventra's CMS API be integrated?
   - Does it have a mega menu or special navigation?
   - Primary language and whether it will have i18n
   - CTA strategy (cal.com? WhatsApp? form?)
   - Domain

If the Paper exports (items 3 and 4) are missing, **do not generate the guide**. Instead, recommend running the corresponding skills first:
- Missing DS → run `design-system-creation` first
- Missing screens → run `inventra-app-design` first
- Missing both → run DS first, then screens (DS feeds into screens)

If the brand strategy or visual reference analysis is missing, notify the user and suggest running `brand-research` first — and remind them to bring 2-4 reference URLs ready.

If only the content document is missing, the operator can create it manually or with a content writing skill.

## Visual Reference Workflow: Paper-First Design

The design is done **before** the code. Paper produces the visual contract; Claude Code implements it.

### The Paper-First Flow

1. **Operator provides 2-4 reference site URLs** → competitor sites, aspirational references, or sites the client admires
2. **Run `brand-research` skill** → Claude fetches each reference URL, analyzes the design visually, and produces brand strategy + structured visual reference analysis
3. **Run `design-system-creation` skill** → generates a DS briefing informed by the visual reference analysis
4. **Paste the DS briefing into Paper** → Paper generates palette, typography, spacing, components
5. **Export the DS from Paper** as PNG → save in `/docs/design-system/`
6. **Run `inventra-app-design` skill** → generates screen briefings with locked copy, informed by the visual reference analysis
7. **Paste the screen briefing into Paper** (with the DS loaded) → Paper generates all screens mobile-first
8. **Export all screens from Paper** as PNG → save in `/docs/screens/`
9. **Now run this skill** → generates the execution guide that references those exports

### What Claude Code Gets from Paper Exports

When the operator drags the Paper exports along with the prompt, Claude Code sees:
- **Exact colors** — not "dark background" but the precise hex applied in context
- **Exact typography** — not "serif headings" but the actual font at the actual size with the actual weight
- **Exact spacing** — not "generous padding" but the real proportions between elements
- **Exact layout** — not "centered hero" but the precise arrangement of elements, including responsive breakpoints
- **Exact components** — not "a card with hover" but the actual card design with all states
- **Exact atmosphere** — the full gestalt of the design, not a verbal approximation

This is dramatically better than screenshots of other sites, because:
- There's no ambiguity about "which parts to copy" — everything in the export is intentional
- The copy is already locked — Claude Code reads it from the image
- The design decisions are already made — Claude Code just implements

### When Paper Exports Are Not Available (Fallback)

If the operator explicitly chooses to skip Paper (rare — only for very simple sites or tight deadlines), fall back to the old workflow:
1. Capture 2-4 screenshots of reference sites in the client's niche
2. Save in `/docs/references/`
3. The execution guide will reference these screenshots instead

**Always prefer Paper exports over screenshots.** The quality difference in Claude Code's output is significant.

### When the Client Has a Current Site

If the client already has a site and wants a redesign, capture screenshots of the current site and save in `/docs/references/old-site/`. These serve as context for what to improve, but the Paper exports remain the primary visual target.

## Guide Structure

The guide ALWAYS follows this structure. Adapt the content of each step to the specific project, but keep the format.

### General Format

```markdown
# Execution Guide — [Company Name] Site

> Estimated time: [X] hour(s)
> Stack: Next.js (App Router) + Tailwind CSS + Vercel
> Tools: Claude Code + visual reference + ready content
> Default site language: [language]

---

## PREREQUISITES (before opening Claude Code)
[checklist]

## STEP 1 — Structure with content ([X] min)
[prompt for Claude Code]

## STEP 2 — Design tokens / system ([X] min)
[prompt for Claude Code]

## STEP 2.5 — Assets ([X] min, parallel)
[manual checklist]

## STEP 3 — Build the pages with design ([X] min)
[prompts for Claude Code, divided by page/group]

## STEP 4 — Blog API + SEO ([X] min)
[prompt for Claude Code]

## STEP 5 — Polish + Performance ([X] min)
[prompt for Claude Code]

## STEP 6 — Deploy ([X] min)
[commands + checklist]

## NOTES
[tips, priorities, warnings]

## FINAL DELIVERY
[deliverables checklist]
```

### Detailed Breakdown of Each Step

Read the file `references/exemplo-inventra-execution-guide.md` for a complete example of a generated guide. Below are the rules for each step:

---

#### PREREQUISITES

Checklist with everything that needs to be ready before opening Claude Code:
- [ ] Next.js boilerplate created and running locally (include the `npx create-next-app@latest` command)
- [ ] Content file downloaded into the project (in `/docs/`)
- [ ] Design System exports from Paper in `/docs/design-system/` (palette, typography, spacing, components)
- [ ] Landing page screen exports from Paper in `/docs/screens/` (all pages, mobile-first + desktop key pages)
- [ ] SVG/PNG logo in `/public/`
- [ ] Favicon and OG image prepared
- [ ] Secondary visual references in `/docs/references/` (optional — screenshots of inspiration sites or client's old site)
- [ ] CTA links confirmed (cal.com, WhatsApp, Booksy, etc.)
- [ ] Client-specific information (address, phone, license numbers, tax ID — whatever is relevant)

---

#### STEP 1 — Structure with content

The prompt should:
- Reference the site content file
- List ALL files to be created (pages + components)
- Use Next.js App Router conventions (`src/app/`, `src/components/`)
- Include the text for all CTAs with real links
- Include contact information
- Explicitly state "Don't worry about styling — just get all the content in the right structure"

**Adapt for each project:**
- If the site has 4 pages, list 4 pages
- If it has 8 pages + mega menu, list everything
- Global components: Header, Footer, and any special components (MegaMenu, WhatsAppButton, etc.)

Estimated time: ~10-15 min (proportional to the number of pages)

---

#### STEP 2 — Design tokens / system

**This step uses the Design System exports from Paper.** The prompt MUST instruct the operator to drag the DS export images along with the text into Claude Code. This is not optional — Claude Code reads the exact tokens from the visual exports.

The prompt should:
- Start with: "I'm attaching the Design System created in Paper for this project. These images contain the exact palette, typography, spacing, and component specs. Implement these tokens exactly as shown — do not improvise colors, fonts, or spacing."
- Instruct the operator to drag DS export images (`/docs/design-system/*.png`) along with the text
- List the complete color palette (hex, token name, usage) — extracted from the DS export
- Specify fonts using `next/font/google` (NEVER @import or <link>)
- Define typographic hierarchy (h1-h6, body, labels, CTAs) — matching the DS export
- Define spacing tokens (section padding, container max-width, gaps) — matching the DS export
- Describe the overall "vibe" in one sentence (e.g., "dark premium, tech-editorial" or "warm sophisticated, science clinic")
- IMPORTANT: include the warning about not using @import url() for fonts

The prompt should include a notice block like this:
```
> **IMPORTANT:** When pasting this prompt, drag along the Design System export images
> from /docs/design-system/. Claude Code will read the exact palette, typography,
> spacing, and component tokens from the exports and implement them precisely.
> These are the source of truth — do not deviate from them.
```

**Adapt for each project:**
- Colors come from the Paper DS export (which was built from the brand strategy)
- Fonts come from the Paper DS export
- Spacing tokens come from the Paper DS export
- If the DS export includes component specs (button styles, card styles), reference them here so Claude Code creates reusable component primitives

Estimated time: ~10 min

---

#### STEP 2.5 — Assets (parallel)

Short checklist of things the operator does manually while Claude Code processes step 2:
- SVG logo confirmed
- Icons (usually Lucide React — no need to download anything)
- Client photo (or placeholder)
- Project-specific assets

Estimated time: ~5 min

---

#### STEP 3 — Build the pages with design

This is the longest step. Divide into sub-prompts by page or group of pages.

**Paper screen exports are the visual contract.** Each page prompt MUST instruct the operator to drag the corresponding Paper screen export(s) along with the prompt. Claude Code will implement the exact design shown in the export — this is not interpretation, it's implementation.

**Design skill is mandatory.** Each page prompt MUST include the instruction for Claude Code to use the design/frontend skill. Add this line at the beginning of each prompt in this step:

```
Use the design-taste-frontend skill (and other frontend/design skills you have access to) for reference on visual quality, spacing, and design patterns.
```

If the operator doesn't have this skill installed in Claude Code, the prompts still work — but the visual output will be better with it. Mention this in the NOTES section of the guide.

**Paper exports for every page.** Each page prompt should instruct the operator to drag the corresponding screen export from `/docs/screens/`. For the Home page (the first and most important), include both mobile and desktop exports. Claude Code can lose context between long prompts, so always re-attach the relevant screen export for each page.

**Golden rule:** Home page always first, in a separate prompt. It's the most complex page and sets the visual tone for the entire site.

**For each page prompt, include:**
- Instruction to use the design/frontend skill
- Instruction to drag the corresponding Paper screen export(s) from `/docs/screens/`
- Which page to build (file path)
- A note: "Match the design in the attached screen export exactly — colors, spacing, typography, layout, and component styles should be pixel-close to the export"
- Background for each section (dark/light — specify hex, as shown in the export)
- Layout for each section (centered, split, grid, etc. — as shown in the export)
- Specific design details visible in the export (hover effects, accent lines, icons)
- Which icons to use (Lucide React — list by name)
- Responsiveness instructions: "The attached export is mobile-first (375px). For desktop (1280px+), [describe adaptations or attach desktop export]"
- Animation instructions (framer-motion or CSS) — these are NOT in the Paper export, so specify them explicitly

**Recommended order:**
1. Home page (alone, it's the most important)
2. Header + Footer + global components
3. About
4. Product/service pages
5. Contact
6. Blog (listing + post template)

**For each section of each page, specify:**
- Background color (dark #hex or light #hex)
- Alignment (centered, left, split)
- Special elements (stats bar, timeline, before/after table, cards grid)
- Hover effects
- Icons (list Lucide React names)

**Blog post template (`/blog/[slug]`) — required:**

Inventra now generates articles with **References** and **FAQ** blocks automatically — these blocks are part of what makes an Inventra article excellent. The blog post page prompt MUST include the design for these two blocks:

- **References:** Section that lists the external sources/links used in the article. Each reference has a title, URL, and (optionally) a description. Design should be a clean list with clear typography, external link icons (Lucide `ExternalLink`), hover state indicating clickability. Position at the end of the article, before the FAQ.
- **FAQ:** Frequently asked questions section related to the article's topic. Each item has a question + answer. Design can be accordion (recommended, with Lucide `ChevronDown`) or expanded list — choose according to the site's vibe. Position as the last content section of the post, before the final CTA or "related posts".

Don't worry about conditional rendering here — Step 4 (API integration) handles that following the Inventra docs. Here in Step 3, the design for both blocks should always be built.

Estimated time: ~25-35 min (proportional to the number of pages)

---

#### STEP 4 — Blog API + SEO

The prompt should:
- Configure the Inventra CMS API client (`lib/inventra.ts`)
  - Endpoints: GET `/api/organizations/{ORG_ID}/contents` and GET `/api/organizations/{ORG_ID}/contents/{id}`
  - Auth: Bearer token
  - Types: BlogPost with id, slug, title, excerpt, content, category, coverImage, publishedAt, etc.
- Configure env vars (`lib/env.ts` + `.env.local.example`)
- Update blog pages to fetch from Server Component with ISR (`revalidate: 3600`)
- Fallback to mock data if API returns no data
- Per-page SEO metadata (use the meta tags from the content document)
- `sitemap.ts` with static + dynamic pages (blog posts)
- `robots.ts`
- JSON-LD structured data (Organization, Service, Article schemas as applicable)

**Adapt for each project:**
- If the client doesn't have a blog, skip the API part
- If the client has a blog but doesn't use Inventra's CMS, adapt the endpoints
- Meta tags come from the content document (SEO section)

Estimated time: ~10 min

---

#### STEP 5 — Polish + Performance

Final refinement prompt:
- Animations (fade-up on scroll, hover states, transitions)
- Dark/light section rhythm verification
- Responsiveness (375px, 768px, 1280px, 1440px+)
- Accessibility (alt text, keyboard nav, contrast, heading hierarchy, aria-labels)
- Performance (next/image, next/font, Server Components, loading.tsx)

Estimated time: ~10 min

---

#### STEP 6 — Deploy

- Deploy command (`vercel --prod` or Vercel dashboard instructions)
- Env vars configuration in Vercel
- Custom domain configuration
- Pre-deploy checklist with ALL items to verify:
  - All pages render without errors
  - Mobile responsive
  - CTAs work
  - Navigation links
  - Meta tags
  - Performance (Lighthouse > 90)
  - Assets load

Estimated time: ~5 min

---

#### NOTES

Free-form section with project-specific tips. Always include:
- **Paper exports are the source of truth.** Every page prompt should include the corresponding screen export from Paper. Claude Code implements the design — it doesn't improvise it. If the result doesn't match the export, iterate until it does.
- **Design System exports matter for tokens.** The DS export from Paper contains the exact hex codes, font sizes, and spacing values. Always cross-reference when writing the design tokens prompt.
- **Design skill in Claude Code.** If the operator has the `design-taste-frontend` skill installed in Claude Code, the design prompts (Step 3) will produce better results. If not, the prompts still work — the result is good, but the skill adds an extra level of visual refinement.
- **Animations are NOT in Paper exports.** Paper produces static screens. All animation specs (fade-up on scroll, hover transitions, micro-interactions) must be written explicitly in the prompts. Specify these clearly in Step 3 and Step 5.
- Build priority (if stuck, focus on the Home first)
- Color usage tips (e.g., "gold as accent, not main color")
- Typography tips (e.g., "Source Serif 4 only for headings, Geist for everything else")
- What is sufficient for v1 vs. what can wait
- Any project-specific quirks

---

#### FINAL DELIVERY

Checklist of everything delivered to the client:
- Site live (URL)
- Brand strategy doc
- Website content doc
- Design System exports (from Paper)
- Landing page screen exports (from Paper)
- Pending items (i18n, live blog, etc.)

---

## Quality Rules

1. **Complete and self-contained prompts.** Each prompt must contain EVERYTHING Claude Code needs to execute that step. The operator should not need to supplement with information not included in the prompt.

2. **Colors in hex, always.** Never reference colors by name without the hex. "Dark background (#232323)" is correct. "Dark background" alone is not.

3. **Fonts with import instructions.** Always specify that fonts should use `next/font/google` or `next/font/local`. Include the anti `@import url()` warning.

4. **Icons by name.** When mentioning Lucide React icons, list the exact names (Brain, Search, Calendar, etc.).

5. **Realistic timing.** Total time should be 1-2 hours for typical sites (4-8 pages). If the site is more complex, adjust and notify.

6. **Guide language.** The guide itself can be in PT-BR or EN. The prompts for Claude Code should be in English (Claude Code works better with English prompts).

7. **Reference to the content document.** Each prompt should reference the site content file by name, so Claude Code knows where to pull the text from.

## Output

Save the guide as:
`[CompanyName]_Execution_Guide.md`

Example: `Inventra_Execution_Guide.md`, `Mavy_Execution_Guide.md`

Save in the outputs directory for the user to access.
