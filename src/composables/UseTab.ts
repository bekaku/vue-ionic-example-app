import { useTabStore } from '@/stores/TabStore';
import { watch } from 'vue';
import { useBase } from './UseBase';
export const useTab = (tabName: string) => {
  const tabStore = useTabStore();
  const { WeeScrollToTop } = useBase();
  // tabStore.setCurrentTab(tabName);
  watch(tabStore, (state) => {
    if (state.countClick > 1 && tabName == tabStore.currentTab) {
      WeeScrollToTop();
    }
  });
  return {};
};
