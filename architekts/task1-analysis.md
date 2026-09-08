# Task 1 Requirements Analysis

## Scope

This document maps the requirements from [task1.md](../task1.md) to the current Task 1 implementation. It does not modify application code.

Status values:

- **DONE**: implemented and traceable in the current source.
- **PARTIAL**: substantially implemented, but an explicit requirement, verification step, or edge case remains incomplete.
- **MISSING**: not implemented in the current Task 1 application.

Priority values:

- **REQUIRED**: explicit task requirement or necessary part of the requested feature.
- **RECOMMENDED**: explicitly recommended or strongly implied, but not strictly mandatory.
- **OPTIONAL**: useful enhancement that is not required for acceptance.

## 1. Requirements Extracted and Traced

### Pages and Data

| Priority | Requirement                                                     | Status | Implementation files                                                                                                                                                                               | Notes                                                                                               |
| -------- | --------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| REQUIRED | Provide `/` as the exam catalog page.                           | DONE   | [pages/index.vue](../pages/index.vue)                                                                                                                                                              | Catalog, filters, sorting, result cards, cart link, and cart count are rendered here.               |
| REQUIRED | Provide `/cart` as the shopping cart and checkout preview page. | DONE   | [pages/cart.vue](../pages/cart.vue)                                                                                                                                                                | Displays line items, quantities, prices, discount, subtotal, and total.                             |
| REQUIRED | Use the provided `/public/exams.json` seed data.                | DONE   | [features/catalog/stores/catalog.ts](../features/catalog/stores/catalog.ts), [pages/index.vue](../pages/index.vue), [pages/cart.vue](../pages/cart.vue), [public/exams.json](../public/exams.json) | The catalog store loads the data using the existing absolute `${requestURL.origin}/exams.json` URL. |
| REQUIRED | Use shared TypeScript exam interfaces.                          | DONE   | [types/index.ts](../types/index.ts)                                                                                                                                                                | `Exam`, `ExamCategory`, and cart-related types are defined and imported by the implementation.      |
| REQUIRED | Support the supplied exam data model.                           | DONE   | [types/index.ts](../types/index.ts), [public/exams.json](../public/exams.json)                                                                                                                     | Includes id, name, category, price, fasting flag, result time, popularity, and tags.                |

### Catalog Search, Filtering, and Sorting

