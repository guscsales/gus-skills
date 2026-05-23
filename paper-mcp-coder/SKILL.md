---
name: paper-mcp-coder
description: Pixel-perfect rebuild of components from Paper artboards into the codebase. Use whenever the user wants to migrate a design from Paper into code, redesign an existing component to match a Paper artboard, or update a design system based on Paper. Triggers on phrases like "rebuild from Paper", "migrate Paper artboard", "update component from A0X", "redesign component from the design system in Paper", or "implement design from Paper into our app". Auto-discovers all child nodes from a single artboard ID using get_children + get_tree_summary, then extracts each child via get_jsx + get_computed_styles (never screenshots as input), converts to the codebase's Tailwind v4 + token conventions in rem, and validates pixel parity in Chrome MCP before declaring complete.
---

# paper-mcp-coder

Pixel-perfect rebuild of UI from Paper artboards into the codebase. The skill never makes you repeat the same rules across artboards — every Paper-to-code migration follows the same flow.

## Pre-flight (HARD GATES)

Before any other step, verify:

1. **Paper MCP is available.** Confirm by calling `paper:get_basic_info`. If it errors, stop and tell the user to open Paper Desktop with the correct file loaded.
2. **Chrome MCP is available.** Confirm by checking for `Claude in Chrome` tools (`Claude in Chrome:list_connected_browsers`, `navigate`, `read_page`, etc.). If absent, stop and tell the user the skill cannot complete without it.
3. **Read the official Paper guide once per session** by calling `paper:get_guide({ topic: "paper-mcp-instructions" })`. The guide includes the canonical "design → codebase" rules. Treat its instructions as authoritative if they conflict with this skill.

If any gate fails, do not proceed. Surface the blocker clearly.

**Resolving the target artboard.** The user provides a single artboard ID (e.g., "rebuild welcome page from artboard 1JX-0"). The skill auto-discovers all children — no need for multiple node IDs. If the invocation does NOT provide an artboard ID, check `paper:get_selection`; if empty, call `paper:get_basic_info` to list all artboards and ask the user once which artboard to target.

## Core principles (non-negotiable)

These rules apply to every Paper-to-code migration. They exist because three previous attempts at "do it all" failed; each rule fills a brittle gap.

