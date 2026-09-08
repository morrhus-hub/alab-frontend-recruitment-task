# Task 2: Appointment Booking Wizard

Create a 3-step wizard for scheduling blood sample collection appointments.

## Overview

This task focuses on building a multi-step user flow with external library integration. Key challenges include synchronizing state between an interactive map and a list view, managing state across multiple steps, handling asynchronous data loading for appointment slots, and implementing robust form validation and route guards.

## Pages

- `/book` - A multi-step wizard for booking an appointment.
- `/book/confirm` - A read-only summary of the confirmed booking, protected by route middleware.

## Data Structure

### Seed Data: `/public/locations.json`

An array of 12 sample collection locations in Warsaw is provided in [`public/locations.json`](./public/locations.json). Shared TypeScript interfaces are in [`types/index.ts`](./types/index.ts).

```typescript
export interface Location {
  id: string;
  name: string;
  district: string; // e.g., "Śródmieście", "Mokotów"
  address: string;
  lat: number;
  lng: number;
  openingHours: string;
  supportsChildDraw: boolean;
}
```

### Seed Data: `/public/slots-<locationId>.json`

Available time slots for each location (e.g. `slots-loc-01.json` through `slots-loc-12.json` in [`public/`](./public)).

```typescript
export interface Slot {
  datetime: string; // ISO 8601 format (e.g. "2026-09-04T08:30:00+02:00")
  capacity: number;
  booked: number;
}
```

> [!NOTE]
> **Mock Reference Time for Deterministic Evaluation:**
> Because slot datasets are static (`2026-09-04` through `2026-09-08`), evaluate date logic against the standard mock reference time exported from [`types/index.ts`](./types/index.ts):
>
> ```typescript
> import { MOCK_REFERENCE_TIME } from "~/types"; // '2026-09-04T08:30:00+02:00' (Friday)
> ```
>
> This prevents time-decay issues where all slots appear permanently in the past.

## Features

### Step 1: Location Picker

- **Interactive Map & List:**
  - Display all 12 locations on a map (e.g., MapLibre GL, Leaflet, or OpenLayers) alongside a responsive list.
  - **Bidirectional Sync:** Clicking a map marker highlights and scrolls to the list item. Clicking a list item centers and zooms the map to the corresponding marker.
- **Filtering:**
  - Filter locations by district (dropdown or selector).
  - Toggle switch to filter by "Child-friendly" locations (`supportsChildDraw`).
- **Validation:** A location must be explicitly selected to advance to Step 2.

### Step 2: Date & Time Selection

- **Slot Loading:** Dynamically fetch and display time slots from `slots-<locationId>.json` (served at `/slots-<locationId>.json`) based on the selected location and date.
- **Opening Hours & Days Alignment:**
  - All locations are closed on Sunday (`2026-09-06`).
  - Weekday-only locations (`loc-03`, `loc-05`, `loc-06`, `loc-08`, `loc-09`, `loc-11`) have no Saturday slots.
  - Saturday-open locations (`loc-01`, `loc-02`, `loc-04`, `loc-07`, `loc-10`, `loc-12`) contain Saturday slots strictly within their defined Saturday hours.
- **Validation & Slot Availability:**
  - **Past Slots:** Slots before `08:30` on Friday `2026-09-04` (relative to `MOCK_REFERENCE_TIME`) must be disabled and visually distinguished as past.
  - **Fully Booked:** Slots with `booked >= capacity` must be disabled and visually marked as full.
  - An available date and time slot must be selected to advance to Step 3.

### Step 3: Review & Confirmation

- **Booking Summary:** Review selected location details (name, address, opening hours), chosen appointment date, and time slot.
- **Fasting Requirement Toggle & Warning:**
  - Allow the user to indicate if their scheduled tests require fasting (`requiresFasting`).
  - **Fasting Warning:** If `requiresFasting` is `true` and the appointment is within the next 8 hours from `MOCK_REFERENCE_TIME` (i.e. Friday between `08:30` and `16:30`), display a prominent warning notice (e.g., _"This exam requires at least 8-12 hours of fasting. Please ensure you have not eaten before your visit."_). Appointments scheduled on Saturday or next week fall outside the 8-hour window and should not trigger the alert.
- **Submit Action:** Completes the booking and navigates to `/book/confirm`.

### Route Guard: `/book/confirm`

- Protected by Nuxt middleware (`defineNuxtRouteMiddleware`):
  - Users accessing `/book/confirm` directly without a completed booking must be redirected back to `/book`.

## State Management

### Pinia Store

Create a store to manage the multi-step booking state:

```typescript
export interface BookingSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface BookingState {
  locationId: string | null;
  slot: BookingSlot | null;
  currentStep: number;
  requiresFasting: boolean;
}
```

- **Actions:**
  - `selectLocation(locationId: string)`
  - `selectSlot(date: string, time: string)`
  - `setRequiresFasting(required: boolean)`
  - `nextStep()`, `prevStep()`, `goToStep(step: number)`
  - `resetBooking()`
- **Getters:**
  - `isStepComplete: (state) => (step: number): boolean`
  - `hasFastingWarning: (state): boolean` (checks if `requiresFasting === true` and appointment time is within 8 hours)
  - `canSubmit: (state): boolean`

## Technical Requirements

- **Framework:** Nuxt 4 with SSR.
- **Syntax:** Composition API with `<script setup lang="ts">` exclusively.
- **Map Integration (SSR-Safe):** Map components must be lazy-loaded on client-side (e.g. using `<ClientOnly>` or dynamic import) to prevent SSR DOM/window errors.
- **Data:** Static JSON files provided in `/public/`.
- **Internationalization (Optional Bonus):** Multi-language toggle (EN / PL).

## Testing Requirements

- Write at least **2 unit tests** (e.g. with Vitest) validating store logic:
  1. `isStepComplete` for each wizard step based on state validity.
  2. `hasFastingWarning` correctly triggering when an appointment is within 8 hours with `requiresFasting: true`, and not triggering when > 8 hours or `requiresFasting: false`.

## Deliverables

1. A fully functional Nuxt 4 booking wizard.
2. Seed data in `/public/locations.json` and `slots-*.json` (provided in this repository).
3. Unit tests for the booking store logic.
4. A `README.md` file documenting setup, map library selection, and design decisions.

## Evaluation Criteria

- **Correctness:** SSR compatibility, robust form and step validation, and seamless map/list synchronization.
- **State Management:** Clean Pinia store with step guards and computed warnings.
- **Hydration:** Zero hydration mismatch errors (especially regarding client-only map widgets).
- **User Experience:** Polished multi-step progression, responsive layout, clear error/warning alerts.
- **Code Quality:** Type safety, modular component structure, and readable code.
- **Testing:** Comprehensive unit test assertions.
