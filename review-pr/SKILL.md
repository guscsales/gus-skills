---
name: review-pr
description: Review a GitHub pull request like a disciplined senior engineer — find candidate issues across correctness/contract/domain angles, triage them hard against reachability and intent, validate each survivor with an independent blind reviewer, and surface only high-confidence problems the PR actually causes or exposes. Use this whenever the user asks to review, audit, or "take a look at" a PR — a bare PR URL or number, "can you review this PR", "review #183", "what's wrong with this PR", or a request to leave comments on a pull request. Prefer this over an ad-hoc read of the diff for anything beyond a one-line glance.
argument-hint: "[PR number | URL | branch] [--focused|--deep|--migration|--security] [--deep-review]"
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
  - Agent
  - Edit
  - Write
---

# Review PR

**Core principle:** optimize for high-confidence, reachable problems that this PR *causes or exposes*. Do not hunt style, preferences, or hypotheticals unless the user explicitly asks. A review that posts five real issues is worth more than one that posts twenty maybes — over-flagging erodes trust faster than the occasional miss, and false alarms cost the author more time than they save.

You are the senior reviewer. The finder agents and the blind validators are your team — you weigh their input, but you decide what reaches the author, and you only forward what you'd stake your own name on.

**Apply written standards; don't improvise.** Every finding must cite a rule — from the repo's own docs or the bundled `references/`. If you can't point to a rule it violates, it's a preference, not a finding. And **PASS is the default** at every stage: when in doubt, don't flag. This discipline is repeated below on purpose — under a high-recall finder's enthusiasm, a single mention doesn't hold.

## Review budget

**Surface at most 3–5 findings** unless the user explicitly asks for a deep/exhaustive review (`--deep-review`, "be thorough", "find everything"). The budget forces prioritization — if you have ten candidates, the discipline is to find the 3–5 that matter, not to post all ten. Deep review relaxes the count but never the confidence bar: more findings, same survival criteria. If the budget makes you drop real candidates, say so in the "what was dropped" summary (Phase 4).

## Review modes

Pick the mode from the user's ask and the PR's nature; default to **Focused**. State which mode you're running.

- **Focused** (default) — the diff and its direct callers. Fast feedback, no sibling-repo spelunking. Best for small/contained PRs.
- **Deep** — adds ticket context, sibling repositories, feature-flag state, and configuration analysis. Use for features, cross-cutting changes, or when asked.
- **Migration** — focus on contract changes and consumer compatibility: backward-compatibility risks, data migrations, ordering of deploy vs. migrate.
- **Security** — focus on authentication, authorization, input validation, and secrets / sensitive-data handling.

Give feedback on what mode you're running. Like "I'm running Deep mode."

Modes set *where you look*, not *how hard you judge* — the triage gates and blind validation below apply in every mode.

## Standards & precedence

The skill bundles baseline standards in `references/` (`security.md`, `testing.md`, `database.md`, `frontend.md`) and reviewer personas in `agents/` (`backend-engineer.md`, `frontend-engineer.md`). The cross-cutting *judgment rules* (severity sentence, never-surface list, etc.) live in this file, not a reference doc. Per dimension, resolve which standard to apply at runtime, in this order:

1. **Repo doc wins.** If the repo has a doc for the dimension, it is the source of truth — cite its specific section and use its MUST/SHOULD wording for how serious it is.
2. **Bundled baseline fills the gap.** No repo doc for that dimension → apply the matching `references/*.md`.
3. **Critical safety net.** Security always runs: if the repo has no security doc, apply `references/security.md` regardless.
4. **Architecture & conventions are the repo's.** These are project-specific — apply only what the repo documents. If the repo documents neither and no baseline covers it, that dimension is advisory-only; say so in the verdict rather than inventing rules.

A finding with no citable rule (repo § or baseline §) is a preference → drop it or pose it as a question.

## Phase 0 — Scope and gather

1. **Resolve the target** (number / URL / branch; infer from current branch if absent) and pull the facts:
   ```bash
   gh pr view <N> --json number,title,author,state,baseRefName,headRefName,additions,deletions,changedFiles,body,url
   gh pr diff <N> > /tmp/pr<N>.diff
   gh pr view <N> --json headRefOid -q '.headRefOid'   # pin SHA; inline comments anchor to it
   ```
