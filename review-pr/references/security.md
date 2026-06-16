# Security review standard (baseline)

> Baseline ruleset for the `review-pr` security finder. **Precedence:** if the repo under review has its own security doc (e.g. `.ai/WEB_SECURITY.md`, `docs/SECURITY.md`, root `SECURITY.md`), that doc wins — cite its sections. Use this baseline when the repo has none. Security always runs even when the repo omits a doc.  Generalized from Mashgin `ai-skills/docs/WEB_SECURITY.md` and gstack `/cso` (OWASP Top 10 + STRIDE). Language-agnostic.

## The gate — security severity sentence

A security finding is real only if you can honestly complete this from the diff:

> *"If we ship this as-is, **[an attacker | the wrong tenant/user | production data]** will be able to **[concrete bad outcome]** because **[specific line in this diff]**."*

Can't fill every bracket from the changed code? It's not a finding — drop it or pose it as a question.

## Ruleset

1. **Authorization** — every new/changed endpoint has an authz rule, enforced at the middleware/policy layer, not inside the handler. If you can't see authentication **and** authorization on the diff for a new route, treat it as missing.
2. **Tenant / org isolation** — every query is scoped to the caller's tenant/org/owner. Even buggy handler code must not be able to read or write another tenant's data.
3. **Input validation** — user input is parsed into typed schemas (Pydantic/Zod/etc.) before reaching business logic; raw dicts/strings never flow into services. Validate file uploads (type/size) and path/URL params (no traversal).
4. **No raw SQL** — DB access via ORM/repositories or parameterized queries. Never build SQL by string interpolation/concatenation. (See `database.md` for query quality.)
5. **Secrets** — no secrets/keys/passwords in committed code; all via env/secret store. `.env` and credential files are git-ignored.
6. **XSS** — server-side sanitize untrusted strings; rely on framework escaping; never feed user content to `dangerouslySetInnerHTML` / `v-html` / unescaped templates.
7. **CSRF / sessions** — session tokens in HttpOnly + SameSite cookies; state changes use POST/PUT/DELETE; CSRF protection for cookie auth.
8. **Injection (beyond SQL)** — command/template/deserialization injection: no `eval`, no shelling out with unsanitized input, no unsafe deserializers on untrusted data.
9. **Audit & logging** — mutations (create/update/delete) are logged with actor + target; errors logged with structured context; never leak stack traces or secrets to clients.
10. **Sensitive-data exposure** — PII/secrets not logged, not returned in API responses beyond need, hashed where appropriate (passwords: bcrypt/argon2).

## Do NOT post (security)

- Pre-existing patterns this diff didn't introduce (see the pre-existing-vs-exposed rule in SKILL.md).
- Theoretical risks with no demonstrated attack path.
- Defense-in-depth "you could also validate/encode here" with no real exploit.
- "Consider input validation" on input already validated upstream.
- "Consider rate limiting" without evidence the endpoint is abusable.
- Hypothetical timing attacks absent a cryptographic context.

## Not a finding

- **Binding to `0.0.0.0` inside a container** is correct and required — Docker port mapping only forwards to `0.0.0.0`. Do not flag it. (Outside containers, prefer `127.0.0.1` unless the service intentionally accepts external connections.)
