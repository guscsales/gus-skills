---
name: inventra-app-design
description: "Generates complete briefings ready to paste into Paper (or equivalent AI design tool) with screens, flows, and locked copies for mini-apps, landing pages, institutional websites, email templates, and PDFs. Use ALWAYS when the user mentions app design creation, landing, site, email or PDF, design briefing, briefing for Paper, product screens, UI flow, mockups, layout, or asks for structured instructions for an AI design tool to build screens + copies. Also trigger when hearing 'I need a design', 'build a briefing', 'I need the screens', 'I'll design in Paper', 'visual briefing'. Strong trigger for Gus's projects (Inventra, RetroLove, nano-apps) and Studio clients. Do not use for standalone logo (skill inventra-logo-design) nor standalone design system (skill inventra-design-system)."
---

# Inventra App Design — Briefing skill for Paper

Skill for generating complete and structured briefings that go directly into an AI design tool (like Paper) to build screens, flows, and copies.

The final briefing is **a single self-contained markdown** that Gus pastes into Paper along with the design system and logo (when they exist), and the tool generates all screens + states + locked copies.

## Core principle

**Paper draws what is written, it does not improvise.** Copies must be locked in the briefing — never let the tool improvise text. The skill produces final copies in PT-BR or EN-US, complete, ready for direct use.

Structure, flow, and tone are also locked. Paper only executes visually.

## When to use

This skill triggers for mini-apps, landing pages, institutional websites, email templates, and PDFs — basically any **visual web element** that needs a structured briefing.