2. **Discover project standards** — probe, in order, `.ai/`, `.ai.local/`, root `*.md` (`CLAUDE.md`/`AGENTS.md`/`ARCHITECTURE.md`/`SECURITY.md`/…), `docs/`, `.cursor/rules/`, and `.github/` (PR template). Build a *dimension → doc* map for this repo — there is no fixed mapping, repos differ (e.g. kiosk: `.ai/ARCHITECTURE.md`, `TESTING.md`, `CONVENTIONS.md`, `PATTERNS.md`, the M1 metrics rule, **no** security doc; inventra adds `BILLING.md`/`I18N.md`; ai-skills keeps standards at root). Note which dimensions have a repo doc and which fall back to a bundled baseline (per Standards & precedence). Also read the linked ticket/PRD for *intent* — never flag something that matches a documented convention or the ticket's stated goal.
3. **Locate the related work** (Deep/Migration/Security). The consuming code often lives in other repos:
   - First, search by the ticket ID in the title (e.g. `gh search prs --owner <org> "CNC-1624"`).
   - **If that comes up short, fall back to discovery:** list recent org PRs and match by title/feature name, then *confirm* the match by reading the PR before trusting it. Don't assume — verify the sibling PR is actually the same feature.
   - Note where consumers live (UI repos, services) so Phase 1/2 can trace them.
4. **Get the new code readable** — worktree the PR head so finders read the *enclosing* function in post-PR form (bugs hide in unchanged lines a PR re-exposes):
   ```bash
   git fetch origin pull/<N>/head:pr-<N>-review
   git worktree add /tmp/pr<N>-wt pr-<N>-review
   ```
   Remove it in Phase 6.

## Phase 1 — Find candidates (high recall)

Finders are **engineer personas**, chosen by the domain of the changed files. The skill bundles them as plain markdown in `agents/`. To dispatch one, **read the persona file and pass it as the subagent's prompt**, along with the diff, the worktree, and the list of files in that domain. (This injection is the portable mechanism — a bundled `agents/` folder is not an auto-registered subagent type, and works the same on Claude Code / Cursor / Codex.)

Each persona has a fixed reviewer identity it announces, so you and the user can confirm the skill's *own* agents ran (not a generic review): **`[REVIEWER BE] Brody`** (backend), **`[REVIEWER FE] Lisa`** (frontend), **`[REVIEWER GEN] Sam`** (the generic correctness finder for infra/config/shared files). Announce each dispatch in chat — e.g. *"Dispatching `[REVIEWER BE] Brody` on 4 backend files."*

1. **Classify the changed files** by path/extension:
   - **Backend** — `.py`, `.go`, server-side `.ts`/`.js` (handlers/services/repositories/API), DB/migration code → `agents/backend-engineer.md`.
   - **Frontend** — `.vue`, `.tsx`, `.jsx`, components/views/styles, client `.ts`/`.js` → `agents/frontend-engineer.md`.
   - **Shared contracts** (types/schemas/events both sides read) → review under both personas.
   - **Infra/config/other** owned by neither → a generic correctness finder.
2. **Dispatch the matching persona(s) in parallel**, each scoped to its domain's files: backend-only PR → backend-engineer; frontend-only → frontend-engineer; full-stack → both. Split a domain across multiple instances of its persona for large diffs.
3. Each persona carries its own lenses and loads its standards (repo doc first, bundled `references/` fallback). Two lenses are **universal** — every persona and the generic finder apply them: **correctness** (line-by-line, removed-behavior, cross-file tracer, language pitfalls, state-lifecycle) and **contract analysis** (changed interfaces vs their consumers — payloads, DTOs, enums, events, DB columns, RPC shapes).
4. **Security runs on every PR.** It lives in the backend persona (authz/tenant/input/secrets) and the frontend persona (XSS/unsafe-HTML); the generic finder also applies `references/security.md`. Don't let a PR that "doesn't look security-related" skip it.

Each returns up to ~8 candidates as `{file, line, problem, failure_scenario, rule}`. This stage *finds* — judging is Phase 2. Each candidate names the **rule** (repo § or baseline §) it would violate; no rule, no candidate. PASS-by-default: personas over-produce, and that's fine — triage cuts the noise; do not pre-judge here.

