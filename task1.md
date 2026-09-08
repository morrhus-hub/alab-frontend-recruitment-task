# Task 1: Catalog & Cart

Build a blood exam catalog with filtering, sorting, and add-to-cart functionality.

## Overview

This task focuses on building a server-side rendered (SSR) e-commerce catalog. Key challenges include implementing complex business logic for discounts, ensuring correct state management with Pinia, and handling SSR-safe `localStorage` persistence without hydration mismatches.

## Pages

- `/` - Exam catalog with search, filters, and sorting.
- `/cart` - Shopping cart and checkout preview.

## Data Structure

### Seed Data: `/public/exams.json`

An array of 35 realistic lab exam objects is provided in [`public/exams.json`](./public/exams.json). Shared TypeScript interfaces are available in [`types/index.ts`](./types/index.ts).

```typescript
export type ExamCategory = "Basic" | "Advanced" | "Specialized";

export interface Exam {
  id: string;
  name: string;
  category: ExamCategory;
  price: number; // in PLN (zł)
  fastingRequired: boolean;
  resultTimeHours: number;
  popularity: number; // 1-100
  tags: string[];
}
```

## Features

### Catalog Filtering & Sorting

- **Search (Recommended):** Real-time text search by exam name and tags.
- **Filters:**
  - **Category:** Multi-select dropdown or chip selector ("Basic", "Advanced", "Specialized").
  - **Price Range:** Min/max slider or numeric inputs.
  - **Fasting Required:** Toggle or checkbox.
  - **Result Time:** Filter by maximum hours (e.g., ≤ 24h).
- **Sorting:**
  - Price (ascending / descending).
  - Popularity (most popular first).
  - Result time (fastest turnaround first).
- **Visual Badges:**
  - Display "Fasting Required" and "≤24h results" badges where applicable.

### Cart & Checkout

- **Bundle Discount Rule:**
  - **Rule:** _"Any 3 exams from the 'Basic' category receive a 10% discount."_
  - **Calculation:** Because the discount is a uniform 10%, calculating the discount does not require complex combinatorics:
    1. Collect all qualifying "Basic" category items in the cart, expanding by their `quantity` into individual units. Let $N$ be the total count of Basic items.
    2. Sort these units by unit price in ascending order.
    3. The number of discounted items is $K = 3 \times \lfloor N / 3 \rfloor$.
    4. Apply the 10% discount to the first $K$ cheapest items (the remaining $N - K$ items are charged at full price).
  - **Multiples of 3 Examples:**
    - 3 Basic exams = 1 bundle discount (10% off the 3 items).
    - 5 Basic exams = 1 bundle discount (10% off the 3 cheapest items; 2 remaining charged at full price).
    - 6 Basic exams = 2 bundle discounts (10% off all 6 items).
  - **Quantities:** Item quantities are additive (e.g., a single Basic exam with `quantity: 3` satisfies a 3-item bundle).
  - **Rounding:** Final totals and discount amounts should be rounded to 2 decimal places (e.g. `Math.round(val * 100) / 100`).
- **SSR-Safe Persistence:**
  - Cart state must be persisted across page reloads using `localStorage`.
  - Implementation must be SSR-safe (no hydration mismatches or client-server rendering differences on mount).
- **Checkout Preview:**
  - Display line items, unit prices, quantities, item totals, subtotal, discount summary, and final total.

## State Management

### Pinia Store

Create a store to manage the cart state:

```typescript
export interface CartItem {
  examId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}
```

- **Actions:**
  - `addToCart(examId: string, quantity?: number)`
  - `removeFromCart(examId: string)`
  - `updateQuantity(examId: string, quantity: number)`
  - `clearCart()`
- **Getters:**
  - `subtotal`: Total cost of all items before discounts.
  - `discountAmount`: Total bundle discount applied.
  - `total`: `subtotal - discountAmount`.
  - `itemCount`: Total number of individual items in the cart.

> [!TIP]
> **Store Composition:** Because `CartState` stores item references (`examId`, `quantity`), cart getters will need access to exam details (price, category). You can either cross-reference an `exams` store, pass the catalog to cart helpers, or resolve exam items via a getter.

## Technical Requirements

- **Framework:** Nuxt 4 with SSR.
- **Syntax:** Composition API with `<script setup lang="ts">` exclusively.
- **Data:** Static JSON data provided in `/public/exams.json`.
- **Accessibility:** Full keyboard navigation, semantic HTML, ARIA attributes for interactive controls, and accessible status announcements for cart modifications (`aria-live`).

## Testing Requirements

- Write at least **2 unit tests** (e.g. with Vitest) covering the cart business logic, specifically:
  1. Correct discount calculation for 3 identical or mixed-price Basic exams.
  2. Edge cases with remainder items (e.g., 5 Basic exams where only the 3 cheapest get discounted, and 2 are full price).

## Deliverables

1. A functional Nuxt 4 application.
2. Seed data in `/public/exams.json` (provided in this repository).
3. Unit tests verifying cart and discount calculations.
4. Project `README.md` documenting setup, design choices, and assumptions.

## Evaluation Criteria

- **Correctness:** Flawless SSR execution, accurate bundle discount logic, responsive filters and sorting.
- **State Management:** Clean, decoupled Pinia store design.
- **Hydration:** Zero client/server hydration mismatch warnings in the console.
- **Accessibility:** Keyboard accessibility, proper ARIA labeling, and screen-reader friendliness.
- **Code Quality:** Strong TypeScript typing, clean component architecture, and DRY code.
- **Testing:** Comprehensive test assertions verifying core business rules.