| Priority    | Requirement                                                                  | Status | Implementation files                                                                                                                                                                                                       | Notes                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| RECOMMENDED | Real-time search by exam name and tags.                                      | DONE   | [features/catalog/composables/useCatalogSearch.ts](../features/catalog/composables/useCatalogSearch.ts), [features/catalog/components/CatalogSearch.vue](../features/catalog/components/CatalogSearch.vue)                 | Search is case-insensitive and updates computed results as the input changes.                                                 |
| REQUIRED    | Multi-select category filtering for Basic, Advanced, and Specialized.        | DONE   | [features/catalog/components/CatalogCategoryFilter.vue](../features/catalog/components/CatalogCategoryFilter.vue), [features/catalog/composables/useCatalogSearch.ts](../features/catalog/composables/useCatalogSearch.ts) | Uses native checkboxes and supports multiple selected categories.                                                             |
| REQUIRED    | Min/max price filtering.                                                     | DONE   | [features/catalog/components/CatalogPriceFilter.vue](../features/catalog/components/CatalogPriceFilter.vue), [features/catalog/composables/useCatalogSearch.ts](../features/catalog/composables/useCatalogSearch.ts)       | Uses numeric inputs. When minPrice is greater than maxPrice, price filtering is bypassed and the validation message is shown. |
| REQUIRED    | Fasting-required filter.                                                     | DONE   | [features/catalog/components/CatalogCategoryFilter.vue](../features/catalog/components/CatalogCategoryFilter.vue), [features/catalog/composables/useCatalogSearch.ts](../features/catalog/composables/useCatalogSearch.ts) | Implemented as a checkbox.                                                                                                    |
| REQUIRED    | Result-time filter for a maximum turnaround, including the example `<= 24h`. | DONE   | [features/catalog/components/CatalogCategoryFilter.vue](../features/catalog/components/CatalogCategoryFilter.vue), [features/catalog/composables/useCatalogSearch.ts](../features/catalog/composables/useCatalogSearch.ts) | Implemented as a checkbox for results within 24 hours.                                                                        |
| REQUIRED    | Sort by price ascending and descending.                                      | DONE   | [features/catalog/components/CatalogSort.vue](../features/catalog/components/CatalogSort.vue), [features/catalog/composables/useCatalogSearch.ts](../features/catalog/composables/useCatalogSearch.ts)                     | Uses `priceAsc` and `priceDesc`.                                                                                              |
| REQUIRED    | Sort by popularity, most popular first.                                      | DONE   | [features/catalog/components/CatalogSort.vue](../features/catalog/components/CatalogSort.vue), [features/catalog/composables/useCatalogSearch.ts](../features/catalog/composables/useCatalogSearch.ts)                     | Default sorting is popularity descending.                                                                                     |
| REQUIRED    | Sort by result time, fastest first.                                          | DONE   | [features/catalog/components/CatalogSort.vue](../features/catalog/components/CatalogSort.vue), [features/catalog/composables/useCatalogSearch.ts](../features/catalog/composables/useCatalogSearch.ts)                     | Sorts by ascending `resultTimeHours`.                                                                                         |
| REQUIRED    | Display fasting and fast-result badges where applicable.                     | DONE   | [features/catalog/components/ExamCard.vue](../features/catalog/components/ExamCard.vue)                                                                                                                                    | Visible badge text is rendered conditionally from the exam data.                                                              |
| REQUIRED    | Provide an accessible empty state when filtering produces no results.        | DONE   | [pages/index.vue](../pages/index.vue), [i18n/locales/pl.json](../i18n/locales/pl.json)                                                                                                                                     | Includes a status message and a keyboard-accessible clear-filters button.                                                     |

### Cart and Checkout Preview

| Priority | Requirement                          | Status | Implementation files                                                                                                                                                                            | Notes                                                                   |
| -------- | ------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| REQUIRED | Add an exam to the cart.             | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [pages/index.vue](../pages/index.vue), [features/catalog/components/ExamCard.vue](../features/catalog/components/ExamCard.vue) | Catalog cards emit an event and the cart store adds the item.           |
| REQUIRED | Support additive quantities.         | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                                                                                                                 | Adding an existing exam increases its quantity.                         |
| REQUIRED | Remove a single cart item.           | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [pages/cart.vue](../pages/cart.vue)                                                                                            | The cart UI exposes an accessible remove action.                        |
| REQUIRED | Update item quantity.                | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [pages/cart.vue](../pages/cart.vue)                                                                                            | Minus removes an item at zero; plus increases quantity.                 |
| REQUIRED | Clear the entire cart.               | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [pages/cart.vue](../pages/cart.vue)                                                                                            | The clear action resets all items and persists the empty cart.          |
| REQUIRED | Show line items.                     | DONE   | [pages/cart.vue](../pages/cart.vue)                                                                                                                                                             | Each visible cart item has its own article and heading.                 |
| REQUIRED | Show unit prices.                    | DONE   | [pages/cart.vue](../pages/cart.vue)                                                                                                                                                             | Uses the shared price formatter.                                        |
| REQUIRED | Show quantities and per-line totals. | DONE   | [pages/cart.vue](../pages/cart.vue)                                                                                                                                                             | Quantity controls, quantity text, and `price * quantity` are displayed. |
| REQUIRED | Show subtotal before discount.       | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [pages/cart.vue](../pages/cart.vue)                                                                                            | Implemented by the `subtotal` getter and cart summary.                  |
| REQUIRED | Show discount summary.               | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [pages/cart.vue](../pages/cart.vue)                                                                                            | Implemented by `discountAmount`.                                        |
| REQUIRED | Show final total.                    | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [pages/cart.vue](../pages/cart.vue)                                                                                            | Implemented by the `total` getter.                                      |

### Discount Rule