If the user says they **don't have a logo yet** OR **don't have a design system yet**, recommend running the appropriate skill first (even if they don't exist yet — the user decides whether to proceed without or pause to create them). If they choose to proceed without, the skill includes a request in the briefing for Paper to generate variations.

## Usage flow

0. **Learn the Design System** — MANDATORY before any design. Invoke skill `inventra-design-system-resources` and execute the full learning procedure.
1. **Elicitation** — ask the necessary questions to fill out the briefing
2. **Confirm understanding** — repeat back what was understood before generating
3. **Generate the single briefing** in markdown
4. **Present the briefing** ready to paste

---

## Stage 0: Learn the Design System (MANDATORY)

**This stage runs BEFORE anything else.** It doesn't matter if it costs tokens — fidelity to the DS is more important than savings.

### What to do

1. **Invoke the skill `inventra-design-system-resources`** — it contains the complete catalog of artboards, the component lookup table, and the deep-analysis procedure via Paper MCP.

2. **Identify which components the design will use** — based on what the user requested, list all needed component types (Input, Button, Card, Switch, Alert, Dialog, etc.).

3. **For each component, execute the DS skill's learning procedure:**
   - `get_children` to navigate to the component in the correct artboard
   - `get_computed_styles` to extract exact CSS values (border-radius, padding, colors, typography)
   - Build a **token map** with the extracted values

4. **Only advance to Stage 1 after the token map is complete.**

### Why this matters

Without this stage, designs come out with approximate values ("I think the border-radius is 6px" when it's actually 8px). The DS is the source of truth — screenshots lie, memory lies, `get_computed_styles` does not lie.

### When to skip (RARE)

Only skip if the user explicitly says "no need to check the DS" or "use the values you already know". Even then, warn that the values may be outdated.

---

## Stage 1: Elicitation

Ask these questions in order. If the previous conversation already has answers, use them and just confirm. Don't repeat questions already answered.

### Block 1 — Product identity

1. **What is the product name?**
2. **What is the 1-sentence pitch?** (the sentence that becomes the landing headline)
3. **Product language:** PT-BR or EN-US?

### Block 2 — Scope

4. **What needs to be designed?** (choose as many as apply)
   - Web app with flow (auth, wizard, dashboard)
   - Landing page
   - Institutional/multi-page site
   - Email templates
   - Printable PDFs
   - Other (specify)

5. **Mobile-first?** (default yes, but confirm — could be desktop-first if it's a B2B dashboard, internal tool, etc.)

### Block 3 — Existing assets

6. **Already have a logo?**
   - Yes → will attach to Paper
   - No → recommend skill `inventra-logo-design` first, OR generate instructions in the briefing for Paper to design variations

7. **Already have a design system?**
   - Yes → will attach to Paper
   - No → recommend skill `inventra-design-system` first, OR generate instructions in the briefing for Paper to create palette + typography + components

### Block 4 — Emotional tone

8. **How should the user feel when using the product?** (1-3 adjectives + 1 descriptive sentence)

Examples of helpful answers:
- "Romantic + sales-persuasive. Like a friend helping you make the perfect gift."
- "Professional + reassuring. Like a senior consultant who knows exactly what to do."
- "Fun + light. Like an app you use while having coffee."

### Block 5 — Approximate screen scope

9. **What is the approximate scope of the product?**

If it's a **web app with flow**: ask for a list of sections/steps (doesn't need to be exact, just directional). E.g.: "landing → checkout → 8-step wizard → dashboard → rendered site → email → PDF".

If it's **just a landing**: ask for the blocks. E.g.: "hero, how it works, features, pricing, FAQ, final CTA".

If it's an **institutional site**: ask for the pages. E.g.: "home, about, services, blog, contact".

### Block 6 — Specifics when applicable

10. **Are there critical flows to highlight?** (e.g.: "preview before publishing is critical", "auto-save on every step", "wizard with 1 question per screen")

11. **What is out of scope?** (things that should NOT appear in the briefing — e.g.: "moment editing", "invite partner", "searchable public page")

---

## Stage 2: Confirm understanding

Before generating the briefing, provide a short summary:

```
I will generate the briefing with:
- Product: [name] in [language]
- Scope: [selected types]
- Tone: [emotional tone]
- Logo/DS: [already exist / will be requested in briefing / other skills]
- Screens/sections: [summarized list]

Confirm this is correct before I build it?
```

Wait for confirmation. Adjust if needed.

---

## Stage 3: Generate the briefing

Use this template, adapting for the collected data. **Always generate in PT-BR or EN-US as chosen by the user.** The internal copies of the briefing (that go into the final UI) follow the chosen language. The instructions for Paper can also be in the chosen language — maintain consistency.

---

### Briefing template (EN-US)

```markdown
# Brief: [NAME] — Complete product

## Context

[2-3 paragraphs describing what the product is, who it's for, what it delivers, and what the main pitch is. Pull this info from block 1 + block 5.]

**Pitch:** [locked headline sentence]

[If applicable: launch date, pricing, audience.]

**Attachments:** [List what is attached to Paper — design system, logo, etc. If none, say "No attachments — design system and logo will be created by Paper following the instructions below".]

## What I need

Design **all screens + flow + copies** [specify: mobile-first with desktop version / desktop-first / mobile only / etc] applying the design system [attached / to be created following instructions below].

Use the locked copies in this document — **do not invent new text**.

## Tone principles

[Split into up to 3 contexts when applicable:]

- **Public screens (landing, checkout):** [specific tone — usually romantic/persuasive, professional/trustworthy, etc. based on block 4]
- **Private screens (wizard, dashboard, logged-in area):** [specific tone — usually more intimate, conversational]
- **Final output delivered to user (site, email, PDF):** [specific tone — usually cinematic or warm, no commercial CTAs when it's a final deliverable]

## Design principles

[List 4-6 principles based on blocks 5 and 6:]

- Mobile-first always / Desktop-first / etc
- Wizard with 1 question per screen [if applicable]
- Auto-save on every step [if applicable]
- Buttons with [chosen tone] language, not corporate
- Preview before publishing is critical [if applicable]
- [other product-specific principles]

[If there is NO design system, add block:]

## Instructions for design system creation

Since there is no defined design system yet, create as part of the deliverable:

- Palette of 5-7 colors with hex codes (primary, secondary, neutrals, accent)
- Typographic pairing (display + body + accent) using Google Fonts or similar open source
- Base components: button (primary/secondary/tertiary), input, card, modal
- Aesthetic coherent with the emotional tone described above

[If there is NO logo, add block:]

## Instructions for logo creation

Since there is no defined logo yet, create as part of the deliverable:

- 3-5 logo variations: symbol + wordmark + combo
- Light and dark versions
- Works as square avatar, favicon, and subtle brand mark
- Concept that reflects: [product tone/concept]

---

# PART 1 — [PART NAME — e.g.: Public screens]

## Screen [N] — [Screen name]

[For each screen, always have:]

### [Visual subsection when applicable — e.g.: Hero, FAQ, Block X]

- **Headline / Title:** [FULL LOCKED TEXT]
- **Subheadline / Subtitle:** [FULL LOCKED TEXT]
- **Supporting text:** [if any]
- **Primary CTA:** [LOCKED TEXT]
- **Secondary CTA:** [if any]
- **Important microcopy:** [labels, placeholders, messages]

[Repeat for all screens listed in block 5.]

---

# PART 2 — [Next product part — e.g.: Wizard, Rendered site, Email, PDF]

[Same screen structure with locked copies.]

---

# PART N — States, errors, and secondary messages

## Save states

- Saving: [locked text]
- Saved: [locked text]
- Error: [locked text]

## Empty states

- [context]: [locked text]

## Common errors

- [error]: [locked text]
- [error]: [locked text]

## Confirmations

- [context]: [locked text]

---

# Expected deliverable

For each screen/section listed:

- **Mobile version** (375px or 390px width) [if mobile-first or both]
- **Desktop version** (1440px width) [if applicable]
- High-fidelity layouts applying the design system
- Microcopy as locked in this document (do not invent new text)
- Relevant states (empty, filled, error, success) where it makes sense

[If there is a flow, add:]

For the [wizard/checkout/etc] flow, design a **flow diagram** showing how screens connect, where there's a back button, where it saves, where it finishes.

# Final emotional tone

[1-2 paragraphs describing the feeling the user should have when using the product. Pull from block 4 and expand.]
```

---

## Copy generation rules

When building the locked copies inside the briefing:

1. **Always complete** — never leave `[fill in]` or `[example]`. All copies must be final texts ready for direct use.

2. **Locked language** — PT-BR or EN-US. Do not mix. If EN-US, the entire briefing (including instructions for Paper) is in English.

3. **Consistent tone** — maintain the tone chosen in block 4 across all copies. Public screens sell, private screens guide, final output moves emotionally.

4. **Specific, not generic** — instead of "Continue", use copies that feel like the product: "Let's go to the next one", "Save moment", "Continue our story". Adapt to the tone.

5. **States always included** — for each screen with a form or list, include empty state + filled state + error state + save state when applicable.

6. **CTAs always verbal** — prefer action verbs ("Create our story") over nouns ("Get started now").

7. **Microcopy matters** — placeholders, helper texts, labels, error messages are all locked content, not improvised.

---

## Final output structure

Present to the user in **a single message with the complete markdown inside a code block** (` ``` `), ready to Ctrl+C and paste into Paper.

Before the markdown, a short sentence: "Here is the ready briefing. Paste it into Paper along with [DS/logo if available]:"

After the markdown, three short pieces of information:

1. **Next step:** "Paste into Paper, attach [assets], and run."
2. **What to expect:** "Paper will generate mobile + desktop versions of all listed screens, with the locked copies and the design system applied."
3. **Iteration:** "If any screen comes out weak, call me and we'll iterate on just that one."

---

## Expected behaviors

- **ALWAYS run Stage 0 (DS Learning) first** — no exceptions. Invoke `inventra-design-system-resources`, read relevant artboards via `get_computed_styles`, build token map. Never guess values from memory.
- **Do not invent copies** without asking — if information is missing for a specific copy, ask first
- **Do not skip elicitation** — even if the user says "just go", ensure tone + language + scope are clear
- **Recommend sibling skills** — if logo or DS don't exist, mention `inventra-logo-design` and `inventra-design-system` (even if they are still future skills)
- **Single briefing** — always deliver one markdown, self-contained, ready to paste
- **Size matters little** — short briefings (simple landing) have 200 lines, long briefings (full web app) have 800+. Do not cut content to be concise. Paper needs everything locked.
- **Verify after creating** — after writing HTML in Paper, use `get_computed_styles` on created nodes to confirm they match the DS. Fix before moving on.
