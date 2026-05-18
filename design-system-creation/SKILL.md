---
name: design-system-creation
description: Generates design system briefings ready to paste into Paper (or equivalent AI design tool) with palette, typography, spacing, base components, states, and tokens. ALWAYS use when the user mentions design system creation, DS, style system, color palette, typography, design tokens, component library, style guide, brand guidelines, or asks for palette variations, fonts, or base components in Paper. Also trigger when hearing 'I need a design system', 'create a DS', 'I need a palette', 'I need fonts', 'build a style guide', 'design system in Paper', 'design tokens'. Strong trigger for Gus's projects (Inventra, RetroLove, nano-apps) and Studio clients who need a visual foundation before screens. For a standalone design system, use this skill. Not for standalone logos (skill inventra-logo-design) nor for app screens/flows (skill inventra-app-design).
---

# Design System Creation — Briefing skill for Paper

Skill for generating complete design system briefings that go straight into an AI design tool (like Paper) to build palette, typography, components, and tokens.

The final briefing is **a single self-contained markdown** that Gus pastes into Paper to receive the product's complete visual foundation before moving on to screens.

## Core principle

**A design system is foundation, not decoration.** Without a well-defined DS, every screen becomes visual improvisation. The briefing forces clarity about emotional tone → palette → typography → spacing → components, in that order.

The skill produces a briefing that asks Paper for:
1. Complete palette with hex codes and roles (primary, secondary, neutrals, semantic)
2. Typographic pairing (display + body + accent) with Google Fonts or similar open source
3. Spacing and radius scale
4. Base components (button, input, card, modal, badge, etc.) with states
5. Application principles

## When to use

This skill triggers for standalone design system creation — when the product doesn't yet have a defined visual foundation, or when the existing one needs to be rebuilt.

**Do not use for:**
- Standalone logo (skill `inventra-logo-design`)
- App screens and flows (skill `inventra-app-design`)
- Minor tweaks to an existing DS (handle directly, no skill needed)

If the user needs **logo + DS**, recommend running `inventra-logo-design` first (the logo informs colors and tone). If they need **DS + screens**, run this first, then `inventra-app-design`.

## Usage flow

1. **Elicitation** — questions to fill in the briefing
2. **Confirm understanding** — repeat back before generating
3. **Generate the single briefing** in markdown
4. **Present** it ready to paste

---

## Step 1: Elicitation

Ask these questions in order. If the previous conversation already has answers, reuse them.

### Block 1 — Product identity

1. **What is the product name?**
2. **What does it do?** (1-2 sentences)
3. **Briefing language:** PT-BR or EN-US?

### Block 2 — Tone and personality

4. **What 3-5 adjectives describe the desired visual personality?**
   Examples:
   - "Romantic, nostalgic, editorial, calm"
   - "Technical, trustworthy, dense, unemotional"
   - "Playful, youthful, energetic, spontaneous"
   - "Premium, minimalist, timeless, quiet"

5. **Which existing products/brands does the aesthetic resemble?**
   Examples: "Substack + Notion", "Stripe + Linear", "Headspace + Duolingo", "The New Yorker + Apple"

   This helps Paper calibrate.

### Block 3 — Logo and color

6. **Is there already a defined logo?**
   - Yes → ask for the logo's main colors (hex codes), the DS should harmonize with them
   - No → recommend running `inventra-logo-design` first, OR proceed and the DS will propose colors that later guide the logo

7. **Are there any mandatory or prohibited colors?**
   - Mandatory color (e.g., "primary must be gold #D4A853")
   - Prohibited color (e.g., "no red", "avoid cool tones")

8. **Palette mood:** (offer options)
   - Warm (terracotta, gold, peach, coral)
   - Cool (blues, greens, grays)
   - Neutral (off-whites, beiges, grays)
   - Vibrant (saturated colors)
   - Pastel (desaturated versions)
   - Mixed — warm + cool contrasting
   - No preference — DS chooses based on emotional tone

### Block 4 — Typography

9. **Desired typographic style:** (offer options)
   - Classic serif (Playfair, Lora, Source Serif)
   - Modern sans (Inter, Geist, DM Sans)
   - Mix (serif display + sans body)
   - Handwritten / script for headlines
   - Mono for accent (JetBrains Mono, IBM Plex Mono)
   - No preference — DS chooses pairing based on tone

