---
name: create-landing-page-execution-guide
description: "Creates a step-by-step execution guide for building Inventra client sites using Claude Code. Use this skill whenever the user mentions: execution guide, build plan, step-by-step plan, build the site, how to build the site, implement the site, create the client site, implementation guide, 'how do I start coding', 'give me the prompts', Claude Code prompts, prompts for Claude Code, deploy guide, or similar variations. Also trigger when context indicates the user already has the site content ready (brand strategy + website content) and wants the next step, which is actually building it. This skill is the FINAL STEP of the Inventra site creation pipeline — it comes after brand research and site content."
---

# Execution Guide — Step-by-step Build Guide for Client Sites

Generates a complete, practical execution guide for building client sites using Claude Code. The output is a Markdown file with ready-to-paste prompts, checklists, estimated times, and technical notes. The operator (Gus or future team) follows the guide and builds the entire site in ~1-2 hours.

## Position in the Pipeline

This skill is **step 3** (final) of the Inventra site creation pipeline:
1. **Brand Research** (skill `inventra-brand-research`) → generates brand strategy
2. **Site Content** → text for all pages (manual or with skill `seo-content-writer`)
3. **Execution Guide** (this skill) → step-by-step guide to build the site with Claude Code

## Prerequisites: What Must Exist Before

Before generating the guide, verify that these inputs exist:

1. **Site content document** (required) — Markdown with all text for all pages, section by section. Format: `[CompanyName]_Website_Content_[language].md`
2. **Brand strategy or brand kit** (required) — At minimum: colors (hex), fonts, tone of voice, visual references
3. **Visual reference screenshots** (required) — 2-4 screenshots of existing sites that represent the desired visual direction. These can be:
   - Sites in the client's niche that the operator wants to use as a base
   - Aspirational reference sites (e.g., Vercel, Linear, Stripe, a premium clinic)
   - A specific site the client sent saying "I want something like this"
   - Screenshots from Dribbble, Behance, Pinterest that capture the mood
   
   These screenshots are essential because Claude Code analyzes them visually and extracts patterns of spacing, layout, visual rhythm, color usage, hierarchy, and atmosphere. Without screenshots, the visual output is generic. With screenshots, the output is dramatically better.
   
   **In the generated guide:** Screenshots should be referenced in `/docs/references/` and the operator should be instructed to drag the images along with the prompt into Claude Code.

4. **Technical information** (ask if unknown):
   - How many pages does the site have?
   - Does it have a blog? If so, will Inventra's CMS API be integrated?
   - Does it have a mega menu or special navigation?
   - Primary language and whether it will have i18n
   - CTA strategy (cal.com? WhatsApp? form?)
   - Domain

If any required input is missing, notify the user and suggest running the corresponding skill first.

## Visual Reference Workflow: Extracting from an Existing Site

The most common scenario is: the client sends a site they like (or the operator chooses a reference site in the same niche) and wants "something similar but for my brand". The flow for this is:

### How to Capture the References

1. **Open the reference site** in the browser
2. **Take 2-4 screenshots** of the most important sections:
   - Hero / first fold (the most important — sets the tone)
   - A content/cards section in the middle
   - Footer or CTA section
   - An internal page if it has something interesting
3. **Save the screenshots** in `/docs/references/` in the project (e.g., `ref-hero.png`, `ref-cards.png`)
4. Optionally, **annotate what you like** in each screenshot (e.g., "love the generous spacing", "love the serif typography on headings", "love the dark background with gold accent")

### What Claude Code Extracts from Screenshots

When the operator drags the screenshots along with the prompt, Claude Code analyzes:
- **Spacing and rhythm:** section padding, gap between elements, overall "breathing room"
- **Layout:** centered vs. split, grid patterns, how sections connect
- **Typography:** relative size, weight, serif/sans-serif hierarchy
- **Colors:** how the palette is applied (not the colors themselves — the client's brand kit defines the colors)
- **Atmosphere:** premium vs. casual, dark vs. light, minimal vs. decorative
- **Details:** hover effects, accent lines, badges, border radius, shadows

Claude Code does NOT copy the site — it extracts design patterns and applies them with the client's colors, fonts, and content. The result is a site visually influenced by the reference but with its own identity.

### When the Client Sends Their Current Site

If the client already has a site and wants a redesign, capture screenshots of the current site as well. Place them in `/docs/references/old-site/`. In the design prompt, mention: "The client's current site screenshots are in /docs/references/old-site/ — use them to understand what to improve, not to replicate."

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
- [ ] Content file downloaded into the project
- [ ] SVG logo in `/public/`
- [ ] Favicon and OG image prepared
- [ ] Visual reference screenshots in `/docs/references/`
- [ ] CTA links confirmed (cal.com, WhatsApp, etc.)
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

**This step uses visual reference screenshots.** The prompt MUST instruct the operator to drag the reference images along with the text into Claude Code. This is not optional — it's what makes the difference between a generic site and a professional-looking one.

The prompt should:
- Start with: "I'm attaching reference images that represent the visual direction for this project. Analyze them carefully — pay attention to spacing, layout rhythm, color usage, typography hierarchy, and overall atmosphere."
- Instruct the operator to drag reference screenshots along with the text
- List the complete color palette (hex, token name, usage)
- Specify fonts using `next/font/google` (NEVER @import or <link>)
- Define typographic hierarchy (h1-h6, body, labels, CTAs)
- Define spacing tokens (section padding, container max-width, gaps)
- Describe the overall "vibe" in one sentence (e.g., "dark premium, tech-editorial" or "warm sophisticated, science clinic")
- IMPORTANT: include the warning about not using @import url() for fonts

The prompt should include a notice block like this:
```
> **IMPORTANT:** When pasting this prompt, drag along the visual reference images
> located in /docs/references/. Claude Code will analyze the style, layout,
> spacing, and atmosphere of the references and apply them to the design system.
```

**Adapt for each project:**
- Colors come from the client's brand kit
- Fonts come from the brand strategy
- The vibe comes from the visual references defined in the brand strategy
- Spacing tokens should be inspired by the visual references

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

**Design skill is mandatory.** Each page prompt MUST include the instruction for Claude Code to use the design/frontend skill. Add this line at the beginning of each prompt in this step:

```
Use the design-taste-frontend skill (and other frontend/design skills you have access to) for reference on visual quality, spacing, and design patterns.
```

If the operator doesn't have this skill installed in Claude Code, the prompts still work — but the visual output will be better with it. Mention this in the NOTES section of the guide.

**Reference screenshots again.** In the Home page prompt (the first and most important), instruct the operator to drag the reference screenshots again. Claude Code can lose context between long prompts, so reinforcing the visual reference on the Home ensures the visual tone is nailed on the first try.

**Golden rule:** Home page always first, in a separate prompt. It's the most complex page and sets the visual tone for the entire site.

**For each page prompt, include:**
- Instruction to use the design/frontend skill
- Which page to build (file path)
- Background for each section (dark/light — specify hex)
- Layout for each section (centered, split, grid, etc.)
- Specific design details (hover effects, accent lines, icons)
- Which icons to use (Lucide React — list by name)
- Responsiveness instructions
- Animation instructions (framer-motion or CSS)

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
- **Visual reference matters a lot.** Dragging screenshots from the reference site along with the design prompts makes a huge difference in Claude Code's output quality. Without screenshots, the result is generic. With screenshots, the result is dramatically better.
- **Design skill in Claude Code.** If the operator has the `design-taste-frontend` skill installed in Claude Code, the design prompts (Step 3) will produce better results. If not, the prompts still work — the result is good, but the skill adds an extra level of visual refinement.
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
