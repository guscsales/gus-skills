---
name: brand-research
description: "Generates brand research and positioning for Inventra clients or for Inventra itself. Use this skill whenever the user mentions: brand research, brand positioning, brand strategy, competitor analysis for branding, visual identity research, how to position a brand, visual direction, brand tone of voice, messaging pillars, competitive differentiators, competitive analysis branding, competitor visual analysis, competitor color palette, or similar variations. Also trigger when the context indicates the user needs to understand the competitive landscape of a niche/segment to define brand positioning, whether for Inventra or for an Inventra client. Works via Web Search for live data. Output in Markdown according to the chosen language."
---

# Brand Research — Brand Strategy & Positioning

Generates a comprehensive brand research document according to the chosen language (must ask EN-US or PT-BR), analyzing competitors, visual and messaging positioning, and recommending strategic direction. Useful both for positioning Inventra itself and for delivering brand research as a service to clients.

## Context: Who Is Inventra

Inventra (inventra.sh) is a Brazilian technology and artificial intelligence company. A software house that creates software, websites, and digital products for small and medium businesses. Founded by Gustavo Sales, an engineer with 17 years of experience including companies in Silicon Valley.

**Inventra's current visual identity:**
- Primary: Gold #D4A853 (OKLCH 0.755 0.115 81.9)
- Secondary: Slate Blue #2E314C (OKLCH 0.323 0.048 278.5)
- Darkest: #232323 | Lightest: #FBFBFA
- Typography: Source Serif 4 (headings) + Geist (body/UI)
- Tone: Confident not arrogant, technical when needed human always, direct and objective, approachable yet professional.

This data is relevant when the research is for Inventra itself or when the final deliverable will be delivered by Inventra to the client.

---

## Skill Flow

### Step 1: Interview

Ask these questions (skip any that have already been answered in the conversation context):

**Question 1 — Who is the research for:**
> Is this brand research for Inventra itself or for a client?
> If it's for a client, what is the business name and what does it do?

**Question 2 — Niche and segment:**
> What is the business's niche or segment?
> E.g.: dental clinic, fashion e-commerce, management SaaS, artisan bakery, law firm

**Question 3 — Location and market:**
> Does the business serve a local (city/region), national, or international market?
> What city/state is it based in?

**Question 4 — Target audience:**
> Who is the ideal customer of this business?
> E.g.: homemakers aged 30-50, early-stage startups, SMB owners, young adults 18-25

**Question 5 — Known competitors:**
> Do you already know any direct competitors? (names, URLs)
> If not, that's fine — I'll research them.

**Question 6 — Existing brand kit:**
> Does the business already have a defined visual identity (colors, fonts, logo)?
> If yes, share the brand kit or describe the colors and fonts.
> If not, I'll recommend a direction based on the research.

**Question 7 — Research objective:**
> What is the main objective? Examples:
> - Create the brand from scratch
> - Reposition an existing brand
> - Understand the competitive landscape before building the website
> - Define tone of voice and messaging

---

### Step 2: Competitor Research (Live Web Search)

Perform at least 4-6 web searches to map the competitive landscape. Adapt searches to the niche and market:

**Required searches:**
1. `"{niche} {city/region} best companies 2025 2026"` — local competitors
2. `"{niche} {segment} brand identity visual positioning"` — how competitors position themselves visually
3. `"AI {niche} tools platforms 2025 2026"` — AI tools and platforms in the segment (if applicable)
4. `"{niche} {country} market size trends"` — market size and trends

**Optional searches (as needed):**
5. `"{mentioned_competitor} brand colors visual identity"` — specific research on known competitors
6. `"SaaS brand design trends 2026 color palette typography"` — visual trends in the segment
7. `"{niche} tone of voice messaging examples"` — tone of voice examples
8. `"{niche} target audience persona"` — audience profile

**For each identified competitor, extract:**
- Name and URL
- Type (agency, SaaS, marketplace, store, etc.)
- Positioning (how they present themselves — tagline, value proposition)
- Visual style (dominant colors, typography, overall vibe)
- Key strength
- Weakness or gap

Try to identify at least 6-8 competitors, mixing local/national and international (if applicable).

---

### Step 3: Pattern Analysis

With the collected data, identify visual and messaging patterns:

**Color language:**
- Which colors dominate in the segment? (e.g.: blue = trust, purple = AI, green = health)
- Is there a "cliche" color in the segment that should be avoided?
- What color space is free/underexplored?

**Typography:**
- Serif vs sans-serif vs mixed — what is the pattern?
- Is there room for typographic differentiation?

**Messaging:**
- Which words and phrases are recurring? (e.g.: "autopilot", "effortless", "results")
- What is the dominant tone? (corporate, casual, technical, emotional)
- What promises are made? (speed, price, quality, results)

**Competitive gap:**
- What does no competitor do or communicate well?
- Where is the opportunity for differentiation?

---

### Step 4: Build the Document

Use EXACTLY this structure. Ask which language to return: EN-US or PT-BR.

If the business already has a brand kit, incorporate the actual colors and fonts into the visual recommendations and explain how they position competitively. If not, recommend a visual direction based on the research.

````markdown
# {BUSINESS NAME} — Brand Strategy & Positioning

**{url if available}** | Prepared by **Inventra** (inventra.sh) | {date} | Confidential

---

## 1. Executive Summary

