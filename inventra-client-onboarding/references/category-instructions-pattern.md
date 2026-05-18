# Category aiWriteInstructions Pattern

## Structure of each category

Each `aiWriteInstructions` has 5 fixed sections, in this order:

1. **SCOPE** — what the category covers and what it does NOT cover
2. **EDITORIAL ANGLE** — category's point of view, position defended
3. **READER** — who the specific reader of this category is
4. **WHAT MAKES A POST WORK HERE** — positive criteria (not required formats)
5. **WHAT DOES NOT WORK HERE** — explicitly forbidden formats and approaches

Always in this order. Order matters because the model processes hierarchically — scope restricts universe, angle restricts tone, reader restricts vocabulary, and the last two sections give final guardrails.

## What NOT to put in aiWriteInstructions

The following rules already live in the writer's system prompt and **must not** be duplicated per category. Duplication creates conflict and output gets worse:

- Anti-AI rules (no "nestled", no em-dashes, etc.)
- SEO rules (keyword placement, meta description, internal linking)
- Structure rules (1200-1800 words, H2, etc.)
- Output format rules (title under 55 chars, excerpt, etc.)
- Integrity rules (don't invent clients, don't invent statistics)

If something from those generic categories needs a category-specific override, write it as an exception: "Unlike other categories, this one allows X because Y."

## Details per section

### SCOPE

Defines the content universe. Two parts:

**Part 1: What it covers.** Concrete list of topics, tools, concepts. Be specific — "performance" is vague, "Core Web Vitals, LCP, CLS, INP, TTFB, bundle size, image optimization, caching, CDN strategy" is specific.

**Part 2: What it does NOT cover.** Explicit list of what belongs to other categories. This avoids overlap between categories and prevents all categories from becoming variations of the same theme.

Ends with: "When a topic touches [other category], keep the angle on [this category's angle]."

### EDITORIAL ANGLE

Defines the category's position. Three elements:

1. **The defended position** — "We defend X", "We reject Y", "We believe Z"
2. **What is rejected as the wrong framing** — the common counter-argument the category refutes
3. **The typical subtext of posts** — sentence "The subtext of most posts is: ..." that captures the implicit thesis

A category without editorial stance becomes a Wikipedia blog. If the user doesn't bring clear stance, pull from the general stance in the business description and adapt it to the category's specific topic.

### READER

Reader profile for the category. More specific than the client's general ICP. Elements:

