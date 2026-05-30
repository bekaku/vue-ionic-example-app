import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useFourceReloadStore = defineStore('fourceReloadStore', () => {
  const companyTheme = ref<boolean>(false);
  const companyThemeLeader = ref<boolean>(false);
  return {
    companyTheme,
    companyThemeLeader
  }
});
