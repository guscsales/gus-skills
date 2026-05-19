---
name: paper-brand-kit
description: Use when creating a brand kit or brand guidelines presentation in Paper using the Paper MCP tools. Triggers on requests to build brand kits, style guides, or visual identity documents for clients.
---

# Paper Brand Kit Generator

## Overview

Creates a complete brand kit presentation in Paper (design tool) with 13 landscape artboards. Requires brand assets (colors, fonts, logos, voice) as input. All content is built incrementally via `write_html` with inline styles.

## Input Requirements

Before starting, gather from the client's project folder:

| Asset | Format | Used In |
|-------|--------|---------|
| Logo SVG (dark bg) | `.svg` with light fills | Slides 1, 5, 13 |
| Logo SVG (light bg) | `.svg` with dark fills | Slide 5 |
| Brand colors | Markdown/JSON with HEX + OKLCH | Slides 9-12 |
| Color shades | 50-950 scale per color | Slides 10-12 |
| Heading font | Available in Paper | Slides 2-4, 6-8, 7 |
| Body font | Available in Paper | All slides |
| Brand voice | Markdown with pillars + examples | Slide 3 |
| Contact info | Site, email, phone | Slide 13 |

Check font availability first: `get_font_family_info(["Font Name"])`.

## Slide Structure (13 Artboards)

All artboards: **1440 x 900px** (landscape), arranged horizontally with 80px gaps.

```
01 Capa → 02 Ch:Marca → 03 Marca → 04 Ch:Logo → 05 Logo → 06 Ch:Tipo → 07 Tipo → 08 Ch:Cores → 09 Cores → 10 Shade1 → 11 Shade2 → 12 Shade3 → 13 Contato
```

### Slide Types

**Capa (01)** — `bg: darkest` centered logo + "Brand Guidelines" + footer year

**Chapter Opener (02, 04, 06, 08)** — `bg: secondary` section number (large, accent color) + gold line + title. Create first one, then `duplicate_nodes` for the rest and update text with `set_text_content`.

**Content: Sobre a Marca (03)** — `bg: lightest` two-column: left = brand description + keywords, right = voice pillars in cards (`bg: secondary-50`, rounded)

**Content: Logo (05)** — `bg: lightest` left text column + right split: top half dark with light logo, bottom half light with dark logo. Embed full SVG inline in `write_html`.

**Content: Tipografia (07)** — `bg: lightest` left text column + right split: top panel (`bg: secondary`) heading font hierarchy (H1-H4 with sizes), bottom panel (`bg: primary`) body font examples (large, body, small, italic, label).

**Content: Cores (09)** — `bg: lightest` left text column + 4 vertical swatches (primary, secondary, darkest, lightest) with HEX and OKLCH values.

**Content: Shades (10, 11, 12)** — `bg: lightest` left text column + 11 vertical color strips (50-950). Create first shade slide fully, then `duplicate_nodes` twice. Update colors with `update_styles` on rectangle nodes, update text with `set_text_content`.

**Contato (13)** — `bg: darkest` centered logo icon (only, no wordmark) + "Obrigado" + accent line + contact info.

### Footer Pattern (all slides)

```html
<div style="position: absolute; bottom: 48px; left: 80px; right: 80px; display: flex; justify-content: space-between;">
  <p style="font-family: '{bodyFont}'; font-size: 12px; color: {mutedColor};">@{domain}</p>
  <p style="font-family: '{bodyFont}'; font-size: 12px; color: {mutedColor};">PAGE {nn}</p>
</div>
```

## Color Token Mapping

When building for a client, map these tokens to their brand:

| Token | Role | Example |
|-------|------|---------|
| `primary` | Accent, highlights, gold line | `#D4A853` |
| `secondary` | Chapter bg, heading panels | `#2E314C` |
| `darkest` | Cover bg, dark panels | `#232323` |
| `lightest` | Content bg, light panels | `#fbfbfa` |
| `muted` | Footer text, labels | `secondary-400` or `zinc-400` |
| `subtle-bg` | Voice cards bg | `secondary-50` |

## Execution Strategy

1. **Create artboards** sequentially with `create_artboard`
2. **Build content** incrementally — one visual group per `write_html` call
3. **Duplicate** chapter openers and shade slides — saves 60%+ effort
4. **Screenshot** every 2-3 slides for review checkpoint
5. **Reorder** at end if needed with `update_styles` setting absolute positions

### Duplication Workflow (Chapter Openers)

```
1. Build slide 02 (first chapter opener) fully
2. duplicate_nodes([{id: slide02Id}]) → 3 times
3. rename_nodes for each duplicate
4. set_text_content to update: section number, title, page number
```

### Duplication Workflow (Shade Slides)

```
1. Build slide 10 (first shade) fully with all 11 color strips
2. duplicate_nodes([{id: slide10Id}, {id: slide10Id}]) → 2 copies
3. rename_nodes for each
4. set_text_content for: title, subtitle, page, all 11 token+hex labels
5. update_styles for: all 11 rectangle background colors (use descendantIdMap)
```

## Common Mistakes

- **SVG too large**: Logo SVGs can be ~19KB. Embed full SVG inline — Paper handles it. Use different `clipPath` IDs per SVG instance to avoid conflicts.
- **Truncated wordmark**: When embedding logo SVG, include ALL path elements. The wordmark is typically one massive `<path>` element — don't cut it short.
- **Font not available**: Always check `get_font_family_info` before building. Fall back to Google Fonts if local font unavailable.
- **Shade colors not updated**: After duplicating shade slides, you must update BOTH the rectangle `backgroundColor` via `update_styles` AND the text labels via `set_text_content`. The `descendantIdMap` from `duplicate_nodes` maps source IDs to clone IDs.
