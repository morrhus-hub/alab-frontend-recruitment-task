// Shared TypeScript definitions for Frontend Recruitment Tasks (Medical Diagnostics E-Commerce)

// ==========================================
// Task 1: Catalog & Cart Types
// ==========================================

export type ExamCategory = "Basic" | "Advanced" | "Specialized";

export type SortOption = "priceAsc" | "priceDesc" | "popularity" | "resultTime";

export interface Exam {
  id: string;
  name: string;
  category: ExamCategory;
  price: number;
  fastingRequired: boolean;
  resultTimeHours: number;
  popularity: number;
  tags: string[];
}

export interface CartItem {
  examId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

// ==========================================
// Task 2: Appointment Booking Wizard Types
// ==========================================

/**
 * Standard reference mock time (Friday morning) for deterministic evaluation of:
 * - Past slots: datetime < MOCK_REFERENCE_TIME (disabled)
 * - Fasting warning: datetime >= MOCK_REFERENCE_TIME && (datetime - MOCK_REFERENCE_TIME) <= 8 hours
 */
export const MOCK_REFERENCE_TIME = "2026-09-04T08:30:00+02:00";

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

export interface Slot {
  datetime: string; // ISO 8601 format
  capacity: number;
  booked: number;
}

export interface BookingSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface BookingState {
  locationId: string | null;
  slot: BookingSlot | null;
  currentStep: number;
  /**
   * Indicates whether the scheduled test requires fasting.
   * Used to calculate the `hasFastingWarning` getter for appointments within 8 hours.
   */
  requiresFasting: boolean;
}

// ==========================================
// Task 3: Orders Dashboard & Mock Auth Types
// ==========================================

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
  resultPdf?: string; // Optional URL or mock path
}

export interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
}

export interface OrdersFilter {
  status: OrderStatus | null;
}

export interface OrdersPagination {
  currentPage: number;
  perPage: number;
}

export interface OrdersState {
  orders: Order[];
  filters: OrdersFilter;
  pagination: OrdersPagination;
  loading?: boolean;
  error?: string | null;
}