10. **Is there a font that must NOT appear?**
    Examples: "avoid Caveat", "no Comic Sans", "no Arial"

### Block 5 — Platforms and contexts

11. **The DS will be used for:**
    - Web app (mobile + desktop)
    - Landing page
    - Email templates
    - PDF / print
    - Social media (posts, stories)
    - Dashboard / dense interface
    - All of the above

This affects:
- Component density (dense interfaces need more compact components)
- Font compatibility (PDF and email need safe fonts or embedded web fonts)
- Responsiveness (mobile needs touch-friendly components)

### Block 6 — Priority components

12. **Which components does the product need in this first version?** (offer multiple selection)
    - Buttons (primary, secondary, tertiary, destructive)
    - Inputs (text, textarea, select, checkbox, radio, switch, date picker)
    - Cards (static, hover, selected)
    - Modals and drawers
    - Toasts and alerts
    - Badges and tags
    - Tabs and accordion
    - Tables (if dashboard)
    - Navigation (header, sidebar, bottom tabs mobile)
    - Empty states
    - Loading states (skeleton, spinner)
    - Avatar / user
    - Tooltip and popover
    - Other product-specific ones

List only the ones that will be used — a DS without use cases becomes dead documentation.

### Block 7 — Technical constraints

13. **Product stack** (affects font and token choices):
    - Tailwind CSS → tokens in Tailwind format
    - CSS-in-JS (styled-components, emotion) → JS tokens
    - Vanilla CSS → CSS variables tokens
    - Other

14. **Are there any technical decisions already made?**
    Examples: "we'll use shadcn/ui as a base", "dark mode mandatory", "mobile-first always"

---

## Step 2: Confirm understanding

Before generating the briefing, provide a summary:

```
I'll generate the design system briefing with:
- Product: [name] in [language]
- Personality: [adjectives]
- Palette mood: [choice]
- Typography: [style]
- Platforms: [contexts]
- Components: [list]
- Stack: [technology]

Confirm before I build it?
```

Wait for confirmation. Adjust if needed.

---

## Step 3: Generate the briefing

Use this template, adapting it to the collected data.

---

### Briefing template (EN-US)

