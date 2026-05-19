---
name: paper-design-creation
description: Use when designing app screens, modals, or feature flows in Paper (Paper MCP). Triggers on requests like "design X in Paper", "build a mockup for Y", "create artboards for Z", "draft the design for [feature]", or any prompt that wants a multi-state UI laid out on the Paper canvas for handoff to engineering. Encodes the artboard-split + annotation-chip + variants-only-when-actions-change patterns so the resulting designs can be implemented from without ambiguity.
---

# Paper Design Creation

Design app surfaces in Paper so an engineer can implement them with **zero ambiguity** about what is UI vs metadata, what state is what, and which variants are intentional vs accidental duplication.

## When to use this skill

Use whenever the task is to **produce designs in Paper** for a product feature — a page, a flow, a modal sequence — that an engineer will later turn into code. Skip for: brand boards, marketing posters, brainstorming sketches, or proposals (use `paper-build-proposal` / `paper-brand-kit` for those).

## Hard rules

1. **Never call `use_figma`-style or `write_html` tools before** `get_guide({ topic: "paper-mcp-instructions" })`. Paper has its own guide and you must follow it.
2. **Never invent design tokens.** Always derive colors, spacing, type scale, and component shells from an existing baseline artboard via `get_jsx` + `get_computed_styles`. If the project has no baseline, ask the user which artboard to follow.
3. **Never use the words "STATE" or "VARIANT" as raw page-content text.** Always wrap them in the annotation chip pattern (below) so engineers can't mistake them for UI copy.
4. **Only design variants where the ACTIONS change.** A "Solo plan" view and a "Scale plan" view are not separate variants if the only difference is the displayed plan name — the layout and CTAs are identical. A "Past due" view IS a separate variant because the CTAs change ("Update payment method" replaces "Upgrade"). Same rule applies to modals: render `loading`, `submitting`, `error`, `success` only if their UI is meaningfully different.
5. **Match the real app container width.** Ask the user for their container width (e.g. "what's the max-width of your main column?") before creating artboards. Don't default to 1440px / 1900px just because Paper templates do.

## Pre-flight (run once per session)

Always, in this order:

1. `get_guide({ topic: "paper-mcp-instructions" })` — refresh Paper conventions.
2. `get_basic_info` — list existing artboards, fonts, dimensions.
3. `get_font_family_info({ familyNames: [...] })` — confirm weights for every typeface you plan to use.
4. `get_selection` — see what the user is focused on; they may have pointed you at a baseline.
5. **Locate the baseline artboard.** Look for component-library or token artboards (e.g. names matching "design system", "tokens", "components", or the highest-letter "A##" in their numbering). If unsure, ask: *"Which artboard should I use as the visual baseline?"*
6. Pull tokens from baseline: `get_jsx({ nodeId, format: "inline-styles" })` on the most representative card or page, then read off the colors, type scale, radii, shadow, spacing.

Once tokens are locked, list them back to the user as a one-line brief before creating artboards: `bg #F8F9FA · ink #18191B · accent #D4A853 · Source Serif 4 display · Geist UI · radius 14/9 · shadow soft`.

## Artboard structure

### Two artboards is the default split

Most product features split cleanly into two artboards:

- **`App - <Feature> - Page`** — the page composition. Contains every variant of the page itself (states where the layout or actions change).
- **`App - <Feature> - <Flow>`** — the modal / dialog flow triggered from the page (e.g. `Plan Change Flow`, `Onboarding Flow`, `Bulk Actions Flow`).

If the feature has multiple distinct flows, create one artboard per flow rather than cramming them all into one. Don't create more than one artboard per page composition — variants stack inside it.

### Width

Set artboard width to **the user's app container width**, not Paper's default. Common values:

- App with sidebar, content column ~1100px wide → `1104px`
- Full-bleed dashboard → `1440px`
- Mobile → `390px` (and add a status bar via `get_guide({ topic: "mobile-status-bar" })`)

Set `height: "fit-content"` so the artboard grows with stacked variants. Initial pixel height is just a starting frame.

### Naming

Artboard names use the format `App - <Feature> - <Surface>`. Examples:

- `App - Billing - Page`
- `App - Billing - Plan Change Flow`
- `App - Onboarding - Page`
- `App - Settings - Account Flow`

Always prefix with `App -` so the artboards group together visually in the canvas tree alongside any existing `Marketing -`, `Email -`, etc.

## The annotation chip pattern

The single most important pattern in this skill. Use this whenever you need to communicate something to the implementing engineer that **must not appear in the rendered UI** — variant labels, state names, flow notes, "this is a placeholder", anything meta.

### Visual

```
─ ─ ─ ─ ─ ─ ─ ─ ─  [ // design metadata · not rendered in app | VARIANT N — name ]  ─ ─ ─ ─ ─ ─ ─ ─ ─
```

