import { defineStore } from 'pinia';
export const useFourceReloadStore = defineStore('fourceReloadStore', {
  state: () => ({
    companyTheme: false as boolean,
    companyThemeLeader: false as boolean
  }),
  getters: {},
  actions: {}
});
