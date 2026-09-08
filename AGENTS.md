# AGENTS.md

## Project Context

Nuxt 4 recruitment task implementing:

- medical exam catalog
- filtering and sorting
- Pinia cart
- bundle discount logic
- SSR-safe persistence
- accessibility requirements
- Vitest coverage

## Architecture

The project uses a feature-based modular structure.

Main areas:

- `features/catalog`
- `features/cart`
- `shared`
- `pages`
- `tests`

## Development Rules

When reviewing or modifying the project:

1. Do not modify generated folders such as:
   - `.nuxt`
   - `node_modules`
   - build output

2. Preserve:
   - Nuxt 4 SSR compatibility
   - Vue Composition API
   - strict TypeScript
   - Pinia state management
   - existing i18n keys
   - accessibility behavior

3. Avoid introducing new dependencies unless clearly justified.

4. Do not change business rules without explicit reason.

5. Prefer simple, readable code over unnecessary abstractions.

## Review Checklist

Before accepting a change:

- run `npm run test`
- run `npm run build`
- verify no hydration warnings
- verify keyboard navigation
- verify visible focus states
- verify `aria-live` cart feedback
- verify cart persistence after reload
- verify discount edge cases

## AI-Assisted Development

AI tools may assist with:

- code review
- accessibility review
- identifying edge cases
- refactoring suggestions
- test suggestions
- architecture validation

AI suggestions should be reviewed before being accepted.

Business logic and architectural decisions must remain understandable, explicit and testable.