- **Source of truth: `get_jsx` + `get_computed_styles`.** Never use screenshots as input for code — only for visual verification. The Paper guide states this explicitly.
- **Always rem, never px.** Paper exports `font-size`, `line-height`, padding/margin/gap, height, border-radius, and shadow offsets in `px`. Convert every value to `rem` at base 16: `16px = 1rem`, `14px = 0.875rem`, `13px = 0.8125rem`, `12px = 0.75rem`, `10px = 0.625rem`, `8px = 0.5rem`, `4px = 0.25rem`, `2px = 0.125rem`. The only acceptable px exception is `1px` for hairline borders. Letter-spacing stays in `em` (Paper's native unit for it).
- **Token first, arbitrary second, custom CSS never.** Always check `globals.css` (Tailwind v4 `@theme` block) for an existing token before reaching for an arbitrary value. If a value repeats across variants/states/components, promote it to a token. Off-scale one-offs use Tailwind arbitrary values in rem (`p-[0.625rem_0.875rem]`, `text-[0.8125rem]`, `rounded-[0.5rem]`). NEVER write custom CSS classes, custom `@layer` rules, or inline `style={{}}` for design properties.
- **Behavior is locked.** Don't change props, variant names, event handlers, ref forwarding, controlled/uncontrolled patterns, or `asChild` support. Only the visual layer changes. If the artboard implies an API change (rare), stop and ask the user before proceeding.
- **Permission to fully overwrite.** If pixel parity is cleaner by deleting the existing component file and rewriting from scratch, do it. Don't preserve outdated styling for sentimental reasons.
- **Stopping condition.** Do NOT declare the task complete until the browser-validated diff (Phase 4) shows zero defects. Reading code, compiling without errors, and type-checks passing are not validation. Only deviation-report-empty counts.
- **Dark mode handling.** Most artboards in this DS render both Light and Dark cells side by side (typically as left and right columns labeled "Light" and "Dark"). Dark mode is mostly automatic via CSS variables in `globals.css` — when the same token resolves differently in `.dark`, the component requires no extra code. BUT some components (notably `input-switch`, `radio-group`, and other selection controls) have small dark-mode-specific tweaks beyond pure token resolution — typically a subtle background color, a different border treatment, or an opacity shift. The skill MUST compare Light and Dark cells per state and detect divergences:
  - **No divergence between Light and Dark beyond token resolution** → no `dark:` variant needed in code; CSS vars handle it.
  - **Divergence detected** (e.g., Light has `bg-transparent` but Dark has `bg-white/5`) → add a `dark:` variant in the component for that property only.
  Phase 1 (extraction) must call `get_computed_styles` for both Light and Dark instances of every cell. Phase 2 (plan) must list dark-mode divergences explicitly per component. Phase 4 (validation) must verify both modes by toggling the `<html class="dark">` attribute via Chrome MCP and re-running the diff.

## Phase 1 — Extract spec from Paper

Goal: end this phase with a complete, unambiguous spec for every component, variant, size, and state shown in the target artboard. Do this BEFORE writing any code.

### Step 1 — Discover artboard structure

1. `paper:get_basic_info` — confirm the file and page. Note artboard dimensions.
2. **Resolve the target artboard ID.** Source order: (a) artboard ID from invocation prompt (e.g., "rebuild from artboard 1JX-0"); (b) `paper:get_selection` if something is selected; (c) list artboards via `get_basic_info` and ask the user which one.
3. `paper:get_children({ nodeId: "<artboard-id>" })` — returns all top-level child nodes (sections, groups, frames). This reveals the artboard's layout: header, hero, form section, footer, etc.
4. `paper:get_tree_summary({ nodeId: "<artboard-id>" })` — hierarchical structure with every node ID. Use this to identify each component's root node, its variants/states, and Light vs Dark cells. Map the tree to a list of component node IDs to extract.

### Step 2 — Extract each child node

For each component/section discovered in Step 1:

   - Call `paper:start_working_on_nodes({ nodeIds })` so the user sees progress in Paper.
   - Call `paper:get_jsx({ nodeId, format: "tailwind" })` — the JSX output is your structural and styling skeleton.
   - Call `paper:get_computed_styles({ nodeIds: [...all variant/state node IDs in batch, BOTH Light AND Dark cells] })` — exact CSS values per state, per mode.
   - Call `paper:get_font_family_info({ familyNames: [...] })` once for any custom fonts the artboard uses, to confirm availability.
   - Call `paper:get_fill_image({ nodeId })` only if the component has bitmap fills (icons/illustrations).
   - Build an internal spec table (in your reasoning, not as a file) with: variant, size, state, mode (Light/Dark), every CSS property and value (in rem after conversion), tokens needed, arbitrary values needed, and a Light vs Dark divergence column flagging properties where the two modes differ beyond token resolution.

### Step 3 — Reference screenshot

`paper:get_screenshot({ nodeId: "<artboard-id>", scale: 1 })` for the artboard root — keep ONLY for the final visual verification step. Never use this as input for writing code.

If the artboard contains components with multiple variants/states displayed as separate cells (typical for design system artboards), each cell is a separate spec entry — capture them all.

## Phase 2 — Plan mode output (HARD GATE)

Before writing or modifying any code, output a detailed plan. The user uses this to verify Paper was read correctly. A generic, vague, or component-agnostic plan is a red flag — go back to Phase 1 and re-read.

The plan must include:

1. **Component inventory** in the exact order Paper presents them (use the labels Paper shows — often filenames like `textarea.tsx`).
2. **Per-component change plan**, sub-section per component:
   - Filename
   - Variants present in the artboard
   - Sizes present
   - States present (default, hover, focus, focus-visible, disabled, error, etc.)
   - Special variations (e.g., a 2-line wrap variation, a with-icon variation, etc. — anything that's a meaningful state/shape rather than a separate component)
   - Property-level deltas vs current implementation: list `background-color`, `color`, `border-*`, `border-radius`, `padding`, `font-*`, `line-height`, `letter-spacing`, `box-shadow`, `min-height`, `gap`, `transition` for each — current value vs Paper value (in rem). Mark "unchanged" when applicable; do not omit.
   - **Dark mode divergences**: list every property where Light and Dark cells differ beyond pure token resolution. Format: `bg in dark: white/5 (Light is transparent)`. If no divergences, write "none — CSS vars resolve automatically".
   - Tokens consumed (existing in `globals.css`)
   - Tokens needed (proposed name + rem value)
   - Arbitrary values needed (off-scale one-offs)
   - API impact (default: "no API change — visual only"; if anything else, stop and ask)
3. **Token additions to `globals.css`** — consolidated list with name + rem value + which components use them.
4. **Showcase route outline** — section structure for the `/design-system/<route>` page, mirroring artboard order.
5. **Risk list** — anything ambiguous in the artboard that needs user clarification before coding starts.

**Anti-patterns that mean the plan is insufficient:**
- "Update X to match the new design" → too generic, re-read.
- A single combined section instead of per-component breakdown → re-read.
- "Various spacing changes" instead of property-level deltas → re-read.
- Missing any variant/state visible in the artboard → re-read.
- Zero tokens added (rare for a real artboard; usually means extraction was sloppy) → re-read.

End plan mode with: "Plan complete. Ready for user approval." Do not start coding before the user explicitly approves.

## Phase 3 — Implementation

After approval:

1. **Update foundation tokens.** Add only the tokens this artboard requires to `globals.css`. Do NOT do a global foundations refactor. Commit after this step.
2. **Rebuild each component, in artboard order.** For each component:
   - Locate the file (resolve via the project's `CLAUDE.md` conventions).
   - Replace the visual implementation entirely. Full file rewrite is allowed and preferred when cleaner.
   - Public API stays stable: same exports, props, `forwardRef`, `asChild`, controlled/uncontrolled patterns.
   - All values come from `globals.css` tokens or Tailwind arbitrary values in rem. No custom CSS, no inline `style={{}}` for design properties.
   - Cover every variant, size, and state shown in the artboard. Cover the special variations explicitly (e.g., 2-line wraps).
   - If the component's API genuinely changed (rare, requires user pre-approval), update consumers across the app so the build stays green.
   - Commit after each component.
3. **Build the showcase route.** Create `/design-system/<route>` (e.g., `/design-system/buttons`, `/design-system/form-controls`). Render every component in the same order as the artboard, using `<h2>` with the filename as section title. Within each section, render every variant × size × state. Include any special variation explicitly with a label that matches Paper. No prose, no extra UI chrome — visual reference only. Commit after this step.

After every component, call `paper:finish_working_on_nodes({ nodeIds })` to clear the working indicator in Paper.

## Phase 4 — Browser-validated diff (HARD GATE)

This is where the previous attempts failed. The task is NOT complete until the deviation report is empty.

1. Start the dev server: `bun dev` (or the project's dev command per `CLAUDE.md`). Confirm it runs cleanly — no compile errors, no console errors.
2. Use Chrome MCP to navigate to `http://localhost:3000/design-system/<route>` (adjust port as needed).
3. Use Chrome MCP to capture rendered DOM and computed styles for every component instance on the showcase page. The relevant tools:
   - `Claude in Chrome:navigate` — open the URL
   - `Claude in Chrome:read_page` — get the accessibility tree with element references
   - `Claude in Chrome:javascript_tool` — run `getComputedStyle(el)` for precise values
   - `Claude in Chrome:get_page_text` — fallback for content checks
4. For each component × variant × size × state, compare these properties at minimum:
   - `background-color`, `color`
   - `border-width`, `border-style`, `border-color`
   - `border-radius`
   - `padding` (all four sides)
   - `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`
   - `box-shadow`
   - `min-height` / `height`
   - `gap`
   - `transition`
5. **Interactive states.** Force `:hover`, `:focus`, `:focus-visible`, `:disabled`, `[aria-invalid]` (or the codebase's error attribute) programmatically via `javascript_tool`. Capture computed styles per state. Compare against the Paper artboard's corresponding state cells.
6. **Special variations.** For variations like wraps or overflow states, render with content that triggers them and compare layout.
7. **Build a deviation report.** Any mismatch — even a 1px / 0.0625rem difference, a slightly off color, a missing shadow — is a defect. List every defect: component, cell, property, expected (Paper, in rem), actual (app, in rem).
8. **Loop until zero defects.** Fix, re-run comparison, repeat. Do not exit this loop with non-zero defects. Do not "explain away" a defect.
9. **Dark mode validation.** Toggle `<html class="dark">` via Chrome MCP `javascript_tool` (`document.documentElement.classList.toggle("dark")`). Re-run computed style capture for every component. Compare against the Paper Dark cells. Verify any `dark:` variants documented in the plan are taking effect. Add any new defects found to the deviation report and loop again.
10. Take final screenshots of the showcase page in BOTH light and dark modes, plus the artboard. They must be visually indistinguishable at default zoom.

## Phase 5 — Final report

Only after Phase 4 deviation report is empty. Report to the user:

1. **Confirmation the deviation report is empty** for every component.
2. **Final screenshots** (showcase page + Paper artboard).
3. **List of tokens added** to `globals.css` (name + rem value + components using them).
4. **List of components updated** with their file paths.
5. **Any consumer files updated** (only if an API change was pre-approved; otherwise this list is empty).
6. **Confirmation that special variations work** as the artboard specifies (call them out by name).

If the deviation report is non-empty for any component when you've exhausted attempts, do NOT claim completion. Report exactly which cells/properties still differ, and stop. The user decides whether to ship partial work or iterate.

## Modes

The skill supports two scopes, determined by the target ID provided in the task:

- **Full artboard mode** — ID points to an artboard root. The skill calls `get_children` + `get_tree_summary` to discover every component inside it and processes them all.
- **Single section / component mode** — ID points to a section or specific component within an artboard. The skill calls `get_children` on that section to discover its children, processes only that scope, builds a partial showcase route (or appends to an existing one), validates only that scope. This is the recommended mode for dense artboards (e.g., A05 Form Controls with multiple sections) — go one section at a time, commit between each.

Detect mode by inspecting the result of `paper:get_node_info` on the target ID. If `component` is `Frame` and the node is the artboard root (no parent inside the page), you're in full artboard mode. Otherwise, single section / component mode.

## Reference: Paper MCP tools used

Read tools (used in every run):
- `paper:get_basic_info`
- `paper:get_selection`
- `paper:get_children` (discover all child nodes of an artboard/section)
- `paper:get_tree_summary` (hierarchical structure with node IDs)
- `paper:get_jsx` (format: "tailwind")
- `paper:get_computed_styles` (batch with all node IDs at once)
- `paper:get_screenshot` (verification only, never as code input)
- `paper:get_font_family_info` (when custom fonts are used)
- `paper:get_fill_image` (when bitmap fills exist)
- `paper:get_node_info` (when deeper node details needed)

Progress indicators:
- `paper:start_working_on_nodes` (when starting a component)
- `paper:finish_working_on_nodes` (when component done)

Write tools — NEVER used by this skill. This is a one-way migration from Paper to codebase.

## Reference: Chrome MCP tools used

- `Claude in Chrome:list_connected_browsers` (pre-flight)
- `Claude in Chrome:navigate`
- `Claude in Chrome:read_page`
- `Claude in Chrome:javascript_tool` (computed styles, force pseudo-classes)
- `Claude in Chrome:get_page_text` (content sanity check)

## Quick checklist for the user (paste at start)

When invoking this skill, the user should provide:

- [ ] Paper Desktop is open with the correct file loaded
- [ ] Target artboard ID (e.g., "rebuild from artboard 1JX-0") — the skill auto-discovers all children. No need for individual node IDs.
- [ ] The dev server can run with `bun dev` (or project equivalent)
- [ ] Chrome MCP is connected to a browser
- [ ] The showcase route segment is named (e.g., `buttons`, `form-controls`, `badges`) — defaults to a sensible kebab-case if omitted
- [ ] Any special variations to call out by name (e.g., "send contact to" 2-line variation for `input-multi-select.tsx`)
