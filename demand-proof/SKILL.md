---
name: demand-proof
description: 'Generates a "demand proof" report for Inventra client prospecting. Use this skill whenever the user mentions: prove demand, demand proof, show to the client, business search volume, market research for client, prospect client, convince client, local search data, "how many people search for X", "my client doesn''t believe it", prospecting report, local market analysis, how much does Google Ads cost, website ROI, site return on investment, how many clients can I win, or similar variations. Also trigger when the context indicates preparing a commercial proposal for a Brazilian SMB using search data as a sales argument. Works via DataForSEO MCP Server. Output in Markdown ready to send to the lead or paste into Notion.'
---

# Demand Proof — Demand Proof Report for Leads

Generates a professional report showing the potential Inventra client that real search demand exists for their service, translating search data into **real customers and estimated revenue**.

## Core Principle

The lead doesn't want to hear about "search volume." They want to know:
- **"Will this bring me customers?"**
- **"How much will I earn from this?"**
- **"Is it worth more than what I pay?"**

The entire report must answer these 3 questions with real data.

## Prerequisite: DataForSEO MCP Server

### Setup (one time only)

**In Claude Desktop / Cowork:**
1. **Settings -> Connectors -> Add custom connector**
2. URL: `https://mcp.dataforseo.com/mcp`
3. Authenticate with DataForSEO credentials (API login + password, from app.dataforseo.com/api-access)

**In Claude Code:**
```bash
claude mcp add dataforseo --transport http https://mcp.dataforseo.com/mcp \
  --env DATAFORSEO_USERNAME=your_login \
  --env DATAFORSEO_PASSWORD=your_password
```

### Tools used
- `keywords_data_google_ads_search_volume` — volume + CPC
- `serp_google_organic_live` — who shows up on Google today
- `dataforseo_labs_google_keyword_suggestions` — long-tail suggestions (blog)
- `business_data_google_my_business_info` — Google Maps data (price_level, rating, category)

---

## Skill Flow

### Step 1: Interview the User

Ask these questions (skip any already answered):

**Question 1 — Niche:**
> What is the lead's niche or type of business?
> E.g.: cafeteria, psychologist, dentist, personal trainer, Japanese restaurant, pet shop

**Question 2 — Location:**
> Does the business depend on location? (Does the customer need to go there or live nearby?)
>
> **Location-based**: cafeteria, restaurant, barbershop, clinic, gym, pet shop
> **Not location-based**: online coach, financial consultant, e-commerce store, online therapist

**Question 3 (if location-based) — City/Region:**
> In which city or region?

**Question 4 — Business name or Google link:**
> What is the business name? Or if available, paste the Google Maps / Google My Business link.
> (We use this to look up the price level and check if it shows up in results)

**Question 5 — Average ticket (if unable to look up automatically):**
> How much does the customer spend on average per visit/session/purchase?
> For a service like a cafeteria, consider the real average consumption (solo ~R$ 40, couple ~R$ 80, family ~R$ 150).
> If unknown, I'll ask the niche and use a market reference.

### Step 1b: Fetch Business Data via MCP (automatic)

If the user provided a name or Google link, automatically fetch the business data.

**Via DataForSEO MCP — tool `business_data_google_my_business_info`:**

If the user provided the **Google Maps link**, extract the `place_id` or `cid` from the URL:
- URL like `google.com/maps/place/...` -> extract place_id
- URL like `google.com/maps?cid=123456` -> use `cid:123456`

```
keyword: "business name" OR "cid:XXXXX" OR "place_id:XXXXX"
location_code: 2076
language_code: "pt"
```

**Data to extract:**
- `price_level` -> Google Maps price level
- `rating` -> Google rating (e.g., 4.5)
- `rating_count` -> number of reviews
- `category` -> business category
- `address` -> confirmed address
- `url` -> current website (if any)

**Translating price_level to average ticket:**

