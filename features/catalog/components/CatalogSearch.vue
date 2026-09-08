<script setup lang="ts">
import { useI18n } from "vue-i18n";

const model = defineModel<string>({ required: true });

const { t } = useI18n();
</script>

<template>
  <form role="search" @submit.prevent>
    <label for="exam-search">
      {{ t("Catalog.searchLabel") }}
    </label>

    <input
      id="exam-search"
      v-model="model"
      name="exam-search"
      type="search"
      :placeholder="t('Catalog.searchPlaceholder')"
      autocomplete="off"
    />
  </form>
</template>

<style scoped>
input:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
