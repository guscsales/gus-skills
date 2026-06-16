#!/usr/bin/env python3
"""Post code-review findings as individual, resolvable inline comments on a GitHub PR.

Each comment is created via `POST /repos/{repo}/pulls/{n}/comments`, which makes it
its own conversation thread the author can resolve one by one — unlike a single
review body.

The #1 failure mode for inline comments is anchoring on a line that isn't part of
the diff (GitHub returns HTTP 422). This script parses the PR's unified diff,
builds the set of commentable (path, line, side) anchors, and validates every
comment *before* posting — reporting un-anchorable ones instead of failing mid-run.

Input JSON: an array of objects
    {"path": "...", "line": 123, "body": "...",
     "side": "RIGHT"|"LEFT"   # optional, default RIGHT
     "start_line": 120}       # optional, for a multi-line range

Usage:
    python3 post_review_comments.py --pr 183 --comments comments.json
    python3 post_review_comments.py --pr 183 --comments comments.json --dry-run
    python3 post_review_comments.py --pr 183 --comments comments.json \
        --repo owner/name --commit <sha> --summary summary.md

Requires the `gh` CLI, authenticated, with write access to the repo.
"""
import argparse
import json
import re
import subprocess
import sys


def sh(args, input_str=None):
    """Run a command, return (returncode, stdout, stderr)."""
    p = subprocess.run(
        args, input=input_str, capture_output=True, text=True
    )
    return p.returncode, p.stdout.strip(), p.stderr.strip()


def resolve_repo(explicit):
    if explicit:
        return explicit
    rc, out, err = sh(["gh", "repo", "view", "--json", "nameWithOwner",
                       "-q", ".nameWithOwner"])
    if rc != 0:
        sys.exit(f"Could not resolve repo (pass --repo owner/name): {err}")
    return out


def resolve_commit(pr, explicit):
    if explicit:
        return explicit
    rc, out, err = sh(["gh", "pr", "view", str(pr), "--json", "headRefOid",
                       "-q", ".headRefOid"])
    if rc != 0:
        sys.exit(f"Could not resolve head SHA (pass --commit <sha>): {err}")
    return out


HUNK_RE = re.compile(r"^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@")


def commentable_anchors(repo, pr):
    """Parse the PR diff into {(path, 'RIGHT', new_line)} and {(path, 'LEFT', old_line)}.

    RIGHT  = added or context lines (comment by new-file line number)
    LEFT   = deleted lines        (comment by old-file line number)
    """
    rc, diff, err = sh(["gh", "pr", "diff", str(pr)])
    if rc != 0:
        sys.exit(f"Could not fetch PR diff: {err}")
    anchors = set()
    path = None
    old_ln = new_ln = 0
    for line in diff.splitlines():
        if line.startswith("+++ b/"):
            path = line[6:]
            continue
        if line.startswith("--- "):
            continue
        m = HUNK_RE.match(line)
        if m:
            old_ln = int(m.group(1))
            new_ln = int(m.group(2))
            continue
        if path is None:
            continue
        if line.startswith("+"):
            anchors.add((path, "RIGHT", new_ln))
            new_ln += 1
        elif line.startswith("-"):
            anchors.add((path, "LEFT", old_ln))
            old_ln += 1
        elif line.startswith("\\"):  # "\ No newline at end of file"
            continue
        else:  # context line: commentable on the new side, advances both
            anchors.add((path, "RIGHT", new_ln))
            old_ln += 1
            new_ln += 1
    return anchors


def nearest(anchors, path, side, line):
    cands = [ln for (p, s, ln) in anchors if p == path and s == side]
    if not cands:
        return None
    return min(cands, key=lambda ln: abs(ln - line))


def post_one(repo, pr, commit, c):
    payload = {
        "commit_id": commit,
        "path": c["path"],
        "line": c["line"],
        "side": c.get("side", "RIGHT"),
        "body": c["body"],
    }
    if "start_line" in c:
        payload["start_line"] = c["start_line"]
        payload["start_side"] = c.get("start_side", payload["side"])
    rc, out, err = sh(
        ["gh", "api", "--method", "POST",
         f"repos/{repo}/pulls/{pr}/comments", "--input", "-"],
        input_str=json.dumps(payload),
    )
    if rc != 0:
        return False, err
    try:
        return True, json.loads(out).get("html_url", "(posted)")
    except json.JSONDecodeError:
        return True, "(posted)"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--pr", required=True)
    ap.add_argument("--comments", required=True, help="JSON array of comments")
    ap.add_argument("--repo", help="owner/name (auto-detected if omitted)")
    ap.add_argument("--commit", help="head SHA (auto-detected if omitted)")
    ap.add_argument("--summary", help="optional markdown file posted as a top-level review")
    ap.add_argument("--dry-run", action="store_true",
                    help="validate anchors and print plan; post nothing")
    args = ap.parse_args()

    with open(args.comments) as f:
        comments = json.load(f)
    if not isinstance(comments, list):
        sys.exit("comments JSON must be an array of {path, line, body}")

    repo = resolve_repo(args.repo)
    commit = resolve_commit(args.pr, args.commit)
    anchors = commentable_anchors(repo, args.pr)
    print(f"repo={repo} pr={args.pr} commit={commit[:10]} "
          f"comments={len(comments)} commentable_anchors={len(anchors)}\n")

    postable, skipped = [], []
    for i, c in enumerate(comments):
        for k in ("path", "line", "body"):
            if k not in c:
                sys.exit(f"comment[{i}] missing required field '{k}'")
        side = c.get("side", "RIGHT")
        if (c["path"], side, c["line"]) in anchors:
            postable.append(c)
        else:
            near = nearest(anchors, c["path"], side, c["line"])
            hint = f" nearest commentable {side} line = {near}" if near else \
                   " no commentable line for this file/side"
            skipped.append((c, hint))

    if skipped:
        print(f"⚠️  {len(skipped)} comment(s) not anchorable in the diff "
              f"(would 422) — re-anchor on a changed line or use a "
              f"consolidated review:")
        for c, hint in skipped:
            print(f"   SKIP {c['path']}:{c['line']} ({side_of(c)}).{hint}")
        print()

    if args.dry_run:
        print(f"DRY RUN — would post {len(postable)} comment(s):")
        for c in postable:
            print(f"   OK  {c['path']}:{c['line']}")
        if args.summary:
            print(f"   + summary review from {args.summary}")
        return

    ok = 0
    for c in postable:
        success, info = post_one(repo, args.pr, commit, c)
        tag = "OK  " if success else "ERR "
        print(f"{tag}{c['path']}:{c['line']} -> {info}")
        ok += int(success)

    if args.summary:
        rc, out, err = sh(["gh", "pr", "review", str(args.pr), "--comment",
                           "--body-file", args.summary])
        print(f"summary review: {'OK' if rc == 0 else 'ERR ' + err}")

    print(f"\nposted {ok}/{len(postable)} inline comment(s); "
          f"{len(skipped)} skipped.")


def side_of(c):
    return c.get("side", "RIGHT")


if __name__ == "__main__":
    main()
