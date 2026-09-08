<script setup lang="ts">
import { useI18n } from "vue-i18n";

const minPrice = defineModel<number | null>("minPrice", {
  required: true,
});

const maxPrice = defineModel<number | null>("maxPrice", {
  required: true,
});

const { t } = useI18n();

const invalidRange = computed(
  () =>
    minPrice.value !== null &&
    maxPrice.value !== null &&
    minPrice.value > maxPrice.value,
);

const updateMinPrice = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  minPrice.value = value === "" ? null : Number(value);
};

const updateMaxPrice = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  maxPrice.value = value === "" ? null : Number(value);
};
</script>

<template>
  <fieldset>
    <legend>
      {{ t("CatalogPriceFilter.title") }}
    </legend>

    <div>
      <label for="min-price">
        {{ t("CatalogPriceFilter.min") }}
      </label>

      <input
        id="min-price"
        name="min-price"
        type="number"
        min="0"
        inputmode="decimal"
        :aria-invalid="invalidRange"
        :aria-describedby="invalidRange ? 'price-range-error' : undefined"
        :value="minPrice ?? ''"
        @input="updateMinPrice"
      />
    </div>

    <div>
      <label for="max-price">
        {{ t("CatalogPriceFilter.max") }}
      </label>

      <input
        id="max-price"
        name="max-price"
        type="number"
        min="0"
        inputmode="decimal"
        :aria-invalid="invalidRange"
        :aria-describedby="invalidRange ? 'price-range-error' : undefined"
        :value="maxPrice ?? ''"
        @input="updateMaxPrice"
      />
    </div>

    <p v-if="invalidRange" id="price-range-error">
      {{ t("CatalogPriceFilter.invalidRange") }}
    </p>
  </fieldset>
</template>

<style scoped>
input:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
