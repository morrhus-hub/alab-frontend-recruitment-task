# Analyze task1.md using:

architects/task-requirements-review.md

Do not change application code.

Create or update:

architects/task1-analysis.md

The analysis must:

- extract all requirements from task1.md
- classify them as REQUIRED / RECOMMENDED / OPTIONAL
- compare them with the current implementation
- mark each as DONE / PARTIAL / MISSING
- reference the implementation files
- identify ambiguities and risks
- finish with a submission checklist

After creating the analysis, do not modify production files.

# Review Prompts

Use these prompts with an AI coding agent after implementation is complete.

The reviewer instructions are stored in:

- [`frontend-review.md`](./frontend-review.md)
- [`accessibility-review.md`](./accessibility-review.md)
- [`test-review.md`](./test-review.md)

The goal of these reviews is to identify issues and suggest focused improvements without rewriting the entire project.

---

## Frontend Review

```text
Review this project using the instructions from:

architekts/frontend-review.md

Inspect the whole source code, especially:

- features/catalog
- features/cart
- pages
- shared
- types
- tests

Do not modify generated files such as .nuxt, node_modules, .output, dist, or other build artifacts.

First produce a review report.

Do not change any files yet.

Group findings into:
1. Critical
2. Important
3. Nice-to-have

For every issue provide:
- affected file
- explanation
- suggested fix
```

## Accessibility Review

```text
Review this project using the instructions from:

architekts/accessibility-review.md

Focus on the actual rendered UI and Vue templates.

Pay particular attention to:
- keyboard navigation
- focus-visible states
- semantic HTML
- landmarks
- labels
- fieldset/legend
- aria-live
- accessible button names
- unnecessary ARIA

Do not change files yet.

First return a review report grouped into:
1. Critical
2. Important
3. Nice-to-have

Include affected files and suggested fixes.
```

## Test and Edge-Case Review

```text
Review this project using the instructions from:

architekts/test-review.md

Inspect the current Vitest tests and the cart business logic.

Look specifically for missing cases around:
- 3 Basic items
- 5 Basic items
- 6+ Basic items
- quantities
- mixed categories
- rounding
- invalid localStorage data
- empty cart
- missing exam IDs

Do not modify files yet.

Return:
1. Missing critical tests
2. Important edge cases
3. Nice-to-have tests
4. Exact suggested test scenarios
```

## Apply Approved Review Fixes

After reviewing the report manually, use this prompt:

```text
Apply only the Critical and Important findings from the previous review.

Requirements:
- do not redesign the application
- do not introduce new dependencies
- preserve the current feature-based architecture
- preserve business behavior
- preserve existing i18n keys where possible
- do not modify .nuxt, node_modules, .output, dist, or generated files
- keep changes minimal and focused

After changes:
1. run npm run test
2. run npm run build
3. report what changed
```

## Final Project Review

```text
Perform a final pre-submission review of this Nuxt 4 recruitment task.

Use:
- architekts/frontend-review.md
- architekts/accessibility-review.md
- architekts/test-review.md

Check whether the project is ready for submission.

Do not modify files.

Return only:

1. Blocking issues
2. Non-blocking issues
3. Submission readiness: READY / NOT READY
4. Short justification
```