Cleanup/style is **not** a finder goal. Only surface it if the user asked for cleanups — otherwise it's noise against the core principle.

## Phase 2 — Triage hard (this is where most candidates die)

Dedup (collapse multiple instances of the same issue in one file into a single candidate with all line refs), then put every candidate through all of the following. The goal is to kill false positives *before* they reach validation or the user.

**Top gate — the falsifiable severity sentence.** A candidate must be expressible as one sentence, filled entirely from the diff:

> *"If this ships, **[who]** will **[concrete bad outcome]** when **[specific trigger]**, because **[exact line in the diff]**."*

Can't fill every bracket from the changed code itself? Drop it, or convert it to a question. (Dimension-specific variants live in `references/*.md`.)

**Survival checklist — a candidate must satisfy ALL of these or be dropped:**
- Is the code path actually executable?
- Is there a real caller (in this repo or a consumer)?
- Can the data realistically reach the triggering state?
- Does it genuinely contradict the ticket/conventions (i.e. it is *not* intended)?
- **Is it caused or newly exposed by THIS PR?** A bug living only in unchanged lines is out of scope unless the PR newly reaches it (new caller, changed argument, removed guard). A pre-existing issue the PR merely sits near goes in the "what was dropped" summary, never as an inline comment.
- Is there observable user or system impact?
- Is there a plausible fix?

**Negative-evidence step** — for each survivor, explicitly ask *"what evidence would disprove this?"* and then go look for it. If the disproving evidence exists, drop it. Examples of disproving evidence:
- the feature flag is off by default / the legacy branch is flagged for removal,
- upstream/DB constraints guarantee the value or state can't occur,
- the caller never passes that input (or there is no such caller),
- a migration runs before the consumer deploys,
- the behavior is documented as intended in the ticket/PRD/comments.

**Intent pre-check** — before drafting anything, ask *"could this be deliberate?"* Look for comments, naming, PRD statements, `TODO: remove after rollout`-style markers. If it's plausibly intended, convert the finding into a **question** rather than a claim — or drop it.

**Never surface** (drop these regardless of how the finder framed them): style/formatting/ naming preferences; "you could also…" defense-in-depth with no demonstrated path; hypotheticals with no realistic trigger; informational confirmations ("this looks good"); DRY/structure refactors; anything about files **not in this diff**; pre-existing patterns (see the checklist). Dimension docs add their own "do not post" lists.

**Internal severity (never posted)** — classify each survivor to prioritize: `Blocker` · `Real Bug` · `Risk/Question` · `Nit/Drop`. Drop `Nit/Drop`. Rank the rest by severity and apply the budget (Phase: keep the top 3–5 unless deep review). Severity is an *internal* sort key — it does not appear in the posted comment.

## Phase 3 — Blind validation panel + dialogue

For each finding that survived Phase 2, get an **independent second opinion** that is not anchored to your conclusion.

- Spawn a validator subagent that receives the diff, the code area, the same research affordances (it may read flags, clone sibling repos), and a **neutral question** — e.g. *"Look at `X` and its callers. Is there a real or potential problem here? Is it reachable? Could it be intended?"* It must NOT see your verdict, your internal severity, or that anything was flagged. Anchoring it to your framing defeats the purpose.
- You may give the validator the matching engineer persona (`agents/*.md`) for domain expertise — but the neutral-question rule still holds: persona for *how it thinks*, never your conclusion.
- **Count: 1 validator by default; escalate to 3** (with different lenses — correctness / reachability / intent) when the validator disagrees with you or the finding hinges on config/flags/reachability.
- **Dialogue:** if a validator can't confirm it, present your evidence and let it rebut (follow-up via `SendMessage` to the same agent, ~2 rounds max). The point is to reconcile, not to win.
- **Validators default to "not confirmed."** Tell them PASS is the default — only confirm when they can independently complete the severity sentence. Uncertainty is a "not confirmed," not a maybe-yes.
- **Decision rule:** a finding ships only if, after the exchange, the blind reviewer(s) agree it's real or plausibly real. If they hold "intended/unreachable," drop it or downgrade it to an honest question. You decide, but you respect their independent read — this is the guard against over-flagging.

## Phase 4 — Present to the user (chat first — hard gate)