Two horizontal dashed lines flanking a chip. Chip has dashed border, off-canvas gray background, monospace font, and **always starts with `// design metadata · not rendered in app`** so a human (or LLM) reading the design instantly knows the chip is comment-style metadata and not page content.

### HTML template

```html
<div layer-name="ANNOTATION - <Variant Name>" style="margin:0 32px 14px 32px;display:flex;align-items:center;gap:14px;padding:6px 0;">
  <div style="flex-grow:1;height:0;border-top:1px dashed #C7CBD1;"></div>
  <div style="display:inline-flex;align-items:center;gap:8px;background:#EEF0F2;border:1px dashed #C7CBD1;border-radius:4px;padding:5px 10px;">
    <div style="color:#9AA0AA;font-family:'Geist Mono',system-ui;font-size:10px;font-weight:500;line-height:12px;">// design metadata · not rendered in app</div>
    <div style="background:#C7CBD1;width:1px;height:10px;flex-shrink:0;"></div>
    <div style="color:#18191B;font-family:'Geist Mono',system-ui;font-size:11px;font-weight:600;line-height:12px;">VARIANT N — <name>, e.g. Past due (payment failed)</div>
  </div>
  <div style="flex-grow:1;height:0;border-top:1px dashed #C7CBD1;"></div>
</div>
```

Adapt the font family and accent gray to match the project's design system — but keep the structural pattern (dashes + dashed-border chip + `//` prefix + monospace) identical so the convention stays recognizable across all your Paper files.

### Use cases

- **Top of artboard, before the page header** — declare the canonical variant ("VARIANT 1 — Paid (active subscription)").
- **Between sibling variants** — separate "Past due" from "Trial".
- **Before flow groups in a Flow artboard** — "FLOW 1 — Upgrade modal · 4 states".
- **As a notes panel** — same chip style at the top of a `// flow notes` panel that lists triggers, on-confirm behavior, and reused-pattern references.

### Per-modal `// state` chip — ALWAYS outside the dialog

**Critical:** the state chip lives **above** the dialog, not inside it. If you put a state strip inside the dialog (with a bottom border attached to the dialog body), engineers will copy it into the production component. They shouldn't have to be smart enough to know it's metadata — the visual structure has to make it impossible to confuse.

Pattern: each modal entry on a Flow artboard is a column-flex wrapper with two children — `[state chip + dashed line]` then `[Dialog frame]`. The dialog itself has zero metadata text.

```
[ // state | submitting (charging Stripe) ]  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

┌─────────────────────────────────────────┐
│ Dialog body — no state text inside      │
│ ...                                      │
└─────────────────────────────────────────┘
```

HTML:

```html
<div layer-name="Modal Block - <name>" style="flex:1;display:flex;flex-direction:column;gap:10px;">
  <div style="display:flex;align-items:center;gap:10px;padding:0 4px;">
    <div style="display:inline-flex;align-items:center;gap:6px;background:#EEF0F2;border:1px dashed #C7CBD1;border-radius:4px;padding:4px 8px;flex-shrink:0;">
      <div style="color:#9AA0AA;font-family:'Geist Mono',system-ui;font-size:10px;font-weight:500;line-height:12px;">// state</div>
      <div style="background:#C7CBD1;width:1px;height:10px;flex-shrink:0;"></div>
      <div style="color:#18191B;font-family:'Geist Mono',system-ui;font-size:10px;font-weight:600;line-height:12px;">submitting (charging Stripe)</div>
    </div>
    <div style="flex-grow:1;height:0;border-top:1px dashed #C7CBD1;"></div>
  </div>
  <div layer-name="Dialog" style="background:#FFFFFF;border:1px solid #E1E4E8;border-radius:14px;box-shadow:0 24px 48px -12px rgba(31,29,27,0.18);display:flex;flex-direction:column;overflow:hidden;">
    <!-- dialog content -->
  </div>
</div>
```

The `//` prefix + dashed-border chip + dashed line make this unmistakably code-comment-style metadata. Engineer's eye drops it from the implementation automatically.

## Variant decision: does this state deserve its own design?

Before rendering a new variant, run this checklist:

| Question | If yes | If no |
|---|---|---|
| Does the primary CTA change? | Render it | Don't |
| Does the alert/banner change? | Render it | Don't |
| Does the data layout change (rows added/removed)? | Render it | Don't |
| Only the data values change? | **Don't render** | — |
| Only the plan name / user name / number changes? | **Don't render** | — |

Examples:

- ✅ `Paid` vs `Past due` — different CTA + red alert ribbon. Render both.
- ✅ `Trial` vs `Paid` — trial banner replaces plan card; CTAs are "Choose plan" vs "Manage". Render both.
- ✅ Modal: `default` vs `loading` vs `error` — visibly different. Render all three.
- ❌ `Paid (Solo)` vs `Paid (Scale)` — same layout, different displayed plan name. **One variant.**
- ❌ Modal: `loading (preview)` vs `loading (submitting)` — both are spinners. **One variant.**
- ❌ `Pending downgrade` — this is just `Paid` + an extra banner. Show the banner inside the `Paid` variant; don't make it its own.

