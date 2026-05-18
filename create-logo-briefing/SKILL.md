---
name: create-logo-briefing
description: Generates logo briefings ready to paste into Paper (or equivalent AI design tool) with 3-5 brand variations, concept, initial palette, typography, and usage rules. Use ALWAYS when the user mentions logo creation, logotype, brand, visual identity, branding, symbol, wordmark, combo mark, logomark, monogram, brandmark, favicon, brand avatar, logo briefing, brand briefing, or asks for logo variations in Paper. Also trigger when hearing 'I need a logo', 'create a logo', 'I need a brand', 'build a brand briefing', 'logo in Paper', 'brand identity', 'generate logo variations'. Strong trigger for Gus's projects (Inventra, RetroLove, nano-apps) and Studio clients who need a new visual identity. For a standalone logo, use this skill. Not for a complete design system (skill inventra-design-system) nor for app screens/flows (skill inventra-app-design).
---

# Create Logo Briefing — Briefing skill for Paper

Skill for generating complete, structured briefings that go directly into an AI design tool (like Paper) to produce logo variations + usage rules.

The final briefing is **a single self-contained markdown** that Gus pastes into Paper to receive 3-5 logo variations ready to choose from.

## Core principle

**Logo needs concept before execution.** The briefing forces clarity on the emotional/conceptual meaning of the brand before requesting designs. Without concept, Paper generates generic variations.

The skill produces a briefing that asks Paper for:
1. 3-5 exploratory variations (symbol + wordmark + combo)
2. Concept behind each variation
3. Final version with 3 renditions (light, dark, monochrome)
4. Basic usage rules (minimum clearance, minimum size, what to avoid)

## When to use

This skill triggers for standalone logo creation — when the product doesn't yet have a defined visual identity.

**Do not use for:**
- App screens and flows (skill `inventra-app-design`)
- Complete design system with palette + typography + components (skill `inventra-design-system`)
- Adjusting/editing an existing logo (use editing tools directly, or skill recraft-logo-creator if via Recraft)

If the user needs **app + logo**, recommend running this skill first, then `inventra-app-design`. If they need **logo + design system**, this one first, then `inventra-design-system`.

## Usage flow

1. **Elicitation** — questions to fill in the briefing
2. **Confirm understanding** — repeat back before generating
3. **Generate the single briefing** in markdown
4. **Present** ready to paste

---

## Step 1: Elicitation

Ask these questions in order. If the previous conversation already has answers, reuse them.

### Block 1 — Brand identity

1. **What is the brand name?**
2. **What is the pitch / what does the brand do?** (1 sentence)
3. **Who is the audience?** (brief profile)
4. **Briefing language:** PT-BR or EN-US?

### Block 2 — Emotional concept

5. **What 3-5 adjectives describe the brand?**
   Examples: "romantic, nostalgic, timeless", "technical, reliable, intelligent", "fun, youthful, bold"

6. **What is the central story or metaphor?**
   Examples:
   - RetroLove: "rewinding love — heart with a rewind arrow"
   - Inventra: "operable agent — block that assembles itself"
   - Strava-present: "personal trail — path that becomes a portrait"

   If the user doesn't know, help them arrive at a metaphor — ask "if the brand were an object, what would it be?" or "what should people feel when they see the logo?"

### Block 3 — Visual direction

7. **Do you have a style preference?** (offer options)
   - Minimalist geometric (Stripe, Vercel, Linear style)
   - Editorial / classic serif (The New Yorker, Substack style)
   - Handwritten / organic (Notion, Headspace style)
   - Retro / vintage (1930s-40s poster style)
   - Modern tech (OpenAI, Anthropic style)
   - Playful / childlike (Duolingo, Lego style)
   - No preference — explore 3 different styles across variations

8. **Desired logo type:**
   - Symbol + wordmark (combo) — most common
   - Wordmark only (custom typography)
   - Symbol only (monogram/icon)
   - No preference — explore all

9. **Initial palette in mind?** (if yes, which colors)
   If not, the briefing will request 2-3 palette suggestions along with the logo.

### Block 4 — Constraints

10. **Is there any color, font, or element that must NOT appear?**
    Examples: "no red", "no hearts", "avoid Caveat font", "must not look like X"

11. **Do you have visual references you admire?**
    Can be brand names or descriptions. Helps Paper a lot.

### Block 5 — Practical usage

12. **Where will the logo be used primarily?**
    - Website / app (favicon, header, splash)
    - Social media avatar (Instagram, TikTok, X)
    - Watermark on digital assets
    - Physical materials (printed poster, business card, packaging)
    - All of the above

This affects legibility at small sizes, contrast, and format.

---

## Step 2: Confirm understanding

Before generating the briefing, provide a short summary:

```
I'll generate the logo briefing with:
- Brand: [name] in [language]
- Concept: [central metaphor]
- Style: [chosen direction]
- Type: [combo/wordmark/symbol]
- Palette: [defined or exploratory]
- Constraints: [what to avoid]

Confirm before I build it?
```

