import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCache } from '@/composables/UseCache';
import { getCurrentTimestamp, getDateDiffMinutes } from '@/utils/DateUtil';
export const useDeviceStore = defineStore('deviceStore', () => {
  const isActive = ref(false);
  const deviceFourceReloadData = ref(false);
  const { latestDeviceActive } = useCache();
  const setAppStateChange = (state: boolean) => {
    isActive.value = state;
    if (state) {
      const currentTimeTamp = getCurrentTimestamp();
      const diffminutes = getDateDiffMinutes(
        latestDeviceActive.value,
        currentTimeTamp
      );
      if (diffminutes >= 30) {
        deviceFourceReloadData.value = true;
      }
    } else {
      latestDeviceActive.value = getCurrentTimestamp();
      deviceFourceReloadData.value = false;
    }
  };
  return {
    isActive,
    setAppStateChange,
    deviceFourceReloadData
  };
});