```markdown
# Brief: Design System — [PRODUCT NAME]

## Context

[1-2 paragraphs describing the product, what it does, who it's for.]

## Visual personality

**Core adjectives:** [3-5 adjectives]

**Aesthetic references:** [brands/products mentioned in block 2]

**Target emotional tone:** [short paragraph describing the feeling the DS should convey — e.g., "Calm, premium, editorial. The user should feel they're in a carefully crafted product, not a cold productivity app."]

## Platforms and usage contexts

[List from block 5 with implications]

## Technical stack

[From block 7 — affects token format]

---

## What I need

### 1. Color palette

Generate a complete palette in **OKLCH or hex**, organized by role:

- **Primary** (main brand color, used for CTAs and highlights)
  - 5 shades: 50, 100, 300, 500 (base), 700, 900
- **Secondary** (supporting color, used for important non-primary elements)
  - 5 shades: same pattern
- **Neutrals** (text, backgrounds, borders)
  - 9 shades: 0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
- **Semantic:**
  - Success (green)
  - Warning (yellow/orange)
  - Error (red)
  - Info (blue)
  - Each with 3 shades (light, base, dark)
- **Accent** (1-2 complementary colors for decorative use, graphics, illustrations)

[If mood was defined in block 3, specify:]
**Palette mood:** [warm / cool / neutral / vibrant / pastel / mixed]

[If there are mandatory/prohibited colors, list:]
**Mandatory colors:** [hex codes that must appear]
**Prohibited colors:** [what to avoid]

Each color must have:
- Hex code
- Semantic name (e.g., "primary-500", not "blue-1")
- Recommended use case
- Applied example (text, background, border)

### 2. Typography

**Typographic pairing** with Google Fonts or similar open source:

- **Display** (large headlines, hero headlines)
  - Suggested font + 2 alternatives
  - Available weights
- **Body** (running text, paragraphs)
  - Suggested font + 2 alternatives
  - Available weights
- **Accent** (quotes, callouts, numbers, code if applicable)
  - Suggested font (can be mono, script, or display variant)

**Typographic scale:**

- xs: 12px / 16px line-height
- sm: 14px / 20px
- base: 16px / 24px
- lg: 18px / 28px
- xl: 20px / 28px
- 2xl: 24px / 32px
- 3xl: 30px / 36px
- 4xl: 36px / 40px
- 5xl: 48px / 1
- 6xl: 60px / 1
- 7xl: 72px / 1
- 8xl: 96px / 1

(Adjust scale based on product density — dense interfaces use a more compact scale)

**Recommended weights by use:**
- Headlines: 700-900
- Subheadlines: 500-600
- Body: 400
- Emphasis: 600
- Captions: 400 (at smaller size)

[If there is a prohibited font, list it.]

### 3. Spacing and radius

**Spacing scale** (base 4px or 8px):
- 0, 1 (4px), 2 (8px), 3 (12px), 4 (16px), 5 (20px), 6 (24px), 8 (32px), 10 (40px), 12 (48px), 16 (64px), 20 (80px), 24 (96px)

**Border radius:**
- none: 0
- sm: 4px
- base: 8px
- md: 12px
- lg: 16px
- xl: 24px
- full: 9999px

**Shadows:**
- sm, base, md, lg, xl with defined values
- Inner shadow for inputs

### 4. Base components

[List components from block 6, each with:]

#### [Component name]

- **Variants:** [primary, secondary, tertiary, destructive, etc.]
- **Sizes:** [sm, base, lg when applicable]
- **States:** [default, hover, active, focus, disabled, loading]
- **Tokens used:** [reference palette, spacing, typography]
- **Behavior:** [brief description]

[Repeat for each component]

### 5. Application principles

Short document with:
- **Hierarchy:** how to use colors and type to create visual focus
- **Contrast:** minimums for accessibility (WCAG AA)
- **Density:** when to use more or less space
- **Consistency:** when to create new patterns vs. reuse
- **Visual examples** of good and bad usage (side by side)

## Delivery format

- **Tokens in [Tailwind config / CSS variables / JS object] format** per chosen stack
- **Visual documentation** in page format (palette, typography, spacing, components)
- **Components** designed with all variants and states
- **Application examples** showing the DS in use (e.g., 1 example product screen, 1 card, 1 form)

## Final emotional tone

[1 paragraph describing the feeling the DS should convey, serving as a guide for any future decision about adding components or colors.]
```

---

## Generation rules

1. **Emotional tone always first.** Without clarity on adjectives and aesthetic references, palette and typography become guesswork. Force block 2 before proceeding.

2. **Components only if they'll be used.** Don't request 30 components "just in case" — only those from block 6. A bloated DS becomes dead documentation.

3. **Tokens in the stack's format.** If Tailwind, Tailwind format. If CSS-in-JS, JS object. If vanilla, CSS variables. Don't invent a generic format.

4. **Language locked.** PT-BR or EN-US, don't mix.

5. **Accessibility is not optional.** Always include WCAG AA minimum contrast in the application rules.

6. **Mention sibling skills when relevant.** If the user mentions a logo, remind them of `inventra-logo-design`. If they mention screens, remind them of `inventra-app-design`.

7. **Single briefing.** Always deliver one single markdown, self-contained, ready to paste.

---

## Final output structure

Present to the user in **a single message with the complete markdown inside a code block**, ready to copy and paste into Paper.

Before the markdown, a short sentence: "Here's the design system briefing ready to go. Paste it into Paper:"

After the markdown, three short pieces of information:

1. **Next step:** "Paste it into Paper and run it."
2. **What to expect:** "Paper will generate a complete palette, typographic pairing, tokens, and the listed components with all states."
3. **Iteration:** "If any component comes out weak or any color doesn't land, call me and we'll iterate just that part."

---

## Expected behaviors

- **Force emotional tone before palette** — without it, palette becomes guesswork
- **Don't bloat components** — only the ones that will be used
- **Respect technical stack** — tokens in the right format
- **Recommend sibling skills** when the user needs a logo or app
- **Single briefing** — always one single markdown, complete