| price_level (DataForSEO) | Google Maps | Estimated average ticket |
|--------------------------|-------------|------------------------|
| `inexpensive` | $ | R$ 20 - 40 |
| `moderate` | $$ | R$ 40 - 90 |
| `expensive` | $$$ | R$ 90 - 180 |
| `very_expensive` | $$$$ | R$ 180+ |

Use the midpoint of the range as default. If price_level is not available (not every business has one), use the niche reference table below.

**Bonus — if the business does NOT have a website (`url` is null or only social media):**
Add to the report: "Your business shows up on Google Maps but doesn't have its own website. Customers searching for you find only your Google profile or social media — with no control over the experience."

**Average ticket and recurrence reference by niche (fallback if price_level unavailable):**

| Nicho | Average ticket | Typical recurrence | Estimated LTV (6 months) |
|-------|---------------|-------------------|------------------------|
| Cafeteria / cafe | R$ 60 | 2x/week | R$ 2,880 |
| Restaurante | R$ 80 | 2x/month | R$ 960 |
| Psicóloga | R$ 200 | 4x/month | R$ 4,800 |
| Dentista | R$ 300 | 1x/quarter | R$ 600 |
| Personal trainer | R$ 200/month | subscription | R$ 1,200 |
| Pet shop / veterinário | R$ 100 | 1x/month | R$ 600 |
| Barbearia / salão | R$ 80 | 2x/month | R$ 960 |
| Academia | R$ 120/month | subscription | R$ 720 |
| Advogado | R$ 400 | one-time case | R$ 400 |
| Nutricionista | R$ 200 | 2x/month for 3 months | R$ 1,200 |
| Clínica de estética | R$ 250 | 1x/month | R$ 1,500 |
| Arquiteto / designer | R$ 3,000 | one-time project | R$ 3,000 |
| Contabilidade | R$ 300/month | subscription | R$ 1,800 |

LTV is the most important data point for the report — it transforms "R$ 60 per coffee" into "R$ 2,880 per loyal customer."

**Question 6 (optional) — Recurrence:**
> Does the customer come back frequently? How often?
> (If unknown, use the table above as reference)

### Step 2: Generate Keywords

Generate 3 groups of keywords adapted to the niche:

#### Group A — Transactional Keywords (direct service search)

**If location-based:**
```
- "{niche} em {city}"
- "{niche} {city}"
- "melhor {niche} em {city}"
- "{niche} perto de mim"
- "{niche} perto"
- "{niche} próximo"
- "{niche} aberto agora" (if retail/food)
```

**If NOT location-based:**
```
- "{niche} online"
- "contratar {niche}"
- "{niche} preço"
- "{niche} valor"
- "melhor {niche}"
```

**Adaptations by niche:**
- Food: "café da manhã perto de mim", "delivery {niche} {city}", "brunch {city}"
- Health: "consulta {niche} {city}", "{niche} particular", "agendar {niche}"
- Beauty: "corte de cabelo {city}", "manicure perto de mim"
- Pet: "banho e tosa {city}", "veterinário perto de mim"
- Fitness: "academia perto de mim", "pilates {city}"

#### Group B — Blog Keywords (long-tail / informational)

Searches that the blog answers, attracting qualified organic traffic:

```
- "como escolher {niche}"
- "quanto custa {niche}"
- "{niche} vale a pena"
- "dicas de {niche}"
- "quando procurar {niche}"
- "{niche} para {target audience}"
- "benefícios de {service}"
```

Adapt to the niche:
- Cafeteria: "melhores cafés especiais", "como fazer café coado", "café da manhã saudável"
- Psychologist: "como saber se preciso de terapia", "ansiedade sintomas", "terapia online vale a pena"
- Dentist: "clareamento dental valor", "dor de dente o que pode ser"

#### Group C — "Near Me" (location-based only)

```
- "{niche} perto de mim"
- "{broad category} perto de mim"
- "onde {verb} perto de mim" (e.g.: "onde tomar café perto de mim")
```

