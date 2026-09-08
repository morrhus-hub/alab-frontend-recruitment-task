# Task 3: Orders Dashboard & Mock Auth

Build a dashboard for users to view their order history and results, protected by a mock authentication flow.

## Overview

This task focuses on building an authenticated dashboard with robust state management in Nuxt 4. Key challenges include implementing mock authentication with route protection, managing state for filtering and pagination, and building a defensive UI that gracefully handles loading states, empty states, and errors.

## Pages

- `/login` - Mock login page to authenticate the user.
- `/account/orders` - Order history with status filtering, pagination, and status chips.
- `/account/orders/:id` - Detailed view of a single order.

## Data Structure

### Seed Data: `/public/orders.json`

An array of 25 order objects is provided in [`public/orders.json`](./public/orders.json). Shared TypeScript interfaces are in [`types/index.ts`](./types/index.ts).

```typescript
export type OrderStatus =
  | "pending_payment"
  | "processing"
  | "awaiting_sample"
  | "in_lab"
  | "ready"
  | "cancelled";

export interface OrderItem {
  examId: string;
  examName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string; // ISO 8601
  status: OrderStatus;
  items: OrderItem[];
  amount: number;
  labLocation: string;
  resultPdf?: string; // Optional URL
}
```

> [!TIP]
> **Static Asset URL vs Filesystem Path:**
> In Nuxt, files located in the `public/` folder are served at the root URL path (`/`). In your store or composables, fetch orders via `$fetch('/orders.json')` or `useFetch('/orders.json')`. Do **not** fetch `/public/orders.json`, which will return a 404 error.

## Features

### Mock Authentication

- **Login & Logout:**
  - Implement a mock auth store.
  - Login can accept simple mock credentials (e.g., `user@example.com` / any password or a quick "Log in as Test User" button).
  - Persist auth state across reloads.
- **Route Protection (Middleware):**
  - Use Nuxt route middleware (`defineNuxtRouteMiddleware`) to protect `/account/*` routes.
  - Unauthenticated visits to `/account/*` must redirect to `/login` with an optional `redirect` query parameter.
  - Authenticated visits to `/login` should redirect to `/account/orders`.

> [!IMPORTANT]
> **SSR Route Middleware & Cookie-Based Persistence:**
> Nuxt route middleware executes on the server during initial page requests and direct URL visits. `localStorage` is **not available** during server-side execution. Relying on `localStorage` will cause server-side middleware to evaluate the user as unauthenticated, triggering false redirects to `/login` and SSR hydration mismatches.
>
> To ensure correct SSR authentication, manage and persist session state using Nuxt's `useCookie('auth_token')` (or `useCookie('auth_user')`). Cookies are automatically sent in HTTP request headers and are synchronously readable in both SSR middleware and client code.

### Order History & Filtering

- **List View (`/account/orders`):**
  - Display orders in cards or a table with color-coded status chips (e.g. green for `ready`, orange for `pending_payment`, gray for `cancelled`).
  - **Pagination:** Client-side pagination (5 items per page), keeping `?page=X` synchronized with the URL query parameters.
  - **Filtering:** Filter orders by `status` (All, Ready, In Lab, Pending Payment, etc.), resetting pagination to page 1 on filter change.
  - **Defensive UI:** Gracefully render loading skeletons/spinners and an informative empty state when no orders match the selected filter.
- **Detail View (`/account/orders/:id`):**
  - Show full order details: order ID, creation date, status badge, collection location, and an itemized breakdown (exam name, quantity, unit price, line total, and final order amount).
  - **Result Download:** If `status === "ready"` and `resultPdf` exists, display a prominent button/link to view or download the PDF.
  - **Payment Action:** If `status === "pending_payment"`, display a "Retry Payment" button that simulates completing payment (updating status to `processing`).

## State Management

### Pinia Stores

- **Auth Store (`useAuthStore`):**

  ```typescript
  export interface AuthState {
    isLoggedIn: boolean;
    userId: string | null;
  }
  ```

  - **Actions:**
    - `login(userId?: string)`: Sets logged-in state and persists session.
    - `logout()`: Clears session and redirects to login.

- **Orders Store (`useOrdersStore`):**

  ```typescript
  export interface OrdersState {
    orders: Order[];
    filters: { status: OrderStatus | null };
    pagination: { currentPage: number; perPage: number };
    loading: boolean;
    error: string | null;
  }
  ```

  - **Actions:**
    - `fetchOrders()`: Loads orders from `/orders.json` (served from `public/orders.json`).
    - `setStatusFilter(status: OrderStatus | null)`: Updates filter and resets page to 1.
    - `setPage(page: number)`: Updates current pagination page.
    - `retryPayment(orderId: string)`: Simulates successful payment by updating order status to `processing`.
  - **Getters:**
    - `filteredOrders`: Returns orders matching the active status filter.
    - `paginatedOrders`: Slices `filteredOrders` according to `currentPage` and `perPage` (5 items/page).
    - `totalPages`: Computed count of total pages based on `filteredOrders.length`.
    - `getOrderById: (state) => (id: string): Order | undefined`

## Technical Requirements

- **Framework:** Nuxt 4 with SSR.
- **Syntax:** Composition API with `<script setup lang="ts">` exclusively.
- **Data:** Static JSON data provided in `public/orders.json` (fetched at `/orders.json`). No external backend API required.
- **Defensive UX:** Explicit loading, empty, and 404 (order not found) states.

## Testing Requirements

- Write at least **2 unit tests** (e.g. with Vitest) for store logic:
  1. Filtering orders by status and verifying `totalPages` / `paginatedOrders` calculations.
  2. Pagination logic (page boundaries, correct items per page slice).
  3. _(Bonus)_ Auth store login/logout and status mutation for `retryPayment`.

## Deliverables

1. A functional Nuxt 4 application with mock authentication and route protection.
2. Seed data in `/public/orders.json` (provided in this repository).
3. Unit tests verifying filtering, pagination, and store actions.
4. A `README.md` documenting setup, mock auth implementation, and architectural decisions.

## Evaluation Criteria

- **Correctness:** Robust route middleware, accurate pagination/filtering, defensive states.
- **State Management:** Clean Pinia store with distinct actions and computed getters.
- **Hydration:** Clean SSR rendering without client/server markup mismatches.
- **Code Quality:** Strong TypeScript typing, clean folder structure, and descriptive component naming.
- **Testing:** Reliable unit tests validating core store features.
