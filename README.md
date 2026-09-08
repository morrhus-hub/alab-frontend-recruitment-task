# Candidate Implementation: Task 1

This repository contains my implementation of **Task 1: Catalog & Cart** from the frontend recruitment challenge.

## Implemented Features

- SSR-rendered medical exam catalog
- Search by exam name and tags
- Category, price, fasting, and result-time filters
- Sorting by price, popularity, and result time
- Pinia-based shopping cart
- Quantity increase and decrease
- Single-item removal and full-cart clearing
- Bundle discount for Basic exams
- SSR-safe client-side `localStorage` persistence
- Validation of persisted cart data before restoring it
- Accessible cart announcements using `aria-live`
- Native keyboard-accessible controls and visible focus states
- Polish translations with `vue-i18n`
- Price formatting with `Intl.NumberFormat`

## Architecture

The application uses a feature-based modular structure:

```text
features/
  catalog/
    components/
    composables/
    stores/
  cart/
    composables/
    stores/
shared/
  utils/
pages/
types/
tests/
i18n/
plugins/
```

Catalog and cart code is isolated in their respective features. Shared utilities and domain types remain available through `shared/` and `types/`.

# ALAB Frontend Recruitment Task

Live demo: https://alab-frontend-recruitment-task.vercel.app/

Repository: https://github.com/morrhus-hub/alab-frontend-recruitment-task

## Discount Rule

For Basic-category exams:

1. Quantities are expanded into individual units.
2. Eligible units are sorted by ascending price.
3. A 10% discount is applied to the first `3 * floor(numberOfBasicUnits / 3)` units.
4. Monetary values are rounded to two decimal places.

Non-Basic exams are excluded from this discount.

## SSR and Persistence

The catalog data is fetched during SSR. The cart is persisted in `localStorage` on the client only, so browser APIs are never accessed during SSR. Persisted cart data is validated before it is restored.

## Accessibility

The implementation includes:

- semantic HTML landmarks
- `fieldset` and `legend` for grouped filters
- explicit labels for form controls
- native keyboard-accessible controls
- visible `:focus-visible` states
- contextual ARIA labels
- `aria-live` announcements for cart updates

## Testing

Run the unit tests with:

```bash
npm run test
```

The cart tests cover:

- three Basic exams receiving a 10% discount
- five Basic items where only the three cheapest are discounted
- Advanced exams being excluded from the Basic bundle discount

Run the production build with:

```bash
npm run build
```

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application is available at `http://localhost:3000` by default. Mock JSON files in `public/` are served from the root URL, for example `http://localhost:3000/exams.json`.

## Challenge Specifications

The repository also contains the original specifications for the remaining tasks:

- [Task 1: Catalog & Cart](./task1.md)
- [Task 2: Appointment Booking Wizard](./task2.md)
- [Task 3: Orders Dashboard & Mock Auth](./task3.md)

This implementation focuses on Task 1. Tasks 2 and 3 remain available as specifications and are not claimed as implemented here.