### Step 3: Fetch Search Volume via MCP

Call `keywords_data_google_ads_search_volume` with ALL keywords:

```
keywords: [all]
location_code: 2076  (Brazil)
language_code: "pt"
```

**Extract per keyword:** `search_volume`, `cpc` (USD), `competition`, `monthly_searches`

**Conversion:** CPC USD -> BRL x 5.50

### Step 4: Fetch SERP via MCP

Call `serp_google_organic_live` for the main keyword from Group A (highest volume):

```
keyword: "{main keyword}"
location_code: 2076
language_code: "pt"
depth: 10
```

Check if the lead's business appears in the results.

**Competitor analysis (extract from SERP):**

For each organic result, classify:
1. **Direct competitor** — same niche, same city (e.g., another cafeteria in Atibaia)
2. **Aggregator/listing** — TripAdvisor, Google Maps, local guides, blogs
3. **Other** — not relevant

For each direct competitor, note:
- Business name
- Whether it has a **dedicated website** (its own .com.br domain) or only social media (instagram.com, facebook.com)
- Whether it appears in **listings/blogs** (indicates active digital presence)
- Position on Google

This data feeds into **Section 3 of the report** ("Your Competitors Are Already Ahead").

**Tip:** if the SERP result shows a competitor with a dedicated website AND blog, highlight this in the report — it's the strongest urgency argument.

### Step 5: Fetch Blog Suggestions via MCP (if available)

Call `dataforseo_labs_google_keyword_suggestions` to enrich Group B:

```
keyword: "{niche}"
location_code: 2076
language_code: "pt"
limit: 20
```

Filter only informational keywords useful for blog content.

### Step 6: Calculate Business Metrics

**Google Ads — REALISTIC cost (top 5 keywords only):**
```
Select the 5 keywords from Group A with highest volume
monthly_ads_cost = sum(volume x cpc_brl) of those 5
```
Use only top 5 to be honest — nobody advertises on all keywords.

**Estimated new customers (via organic site):**
```
organic_visitors = sum_volumes_group_a x 0.276 (CTR position 1)
estimated_leads = organic_visitors x 0.03 (3% conversion rate)
site_customers_month = estimated_leads x 0.50 (50% of leads become customers)
```

**Estimated new customers (via blog):**
```
blog_visitors = sum_volumes_group_b x 0.15 (lower CTR, average position)
blog_leads = blog_visitors x 0.02 (lower conversion, informational traffic)
blog_customers_month = blog_leads x 0.30 (longer funnel)
```

**ALWAYS calculate two return scenarios:**

```
total_customers_month = site_customers_month + blog_customers_month

Scenario A — First Purchase (conservative):
revenue_a = total_customers_month x single_ticket

Scenario B — Loyal Customer (realistic):
ltv_6m = single_ticket x frequency x 26 weeks (or months depending on niche)
revenue_b_total = total_customers_month x ltv_6m
revenue_b_monthly = revenue_b_total / 6
```

Scenario B is the strong argument: each customer the website brings doesn't buy just once — they come back many times.

**ROI for each scenario:**
```
inventra_investment = R$ 300/month
roi_a = revenue_a / inventra_investment
roi_b = revenue_b_monthly / inventra_investment
```

### Step 6b: Viability Flag (INTERNAL — does NOT go into the lead's report)

Before assembling the report, evaluate the ROI and show a flag to the user (Gus).
This flag appears BEFORE the report, as a warning in the conversation:

