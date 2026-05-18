---
name: inventra-client-onboarding
description: Generate business description, product context, and blog categories for a new Inventra client. Use this skill whenever the user mentions onboarding a new Inventra client, setting up a new client's blog, creating business description / product context / aiWriteInstructions for a client, or when the user pastes answers from a client onboarding questionnaire. Also triggers when the user says "new Inventra client", "Inventra setup", "client blog setup", "onboarding questions", or provides client answers that need to be turned into admin panel content. Produces copy-paste-ready content for the Inventra admin plus a client-facing questionnaire in the client's language (en-US or pt-BR).
---

# Inventra Client Onboarding

Generates editorial content for a new Inventra client: `business_description`, `product_context`, and `aiWriteInstructions` per category. Also generates the questionnaire the user sends to the client before running the skill.

## When to use this skill

Use this skill when the user:
- Is closing a new client and needs to generate the blog setup
- Asked for the questionnaire to send to the client
- Pasted the client's answers and wants the final content
- Mentioned "client onboarding", "blog setup", "new Inventra org", "generate client categories"

The skill operates in two modes depending on where the user is in the process:

1. **Questionnaire Mode** — user just closed a client, needs the questions
2. **Generation Mode** — user has answers from the client, needs the final content

Identify the mode by what the user brings. If they bring answers (even partial), go straight to Generation Mode. If they bring nothing or mention "I need the questions", use Questionnaire Mode.

## Important structural context

Inventra generates automated blog content through a pipeline that combines 3 layers of context:

1. **`business_description`** (client's company identity) — 3 paragraphs: compressed identity, position of authority, editorial stance
2. **`product_context`** (client's products/services) — compact format, one line per product: `NAME — what it does for the customer`
3. **`aiWriteInstructions`** (per category) — scope / editorial angle / reader / what works / what doesn't

These 3 layers must be complementary, not redundant. `business_description` carries identity and stance (applied to every post). `product_context` is only activated in categories with `allowsProductBridge: true`. `aiWriteInstructions` defines the category-specific editorial angle.

## Languages

Each client is **always** en-US **or** pt-BR, never both. If the client is bilingual, they get two separate orgs. Never mix languages in the same skill output.

- **en-US**: all content (business_description, product_context, aiWriteInstructions, questionnaire) in English
- **pt-BR**: everything in Brazilian Portuguese

The questionnaire language always matches the client's language (American client gets English questionnaire, Brazilian client gets Portuguese).

## Questionnaire Mode

When the user needs the questions for their client, produce two outputs:

### Output 1: Summary for the user (always in English)

Short block showing the user what information the skill will need to extract from the client's answers. This helps the user verify the answers came in complete before running Generation Mode.

### Output 2: Questionnaire for the client (in client's language)

The questionnaire the user sends to the client. Questions in accessible language (not technical), but designed to extract the needed information. Use templates in `references/questionnaire-templates.md`.

Before generating the questionnaire, **ask the user**:
- Client name
- Language (en-US or pt-BR)

Optionally also ask:
- How many categories approximately? (influences whether the questionnaire includes category-inference questions)

## Generation Mode

When the user brings the client's answers, generate the final content.

### Expected inputs (the user should have extracted these from client answers)

**For business description and product context:**
- Client name
- Language (en-US or pt-BR)
- Basic description of the client (what they do, 1-2 free-form sentences)
- Client's ICP (who is their ideal buyer)
- What competitors do badly / what the client does differently
- Market positioning (new entrant / challenger / leader / niche specialist)
- Products and services (name + what it does for the end user)
- Blog goal (authority / lead generation / nurturing / mix)

**For each category the client wants:**
- Category name
- Scope: what's in and what's NOT
- Primary strategic vector (technical authority / high-intent lead / product demonstration / trust via transparency / hype capture)
- Specific reader profile for the category (can refine the general ICP)
- Allows product bridge? (yes/no)

### If any input is missing

**Don't invent.** Ask the user. Fields that commonly come in vague:
- Editorial stance (if the client doesn't have strong opinions about the market, the blog will sound generic — help the user extract this from the stated differentiator)
- Strategic vector per category (if not explicit, ask the user what the specific goal of that category is)
- `allowsProductBridge` (this is the user's decision, not the client's)

### Generation Mode output

A single organized block for copy-paste into the Inventra admin:

```markdown
## [CLIENT NAME] — Blog Setup

**Language:** [en-US | pt-BR]

---

### 1. Business Description

[3 paragraphs: identity / authority / stance]

---

### 2. Product Context

[NAME — what it does, in compact lines]

---

### 3. Categories

#### Category 1: [Name]
- **Slug:** [kebab-case-slug]
- **Allows product bridge:** [true | false]
- **Reason:** [short justification]

**aiWriteInstructions:**

[complete block: scope / editorial angle / reader / what works / what doesn't]

---

#### Category 2: [Name]
[etc.]
```

Present each category as a complete block. The user will copy each section into a different admin field — this makes pasting easier.

## Writing standards per layer

Detailed standards live in reference files. Read the file matching the mode you're operating in:

- **Business description and product context:** read `references/business-description-pattern.md`
- **aiWriteInstructions per category:** read `references/category-instructions-pattern.md`
- **Questionnaires:** read `references/questionnaire-templates.md`

## Editorial principles (apply to all generation)

These principles came from extensive iteration and must be preserved:

1. **Identity ≠ Offer.** `business_description` carries identity and stance. Product is separate. Don't mix them, or every post turns into an advertorial.

2. **Editorial stance is mandatory.** Without declared opinions, the blog sounds like Wikipedia. Paragraph 3 of the business description must carry opinionated beliefs about the market, not platitudes.

3. **Technical authority + decision framing.** Reader is tech-aware (founder, CTO, operator who understands vocabulary but doesn't execute). Categories should assume the reader knows the jargon and wants a recommendation, not a tutorial.

4. **Categories with different vectors.** If all categories pull the same goal (e.g., all technical authority), the blog fragments audience. Balance across: authority, high-intent lead, product demonstration, trust, hype capture.

5. **Negative format > positive format.** Listing "formats that work" collapses the creativity space. Listing "formats that DON'T work" + positive criteria (what makes a post work) gives more freedom.

6. **Product enters via conditional `product_context`, not via `business_description`.** Categories that allow bridge: `allowsProductBridge: true`. Neutral categories (e.g., "Business Side / Pricing"): `allowsProductBridge: false` to preserve authority.

7. **Rigid language.** One client = one language. If bilingual, two orgs. Questionnaire in client's language, outputs in client's language.

## Common mistakes to avoid

- **Generic business description** ("We provide high-quality X for Y"). Sign that editorial stance was missing — ask the user about the client's beliefs.
- **Product context as feature list.** It's "what the product does for the user", not "features the product has".
- **aiWriteInstructions with required formats listed.** Use criteria + negative formats. Never "formats that work: X, Y, Z" without qualifying as partial list.
- **All categories with same vector.** Ask the user the strategic vector of each one if not explicit.
- **Formatting/SEO rules inside aiWriteInstructions.** Those rules already live in the writer's system prompt. Duplication creates conflict.

## Recommended flow

1. Identify the mode (Questionnaire or Generation)
2. If Questionnaire: ask client name and language, generate both outputs
3. If Generation: validate all inputs are present, ask for what's missing (especially stance and vectors), read relevant references, generate the single organized output
4. After the output, suggest validation: "Generate 2-3 test posts before running at scale"
