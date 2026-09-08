import { defineStore } from "pinia";
import type { CartItem } from "~/types";
import { useCatalogStore } from "~/features/catalog/stores/catalog";

const STORAGE_KEY = "alab-cart";

const roundToTwo = (value: number) => Math.round(value * 100) / 100;

const isValidCartItem = (item: unknown): item is CartItem => {
  if (!item || typeof item !== "object") {
    return false;
  }

  const cartItem = item as CartItem;

  return (
    typeof cartItem.examId === "string" &&
    Number.isInteger(cartItem.quantity) &&
    cartItem.quantity > 0
  );
};

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  actions: {
    loadFromStorage() {
      if (!import.meta.client) {
        return;
      }

      const storedCart = localStorage.getItem(STORAGE_KEY);

      if (!storedCart) {
        return;
      }

      try {
        const parsed = JSON.parse(storedCart);

        if (!Array.isArray(parsed)) {
          throw new Error("Invalid cart data");
        }

        const catalogStore = useCatalogStore();

        this.items = parsed
          .filter(isValidCartItem)
          .filter((item) =>
            catalogStore.exams.some((exam) => exam.id === item.examId),
          );
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        this.items = [];
      }
    },

    saveToStorage() {
      if (!import.meta.client) {
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    },

    addToCart(examId: string, quantity = 1) {
      const normalizedQuantity = Math.floor(quantity);

      if (normalizedQuantity <= 0) {
        return;
      }

      const existingItem = this.items.find((item) => item.examId === examId);

      if (existingItem) {
        existingItem.quantity += normalizedQuantity;
        this.saveToStorage();
        return;
      }

      this.items.push({
        examId,
        quantity: normalizedQuantity,
      });

      this.saveToStorage();
    },

    removeFromCart(examId: string) {
      this.items = this.items.filter((item) => item.examId !== examId);

      this.saveToStorage();
    },

    updateQuantity(examId: string, quantity: number) {
      const normalizedQuantity = Math.floor(quantity);

      if (normalizedQuantity <= 0) {
        this.removeFromCart(examId);
        return;
      }

      const item = this.items.find((item) => item.examId === examId);

      if (!item) {
        return;
      }

      item.quantity = normalizedQuantity;
      this.saveToStorage();
    },

    clearCart() {
      this.items = [];
      this.saveToStorage();
    },
  },

  getters: {
    itemCount: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),

    subtotal(state) {
      const catalogStore = useCatalogStore();

      const value = state.items.reduce((sum, item) => {
        const exam = catalogStore.exams.find((exam) => exam.id === item.examId);

        if (!exam) {
          return sum;
        }

        return sum + exam.price * item.quantity;
      }, 0);

      return roundToTwo(value);
    },

    discountAmount(state) {
      const catalogStore = useCatalogStore();

      const basicPrices: number[] = [];

      for (const item of state.items) {
        const exam = catalogStore.exams.find((exam) => exam.id === item.examId);

        if (!exam || exam.category !== "Basic") {
          continue;
        }

        for (let i = 0; i < item.quantity; i += 1) {
          basicPrices.push(exam.price);
        }
      }

      basicPrices.sort((a, b) => a - b);

      const discountedCount = 3 * Math.floor(basicPrices.length / 3);

      const discount = basicPrices
        .slice(0, discountedCount)
        .reduce((sum, price) => sum + price * 0.1, 0);

      return roundToTwo(discount);
    },

    total(): number {
      return roundToTwo(this.subtotal - this.discountAmount);
    },
  },
});