| Priority | Requirement                                       | Status | Implementation files                                                                                         | Notes                                                                            |
| -------- | ------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| REQUIRED | Every 3 Basic exams receive a 10% discount.       | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                              | Discount applies to complete groups of three Basic units.                        |
| REQUIRED | Expand quantities into individual Basic units.    | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                              | Each quantity contributes one price entry per unit.                              |
| REQUIRED | Sort qualifying units by ascending unit price.    | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                              | `basicPrices.sort((a, b) => a - b)`.                                             |
| REQUIRED | Calculate `K = 3 * floor(N / 3)`.                 | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                              | Implemented as `discountedCount`.                                                |
| REQUIRED | Discount only the first K cheapest units.         | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                              | Uses `basicPrices.slice(0, discountedCount)`.                                    |
| REQUIRED | Leave remainder units at full price.              | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                              | Only the sliced units contribute to the discount.                                |
| REQUIRED | Exclude non-Basic exams from the discount.        | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                              | Non-Basic categories are skipped.                                                |
| REQUIRED | Round final totals and discounts to two decimals. | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [tests/cart.spec.ts](../tests/cart.spec.ts) | `roundToTwo` is used for subtotal, discount, and total; decimal coverage exists. |

### Persistence and SSR

| Priority | Requirement                                                   | Status  | Implementation files                                                                                                                        | Notes                                                                                                                           |
| -------- | ------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| REQUIRED | Persist cart state across reloads using `localStorage`.       | DONE    | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                                                             | Mutating actions call `saveToStorage`; pages restore on mount.                                                                  |
| REQUIRED | Avoid browser API access during SSR.                          | DONE    | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                                                             | Storage operations are guarded by `import.meta.client`.                                                                         |
| REQUIRED | Avoid hydration mismatches caused by persisted cart state.    | DONE    | [pages/index.vue](../pages/index.vue), [pages/cart.vue](../pages/cart.vue), [features/cart/stores/cart.ts](../features/cart/stores/cart.ts) | Cart restoration runs in `onMounted`, after the SSR render.                                                                     |
| REQUIRED | Remove invalid persisted cart data safely.                    | DONE    | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [tests/cart.spec.ts](../tests/cart.spec.ts)                                | Invalid JSON is cleared; invalid entries and unknown exam IDs are discarded.                                                    |
| REQUIRED | Avoid concurrent duplicate catalog requests for the same URL. | DONE    | [features/catalog/stores/catalog.ts](../features/catalog/stores/catalog.ts)                                                                 | Per-store pending requests are deduplicated with a `WeakMap`.                                                                   |
| REQUIRED | Keep the existing absolute exams URL approach.                | DONE    | [pages/index.vue](../pages/index.vue), [pages/cart.vue](../pages/cart.vue)                                                                  | Both pages pass `${requestURL.origin}/exams.json` to the catalog store.                                                         |
| PARTIAL  | Verify zero hydration warnings in a real browser session.     | PARTIAL | [app.vue](../app.vue), [pages/index.vue](../pages/index.vue), [pages/cart.vue](../pages/cart.vue)                                           | The implementation is designed for SSR safety, but a full browser/hydration audit is not represented by the current unit tests. |

### State Management and Architecture

| Priority | Requirement                                               | Status | Implementation files                                                                                 | Notes                                                                                          |
| -------- | --------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| REQUIRED | Use Pinia for cart state.                                 | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [nuxt.config.ts](../nuxt.config.ts) | Pinia Nuxt module is configured and the cart store exposes the required state/actions/getters. |
| REQUIRED | Provide the required cart actions.                        | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                      | `addToCart`, `removeFromCart`, `updateQuantity`, and `clearCart` are implemented.              |
| REQUIRED | Provide the required cart getters.                        | DONE   | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                                      | `subtotal`, `discountAmount`, `total`, and `itemCount` are implemented.                        |
| REQUIRED | Use Nuxt 4 with SSR.                                      | DONE   | [package.json](../package.json), [nuxt.config.ts](../nuxt.config.ts)                                 | Nuxt 4.5.2 is configured with compatibility version 4.                                         |
| REQUIRED | Use Vue Composition API with `<script setup lang="ts">`.  | DONE   | [pages/index.vue](../pages/index.vue), [pages/cart.vue](../pages/cart.vue), [features](../features)  | Vue components use script setup; the app uses composables and Pinia setup-compatible patterns. |
| REQUIRED | Keep a clean feature-based architecture.                  | DONE   | [features](../features), [shared](../shared), [pages](../pages), [types](../types)                   | Catalog and cart concerns are separated into feature folders.                                  |
| REQUIRED | Use static JSON data and no unnecessary new dependencies. | DONE   | [public/exams.json](../public/exams.json), [package.json](../package.json)                           | No Task 1-specific dependency was introduced for the implementation.                           |