```
IF roi_a >= 3:
  -> GREEN: "Excellent ROI even in the conservative scenario. Strong niche for Inventra."

IF roi_a >= 1 AND roi_a < 3:
  -> YELLOW: "Positive but modest ROI on single ticket.
    The sales argument should focus on the loyal customer scenario.
    If the lead understands that customers come back, they'll close."

IF roi_a < 1 AND roi_b >= 2:
  -> ORANGE: "Negative ROI on single ticket, positive with recurrence.
    Works if the niche truly has high recurrence (cafeteria, salon, gym).
    Reinforce the loyalty argument in the conversation."

IF roi_a < 1 AND roi_b < 2:
  -> RED: "Weak ROI in both scenarios.
    Possible reasons: very low ticket, small search volume, or small city.
    Consider: (1) not pursuing this lead, (2) adjusting the offer (site only, no blog),
    or (3) focusing on Google Ads as a comparative argument."
```

Flag output example:
```
ORANGE FLAG — Cafeteria in Atibaia
Single ticket ROI: R$ 420/month vs R$ 300 investment (1.4x) — tight
Loyalty ROI: R$ 1,680/month vs R$ 300 investment (5.6x) — strong
Recommendation: focus on the argument "each new customer is worth R$ 2,880 over 6 months"
```

### Step 7: Assemble the Report

Use EXACTLY this template, filling in with real data.

**IMPORTANT — Inline references:**
Throughout the report, whenever presenting a data point, add a micro-reference in parentheses indicating the source. Examples:

- "**490 people** search for cafeteria in Atibaia every month *(source: Google Ads — Keyword Planner)*"
- "Rating 5.0 with 1 review *(source: Google Maps)*"
- "Price level: $$ - $$$ *(source: Google Maps)*"
- "Cafe Dali appears at position 5 *(source: Google search on 03/28/2026)*"
- "Click-through rate of 27.6% for 1st position *(source: FirstPageSage 2024)*"

The goal is for the lead to see that **nothing was made up** — everything is verifiable. They can open Google and confirm every number.

Don't overdo it: place the reference on the first mention of each type of data. After that you can omit it to keep things clean.

---

````markdown
# Digital Opportunity Report
## {Niche} in {City}

> Prepared by **Inventra** (inventra.sh) on {date}
> Real Google data

---

### What this report shows

We analyzed the real searches people make on Google when looking for **{niche}** in your area. The numbers below are real — and they show how many customers you may be missing out on.

---

## 1. How Many People Search for Your Service

**{sum_volumes_group_a} people search for {niche} in your area every month.**

| What people type on Google | Searches per month |
|---------------------------|-------------------|
| {keyword1} | {vol1} |
| {keyword2} | {vol2} |
| ... | ... |
| **Total** | **{sum}** |

{If location-based and has "near me" keywords:}

### "Near Me" Searches

These are people **on the street, phone in hand**, looking for exactly what you offer:

| Search | Searches per month |
|--------|-------------------|
| {kw_near1} | {vol} |
| {kw_near2} | {vol} |

> **{sum_near_me} people per month** make this type of search.
> They're ready to buy — they just need to find you.

---

## 2. Who Shows Up When They Search for You

When someone searches **"{main_keyword}"** on Google today:

| Position | Who shows up |
|----------|-------------|
| 1st | {title1} — {domain1} |
| 2nd | {title2} — {domain2} |
| 3rd | {title3} — {domain3} |
| 4th | {title4} — {domain4} |
| 5th | {title5} — {domain5} |

{If the business does NOT appear:}

> **{business_name} does not appear in any result.**
>
> {vol_main} people per month search for this and find only your competitors.

{If the business appears:}

> **{business_name} appears at position {pos}.**
> With optimization, it's possible to climb to the top positions and capture more customers.

---

## 3. Your Competitors Are Already Ahead

{Analyze SERP results and identify DIRECT competitors in the same niche/city.
For each direct competitor found, check:
- Has a dedicated website? (own domain vs instagram/facebook/ifood)
- Appears in listings/blogs? (tripadvisor, local blogs, guides)
- Has a blog/content? (check if the domain has /blog or articles)}

Some of your competitors have already invested in their digital presence:

