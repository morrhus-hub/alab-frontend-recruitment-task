<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { SortOption } from "~/types";

const model = defineModel<SortOption>({ required: true });

const { t } = useI18n();
</script>

<template>
  <div>
    <label for="catalog-sort">
      {{ t("CatalogSort.label") }}
    </label>

    <select id="catalog-sort" v-model="model" name="catalog-sort">
      <option value="priceAsc">
        {{ t("CatalogSort.priceAsc") }}
      </option>

      <option value="priceDesc">
        {{ t("CatalogSort.priceDesc") }}
      </option>

      <option value="popularity">
        {{ t("CatalogSort.popularity") }}
      </option>

      <option value="resultTime">
        {{ t("CatalogSort.resultTime") }}
      </option>
    </select>
  </div>
</template>

<style scoped>
select:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