- Professional role (founder, CTO, operator, head of marketing)
- Sophistication level (knows jargon / doesn't)
- Concrete decision or problem that brought the reader to the post
- What the reader explicitly does NOT want (tutorial, basic explanation, hype)

A well-described reader gives the model automatic calibration of vocabulary, depth, and tone.

### WHAT MAKES A POST WORK HERE

Positive criteria — **not a list of required formats**. This distinction is critical.

**Right pattern (criteria):**

```
WHAT MAKES A POST WORK HERE:
- Opens with a specific decision the reader is facing
- Defends a position and names the tradeoff explicitly
- Uses technical vocabulary without explaining it
- Gives the reader a criterion they can apply today
- Acknowledges when the recommended path is wrong, and for whom
```

**Wrong pattern (formats):**

```
WHAT MAKES A POST WORK HERE:
- Comparison posts with a verdict
- Diagnostic posts
- Deconstruction of common beliefs
```

Why the second is bad: after N posts the model alternates only between those 3 formats. Reader notices the pattern, blog becomes format-monotonous.

Criteria describe **qualities the post must have**, independent of format. This preserves format creativity while maintaining editorial quality.

### WHAT DOES NOT WORK HERE

Explicitly forbidden formats and approaches. Here yes, list specific formats — but as prohibition, not as menu.

Typical items to include:
- Step-by-step tutorials (if the category isn't a tutorial category)
- "What is X" explainer posts (if the reader already knows what X is)
- Listicles "10 ways to..."
- Neutral comparisons without recommendation ("X vs Y: it depends")
- Hype pieces ("this changes everything")
- Posts that compete with official documentation

Explicit prohibition is safer than only describing what's wanted. Removes ambiguity.

## Strategic vectors per category

Each category pulls a primary vector. This defines the category's role in the blog portfolio.

### Vector 1: Technical authority

Pulls respect from technical peers and qualified audiences. Doesn't convert directly, but gives legitimacy to the rest of the blog. Reader: tech-aware, full vocabulary.

Typical for: categories about stack, architecture, performance, technical SEO.

`allowsProductBridge`: usually **false** (authority drops if every post ends recommending a product).

### Vector 2: High-intent lead

Captures readers who are making a purchase decision. Bottom of funnel. Reader: comparing proposals, evaluating vendors, evaluating ROI.

Typical for: categories about pricing, TCO, build vs buy, vendor selection.

`allowsProductBridge`: context-dependent. In theory converts well, but risk of sounding advertorial. Recommend **false** as default — the reader already knows the client sells the service.

### Vector 3: Product demonstration

Shows how the client's products work in practice. Reader: evaluating whether the product fits them.

Typical for: cases, feature deep dives, real workflows.

`allowsProductBridge`: **true** — that's the purpose of the category.

### Vector 4: Trust via transparency

Builds confidence by exposing process, decisions, mistakes. Indirect social proof. Reader: comparing vendors, looking for signal of real operation.

Typical for: construction journal, lessons learned, transparent pricing posts.

`allowsProductBridge`: **true** — natural to mention products in the context of real cases.

### Vector 5: Hype capture

Captures traffic from high-volume/low-competition topics because they're recent. Reader: curious, may or may not be a buyer.

Typical for: new tools, industry trends, topics that just emerged.

`allowsProductBridge`: **true** (controlled bridge), but risk of cannibalization if it becomes more than 20-25% of total blog volume.

## Vector balance in the portfolio

When the user defines multiple categories, check the balance:

- If all pull technical authority: blog generates qualified traffic but doesn't convert
- If all pull high-intent lead: blog sounds too commercial, loses authority
- If all pull hype: blog becomes volatile and trend-dependent
- Healthy portfolio: mix of 2-3 different vectors

If the user brings 5 categories all in the same vector, **flag it** before generating. Suggest alternatives that maintain the client's focus but diversify vectors.

## allowsProductBridge — how to decide

Default: **false**. A category only becomes **true** if:

1. The editorial purpose of the category naturally involves the client's products (cases, deep dives)
2. OR the category is about applying tools/methods that the client's products exemplify

Neutral categories (authority, high-intent lead, technical SEO) should be **false** even if it seems to "waste an opportunity". Preserved authority converts better long-term than bridge on every post.

## Output per category

Final format of each category in the skill output:

```markdown
#### Category N: [Name]
- **Slug:** [kebab-case]
- **Allows product bridge:** [true | false]
- **Reason:** [1 sentence justification]

**aiWriteInstructions:**

​```
SCOPE:
[text]

EDITORIAL ANGLE:
[text]

READER:
[text]

WHAT MAKES A POST WORK HERE:
- [item]
- [item]
- [item]
- [item]
- [item]

WHAT DOES NOT WORK HERE:
- [item]
- [item]
- [item]
- [item]
- [item]
​```
```

## Differences by language

Categories in pt-BR follow the same structural pattern (scope, angle, reader, what works, what doesn't), but content is written in Portuguese. Watch out for:

- Translating framings doesn't work literally — recreate the point in the native language
- "Moves the needle" in English is idiomatic; in pt-BR, rewrite as "que gera impacto mensurável" or "que move o ponteiro" (if the client has informal tone)
- Avoid Brazilian AI tells inside the aiWriteInstructions itself (the text will be read by the model; if there's an AI tell in the prompt, the model imitates)