### Accessibility

| Priority    | Requirement                                         | Status | Implementation files                                                                                                                                                                  | Notes                                                                                                 |
| ----------- | --------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| REQUIRED    | Support full keyboard navigation.                   | DONE   | [features/catalog/components](../features/catalog/components), [pages/cart.vue](../pages/cart.vue)                                                                                    | Native inputs, select, links, and buttons are used.                                                   |
| REQUIRED    | Use semantic HTML.                                  | DONE   | [pages/index.vue](../pages/index.vue), [pages/cart.vue](../pages/cart.vue), [features/catalog/components](../features/catalog/components)                                             | Uses `main`, `header`, `section`, `article`, `ul`, `fieldset`, `legend`, labels, and native controls. |
| REQUIRED    | Provide accessible labels and button names.         | DONE   | [features/catalog/components](../features/catalog/components), [pages/cart.vue](../pages/cart.vue)                                                                                    | Form labels and contextual cart/button labels are present.                                            |
| REQUIRED    | Provide ARIA where needed.                          | DONE   | [pages/index.vue](../pages/index.vue), [pages/cart.vue](../pages/cart.vue), [features/catalog/components](../features/catalog/components)                                             | Includes `aria-live`, `aria-invalid`, `aria-describedby`, and labelled regions where appropriate.     |
| REQUIRED    | Announce cart modifications with `aria-live`.       | DONE   | [features/cart/composables/useAnnouncementQueue.ts](../features/cart/composables/useAnnouncementQueue.ts), [pages/index.vue](../pages/index.vue), [pages/cart.vue](../pages/cart.vue) | A dedicated polite announcement region reports cart changes.                                          |
| RECOMMENDED | Keep visible focus states.                          | DONE   | [features/catalog/components](../features/catalog/components), [pages/cart.vue](../pages/cart.vue)                                                                                    | Focus-visible outlines are defined for the interactive controls covered by the UI.                    |
| RECOMMENDED | Avoid unnecessary ARIA and prefer native semantics. | DONE   | [features/catalog/components/ExamCard.vue](../features/catalog/components/ExamCard.vue), [pages/index.vue](../pages/index.vue)                                                        | Recent accessibility review removed unnecessary live-region scope and badge ARIA.                     |

### Testing

| Priority    | Requirement                                              | Status  | Implementation files                        | Notes                                                                                                  |
| ----------- | -------------------------------------------------------- | ------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| REQUIRED    | Provide at least two unit tests for cart business logic. | DONE    | [tests/cart.spec.ts](../tests/cart.spec.ts) | The suite currently contains 14 passing tests.                                                         |
| REQUIRED    | Test 3 Basic exams with a 10% discount.                  | DONE    | [tests/cart.spec.ts](../tests/cart.spec.ts) | Covers mixed-price Basic exams.                                                                        |
| REQUIRED    | Test remainder behavior such as 5 Basic exams.           | DONE    | [tests/cart.spec.ts](../tests/cart.spec.ts) | Verifies only the 3 cheapest of 5 are discounted.                                                      |
| REQUIRED    | Test quantities as individual bundle units.              | DONE    | [tests/cart.spec.ts](../tests/cart.spec.ts) | Covers quantity 3 and larger quantities.                                                               |
| RECOMMENDED | Test 6+ Basic items and multiple bundles.                | DONE    | [tests/cart.spec.ts](../tests/cart.spec.ts) | Covers 6 and 7 Basic units.                                                                            |
| RECOMMENDED | Test mixed categories and rounding.                      | DONE    | [tests/cart.spec.ts](../tests/cart.spec.ts) | Covers Advanced exclusions and decimal prices.                                                         |
| RECOMMENDED | Test invalid persisted data and missing exam IDs.        | DONE    | [tests/cart.spec.ts](../tests/cart.spec.ts) | Covers malformed JSON, invalid quantities, and unknown IDs.                                            |
| OPTIONAL    | Add full component/browser accessibility tests.          | MISSING | —                                           | Current tests are business-logic/composable tests; no browser-level accessibility suite is configured. |

