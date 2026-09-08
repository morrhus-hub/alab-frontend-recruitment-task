<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CatalogSearch from "~/features/catalog/components/CatalogSearch.vue";
import CatalogCategoryFilter from "~/features/catalog/components/CatalogCategoryFilter.vue";
import CatalogPriceFilter from "~/features/catalog/components/CatalogPriceFilter.vue";
import CatalogSort from "~/features/catalog/components/CatalogSort.vue";
import ExamCard from "~/features/catalog/components/ExamCard.vue";
import { useCatalogSearch } from "~/features/catalog/composables/useCatalogSearch";
import { useCartStore } from "~/features/cart/stores/cart";
import { useCatalogStore } from "~/features/catalog/stores/catalog";
import { useAnnouncementQueue } from "~/features/cart/composables/useAnnouncementQueue";

const { t } = useI18n();

const requestURL = useRequestURL();

const catalogStore = useCatalogStore();
await catalogStore.loadExams(`${requestURL.origin}/exams.json`);

const exams = computed(() => catalogStore.exams);

const {
  search,
  selectedCategories,
  fastingOnly,
  fastResultsOnly,
  minPrice,
  maxPrice,
  sortBy,
  filteredExams,
} = useCatalogSearch(exams);

const cartStore = useCartStore();

onMounted(() => {
  cartStore.loadFromStorage();
});

const { message: cartMessage, announce } = useAnnouncementQueue();

const handleAddToCart = (examId: string) => {
  cartStore.addToCart(examId);
  announce(t("Catalog.addedToCart"));
};

const clearFilters = () => {
  search.value = "";
  selectedCategories.value = [];
  fastingOnly.value = false;
  fastResultsOnly.value = false;
  minPrice.value = null;
  maxPrice.value = null;
};
</script>

<template>
  <main class="catalog-page" aria-labelledby="catalog-title">
    <header class="catalog-header">
      <div>
        <h1 id="catalog-title">
          {{ t("Catalog.title") }}
        </h1>

        <p aria-live="polite" aria-atomic="true">
          {{ t("Catalog.examCount", { count: filteredExams.length }) }}
        </p>
      </div>

      <div class="cart-summary">
        <span>
          {{ t("Catalog.cartCount", { count: cartStore.itemCount }) }}
        </span>

        <NuxtLink class="cart-link" to="/cart">
          {{ t("Catalog.goToCart") }}
        </NuxtLink>
      </div>
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

    <p v-else-if="exams.length === 0" role="status">
      {{ t("Catalog.empty") }}
    </p>

    <section
      v-else
      class="filters-panel"
      :aria-label="t('Catalog.filtersLabel')"
    >
      <CatalogSearch v-model="search" />

      <CatalogCategoryFilter
        v-model="selectedCategories"
        v-model:fastingOnly="fastingOnly"
        v-model:fastResultsOnly="fastResultsOnly"
      />

      <CatalogPriceFilter
        v-model:minPrice="minPrice"
        v-model:maxPrice="maxPrice"
      />

      <CatalogSort v-model="sortBy" />
    </section>

    <section
      v-if="!catalogStore.isLoading && !catalogStore.error && exams.length > 0"
      class="results"
      :aria-label="t('Catalog.resultsLabel')"
    >
      <div v-if="filteredExams.length === 0" class="empty-results">
        <p role="status">
          {{ t("Catalog.noResults") }}
        </p>

        <button type="button" @click="clearFilters">
          {{ t("Catalog.clearFilters") }}
        </button>
      </div>

      <div v-else class="exam-grid">
        <ExamCard
          v-for="exam in filteredExams"
          :key="exam.id"
          :exam="exam"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.catalog-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
}

.catalog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 24px;
}

.catalog-header h1 {
  margin-top: 0;
}

.cart-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  white-space: nowrap;
}

.cart-link {
  font-weight: 600;
}

.cart-link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.filters-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 20px;
  padding: 20px;
  margin-bottom: 32px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  background: #fff;
}

.filters-panel :deep(fieldset) {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
}

.filters-panel :deep(fieldset > div) {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filters-panel :deep(label) {
  white-space: nowrap;
}

.filters-panel :deep(input),
.filters-panel :deep(select) {
  margin-left: 4px;
}

.results {
  margin-top: 24px;
}

.exam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.exam-grid :deep(article) {
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  background: #fff;
}

.exam-grid :deep(article h2) {
  margin-top: 0;
}

.exam-grid :deep(article button) {
  margin-top: 12px;
}

.empty-results {
  padding: 24px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  text-align: center;
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

@media (max-width: 800px) {
  .catalog-page {
    padding: 16px;
  }

  .catalog-header {
    flex-direction: column;
  }

  .cart-summary {
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
  }

  .filters-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-panel :deep(fieldset) {
    flex-wrap: wrap;
  }
}
</style>
