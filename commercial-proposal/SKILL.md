---
name: commercial-proposal
description: 'Generates a formal Inventra commercial proposal for leads who have already seen the demand proof and shown interest. Use this skill whenever the user mentions: commercial proposal, proposal for the client, build a proposal, generate a proposal, send a proposal, Inventra proposal, close a client, sales document, quote for the lead, "the client wants the proposal", "they asked for the price", "I will send the proposal", contract, closing a sale, or similar variations. Also trigger when context indicates a lead has already seen the demand proof / demand report and is ready to receive pricing and scope. The proposal automatically pulls data from the previously generated demand proof, avoiding rework.'
---

# Commercial Proposal — Inventra

Generates a professional commercial proposal according to the chosen language (ask whether output should be in EN-US or PT-BR) for leads who have already seen the demand proof report and shown interest. The proposal connects the identified problem to Inventra's solution with clear scope, timeline, investment, and ROI.

## Core Principle

When the proposal arrives, the lead already knows they have a problem (the demand proof showed it). Now they want to know three things:

- **"What exactly are you going to do?"**
- **"How much does it cost and how do I pay?"**
- **"How soon will I start seeing results?"**

The proposal is straightforward and answers these without fluff. No pages and pages of methodology or jargon — the lead is a busy business owner.

## Prerequisite

The demand proof must have already been generated for this lead. The proposal pulls data from it (volumes, competitors, estimated ROI) to build the argument seamlessly — the lead recognizes the same numbers they saw before.

If no prior demand proof exists, ask the user whether they want to generate one first or prefer to build the proposal without the data.

## Skill Flow

### Step 1: Collect Information

Ask for what you don't already know (skip anything that came from the demand proof or the conversation):

**Question 1 — Which lead?**
> Which business is the proposal for? (name, niche, city)
> If we already generated the demand proof, provide the name we used.

**Question 2 — Contact name:**
> What is the name of the person who will receive the proposal?

**Question 3 — Is there a generated demand proof?**
> Have we already generated the demand proof report for this lead?
> If so, I'll pull the data from there automatically.

**Question 4 — Discount or special condition?**
> Do you want to apply any discount or special condition? (default: full prices)

### Step 2: Retrieve Data from the Demand Proof

If a generated demand proof exists (markdown file in the outputs folder), read the file and extract:

- Total search volume/month (Section 1)
- Main keyword and volume
- Lead's position on Google (Section 2) — usually "doesn't appear"
- Competitors that appear (Section 3)
- Estimated new customers/month (Section 4)
- Estimated revenue — conservative and loyal customer scenarios (Section 4)
- Equivalent Google Ads cost (Section 5)
- Estimated ROI (Section 6)

If there is no demand proof, use generic estimates based on the niche, or ask the user for the key numbers.

### Step 3: Build the Proposal

Use the template below, filling it with real data. The tone is professional but approachable — the lead is a business owner, not a corporation.

---

## Inventra Pricing Table (internal data — use to fill the proposal)

| Item | Value |
|------|-------|
| **Creation & Implementation** | R$ 4.000 |
| Installments | Up to 12x on credit card |
| PIX Discount | 5% off → R$ 3.800 |
| **Monthly Fee** | R$ 300/mês |
| Billing | Credit card (recurring subscription) |
| Lock-in | No lock-in — cancel whenever you want |
| Export/migration after cancellation | Charged separately |

## Standard Scope