### Deliverables and Evaluation Criteria

| Priority | Requirement                                                          | Status  | Implementation files                                                                                                                                                   | Notes                                                                                                                                                |
| -------- | -------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQUIRED | Deliver a functional Nuxt 4 application.                             | DONE    | [package.json](../package.json), [pages](../pages), [features](../features)                                                                                            | Application builds successfully.                                                                                                                     |
| REQUIRED | Keep the provided seed data.                                         | DONE    | [public/exams.json](../public/exams.json)                                                                                                                              | The supplied dataset remains present.                                                                                                                |
| REQUIRED | Deliver unit tests for cart and discount logic.                      | DONE    | [tests/cart.spec.ts](../tests/cart.spec.ts)                                                                                                                            | 14 tests currently pass.                                                                                                                             |
| REQUIRED | Provide a README documenting setup, design choices, and assumptions. | DONE    | [README.md](../README.md)                                                                                                                                              | README documents setup, architecture, discount logic, SSR persistence, testing, and scope.                                                           |
| REQUIRED | Maintain correct discount logic.                                     | DONE    | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [tests/cart.spec.ts](../tests/cart.spec.ts)                                                           | Covered by unit tests and production build.                                                                                                          |
| REQUIRED | Maintain responsive filters and sorting.                             | PARTIAL | [features/catalog/components](../features/catalog/components), [features/catalog/composables/useCatalogSearch.ts](../features/catalog/composables/useCatalogSearch.ts) | Filtering and sorting logic exist; responsive visual behavior is not verified by automated tests and the current implementation has minimal styling. |
| REQUIRED | Maintain zero hydration mismatch warnings.                           | PARTIAL | [pages/index.vue](../pages/index.vue), [pages/cart.vue](../pages/cart.vue), [features/cart/stores/cart.ts](../features/cart/stores/cart.ts)                            | SSR-safe guards and mounted restoration reduce risk, but console-level browser verification is still required.                                       |
| REQUIRED | Keep Pinia state clean and decoupled.                                | DONE    | [features/cart/stores/cart.ts](../features/cart/stores/cart.ts), [features/catalog/stores/catalog.ts](../features/catalog/stores/catalog.ts)                           | Cart references the catalog store for exam details while keeping cart state as IDs and quantities.                                                   |
| REQUIRED | Keep TypeScript code strongly typed and maintainable.                | DONE    | [types/index.ts](../types/index.ts), [features](../features), [tests/cart.spec.ts](../tests/cart.spec.ts)                                                              | Shared types and type guards are used; project build passes.                                                                                         |
| REQUIRED | Keep tests comprehensive for core business rules.                    | PARTIAL | [tests/cart.spec.ts](../tests/cart.spec.ts)                                                                                                                            | Core cart rules have strong coverage; component-level, browser-level, and full catalog interaction coverage are not present.                         |

## 2. Risks and Ambiguities

### Specification ambiguities

