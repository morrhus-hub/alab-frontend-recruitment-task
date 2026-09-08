import { defineStore } from "pinia";
import type { Exam } from "~/types";

const pendingLoads = new WeakMap<object, Map<string, Promise<Exam[]>>>();

export const useCatalogStore = defineStore("catalog", {
  state: () => ({
    exams: [] as Exam[],
    loadedUrl: null as string | null,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async loadExams(url: string) {
      if (this.loadedUrl === url) {
        return;
      }

      this.isLoading = true;
      this.error = null;

      let storeLoads = pendingLoads.get(this);

      if (!storeLoads) {
        storeLoads = new Map();
        pendingLoads.set(this, storeLoads);
      }

      let pendingLoad = storeLoads.get(url);

      if (!pendingLoad) {
        pendingLoad = $fetch<Exam[]>(url);
        storeLoads.set(url, pendingLoad);
      }

      try {
        this.exams = await pendingLoad;
        this.loadedUrl = url;
      } catch {
        this.exams = [];
        this.loadedUrl = null;
        this.error = "exam_load_failed";
      } finally {
        if (storeLoads.get(url) === pendingLoad) {
          storeLoads.delete(url);
        }

        this.isLoading = false;
      }
    },
  },
});
