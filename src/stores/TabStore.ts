import { defineStore } from 'pinia';
import { TabsName } from '@/utils/Constant';
export const useTabStore = defineStore('tabStore', {
  state: () => ({
    currentTab: TabsName.HOME,
    countClick: 0
  }),
  getters: {},
  actions: {
    setCurrentTab(name: string) {
      this.currentTab = name;
    },
    setCountClick(no: number) {
      this.countClick = no;
    },
    increaseCount() {
      this.countClick++;
    }
  }
});
