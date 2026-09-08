<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { ExamCategory } from "~/types";

const { t } = useI18n();

const model = defineModel<ExamCategory[]>({ required: true });

const fastingOnly = defineModel<boolean>("fastingOnly", {
  required: true,
});

const fastResultsOnly = defineModel<boolean>("fastResultsOnly", {
  required: true,
});

const categories: ExamCategory[] = ["Basic", "Advanced", "Specialized"];

const toggleCategory = (category: ExamCategory) => {
  if (model.value.includes(category)) {
    model.value = model.value.filter((item) => item !== category);
    return;
  }

  model.value = [...model.value, category];
};
</script>

<template>
  <fieldset>
    <legend>
      {{ t("CatalogCategoryFilter.title") }}
    </legend>

    <div>
      <label v-for="category in categories" :key="category">
        <input
          type="checkbox"
          :name="`category-${category}`"
          :value="category"
          :checked="model.includes(category)"
          @change="toggleCategory(category)"
        />

        {{ t(`CatalogCategoryFilter.${category}`) }}
      </label>
    </div>

    <label>
      <input v-model="fastingOnly" type="checkbox" name="fasting-only" />

      {{ t("CatalogCategoryFilter.fastingOnly") }}
    </label>

    <label>
      <input
        v-model="fastResultsOnly"
        type="checkbox"
        name="fast-results-only"
      />

      {{ t("CatalogCategoryFilter.fastResultsOnly") }}
    </label>
  </fieldset>
</template>

<style scoped>
input:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