| Competitor | What they have | Where they appear |
|------------|---------------|------------------|
| {competitor1} | {Dedicated website / Blog / Social media only} | {Google position X, TripAdvisor, local blogs} |
| {competitor2} | {Dedicated website / Blog / Social media only} | {Google position X, "best of" lists} |
| {competitor3} | {Dedicated website / Blog / Social media only} | {Google position X} |

{If the lead does NOT have a website and competitors DO:}

> While **{competitor with site}** already appears on Google with a dedicated website and attracts customers online, **{business_name}** relies solely on social media and word of mouth.
>
> Every day without an optimized website is a day your competitors capture customers that could be yours.

{If NO direct competitor has a website (opportunity):}

> None of your direct competitors have a professional optimized website. This is a **huge opportunity**: whoever invests first will dominate search results in the area.

---

## 4. How Many Customers You Can Gain

Based on search data and average conversion rates:

### With an optimized website:

| | Estimate |
|---|---------|
| People searching for your service/month | {sum_volumes_a} |
| Estimated visitors to your site (1st position) | {organic_visitors} |
| **New customers per month** | **{site_customers_month}** |

### With an active blog (SEO content):

The blog attracts people researching topics related to your service. They discover your business through the content and become customers.

| Blog article topic with potential | Searches/month |
|----------------------------------|---------------|
| {kw_blog1} | {vol} |
| {kw_blog2} | {vol} |
| {kw_blog3} | {vol} |
| {kw_blog4} | {vol} |
| {kw_blog5} | {vol} |
| **Total** | **{sum_blog}** |

| | Estimate |
|---|---------|
| Blog visitors/month | {blog_visitors} |
| **New customers via blog/month** | **{blog_customers_month}** |

> Blog traffic grows over time. With consistent publishing, it tends to multiply 3x to 5x within 12 months.

### What each new customer represents:

| | First purchase | If they become a loyal customer* |
|---|---|---|
| Value per customer | R$ {single_ticket} | R$ {ltv_6m} (over 6 months) |
| With {total_customers_month} new customers/month | R$ {revenue_a}/month | R$ {revenue_b_monthly}/month |
| Over 12 months | R$ {revenue_a x 12} | R$ {revenue_b_monthly x 12} |

*{Text adapted to the niche. E.g. for cafeteria: "A customer who likes your coffee and comes back 2x a week spends on average R$ 2,880 over 6 months." E.g. for psychologist: "A patient who starts weekly therapy represents R$ 4,800 over 6 months."}

---

## 5. How Much It Costs to Appear on Google Ads

The alternative to organic search is paying for **Google Ads** (advertisements). Here's how much it would cost to show up for the 5 most important searches:

| Search | Volume/month | Cost per click |
|--------|-------------|---------------|
| {top_kw1} | {vol} | R$ {cpc} |
| {top_kw2} | {vol} | R$ {cpc} |
| {top_kw3} | {vol} | R$ {cpc} |
| {top_kw4} | {vol} | R$ {cpc} |
| {top_kw5} | {vol} | R$ {cpc} |
| **Estimated monthly total** | | **R$ {ads_cost_top5}** |

> This amount is **per month**, and it only works **as long as you keep paying**.
> The moment you stop paying, you disappear from Google.

---

## 6. The Investment and the Return

| | Google Ads | Site + Blog (Inventra) |
|---|---|---|
| Monthly cost | R$ {ads_cost_top5} | R$ 300* |
| Works without paying | No — disappears | Yes — permanent |
| Attracts customers via blog | No | Yes |
| Credibility | Advertisement | Professional website |

*Reference value for Inventra monthly plan (plan with automatic blog).

### In practice — conservative scenario (first purchase only):

| | Per month | Per year |
|---|--------|---------|
| Inventra investment | R$ 300 | R$ 3,600 |
| New customers (site + blog) | {total_customers_month} | {total_customers_month x 12} |
| New revenue | R$ {revenue_a} | R$ {revenue_a x 12} |
| **Return per R$ 1 invested** | **R$ {roi_a}** | |