{2-3 paragraphs summarizing:
- What the business does and for whom
- The central research insight (the main opportunity or gap)
- The recommended positioning in one sentence}

---

## 2. Competitive Landscape

### 2.1 {Local/National} Market Competitors

{Flowing text analyzing the categories of competitors found. Group by type (agencies, platforms, direct competitors, etc.). Include market data if found (size, growth).}

### 2.2 {National/Global} Competitors & References

| Competitor | Type | Positioning | Visual | Key Strength | Weakness |
|---|---|---|---|---|---|
| {name1} | {type} | {how they position} | {visual style} | {strength} | {gap} |
| ... | ... | ... | ... | ... | ... |

### 2.3 Core Competitive Insight

{What is the market gap? What does no one do? Where is the differentiation opportunity? Be direct and bold here — this is the most important point of the research.}

---

## 3. Competitor Visual & Messaging Analysis

### 3.1 Visual Patterns

**Color Language**
{Bullet points analyzing dominant colors, segment cliches, opportunities}

**Typography**
{Bullet points on typographic patterns}

**Messaging Patterns**
{Bullet points on recurring language, promises, tone of voice}

### 3.2 What This Means for {Business Name}

{Paragraph connecting the analysis to the recommended positioning. Where to differentiate and why.}

---

## 4. Brand Positioning

### 4.1 Positioning Statement

> {Statement formatted as blockquote. Follow the framework: "For [audience] who [need], [business] is the [what it is] that [differentiator]. Unlike [competitors], [business] [reason to believe]."}

### 4.2 Brand Archetype

{Which archetype should the business embody? Describe with concrete examples of how it manifests in practice.}

### 4.3 Target Customer Profile

{For each identified persona:
- Demographics
- Digital maturity
- Pain points
- Desires
- Decision driver}

### 4.4 Category Definition

{Recommend how the business should categorize itself. Avoid generic categories that put it in direct comparison with giants.}

---

## 5. Visual Direction

### 5.1 Color Palette

{If brand kit exists: analyze existing colors in the competitive context. Explain why they work (or don't).}
{If no brand kit: recommend a palette with hex, name, and role of each color. Justify each choice based on the competitive research.}

| Color | Hex | Role |
|---|---|---|
| {name} | #{hex} | {how and when to use, why it works competitively} |
| ... | ... | ... |

**Palette rationale:**
{Bullet points explaining the strategic choices}

### 5.2 Typography

{If brand kit exists: analyze the existing fonts. If not: recommend a typographic system.}

| Usage | Font | Rationale |
|---|---|---|
| Headings | {font} | {why this choice} |
| Body | {font} | {why this choice} |

### 5.3 Imagery Style

{Direction for photography, illustration, iconography. Be specific about what works and what to avoid.}

**Overall vibe:** {One sentence that sums up the visual feeling the brand should convey.}

---

## 6. Tone of Voice & Messaging

### 6.1 Voice Characteristics

| Dimension | What it is | What it is NOT | Example |
|---|---|---|---|
| {axis1} | {description} | {anti-description} | {example phrase} |
| ... | ... | ... | ... |

### 6.2 Language Strategy

{What is the primary language? Bilingual? Code-switching? Guidelines on jargon.}

### 6.3 Messaging Pillars

{For each pillar (3-4 pillars):}

**Pillar {N}: {Pillar Name}**

{Description of the pillar — what it communicates and why it matters.}

- "{Example phrase 1}"
- "{Example phrase 2}"
- "{Example phrase 3}"

---

## 7. Defensible Differentiators

### 7.1 Moat Analysis

{For each defensible differentiator:}

**{N}. {Differentiator Name} ({Moat Type})**

{Paragraph explaining why it is defensible and difficult to replicate.}

### 7.2 Vulnerability Assessment

{Honest bullet points about where the business is vulnerable. For each vulnerability, include mitigation.}

---

## 8. Strategic Recommendations

### 8.1 Immediate Actions (30 Days)
{5-7 concrete actions}

### 8.2 Medium Term (60-90 Days)
{5-7 actions}

### 8.3 Long Term (6-12 Months)
{4-6 actions}

---

## 9. Conclusion

{2-3 paragraphs tying everything together. What is the most important brand decision the business needs to make? End with a strong, direct statement.}

---

*Document based on market research ({date}), competitor analysis, and strategic direction.*

**Research sources:**
- [{title1}]({url1})
- [{title2}]({url2})
- ...
````

---

### Step 5: Quality Rules

**Honesty:**
- Never invent competitors. Every listed competitor must come from the research.
- If market data is not found, say "market data not found for this segment" instead of making it up.
- Visual recommendations must be justified by the competitive analysis, not by generic preference.

**Document tone:**
- Professional but accessible. Gus (Inventra's founder) is the primary reader — he is technical and wants actionable insights, not fluff.
- Be direct with insights. "The gap is clear:" is better than "After careful analysis, we can observe that there exists a potential opportunity..."
- Bullet points when they help. Flowing text when the reasoning needs context.

**Sources:**
- Always include a sources section at the end with links to the searches and pages consulted.
- Throughout the document, mention sources inline when presenting specific data (e.g.: market size, market share).

**Length:**
- The complete document should be between 1,500 and 3,000 words. Long enough to be useful, short enough to be read.

**Output:**
- Always save as an .md file in the outputs folder.
- File name: `{Business_Name}_Brand_Strategy.md` or `{Business_Name}_Brand_Research.md`
