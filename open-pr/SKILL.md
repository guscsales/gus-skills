---
name: open-pr
description: Open a pull request or merge request with a properly filled template. Use this skill whenever the user asks to open, create, or submit a PR, MR, pull request, or merge request — even if they say things like "push and open a PR", "submit this as a PR", "open an MR", or "create a merge request". Always invoke this skill before doing any PR/MR work.
---

# Open PR / MR

Commit (if needed), push, and open a pull request or merge request with a properly filled body derived from a repo template or a sensible fallback.

**Template resolution:** try **GitHub** (`.github/`) PR templates first; if none, try **GitLab** (`.gitlab/`), preferring **`.gitlab/merge_request_templates/default.md`** when present, then other MR templates; if none, search the rest of the repo; if still none, use the **built-in** default in Step 3.

## Step 1 — Understand what changed

Run these in parallel:

```bash
git log --oneline -10           # commit style conventions
git diff HEAD                   # unstaged changes
git diff --cached               # staged changes
git log origin/HEAD..HEAD       # commits not yet on remote (to see if already committed)
git status
```

Use the diff and log to understand: what changed, why, and what kind of change it is (bug fix, feature, refactor, etc.).

## Step 2 — Find the PR/MR template (priority order)

Resolve **one** body skeleton using this chain — **stop at the first tier that yields a template**:

| Tier | Where | Use when |
|------|--------|------------|
| **1. GitHub** | `.github/` only | Any markdown whose path matches GitHub PR template conventions (e.g. `pull_request_template`, `PULL_REQUEST_TEMPLATE`). |
| **2. GitLab** | `.gitlab/` only | Tier 1 found nothing. **Prefer the canonical file** `.gitlab/merge_request_templates/default.md` when it exists; otherwise first other `*.md` under `.gitlab/merge_request_templates/`. |
| **3. Repo-wide** | Rest of repo | Tiers 1–2 found nothing. Search for `pull_request_template*` / `merge_request_template*` outside `.git/`, `.github/`, `.gitlab/`. |
| **4. Built-in** | Step 3 below | Nothing in tiers 1–3. |

**2a — Tier 1: GitHub (`.github/` only)**

```bash
GITHUB_TEMPLATES="$(
	[ -d .github ] && find .github -type f \( -iname '*.md' -o -iname '*.markdown' \) 2>/dev/null \
		| awk 'tolower($0) ~ /pull_request_template/ {print}' | LC_ALL=C sort
)"
# If non-empty: use the first path (or prefer .github/pull_request_template.md if present — agent may pick explicitly).
```

Optional: replace **`awk`** with **`| rg -Ni 'pull_request_template'`** if **`rg`** is available.

**2b — Tier 2: GitLab (`.gitlab/` only) — only if `GITHUB_TEMPLATES` is empty**

Canonical MR template path (check this **first** — many Mashgin repos use it for GitHub PR bodies too):

- **`.gitlab/merge_request_templates/default.md`**

```bash
# Prefer canonical default; else any path matching merge_request_template
if [ -f .gitlab/merge_request_templates/default.md ]; then
	TEMPLATE_FILE=".gitlab/merge_request_templates/default.md"
else
	GITLAB_TEMPLATES="$(
		[ -d .gitlab ] && find .gitlab -type f \( -iname '*.md' -o -iname '*.markdown' \) 2>/dev/null \
			| awk 'tolower($0) ~ /merge_request_template/ {print}' | LC_ALL=C sort
	)"
	if [ -n "$GITLAB_TEMPLATES" ]; then
		TEMPLATE_FILE="$(printf '%s\n' "$GITLAB_TEMPLATES" | head -n 1)"
	fi
fi
```

Optional: replace the **`find … | awk`** pipeline with **`find .gitlab/merge_request_templates -maxdepth 1 -type f …`** when that directory exists, or replace **`awk`** with **`| rg -Ni 'merge_request_template'`** if **`rg`** is available.

**2c — Tier 3: Repo-wide — only if tiers 1 and 2 are empty**