### In practice — realistic scenario (customers who come back):

| | Per month | Over 12 months |
|---|--------|--------------|
| Inventra investment | R$ 300 | R$ 3,600 |
| New customers (site + blog) | {total_customers_month} | {total_customers_month x 12} |
| Value of each loyal customer | R$ {ltv_6m} (over 6 months) | |
| **Revenue generated by new customers** | **R$ {revenue_b_monthly}** | **R$ {revenue_b_monthly x 12}** |
| **Return per R$ 1 invested** | **R$ {roi_b}** | |

{If the niche has recurrence, add:}
> Each customer who discovers your business through Google and likes it **doesn't buy just once**.
> {Phrase adapted to the niche, e.g.: "A customer who has coffee 2x a week represents R$ 2,880 over 6 months."}
> The website and blog bring new customers **every month** — and they accumulate.

{If ads_cost > 300:}
> If you were to use Google Ads to appear in the same searches, you'd pay **R$ {ads_cost_top5}/month** — {X}x more than the Inventra investment.

---

## Next Steps

1. **Professional website** optimized for the searches we identified
2. **Automatic blog** publishing weekly articles on the topics with the most potential
3. **Google My Business** configured to show up on the map
4. **Monthly follow-up** — you receive a growth report every month

---

## Sources and References

All data in this report comes from public and verifiable sources:

| Data | Source | How to verify |
|------|--------|--------------|
| Search volume and cost per click | Google Ads (via DataForSEO) | Go to ads.google.com -> Keyword Planner |
| Search results (who shows up) | Google.com — organic search | Search "{main_keyword}" on Google in incognito mode |
| Business price level | Google Maps / Google My Business | Search "{business_name}" on Google Maps |
| Rating and reviews | Google Maps | Search "{business_name}" on Google Maps |
| Competitor information | Google.com — organic search | Search "{main_keyword}" on Google in incognito mode |
| Click-through rate by position (CTR) | FirstPageSage 2024 study | firstpagesage.com/seo-blog/google-click-through-rates |
| Conversion rate (3%) | Market average — WordStream, Unbounce | unbounce.com/average-conversion-rates |

> You can verify any data in this report. Just open Google in an
> incognito window (Ctrl+Shift+N) and search for the keywords listed above.

---

> **Inventra** — Smart websites and blogs for businesses that want to be found.
> inventra.sh

---

*Report generated on {date} with real Google data.*
*Volumes = monthly averages over the last 12 months. CPC in local currency.*
*Conversion estimates based on market averages. Actual results depend on multiple factors.*
````

---

### Step 8: Edge Cases and Adjustments

**Zero volume:**
- Show as "< 10" in the table
- If all return 0: try without accents, generic terms, larger city
- Note: "Google rounds small volumes. There are real searches even when it shows zero."

**Very specific niche:**
- "Neuropsychologist in Atibaia" returns 0? Move up to "psychologist in Atibaia"
- Keep the specific one as "< 10" and use the generic one as main

**Zero CPC:**
- Use CPC from the closest keyword or the group average

**Estimated customers comes out zero or very low:**
- If volumes are very low, the calculation may result in < 1 customer/month
- Show as "~1" (round up if > 0.3)
- Add: "Even 1 new customer per month at R$ {ticket} can pay for the investment"
- If it comes out literally 0, check the keywords — probably needs more generic terms

**Viability flag (Step 6b):**
- The flag is ALWAYS shown to the user BEFORE the report, never to the lead
- If RED flag, ask the user if they really want to generate the report
- The lead's report is always optimistic but honest — it never lies about the numbers

