# Frontend review standard (baseline)

> Baseline for the `review-pr` frontend finder. **Precedence:** the repo's own FE doc (e.g. `.ai/FRONTEND.md`, `.ai/CONVENTIONS.md`) wins — cite it. Use this baseline when the repo has none. Generic and **framework-agnostic** (React/Vue/Svelte/etc.).

## The gate — frontend severity sentence

A FE finding is real only if you can complete this from the diff:

> *"A user will **[hit a broken/inaccessible/incorrect UI outcome]** when **[realistic interaction or state]**, because **[specific code in this diff]**."*

A user-visible or correctness/security impact — not "this could be tidier." Can't fill the brackets? Drop it.

## What to check

1. **Component & state boundaries** — business logic and data fetching belong in stores/hooks/services, not inline in components. Flag side effects during render, prop drilling where shared state belongs, and components that both fetch and present with no seam.
2. **Rendering & performance** — needless re-renders, missing/unstable list keys, expensive work not memoized, blocking work on the main thread, obvious bundle bloat (heavy import in a hot path). Tie to a realistic interaction, not a micro-benchmark.
3. **Accessibility** — interactive controls have accessible names/roles; keyboard reachable, no focus traps; semantic elements for semantic intent; images have alt text.
4. **Error / loading / empty states** — every async call handles loading, error, and empty; no unhandled promise rejections; failures don't leave the UI stuck.
5. **Type safety** — no `any`/untyped props or unsafe casts; optional chaining isn't hiding a real null bug.
6. **FE security (XSS)** — no `dangerouslySetInnerHTML` / `v-html` / unescaped interpolation with user-controlled content; safe URL/redirect handling; `target="_blank"` has `rel="noopener"`; no secrets/tokens in client code.
7. **URL-bookmarkable state** — filters, pagination, and sort that a user would expect to share/refresh belong in the URL, not only local state.
8. **i18n** — if the repo uses i18n, user-facing strings go through it (no hardcoded copy).

## Do NOT post (frontend)

- Cosmetic/design taste (spacing, color, copy wording) — not a review concern.
- Framework-style preferences (hooks vs HOC, Options vs Composition API, file layout).
- Micro-optimizations with no measured or likely user-visible cost.
- Naming/formatting preferences.
- Anything about files not in this diff, or pre-existing patterns the PR didn't introduce.
