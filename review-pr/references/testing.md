# Test-quality review standard (baseline)

> Baseline for the `review-pr` test-quality finder, used when the diff touches tests. **Precedence:** the repo's own testing doc (e.g. `.ai/TESTING.md`) wins — cite it. Use this baseline when the repo has none. Language-agnostic (pytest/Jest/Playwright/etc.).  Generalized from Mashgin `ai-skills/docs/TESTING_PHILOSOPHY.md`, `mash-review-fake-tests`, and `mash-review-poor-stubs`.

## The gate — testing severity sentence

A test finding is real only if you can complete this from the test code:

> *"If the production code for this feature were deleted or returned the wrong result, this test would **[still pass | silently skip | pass vacuously]** because **[specific pattern in the test]**."*

The litmus, short form: **would this test still pass if the feature were broken or removed?** If yes → it's a fake test → real finding.

## Fake / weak test patterns (flag these)

1. **Hollow test** — the name promises a scenario the body never exercises (sets up, but never performs the action or asserts the outcome).
2. **Conditional assertion skip** — `if (visible) { assert }` / `if exists: assert` — a missing element silently passes instead of failing.
3. **Existence-only / vacuous assertion** — `toBeVisible()`, `exists()`, `count > 0`, `assertTrue(result)` with no check of the actual value. Assert real, specific data (exact text/count/id from the fixture), not mere presence.
4. **Vacuous pass on empty data** — asserts "0 results" / "no error" without first proving the data existed to be filtered or the path actually ran.
5. **Missing negative counterpart** — "shows matching" without "hides non-matching"; "allows X" without "rejects not-X". A one-sided test can pass on a no-op.
6. **Sleep / timeout band-aid** — `sleep`, `waitForTimeout`, inflated timeouts to mask flakiness instead of waiting on a real condition.
7. **Mock asserting the mock** — the test verifies hardcoded mock output, never the real code path (e.g. stubbed route returns canned JSON the test then "checks").

## What to test vs not

- **Test:** business/service logic (rules, validation, error cases); endpoint behavior (status, shape, authz); critical user journeys traced to a requirement.
- **Don't test:** framework internals, trivial getters/setters, schema-library behavior, third-party libs.

## Do NOT post (testing)

- Assertion-style preferences (`toContainText` vs `toHaveText`), DRY/page-object refactors, selector-strategy preferences (`getByRole` vs `getByText`).
- Tests that already assert real data and have positive + negative coverage — leave them.
- Anything about test files **not in this diff**, or the repo's pre-existing total test count.
- "Could be parameterized" / structure preferences.
