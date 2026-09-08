import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCartStore } from "~/features/cart/stores/cart";
import { useCatalogSearch } from "~/features/catalog/composables/useCatalogSearch";
import { useCatalogStore } from "~/features/catalog/stores/catalog";
import type { Exam } from "~/types";

const exams: Exam[] = [
  {
    id: "basic-1",
    name: "Basic 1",
    category: "Basic",
    price: 10,
    fastingRequired: false,
    resultTimeHours: 24,
    popularity: 50,
    tags: [],
  },
  {
    id: "basic-2",
    name: "Basic 2",
    category: "Basic",
    price: 20,
    fastingRequired: false,
    resultTimeHours: 24,
    popularity: 50,
    tags: [],
  },
  {
    id: "basic-3",
    name: "Basic 3",
    category: "Basic",
    price: 30,
    fastingRequired: false,
    resultTimeHours: 24,
    popularity: 50,
    tags: [],
  },
  {
    id: "basic-4",
    name: "Basic 4",
    category: "Basic",
    price: 40,
    fastingRequired: false,
    resultTimeHours: 24,
    popularity: 50,
    tags: [],
  },
  {
    id: "advanced-1",
    name: "Advanced 1",
    category: "Advanced",
    price: 100,
    fastingRequired: false,
    resultTimeHours: 24,
    popularity: 50,
    tags: [],
  },
];

describe("cart discount", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.removeItem("alab-cart");

    const catalogStore = useCatalogStore();
    catalogStore.exams = exams;
  });

  it("applies 10% discount to 3 Basic exams", () => {
    const cartStore = useCartStore();

    cartStore.addToCart("basic-1");
    cartStore.addToCart("basic-2");
    cartStore.addToCart("basic-3");

    expect(cartStore.subtotal).toBe(60);
    expect(cartStore.discountAmount).toBe(6);
    expect(cartStore.total).toBe(54);
  });

  it("discounts only the 3 cheapest Basic items when 5 Basic items are in the cart", () => {
    const cartStore = useCartStore();

    cartStore.addToCart("basic-1", 2);
    cartStore.addToCart("basic-2");
    cartStore.addToCart("basic-3");
    cartStore.addToCart("basic-4");

    expect(cartStore.subtotal).toBe(110);

    // Basic units:
    // 10, 10, 20, 30, 40
    // Discount applies only to 10 + 10 + 20 = 40
    expect(cartStore.discountAmount).toBe(4);
    expect(cartStore.total).toBe(106);
  });

  it("does not apply the Basic bundle discount to Advanced exams", () => {
    const cartStore = useCartStore();

    cartStore.addToCart("advanced-1", 3);

    expect(cartStore.subtotal).toBe(300);
    expect(cartStore.discountAmount).toBe(0);
    expect(cartStore.total).toBe(300);
  });

  it("returns zero totals for an empty cart", () => {
    const cartStore = useCartStore();

    expect(cartStore.itemCount).toBe(0);
    expect(cartStore.subtotal).toBe(0);
    expect(cartStore.discountAmount).toBe(0);
    expect(cartStore.total).toBe(0);
  });

  it("discounts all 6 Basic units across two full bundles", () => {
    const cartStore = useCartStore();

    cartStore.addToCart("basic-1", 6);

    expect(cartStore.subtotal).toBe(60);
    expect(cartStore.discountAmount).toBe(6);
    expect(cartStore.total).toBe(54);
  });

  it("discounts only the 6 cheapest units when 7 Basic units are in the cart", () => {
    const cartStore = useCartStore();

    cartStore.addToCart("basic-1", 7);

    expect(cartStore.subtotal).toBe(70);
    expect(cartStore.discountAmount).toBe(6);
    expect(cartStore.total).toBe(64);
  });

  it("includes Advanced items in totals but not in the Basic discount", () => {
    const cartStore = useCartStore();

    cartStore.addToCart("basic-1");
    cartStore.addToCart("basic-2");
    cartStore.addToCart("basic-3");
    cartStore.addToCart("advanced-1");

    expect(cartStore.subtotal).toBe(160);
    expect(cartStore.discountAmount).toBe(6);
    expect(cartStore.total).toBe(154);
  });

  it("counts a quantity of 3 as three Basic bundle units", () => {
    const cartStore = useCartStore();

    cartStore.addToCart("basic-1", 3);

    expect(cartStore.itemCount).toBe(3);
    expect(cartStore.discountAmount).toBe(3);
    expect(cartStore.total).toBe(27);
  });

  it("rounds decimal subtotal, discount, and total to two decimals", () => {
    const catalogStore = useCatalogStore();
    catalogStore.exams = [
      { ...exams[0], price: 19.99 },
      { ...exams[1], price: 10.01 },
      { ...exams[2], price: 20.05 },
    ];

    const cartStore = useCartStore();

    cartStore.addToCart("basic-1");
    cartStore.addToCart("basic-2");
    cartStore.addToCart("basic-3");

    expect(cartStore.subtotal).toBe(50.05);
    expect(cartStore.discountAmount).toBe(5.01);
    expect(cartStore.total).toBe(45.04);
  });

  it("clears the cart and removes invalid JSON from localStorage", () => {
    localStorage.setItem("alab-cart", "invalid-json");

    const cartStore = useCartStore();
    cartStore.loadFromStorage();

    expect(cartStore.items).toEqual([]);
    expect(localStorage.getItem("alab-cart")).toBeNull();
  });

  it("keeps valid persisted items and discards invalid entries", () => {
    localStorage.setItem(
      "alab-cart",
      JSON.stringify([
        { examId: "basic-1", quantity: 2 },
        { examId: "basic-2", quantity: 0 },
        { examId: "basic-3", quantity: -1 },
        { examId: "basic-4", quantity: "2" },
        { examId: "basic-4", quantity: 1.5 },
        { examId: "missing-exam", quantity: 1 },
      ]),
    );

    const cartStore = useCartStore();
    cartStore.loadFromStorage();

    expect(cartStore.items).toEqual([{ examId: "basic-1", quantity: 2 }]);
  });

  it("removes unknown exam IDs when restoring the cart", () => {
    localStorage.setItem(
      "alab-cart",
      JSON.stringify([
        { examId: "basic-1", quantity: 1 },
        { examId: "missing-exam", quantity: 2 },
      ]),
    );

    const cartStore = useCartStore();
    cartStore.loadFromStorage();

    expect(cartStore.items).toEqual([{ examId: "basic-1", quantity: 1 }]);
  });
});

describe("catalog loading and filtering", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("does not apply price filtering for an invalid range", () => {
    const examsRef = ref(exams);
    const { minPrice, maxPrice, filteredExams } = useCatalogSearch(examsRef);

    minPrice.value = 100;
    maxPrice.value = 10;

    expect(filteredExams.value).toHaveLength(exams.length);
  });

  it("skips loading when the catalog URL is already loaded", async () => {
    const catalogStore = useCatalogStore();
    const url = "http://localhost:3000/exams.json";
    catalogStore.exams = exams;
    catalogStore.loadedUrl = url;

    await catalogStore.loadExams(url);

    expect(catalogStore.exams).toEqual(exams);
    expect(catalogStore.isLoading).toBe(false);
  });
});