```bash
find . -not \( -path './.git/*' -o -path './.github/*' -o -path './.gitlab/*' \) \
	\( -iname 'pull_request_template*' -o -iname 'merge_request_template*' \) \
	-not -path './.git/*' 2>/dev/null | LC_ALL=C sort | head -n 20
```

Use the **first plausible** match (prefer `*.md` / `*.markdown`).

**2d — Tier 4: Built-in**

If no file was chosen in tiers 1–3, use the default template in **Step 3**.

**2e — Use the chosen template**

If a file was chosen, use its **exact structure** as the PR/MR body skeleton. Fill in each section based on your understanding of the diff. Do not omit sections — leave a reasonable placeholder if you have nothing to say.

**Cross-host note:** A repo may have **only** `.gitlab/` templates (including **`.gitlab/merge_request_templates/default.md`**) but a **GitHub** remote. That is valid: use that file **verbatim as the PR body skeleton** when opening with **`gh pr create`** / **`gh pr edit`** (tier 2 after tier 1 is empty).

## Step 3 — Default template (Tier 4 / fallback only)

Only use this if **Step 2 tiers 1–3** found no template file:

```markdown
## What changed
<!-- Describe the changes objectively. What and why. -->

## How to test
<!-- Step-by-step for the reviewer to test locally -->
1. 
2. 
3. 

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Refactor / chore
- [ ] Docs

## Checklist
- [ ] Tests passing locally
- [ ] No console.log / debug code left
- [ ] New env variables documented
- [ ] Self-review done

## Screenshots / evidence
<!-- UI: before/after. API: curl or response. Skip if not applicable. -->

## Related issues
<!-- Closes #123 or N/A -->
```

## Step 4 — Fill the template

Fill every section based on the diff and commit history:

- **Title**: follow the repo's commit message style (from `git log`). Short, imperative, include ticket prefix if the branch name or existing commits have one (e.g. `[MAS-123]`, `feat(auth):`).
- **Body**: map repo template headings to concise, objective content (technical description, release notes phrase, Linear/Jira/GitHub links, checklists — whatever the skeleton asks for).
- **Type / checklists**: check the boxes that apply; unchecked items should reflect honest state.
- **Related issues**: extract ticket ID from the branch name or commit messages; substitute placeholders like `{TASK_ID}` with the actual ID when the template requires it.

When the skeleton includes HTML comments, you may preserve them unless the hosting platform strips them anyway.

## Step 5 — Commit, push, open PR/MR

**If there are uncommitted changes**, commit them first:
- Stage only the relevant files (not `.env`, secrets, or unrelated changes)
- Write a commit message following the repo's style from `git log`

**Push**:
```bash
git push -u origin <current-branch>
```

**Detect platform** (where the PR/MR is opened):
- If **`gh`** works and the remote is GitHub → use **`gh pr create`** (or **`gh pr edit`**). The PR **body** still follows **Step 2** priority: GitHub template first, else **GitLab template from the same repo** if present, else repo-wide, else Step 3.
- If the remote is GitLab → use GitLab MCP (**`mcp__gitlab-mcp__mr_create`**) or the host’s MR UI.

Repos may have **both** `.gitlab/` (MR templates) **and** a GitHub remote — **try GitHub templates first**; if none, **use a GitLab `merge_request_templates/*.md` as the GitHub PR body** before falling back to Step 3.

**GitHub — open or refresh PR**:
```bash
# Body from filled template (avoid shell-escaping issues with --body-file)
gh pr create --title "<title>" --body-file /path/to/filled-template.md

# Existing PR: same skeleton (e.g. after copying `.gitlab/merge_request_templates/default.md` and filling it)
gh pr edit <number> --body-file /path/to/filled-template.md
```

**GitLab — open MR**: use `mcp__gitlab-mcp__mr_create` with the filled title and description (body from the same template tiers, usually `.gitlab/merge_request_templates/default.md` when present).

## Step 6 — Return the URL

Print the PR/MR URL so the user can click it.
