import { defineStore } from 'pinia';
import { TabsName } from '@/libs/constant';
import { ref } from 'vue';
export const useTabStore = defineStore('tabStore', () => {
  const currentTab = ref<string>(TabsName.HOME)
  const countClick = ref<number>(0)
  const setCurrentTab = (name: string) => {
    currentTab.value = name;
  }
  const setCountClick = (no: number) => {
    countClick.value = no;
  }
  const increaseCount = () => {
    countClick.value++;
  }
  return {
    currentTab,
    countClick,
    setCurrentTab,
    setCountClick,
    increaseCount
  }
});
