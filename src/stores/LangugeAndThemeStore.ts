import { defineStore } from 'pinia';
export const useLangugeAndThemeStore = defineStore('langugeAndTheme', {
  state: () => ({
    locale: '',
    theme: '',
    themeSetting: '',
    leftDrawerOpen: true,
  }),
  getters: {
    isDark: (state) => state.theme === 'dark',
  },
  actions: {
    setLocale(iso: string) {
      this.locale = iso;
    },
    setTheme(theme: string) {
      this.theme = theme;
    },
    setThemeSetting(themeSetting: string) {
      this.themeSetting = themeSetting;
    },
    setLeftDrawer(open: boolean) {
      this.leftDrawerOpen = open;
    },
  },
});