Wait for confirmation. Adjust if needed.

---

## Step 3: Generate the briefing

Use this template, adapting it to the collected data.

---

### Briefing template (EN-US)

```markdown
# Brief: Logo — [BRAND NAME]

## Context

[1-2 paragraphs describing what the brand is, what it does, and who it's for.]

**Pitch:** [locked-in pitch]

**Audience:** [profile]

## Brand concept

**Core adjectives:** [3-5 adjectives]

**Central metaphor / story:** [the metaphor discovered in block 2]

[If applicable, expand in 1-2 sentences explaining why this metaphor — e.g., "Rewinding love: the product takes couples back in time to revisit their story. The logo should suggest a returning motion with emotional warmth."]

## Visual direction

**Desired style:** [chosen style]

**Logo type:** [combo / wordmark / symbol / explore all]

**Initial palette:**
[If defined: list colors with hex codes]
[If not: "No palette defined. The deliverable should include 2-3 palette suggestions for this brand, with 4-5 colors each (primary, secondary, neutrals, accent)."]

## Visual references

[List references provided by the user in block 4. If none, omit this section.]

## Constraints

[List what must NOT appear — colors, fonts, symbols. If none, write "No specific constraints beyond avoiding generic elements such as simple hearts, decorative waves, or puzzle icons."]

## Where the logo will be used

[List contexts from block 5]

Implications:
- Must work at [small sizes / varied backgrounds / print / etc.]
- Must have a [light / dark / monochrome] version

---

## What I need

### Step 1 — Exploration (3-5 variations)

Generate **3 to 5 distinct logo variations**, each exploring a different conceptual or visual direction. For each variation:

- **Concept in 1 sentence:** what this variation represents
- **Visual:** the logo itself
- **Strengths:** why this direction works
- **Trade-offs:** what is lost with this direction

The variations must be truly different from each other — not 5 color versions of the same idea. Explore:
- Variation 1: main symbol + wordmark
- Variation 2: different symbol concept + different typographic treatment
- Variation 3: custom wordmark only
- Variation 4: monogram / standalone symbol
- Variation 5: unexpected combination / bolder direction

### Step 2 — Chosen final version (after user selects)

When the user indicates which variation they prefer, generate:

- **Primary version** in high quality
- **Light version** (for dark backgrounds)
- **Dark version** (for light backgrounds)
- **Monochrome version** (single color, for watermark, embossing, etc.)
- **Favicon version** / square avatar (simplified version that works at 32x32px)

### Step 3 — Usage rules

Short document with:

- **Minimum clearance:** how much breathing room the logo needs around it
- **Minimum size:** smallest legible size (e.g., 24px height)
- **What to avoid:** distortions, rotations, problematic background applications
- **Approved background colors:** which colors work, which don't

## Delivery format

- Variations in SVG or editable vector format
- High-resolution PNG versions (for immediate use)
- Applied mockups (favicon, Instagram avatar, site header, watermark)
- Usage rules documentation

## Emotional tone of the logo

[1 paragraph about how the logo should make someone feel. E.g., "When seeing the RetroLove logo, the person should feel emotional warmth and tenderness, not technology or utility. Even at a 32px favicon, it should suggest 'this is about love', not 'this is an app'."]
```

---

## Generation rules

1. **Concept always before execution.** If the user skips block 2 (emotional concept), **insist** with questions until there's a clear metaphor. Logo without concept is a generic logo.

2. **Always request 3-5 real variations.** Not 5 different colors of the same logo. Paper needs to explore DIFFERENT directions, not variants of a single one.

3. **Language locked in.** PT-BR or EN-US, don't mix.

4. **Explicit constraints.** If the user doesn't provide constraints, include a default list of "generic elements to avoid" — simple hearts, lightbulbs, clasped hands, waves, puzzles, rockets.

5. **Mention sibling skills when relevant.** If the user mentions needing screens/app afterward, remind them of `inventra-app-design`. If they mention a complete design system, remind them of `inventra-design-system`.

6. **Single briefing.** Always deliver one single markdown, self-contained, ready to paste.

---

## Final output structure

Present to the user in **a single message with the complete markdown inside a code block**, ready to copy and paste into Paper.

Before the markdown, a short sentence: "Here's the logo briefing ready to go. Paste it into Paper:"

After the markdown, three short pieces of information:

1. **Next step:** "Paste it into Paper and run it."
2. **What to expect:** "Paper will generate 3-5 distinct variations with concept + strengths/trade-offs. You pick your favorite."
3. **Iteration:** "When you've chosen your favorite variation, let me know and I'll help you refine the briefing for step 2 (final version + usage rules)."

---

## Expected behaviors

- **Force conceptual clarity** before generating — if the user doesn't know the central metaphor, help them arrive at one
- **Don't skip elicitation** even under time pressure — logo without a clear briefing becomes a generic logo
- **Recommend sibling skills** when the user needs more than just a logo
- **Single briefing** — always one single markdown, complete
