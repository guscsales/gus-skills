# Business Description & Product Context Pattern

## Business Description — 3 paragraphs

Each paragraph has a specific function. Don't mix functions across paragraphs.

### Paragraph 1: Compressed identity

Who the company is, in 1-3 sentences. Product + audience + delivery method, no fluffy adjectives ("cutting-edge", "world-class", "innovative" are banned).

**Formula:** `[Company] is a [type of business] for [ideal audience]. We [delivery method / operational differentiator].`

### Paragraph 2: Position of authority

Where the company speaks from. What credentials the strong opinions. Who's behind it (experience, background, track record). Why the reader should listen to this company specifically.

**Typical elements:**
- Team background (e.g., "Run by engineers who shipped at scale", "Led by psychologists with 15 years in clinical practice")
- Operational differentiator that is observable (e.g., "We treat X with the same rigor as Y")
- Market observation that lends credibility (e.g., "Most companies under-invest in X because Y — and that shows up later as Z")

### Paragraph 3: Editorial stance

Opinionated beliefs about the market the company operates in. This is the most important paragraph — it gives the blog its voice and prevents posts from sounding generic.

**Rules:**
- Minimum 3 opinionated beliefs
- Each belief should be something a competitor could **disagree with** (if everyone would agree, it's not a stance)
- Write as direct statements ("We believe X", "We defend Y", "We reject Z"), not as hedges
- Avoid platitudes ("quality matters", "customer first", "excellence in everything")

**Examples of strong stance (for inspiration, not to copy):**
- "We defend price transparency in a market that profits from opacity"
- "We think AI is a tool, not a differentiator"
- "We reject the 'faster is always better' framing — sometimes the right answer is doing less"
- "We believe the therapist should fit the patient, not the other way around"

**Examples of weak stance (avoid):**
- "We believe in quality"
- "We are passionate about what we do"
- "Customer success is our priority"

## When stance is missing from the client's answers

If the client's answers only bring functional service description without market opinions, **ask the user** before inventing stance. Useful questions for the user:

- "What does [client] think competitors get wrong?"
- "What's an opinion [client] holds that would likely generate disagreement?"
- "If [client] had to say the opposite of the industry conventional wisdom, what would it be?"

If the user doesn't know either, document in the output that stance came in weak and suggest the user talk to the client about it before publishing posts.

## Product Context — compact format

One line per product/service, in the format:

```
NAME — what it does for the end user. [1-2 complementary sentences about method/differentiator, optional]
```

**Rules:**
- Focus on **what the product does for the customer**, not on features
- Avoid marketing adjectives
- Maximum 3 sentences per product
- If the client has more than 4-5 products, suggest to the user grouping into categories or focusing on the 3-4 main ones

### Examples of good product context

```
Inventra's products:

BUILD — managed website creation and maintenance for tech companies.
Multi-tenant Next.js platform, technical SEO built in, we own ongoing
updates and performance.

BLOCKS — dynamic content blocks that let clients update their sites
without dev involvement. Fields are defined in Inventra, edited by
the client, optionally controlled via Claude Desktop through MCP.
```

### Examples of bad product context (avoid)

```
INVENTRA BUILD — Our cutting-edge platform leverages the latest in
web technology to deliver world-class websites at scale. Features include:
- Next.js framework
- Multi-tenant architecture
- SEO optimization
- Performance monitoring
```

Why bad: full of marketing adjectives, features listed instead of benefits, doesn't connect to any decision the buyer makes.

## Language

### For en-US clients

Write in American English. Use direct vocabulary, avoid hedge language ("perhaps", "might be", "could potentially"). Contractions OK ("we're", "don't"). Peer conversation tone, not corporate.

### For pt-BR clients

Write in Brazilian Portuguese. Avoid formal European Portuguese constructions ("outrossim", "ditto"). Use "a gente" sparingly — "nós" works better in blog context. Avoid Brazilian AI tells: "no cenário atual", "vale ressaltar", "é fundamental", "no que tange a", "em um mundo cada vez mais". Avoid em-dashes (—), use commas or periods.
