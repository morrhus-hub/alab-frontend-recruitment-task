<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { CartItem, Exam } from "~/types";
import { useCartStore } from "~/features/cart/stores/cart";
import { useCatalogStore } from "~/features/catalog/stores/catalog";
import { formatPrice } from "~/shared/utils/formatPrice";
import { useAnnouncementQueue } from "~/features/cart/composables/useAnnouncementQueue";

const { t } = useI18n();

const cartStore = useCartStore();
const catalogStore = useCatalogStore();

onMounted(() => {
  cartStore.loadFromStorage();
});

const requestURL = useRequestURL();
await catalogStore.loadExams(`${requestURL.origin}/exams.json`);

const exams = computed(() => catalogStore.exams);

type CartItemWithExam = CartItem & { exam: Exam };

const isCartItemWithExam = (
  item: CartItemWithExam | null,
): item is CartItemWithExam => item !== null;

const cartItems = computed<CartItemWithExam[]>(() => {
  return cartStore.items
    .map((item) => {
      const exam = exams.value?.find((exam) => exam.id === item.examId);

      if (!exam) {
        return null;
      }

      return {
        ...item,
        exam,
      };
    })
    .filter(isCartItemWithExam);
});

const { message: cartMessage, announce } = useAnnouncementQueue();

const decreaseQuantity = (examId: string, quantity: number) => {
  cartStore.updateQuantity(examId, quantity - 1);
  announce(t("Cart.quantityDecreased"));
};

const increaseQuantity = (examId: string, quantity: number) => {
  cartStore.updateQuantity(examId, quantity + 1);
  announce(t("Cart.quantityIncreased"));
};

const removeItem = (examId: string) => {
  cartStore.removeFromCart(examId);
  announce(t("Cart.itemRemoved"));
};

const clearCart = () => {
  cartStore.clearCart();
  announce(t("Cart.cartCleared"));
};
</script>

<template>
  <main aria-labelledby="cart-title">
    <header>
      <h1 id="cart-title">
        {{ t("Cart.title") }}
      </h1>

      <NuxtLink to="/">
        {{ t("Cart.backToCatalog") }}
      </NuxtLink>
    </header>

    <p
      v-if="cartMessage"
      class="cart-message"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ cartMessage }}
    </p>

    <p v-if="catalogStore.isLoading" role="status">
      {{ t("Catalog.loading") }}
    </p>

    <p v-else-if="catalogStore.error" role="alert">
      {{ t("Catalog.error") }}
    </p>

    <p v-else-if="cartItems.length === 0">
      {{ t("Cart.empty") }}
    </p>

    <template v-else>
      <section :aria-label="t('Cart.itemsLabel')">
        <ul>
          <li v-for="item in cartItems" :key="item.examId">
            <article :aria-labelledby="`cart-item-${item.examId}`">
              <h2 :id="`cart-item-${item.examId}`">
                {{ item.exam.name }}
              </h2>

              <p>
                {{ formatPrice(item.exam.price) }}
              </p>

              <div>
                <button
                  type="button"
                  :name="`decrease-${item.examId}`"
                  :aria-label="
                    t('Cart.decreaseQuantityFor', {
                      name: item.exam.name,
                    })
                  "
                  @click="decreaseQuantity(item.examId, item.quantity)"
                >
                  −
                </button>

                <span>
                  {{ item.quantity }}
                </span>

                <button
                  type="button"
                  :name="`increase-${item.examId}`"
                  :aria-label="
                    t('Cart.increaseQuantityFor', {
                      name: item.exam.name,
                    })
                  "
                  @click="increaseQuantity(item.examId, item.quantity)"
                >
                  +
                </button>
              </div>

              <p>
                {{ formatPrice(item.exam.price * item.quantity) }}
              </p>

              <button
                type="button"
                :name="`remove-${item.examId}`"
                :aria-label="
                  t('Cart.removeItemAria', {
                    name: item.exam.name,
                  })
                "
                @click="removeItem(item.examId)"
              >
                {{ t("Cart.remove") }}
              </button>
            </article>
          </li>
        </ul>
      </section>

      <section :aria-label="t('Cart.summaryLabel')">
        <p>
          {{ t("Cart.subtotal") }}:
          {{ formatPrice(cartStore.subtotal) }}
        </p>

        <p>
          {{ t("Cart.discount") }}: -{{ formatPrice(cartStore.discountAmount) }}
        </p>

        <p>
          <strong>
            {{ t("Cart.total") }}:
            {{ formatPrice(cartStore.total) }}
          </strong>
        </p>
      </section>

      <button type="button" name="clear-cart" @click="clearCart">
        {{ t("Cart.clear") }}
      </button>
    </template>
  </main>
</template>

<style scoped>
button:focus-visible,
a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

ul {
  display: grid;
  gap: 16px;
  padding: 0;
  list-style: none;
}

article {
  padding: 20px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  background: #fff;
}

article h2 {
  margin-top: 0;
}

article > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

section[aria-label] {
  margin-bottom: 24px;
}

button {
  cursor: pointer;
}

.cart-message {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  min-height: 30px;
  padding: 8px;
  box-sizing: border-box;
  background: green;
  text-align: center;
  color: white;
}
</style>