| Deliverable | Details |
|-------------|---------|
| Visual identity | If the client already has one, we apply it to the site. If not, we create one. |
| Professional website | Pages: Home, About, Blog, Contact. Extra pages upon request. |
| Automated blog | 8 posts/month (2 per week). For more, let's talk. |
| .com.br domain | Included. Other domains discussed separately. |
| Infrastructure | Vercel — fast, secure, always online. |
| Google My Business | Setup and optimization (if they don't have one). |
| Weekly report | Email every week with key site metrics. |
| Personalized support | Direct channel for questions and adjustments. |

## Timeline

| Phase | Timeframe |
|-------|-----------|
| Site live | Up to 14 days after closing |
| First blog post | Together with the site launch |
| Blog at full pace (2/week) | Starting from week 3 |

---

## Proposal Template

````markdown
# Commercial Proposal
## {business_name}

> Prepared by **Inventra** (inventra.sh) on {date}
> For: {contact_name}

---

## The Current Scenario

{2-3 paragraph summary pulling data from the demand proof. The goal is to remind the lead of the problem — they already saw the data, so this is reinforcement, not repetition.}

We analyzed the digital presence of **{niche}** in **{city}** and identified that **{main_volume} people search for "{main_keyword}" every month** on Google.

Today, **{business_name}** doesn't appear in any of those results. {competitor_sentence — e.g., "Meanwhile, {competitor} already shows up with their own website and captures those customers."}

{If there is ROI data from the demand proof:}
With an optimized website, we estimate **~{total_customers_month} new customers per month** — which represents between **R$ {revenue_a}** (first purchase) and **R$ {revenue_b_monthly}/month** considering returning customers.

---

## What Inventra Will Do

### Professional Website

We build a modern, fast website optimized to show up on Google when people search for your service. It includes:

- **Home** — business presentation, testimonials, call to action
- **About** — {business_name}'s story and differentiators
- **Blog** — optimized articles that attract customers through Google
- **Contact** — form, WhatsApp, map, hours

{If the lead doesn't have a visual identity:}
Since {business_name} doesn't have a defined visual identity yet, we create one during the project — logo, color palette, and typography.

{If the lead already has one:}
We apply {business_name}'s existing visual identity — keeping the brand personality intact.

### Automated Blog

We publish **8 articles per month** (2 per week) on topics people actually search for on Google. Based on our analysis, the topics with the highest potential are:

{List 3-5 topics from Group B of the demand proof with volume}

These articles drive visitors to the site and position {business_name} as a reference in {niche} in the region.

### Google My Business

{If they don't have one or it's poorly set up:}
We set up and optimize your Google My Business profile so you appear on **Google Maps** when someone searches for {niche} near you.

{If they already have one:}
We optimize your existing Google My Business profile to improve positioning on the map.

### Weekly Follow-Up

Every week you receive an email with the key metrics:
- How many people visited your site
- Which articles got the most traffic
- Where visitors came from (Google, social media, direct)
- Google ranking evolution

---

## Investment

### Creation & Implementation (one-time)

| | Value |
|---|------|
| Complete professional website | |
| Visual identity | |
| SEO configuration | |
| Google My Business | |
| .com.br domain (1 year) | |
| **Total** | **R$ 4.000** |

| Payment method | |
|---|---|
| Credit card | Up to 12x of R$ 333 |
| PIX (5% discount) | **R$ 3.800 upfront** |

### Monthly Fee (recurring)

| | Value |
|---|------|
| Automated blog (8 posts/month) | |
| Infrastructure and hosting (Vercel) | |
| Weekly email report | |
| Personalized support | |
| **Monthly total** | **R$ 300/mês** |

Charged to the credit card via subscription. **No lock-in** — cancel whenever you want.

---

## Comparison: Inventra vs Google Ads

{If there is data from the demand proof:}

| | Google Ads | Inventra |
|---|---|---|
| Monthly cost | R$ {ads_cost}/mês | R$ 300/mês |
| Setup | R$ 0 | R$ 4.000 (one-time) |
| Works without paying | No — disappears immediately | Yes — the site is yours |
| Blog content | No | 8 articles/month |
| Credibility | "Sponsored" | Professional website |
| 12-month investment | R$ {ads_cost × 12} | R$ 7.600 |

{If ads_cost > 300, add:}
> To appear in the same searches via Google Ads, the monthly investment would be **R$ {ads_cost}** — {X}x more than Inventra's monthly fee. And the moment you stop paying, you vanish from Google.

---

## Timeline

| Phase | When |
|-------|------|
| Briefing and alignment | Day 1 |
| First version of the site | By day 7 |
| Adjustments and approval | Days 7-12 |
| **Site live** | **By day 14** |
| First blog articles | Together with the launch |
| Blog at full pace (2/week) | Starting from week 3 |
| First weekly report | Week 2 |

---

## Expected Return

{Pull data from the demand proof}

| Period | Estimated new customers | Estimated new revenue |
|--------|------------------------|-----------------------|
| Month 1 | Site indexing — first visitors | Ramp-up period |
| Months 2-3 | ~{total_customers_month * 0.5}/month | R$ {revenue_a * 0.5}/month |
| Months 4-6 | ~{total_customers_month}/month | R$ {revenue_a}/month |
| Months 7-12 | Accumulated organic growth | Growth trend |

> SEO results are progressive — the site gains authority over time. The first months are for building; from month 3-4 onwards, results start appearing consistently.

{If the niche has recurring customers:}
> Every new customer who arrives through Google and likes your service **doesn't buy just once**. {Niche-specific sentence — e.g., "A customer who has coffee 2x a week is worth R$ 2.600 over 6 months."} Customers accumulate month after month.

---

## Next Steps

Getting started is simple:

1. **Confirm** — reply to this email or send a "let's go" on WhatsApp
2. **Quick briefing** — a 15-min conversation to align design and content preferences
3. **Payment** — we send the payment link (credit card or PIX)
4. **Within 14 days** — your site is live

---

## Terms

- **Delivery timeframe:** up to 14 business days after confirmation and payment
- **Monthly fee:** charged via credit card subscription
- **Cancellation:** at any time, no penalties. Data export and site migration charged separately
- **Domain:** included for the first year; annual renewal at the client's expense
- **Revisions:** up to 2 rounds of adjustments included in creation; additional adjustments upon request

---

> **Inventra** — Smart websites and blogs for businesses that want to be found.
> 🌐 inventra.sh

---

*Proposal valid for 15 days.*
*Values in Brazilian reais (BRL). Return estimates based on real Google data and market averages.*
````

---

### Step 4: Adjustments and Customization

After building the proposal, ask the user:

**"Do you want to adjust anything before sending?"**

Common adjustments:
- Apply a discount (reduce setup price, give the first month free, etc.)
- Add extra pages to the scope (if the lead requested them)
- Adjust tone (more formal / more casual)
- Remove the Google Ads comparison section (if the lead isn't interested)
- Add a success story or reference (when available)

### Step 5: Save

Save the file as `proposal-{business_name_slug}-{date}.md` in the outputs folder.
Example: `proposal-casa-molina-caffe-2026-03-30.md`

---

## Edge Cases

**Lead without a demand proof:**
- Build the proposal without the specific data
- Use generic niche estimates ("businesses like yours in cities like {city} typically receive between X and Y new customers via Google")
- Recommend generating the demand proof first — "I can generate a report with real data first, would you like that?"

**Lead wants more than the standard scope:**
- Don't make up prices — say "we'll discuss the additional cost"
- Examples: e-commerce, scheduling system, delivery integration, more pages, more posts

**Lead wants a discount:**
- Ask the user which discount to apply
- Common options: 10% off setup, first month of the monthly fee free, PIX with 5% off (already included)
- Never apply a discount without the user's authorization

**Language:**
- Use the chosen language, simple, same standard as the demand proof
- "Site" not "website"
- "Show up on Google" not "rank"
- "Articles" not "SEO-optimized content"
- Professional but human tone — as if speaking directly to the business owner

**What NOT to include in the proposal:**
- Technical jargon (SEO, CTR, SERP, organic without explanation)
- Result guarantees ("we guarantee X customers")
- Complex legal terms
- More than 3-4 pages — the proposal should be scannable in 2 minutes

---

## Step 6: Split Content into Slides

After generating the proposal content, split it into blocks ready for each slide. The goal is only to organize the content — design and PPTX generation are the user's responsibility.

### Content → Slide Mapping

Each section of the Markdown template corresponds to one or more slides:

**Slide 1 — COVER**
- Lead's logo (if available)
- Title: "Commercial Proposal"
- Subtitle: business / professional name
- Line: "Prepared by Inventra — {date}"

**Slide 2 — THE CURRENT SCENARIO**
- Title: "The Current Scenario"
- 2-3 summarized paragraphs from the "The Current Scenario" section of the template
- If there is data from the demand proof: highlight the main number (e.g., "3,500 searches/month")
- If there is no demand proof: use qualitative tone ("thousands of people search...", "your competitors already appear...")

**Slide 3 — WHAT WE DO (Website)**
- Title: "What Inventra Will Do"
- 4 items for the site pages: Home, About, Blog, Contact (with a short description of each)
- Note about visual identity (already has one / we will create one)

**Slide 4 — AUTOMATED BLOG**
- Title: "Automated Blog — 8 articles/month"
- List with the 5-6 article topics from the template + rationale
- Reinforcement sentence: "These articles position [name] as a reference in [niche]"

**Slide 5 — GOOGLE MY BUSINESS + FOLLOW-UP**
- Two blocks:
  - Google My Business — setup, optimization, map
  - Weekly Report — metrics by email, visitors, ranking

**Slide 6 — INVESTMENT**
- Title: "Investment"
- Two blocks:
  - **Creation & Implementation**: price (with strikethrough if discounted), installments, PIX
  - **Monthly Fee**: price, what's included, "no lock-in"
- If there is a special condition, highlight it

**Slide 7 — COMPARISON vs GOOGLE ADS** *(only if there is data from the demand proof)*
- Title: "Inventra vs Google Ads"
- Comparison table from the template
- Highlight: 12-month cost side by side
- If there is NO demand proof: **skip this slide**

**Slide 8 — TIMELINE**
- Title: "Timeline"
- Timeline: Day 1 (Briefing) → Day 7 (First version) → Days 7-12 (Adjustments) → Day 14 (Site live) → Week 3+ (Blog at full pace)

**Slide 9 — EXPECTED RETURN**
- Title: "Expected Return"
- Projection table by period (Month 1, Months 2-3, Months 4-6, Months 7-12)
- If there is data from the demand proof: include customer and revenue numbers
- If there is NOT: use qualitative text ("first visitors", "consistent flow", "accumulated growth")

**Slide 10 — NEXT STEPS**
- Title: "Next Steps"
- 4 steps: Confirm → Briefing (15 min) → Payment → Site live in 14 days

**Slide 11 — TERMS** *(optional)*
- Timeframe, monthly fee, cancellation, domain, revisions

**Slide 12 — CLOSING / CONTACT**
- Inventra logo
- "Inventra — Smart websites and blogs for businesses that want to be found."
- inventra.sh
- Contact: Gustavo Sales
- "Proposal valid for 15 days"

### Slide Content Rules

- **Never more than 6-7 lines of text per slide** — if there's more, split into two
- **If there is no demand proof**, skip the Google Ads comparison slide and use a qualitative tone in the scenario and return slides

### Output

Save as `proposal-{business_name_slug}-{date}.md` in the outputs folder.
The content must be clearly separated by slide (using headers `## Slide N — TITLE`) to make visual assembly easier afterward.