When you skip a variant, add a one-line note in the closest annotation chip: `// loading + error reuse upgrade pattern`.

## Forms inside dialogs: skip fields the app already knows

If the user is logged in, **don't render Name and Email inputs in a contact-style modal**. The app has the session — show the email inline in the subtitle copy ("we'll reply at user@example.com") and skip the inputs entirely.

Same rule for any field the app could prefill from session, organization context, or current entity: don't make the user re-enter it. Only render inputs for data the app genuinely doesn't have.

## CTA placement: actions live in one place

When a feature has multiple cards that could plausibly host the same action, **put the action in only one of them**. The card the user looks at to decide ("which plan?") is where the CTA goes; the card that just shows current state ("here's what you have") shouldn't repeat it.

This prevents the engineer from wiring up two competing CTAs and prevents visual ambiguity for the end user.

Example from the Inventra billing redesign: the current-plan card shows status, price, payment method — but **no Upgrade or Downgrade button**. The plans grid below it is the only surface where plan-change CTAs live.

## Build workflow

Paper renders writes in real-time, so build incrementally:

1. **One visual group per `write_html` call.** A header, a banner, one card, one row of a plans grid. Never write 50+ lines of HTML in one call.
2. **Screenshot after each meaningful group.** `get_screenshot({ nodeId: <artboard or section> })`. Compare against your mental model.
3. **Use `duplicate_nodes` for repeated structures.** When you have three pricing tiers, build one, dup twice, then `update_styles` + `set_text_content` to vary them. Saves tokens vs rewriting HTML.
4. **Use `move_nodes` to reorder.** Don't delete + rewrite a section just to change position; `move_nodes` preserves IDs.
5. **Switch artboard to `height: "fit-content"`** after composition is done so it doesn't clip or leave dead space.
6. **End with `finish_working_on_nodes`** (no args = release all). This drops the working indicator from artboards.

### Iterating on a section

When the user requests a change to a built section:

- **Small change** (rename, recolor, swap one icon) → `set_text_content` or `update_styles`.
- **Add an element** → `write_html({ targetNodeId: <section>, mode: "insert-children" })`.
- **Restructure a section** → `write_html({ targetNodeId: <node>, mode: "replace" })` — replaces the node and its descendants with new HTML.
- **Delete an element** → `delete_nodes({ nodeIds: [...] })`. Verify parent first with `get_node_info` if unsure.

Never delete an entire artboard to "start over." Targeted edits preserve user trust and the canvas history.

## Token derivation cheat sheet

When pulling from a baseline:

```
get_jsx({ nodeId: <baseline card>, format: "inline-styles" })
```

Read off:

- **Background colors** — surface, card, accent, muted bg
- **Text colors** — primary ink, muted, subtle, accent text
- **Border** — color + width + radius
- **Shadow** — exact value (often `0 12px 32px -8px rgba(...)`)
- **Type scale** — display family + size/weight, body family + sizes, mono family + sizes, all letter-spacing and line-height values
- **Spacing** — padding inside cards, gap between sections, eyebrow spacing

Save these as a working token list in your head (or in TodoWrite) before writing anything. Reuse them verbatim — don't round, don't tweak. The whole point of a baseline is consistency.

## Anti-patterns

- ❌ Writing "STATE — Paid Scale" as plain page text. **Engineer will ship it.**
- ❌ Creating a "mobile" artboard that's just the desktop artboard at 390px wide. If the layout doesn't reflow, no second artboard.
- ❌ Adding a "Recommended" badge to every plan tier "for visual interest." Badges are signal — if everything has one, nothing does.
- ❌ Making the artboard 1900px wide because A15 was. Match the user's actual app container.
- ❌ Showing the same modal in `loading`, `submitting`, and `processing` states when they all render identically. One state, one variant.
- ❌ Building a 12-card plans grid in one `write_html` call. Build the first card, dup, vary.
- ❌ Putting the same CTA on the current-plan card AND the plans grid AND the footer. Pick one.
- ❌ Putting the `// state` chip **inside** the dialog (e.g. as a header strip with bottom border attaching it to the dialog body). Engineers will copy it into the production component. Always render the chip above the dialog with a dashed-line separator.
- ❌ Adding Name / Email inputs to a contact-form modal when the app has the user session. Show the email inline in the subtitle, skip the inputs.

## Closing

When the design is done:

1. `get_screenshot` on each artboard at full size and review against the rules above.
2. List back to the user: which artboards exist, which variants each contains, which actions live where. Two-paragraph max.
3. `finish_working_on_nodes` to release indicators.
4. Do **not** offer to start implementation unless the user asks. Designs are the deliverable.
