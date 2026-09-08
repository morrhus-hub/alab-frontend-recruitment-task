<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Exam } from "~/types";
import { formatPrice } from "~/shared/utils/formatPrice";

const props = defineProps<{
  exam: Exam;
}>();

const emit = defineEmits<{
  addToCart: [examId: string];
}>();

const { t } = useI18n();

const titleId = `exam-title-${props.exam.id}`;
</script>

<template>
  <article :aria-labelledby="titleId">
    <h2 :id="titleId">
      {{ props.exam.name }}
    </h2>

    <p>
      {{ props.exam.category }}
    </p>

    <p>
      {{ formatPrice(props.exam.price) }}
    </p>

    <div v-if="props.exam.fastingRequired || props.exam.resultTimeHours <= 24">
      <span v-if="props.exam.fastingRequired">
        {{ t("ExamCard.fastingRequired") }}
      </span>

      <span v-if="props.exam.resultTimeHours <= 24">
        {{ t("ExamCard.fastResults") }}
      </span>
    </div>

    <button
      type="button"
      name="add-to-cart"
      :aria-label="
        t('ExamCard.addToCartAria', {
          name: props.exam.name,
        })
      "
      @click="emit('addToCart', props.exam.id)"
    >
      {{ t("ExamCard.addToCart") }}
    </button>
  </article>
</template>

<style scoped>
button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
