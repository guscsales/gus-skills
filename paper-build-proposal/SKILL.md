---
name: paper-build-proposal
description: Use when creating a commercial proposal or sales presentation in Paper using the Paper MCP tools. Triggers on requests to build proposals, quotes, or pitch decks for clients.
---

# Paper Commercial Proposal Builder

## Overview

Creates a commercial proposal presentation in Paper for Inventra clients. Uses the Inventra brand identity (Source Serif 4, Geist, Gold/Slate Blue palette). Expects a markdown file with all slide content as input.

## Input Requirements

| Asset | Source | Required |
|-------|--------|----------|
| Proposal markdown | Client project folder | Yes |
| Inventra logo SVG (light fills) | Brand kit folder | Yes |
| Inventra logo icon SVG (light fills) | Brand kit folder | Yes |

The markdown file should define each slide's title, content, tables, and pricing.

## Brand Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#D4A853` | Labels, accents, numbers, badges |
| `secondary` | `#2E314C` | Dark panels, table headers, CTA cards |
| `darkest` | `#232323` | Cover/final slide bg, text |
| `lightest` | `#fbfbfa` | Content slide bg |
| `heading-font` | `Source Serif 4` | Titles, numbers, serif accents |
| `body-font` | `Geist` | Body text, labels, tables |

## Slide Structure (11 Artboards)

All artboards: **1440 x 900px** landscape.

### Layout Patterns

**Cover (slide 01)** — `bg: darkest`. Centered: Inventra logo (full, light) + "Proposta Comercial" in Source Serif 4 + client name/subtitle in Geist + "Preparada pela Inventra — DD/MM/YYYY".

**Content slides (02-10)** — `bg: lightest`. Structure:
```
Gold label (uppercase, letter-spacing: 3px)
Title (Source Serif 4, 36px, semibold)
[Optional intro text]
[Content: cards, table, timeline, etc.]
Footer: @inventra.sh | slide number
```

**Final slide (11)** — `bg: darkest`. Centered: Inventra icon SVG + tagline + gold line + contact + disclaimer italics.

### Slide Types by Content

| Type | Layout | Used In |
|------|--------|---------|
| **Text + Cards** | Intro paragraph + 4 horizontal cards | "O Que Fazemos" |
| **Table** | Dark header row + alternating rows | "Blog", "Entregas" |
| **Two Panels** | Side-by-side dark/light panels | "Google", "Investimento" |
| **Timeline** | Numbered rows, one highlighted | "Cronograma" |
| **Progress Cards** | 4 horizontal cards with progression | "Retorno Esperado" |
| **Step Cards** | 4 numbered cards (dark→white→white→gold) | "Próximos Passos" |
| **Term List** | Label-value rows, alternating bg | "Termos" |

### Standard 11-Slide Sequence

```
01 Capa
02 O Cenário Atual (market context, opportunity card, specialty tags)
03 O Que Fazemos (4 service cards + deliverables table)
04 Blog Automático (article table + AI mention + disclaimer)
05 Presença no Google (GMB panel + weekly report panel)
06 Investimento (creation price + monthly price, payment options)
07 Cronograma (6-step timeline, highlight delivery milestone)
08 Retorno Esperado (4 progressive cards: foundation → consolidation)
09 Próximos Passos (4 step cards: confirm → briefing → payment → live)
10 Termos (5 term rows)
11 Contato Final (icon + tagline + validity note)
```

### Footer Pattern

```html
<div style="position: absolute; bottom: 48px; left: 80px; right: 80px; display: flex; justify-content: space-between;">
  <p style="font-family: 'Geist'; font-size: 12px; color: #a1a1aa;">@inventra.sh</p>
  <p style="font-family: 'Geist'; font-size: 12px; color: #a1a1aa;">{number}</p>
</div>
```

Use just the number (01, 02...), not "PAGE 01".

## Execution Strategy

1. User creates the target page in Paper and confirms they're on it
2. Verify with `get_basic_info` that the correct page is active
3. Create artboards sequentially
4. Build content incrementally — one visual group per `write_html`
5. Screenshot every 2-3 slides for review
6. All slides render in horizontal sequence automatically

### Key Design Decisions

- **Pricing slide**: Show original price struck through + discounted price large. Payment options in a dark sub-card. "Condição especial" as a gold badge pill.
- **Timeline**: One row highlighted in `secondary` bg (the delivery milestone). Others alternate white/gray.
- **Step cards**: First card `secondary` bg, middle cards white with border, last card `primary` (gold) bg — creates visual progression.
- **Retorno cards**: Progress from warm (`#fff3dc`) → cool (`#f3f4ff`) → dark (`secondary`) to show growth phases.
- **Disclaimers**: Light blue bg (`#f3f4ff`), small text, rounded corners. Never guarantee results — guarantee techniques.
- **Tables**: Dark header (`secondary`), alternating white/`#f8f8f8` rows, rounded top/bottom corners.

## Customization Per Client

When adapting for a new client, change:

1. **Client name/title** in slides 01, 02 (references to client)
2. **Service descriptions** in slide 03 (pages, features)
3. **Blog topics** in slide 04 (relevant to client's industry)
4. **Google specifics** in slide 05 (location, services)
5. **Pricing** in slide 06 (amounts, payment terms)
6. **Timeline** in slide 07 (dates, milestones)
7. **Specialty tags** in slide 02 (client's areas)
8. **Disclaimer text** if needed for specific industry

## Common Mistakes

- **"PAGE XX" in footers**: Use just the number. The client doesn't need the word "PAGE".
- **Email-specific CTA**: Keep "Próximos Passos" channel-agnostic ("WhatsApp ou e-mail") since proposals go through multiple channels.
- **Missing deliverables table**: Always include a numbered deliverables summary on the "O Que Fazemos" slide — clients scan for concrete deliverables.
- **Forgetting disclaimer**: Always add ranking disclaimer on the blog slide. Never promise Google results — promise techniques.
- **Logo SVG truncation**: Use the full SVG path data. The wordmark is one massive `<path>` — don't cut it short.
