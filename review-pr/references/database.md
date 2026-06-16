# Database-query review standard (baseline)

> Baseline for the `review-pr` DB finder, used when the diff adds or changes queries (ORM calls, raw SQL, repository methods, query builders). **Precedence:** the repo's own data/query doc (e.g. `.ai/DATA-PATTERNS.md`, `.ai/ARCHITECTURE.md` data section) wins — cite it. Use this baseline when the repo has none. Language/ORM-agnostic.

## The gate — DB severity sentence

A DB finding is real only if you can complete this from the diff:

> *"This query will **[scan/return far more rows than needed | let a caller make it arbitrarily expensive | miss its index | issue N queries instead of 1]** when **[realistic data size / caller input]**, because **[specific query in this diff]**."*

Tie it to realistic production data size or attacker-controllable input. A query that is fine at every realistic scale is not a finding.

## What to check

1. **Query-plan sanity (`EXPLAIN`)** — for a new or changed non-trivial query, would the plan use an index or fall back to a sequential/full scan at production row counts? Flag scans on large tables driven by request input.
2. **Bounded, scoped `WHERE` filters (abuse prevention)** — every query is scoped to the caller's tenant/owner and has selective predicates. Flag:
   - leading-wildcard `LIKE '%x%'` or computed-column filters on large tables (unindexable),
   - `ORDER BY` / `GROUP BY` on unindexed columns of large tables,
   - filters on user input that let a caller force an expensive scan/sort.
3. **No unbounded result sets** — list/collection queries have `LIMIT` + pagination. Flag any query that can return an unbounded number of rows to a request.
4. **No N+1** — a query inside a loop / per-item lookup that should be a single batched query or join.
5. **No over-fetch** — `SELECT *` / loading full rows or relations when a few columns suffice, especially in hot paths.
6. **Index coverage** — columns used in `WHERE`/`JOIN`/`ORDER BY` on large tables are indexed (or a new query relies on an index that doesn't exist).
7. **Parameterized** — no string-built SQL (cross-ref `security.md` §4); user input is bound, never interpolated.

## Do NOT post (database)

- Micro-optimizations with no measured/likely cost at real scale.
- Index suggestions on tiny or rarely-queried tables.
- `SELECT *` on a small fixed-size config/lookup table.
- Style preferences about query builder vs raw-but-parameterized SQL when both are safe.
