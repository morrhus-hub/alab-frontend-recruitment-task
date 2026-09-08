import { createI18n } from "vue-i18n";
import pl from "~/i18n/locales/pl.json";

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: "pl",
    fallbackLocale: "pl",
    messages: {
      pl,
    },
  });

  nuxtApp.vueApp.use(i18n);
});