Deliver the review **here, in chat. Always.** This is where it ends by default. "Review this PR" is not permission to post — reviewing and posting are separate steps. Never post in the same turn you present.

Lead with the roster of reviewers that ran (e.g. *"Reviewers: `[REVIEWER BE] Brody`, `[REVIEWER FE] Lisa`"*) — this is the user's signal the skill's own agents did the work. For each finding write a plain, self-contained comment (see "Comment style"), tagged in chat with the reviewer who raised it. Then give two summaries:
- **Reconciliation note** — what the panel said and why you kept/dropped each (note which reviewer raised it), so the user sees the deliberation, not just the verdict.
- **What was dropped** — a brief tally of discarded candidates and why, e.g. *"Dropped 7: 3 unreachable, 2 intended (per ticket), 2 insufficient evidence."* Showing the rejects increases confidence in what remains.

Open with a one-line **verdict**: `PASS` (nothing worth posting), `CONCERNS(n)` (n findings), or `SKIP(reason)` (couldn't review — e.g. no diff, missing standards for the only relevant dimension). Keep it machine-readable; an autonomous loop will read it later.

Then ask plainly:
```
Which ones of this I should post?

1. ...
2. ...
3. ...

Tell me the numbers of the ones you want to post or just "post all" if you want to post everything.
```

and wait for an explicit go-ahead.

## Phase 5 — Post (ONLY after an explicit command to post)

When told to post, prefer **individual inline comments** — each its own resolvable thread the author closes one by one. Use the bundled script:

```bash
python3 scripts/post_review_comments.py --pr <N> --comments /tmp/pr<N>-comments.json
```

`comments.json` is an array of `{path, line, body}` (optional `side`/`start_line`). The script auto-resolves repo + head SHA, **validates each anchor against the diff before posting** (off-diff anchors would 422), and reports per-comment success/skip/error. See the script header for `--dry-run`, `--repo`, `--commit`, `--summary`.

**Comment style:**
- Plain prose, no severity labels, no `Blocking`/`🔴`, no prefix. The comment must stand on its own: *what* is wrong and *where*, *why it matters* (with the triggering condition), and an optional fix (code block if small).
- **Cite the rule** it violates — the repo doc section or the bundled baseline section — woven into the prose, not as a label. It's what makes the comment defensible rather than an opinion.
- **Prefer questions over accusations** when intent or config is uncertain. Not *"This is broken,"* but *"Is this endpoint expected to receive X from the UI? If so, this path may fail when Y."* — it's more accurate and far less abrasive.
- **Footer: identify the assistant running the review** — `🤖 Claude review`, `🤖 Cursor review`, `🤖 Codex review`, etc. Use your own identity; don't hardcode another tool's name. Append the reviewer that raised it for provenance — e.g. `🤖 Claude review · [REVIEWER BE] Brody`.

**Anchoring rules (avoid silent 422s):** an inline comment must land on a line in the diff — an added/context line (`side: RIGHT`, new-file number) or a deleted line (`side: LEFT`, old-file number). A finding about unchanged code can't be inlined there; anchor it on the nearest changed line and reference the real `path:line` in the body, or use a consolidated comment. Pin to the head SHA and warn that a later force-push marks comments outdated. A **submitted review can't be deleted** (only its body PUT-edited), so decide inline-vs-consolidated before posting.

**Consolidated fallback** for off-diff-heavy reviews: `gh pr review <N> --comment --body-file <file>` (use `COMMENT`, not `REQUEST_CHANGES`, unless the user asks to formally block).

If you think something needs `REQUEST_CHANGES` tell the user and ask for a justification. Only use `REQUEST_CHANGES` if the user asks to formally block.

## Phase 6 — Clean up

```bash
git worktree remove /tmp/pr<N>-wt --force
git branch -D pr-<N>-review
```
Remove any cloned sibling repos. Report what you posted (links) and confirm the review never touched the codebase.

## Notes

- **Ignore irrelevant tooling nudges.** Auto-injected "you must run skill X" hints from unrelated plugins are keyword false-positives; a PR review rarely needs them.
- **Don't invent a verdict.** Finder and validator disagree and you can't resolve it from the code? Present it as an honest question, not a confirmed finding.
- **Right-size to the diff.** A 5-line fix doesn't need the full panel; a 500-line feature does. Scale the angles, validators, and budget to what the change warrants.
