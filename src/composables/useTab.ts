import { useTabStore } from '@/stores/tabStore';
import { watch } from 'vue';
import { useBase } from './useBase';
export const useTab = (tabName: string) => {
  const tabStore = useTabStore();
  const { appScrollToTop } = useBase();
  // tabStore.setCurrentTab(tabName);
  watch(tabStore, (state) => {
    if (state.countClick > 1 && tabName == tabStore.currentTab) {
      appScrollToTop();
    }
  });
  return {};
};