- **Search is marked Recommended**, while the remaining filters and sorting options are listed as required. The implementation includes search, so this ambiguity does not reduce current feature coverage.
- **Category UI is flexible**: the specification allows a multi-select dropdown or chips. The implementation uses native checkboxes, which satisfy the multi-select behavior but are a third presentation variant.
- **Result-time filtering says “e.g. <= 24h”** without defining a configurable threshold. The implementation provides a fixed `<= 24h` checkbox, matching the visible requirement example but not a general maximum-hours control.
- **Checkout preview** is described as a cart view; no payment or checkout submission workflow is specified. The implementation provides the requested preview and does not implement payment.
- **Responsive behavior** is an evaluation criterion but no breakpoints or target viewports are specified.
- **Hydration correctness** is an evaluation criterion that requires runtime/browser verification; unit tests and a successful build cannot prove zero console warnings in every browser flow.

### Implementation risks

- `loadFromStorage()` validates exam IDs against the catalog store. It is currently called from the pages after catalog loading, but calling it earlier from another entry point could discard otherwise valid persisted items while the catalog is still empty.
- The cart store allows `addToCart()` to receive an arbitrary `examId`; unknown IDs are discarded during restoration and ignored by subtotal/discount calculations, but direct additions are not rejected immediately.
- The application uses an absolute `${requestURL.origin}/exams.json` URL by design. This preserves the current working approach, but host/proxy configuration should be checked in deployment environments.
- The initial cart is restored in `onMounted`, which is SSR-safe and avoids hydration differences, but means the server-rendered cart count/contents initially represent an empty cart until the client mounts.
- The current tests execute business logic in the Nuxt Vitest environment. They do not replace browser-level keyboard, screen-reader, visual, or hydration checks.

## 3. Final Submission Checklist

### Functional requirements

- [x] `/` catalog page exists.
- [x] `/cart` cart and checkout preview exists.
- [x] 35 provided exam records remain available from `/public/exams.json`.
- [x] Search by name and tags works.
- [x] Category multi-select works.
- [x] Min/max price inputs work.
- [x] Fasting and result-time filters work.
- [x] Price, popularity, and result-time sorting work.
- [x] Conditional exam badges are displayed.
- [x] Add, remove, update quantity, and clear cart actions work.
- [x] Basic bundle discount logic is implemented.
- [x] Subtotal, discount, line totals, and final total are displayed.

### Technical requirements

- [x] Nuxt 4 is configured with SSR.
- [x] Composition API and TypeScript are used.
- [x] Pinia manages cart and catalog state.
- [x] Client-only `localStorage` access is guarded.
- [x] Persisted cart data is validated.
- [x] Unknown persisted exam IDs are discarded.
- [x] Concurrent catalog loads for the same URL are deduplicated per store instance.
- [x] No new Task 1 dependency was introduced.

### Accessibility requirements

- [x] Native keyboard controls are used.
- [x] Form controls have visible labels.
- [x] Category and price filters use `fieldset`/`legend`.
- [x] Cart buttons have contextual accessible names.
- [x] Cart changes use a dedicated `aria-live` announcement.
- [x] Invalid price inputs use `aria-invalid` and `aria-describedby`.
- [x] Empty filtered results have an accessible status and clear-filters action.
- [x] Unnecessary broad `aria-live` regions were removed.
- [ ] Verify keyboard and screen-reader behavior manually in a browser.

### Testing and delivery

- [x] At least two unit tests exist.
- [x] 3 Basic item discount is tested.
- [x] 5 Basic remainder behavior is tested.
- [x] 6 and 7 Basic unit behavior is tested.
- [x] Quantity bundle behavior is tested.
- [x] Mixed categories are tested.
- [x] Decimal rounding is tested.
- [x] Invalid JSON and invalid persisted entries are tested.
- [x] Empty cart behavior is tested.
- [x] Unknown exam IDs are tested.
- [x] `npm run test` passes with 14 tests.
- [x] `npm run build` passes.
- [x] README documents setup, architecture, assumptions, and Task 1 scope.
- [ ] Perform a final browser smoke test for `/` and `/cart`.
- [ ] Check the browser console for hydration or runtime warnings.

## Conclusion

The implementation covers the required Task 1 functionality and the core business rules. The main remaining submission risks are manual verification of browser accessibility/hydration behavior and the explicitly unspecified responsive presentation details. No required catalog, cart, persistence, discount, or unit-testing feature is currently marked MISSING.