**Language:**
- Simple, zero jargon (adapt to the lead's language — PT-BR for Brazilian leads, EN-US for US leads)
- "searches per month" not "search volume"
- "cost per click" not "CPC"
- "show up on Google" not "rank"
- Never mention "CTR", "SERP", "organic" without explaining

**Honesty:**
- Use only top 5 keywords in the Google Ads calculation (realistic)
- Conservative conversion rate (3% site, 2% blog)
- Make clear these are estimates
- Don't promise results, show potential

---

### Step 9: Generate Outreach Message

After generating the report, automatically create a first-contact message ready to copy and send to the lead via WhatsApp or email.

The message should be short (3-5 lines), personal, and based on the report data. The goal is to spark curiosity — NOT to sell. The lead needs to want to see the data, not receive a pitch.

**WhatsApp template (short, direct):**

```
Hi {contact_name}! How are you?

I did a quick analysis of the digital presence of cafeterias in {city} and found an interesting data point: {main_volume} people search for "{main_keyword}" every month on Google — and {business_name} doesn't show up in any result.

{competitor_phrase}

I put together a report with the full data. Can I send it to you?
```

**Message variables:**
- `{contact_name}` -> name of the owner/manager (ask the user if unknown)
- `{main_volume}` -> volume of the main keyword from Group A
- `{main_keyword}` -> keyword with the highest volume from Group A
- `{business_name}` -> business name
- `{competitor_phrase}` -> adapt based on SERP:
  - If competitor has a website: "Meanwhile, {competitor} already shows up on Google with their own website."
  - If nobody has a website: "No competitor in the area has an optimized website — whoever does it first gets the advantage."
  - If lead doesn't appear but competitors are on Maps: "{competitor1} and {competitor2} already show up in the top positions."

**Email template (slightly more detailed):**

```
Subject: {business_name} — {main_volume} people search for you every month

Hi {contact_name},

I work with digital presence for local businesses and did an analysis of the {niche} market in {city}.

I found that:
- {main_volume} people search for "{main_keyword}" every month
- {near_me_volume} search for "{niche} near me" (people on the street, ready to buy)
- {business_name} doesn't appear in any of those results

{competitor_phrase}

I put together a report with all the data — search volumes, competitors, and how much this represents in new customers.

Can I send it to you?

Gustavo Sales
Inventra — inventra.sh
```

**Message rules:**
- Never mention price, proposal, or sale
- Never use words like "incredible opportunity", "revolutionize", "transform"
- The tone is of someone who discovered something interesting and wants to share
- If the viability flag is RED, don't generate the message — warn the user that it may not be worth approaching this lead
- Always ask the user: "Do you want me to adjust anything in the message before sending?"

**Output:** show both versions (WhatsApp and email) ready to copy, right after the report.

---

## Cost per Report (DataForSEO)

| API Call | Cost |
|----------|------|
| Search Volume (~20 keywords) | ~$0.15 |
| SERP Live (1 keyword) | ~$0.004 |
| Keyword Suggestions (1 call) | ~$0.05 |
| Business Info (1 business) | ~$0.01 |
| **Total** | **~$0.21** |

## Brazil Location Codes

| Location | Code |
|----------|------|
| Brazil (all) | 2076 |
| Sao Paulo capital | 1001773 |
| Rio de Janeiro | 1001541 |
| Belo Horizonte | 1001168 |
| Curitiba | 1001249 |
| Campinas | 1001204 |

Small cities: use 2076 (Brazil).

## US Location Codes

| Location | Code |
|----------|------|
| United States (all) | 2840 |
| New York, NY | 1023191 |
| Los Angeles, CA | 1013962 |
| Chicago, IL | 1016367 |
| Houston, TX | 1026339 |
| Austin, TX | 1026135 |

For smaller US cities: use the state or 2840 (United States).

---

## Reference Examples

- **PT-BR example**: [references/exemplo-cafeteria-atibaia.md](references/exemplo-cafeteria-atibaia.md) — Cafeteria in Atibaia, Brazil (R$ / BRL)
- **EN-US example**: [references/example-coffee-shop-austin.md](references/example-coffee-shop-austin.md) — Coffee shop in Austin, TX, USA ($ / USD)
