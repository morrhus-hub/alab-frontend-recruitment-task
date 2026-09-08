import type { Exam, ExamCategory, SortOption } from "~/types";

export const useCatalogSearch = (exams: Ref<Exam[] | null>) => {
  const search = ref("");
  const selectedCategories = ref<ExamCategory[]>([]);
  const fastingOnly = ref(false);
  const fastResultsOnly = ref(false);
  const sortBy = ref<SortOption>("popularity");
  const minPrice = ref<number | null>(null);
  const maxPrice = ref<number | null>(null);

  const filteredExams = computed(() => {
    const query = search.value.trim().toLowerCase();
    const hasInvalidPriceRange =
      minPrice.value !== null &&
      maxPrice.value !== null &&
      minPrice.value > maxPrice.value;

    const filtered = (exams.value ?? []).filter((exam) => {
      const matchesSearch =
        !query ||
        exam.name.toLowerCase().includes(query) ||
        exam.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategories.value.length === 0 ||
        selectedCategories.value.includes(exam.category);

      const matchesFasting = !fastingOnly.value || exam.fastingRequired;

      const matchesFastResults =
        !fastResultsOnly.value || exam.resultTimeHours <= 24;

      const matchesMinPrice =
        hasInvalidPriceRange ||
        minPrice.value === null ||
        exam.price >= minPrice.value;

      const matchesMaxPrice =
        hasInvalidPriceRange ||
        maxPrice.value === null ||
        exam.price <= maxPrice.value;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesFasting &&
        matchesFastResults &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy.value) {
        case "priceAsc":
          return a.price - b.price;

        case "priceDesc":
          return b.price - a.price;

        case "resultTime":
          return a.resultTimeHours - b.resultTimeHours;

        case "popularity":
        default:
          return b.popularity - a.popularity;
      }
    });
  });

  return {
    search,
    selectedCategories,
    fastingOnly,
    fastResultsOnly,
    sortBy,
    filteredExams,
    minPrice,
    maxPrice,
  };
};
