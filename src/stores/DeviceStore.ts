import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getCurrentTimestamp, getDateDiffMinutes } from '@/utils/dateUtil';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import { LatestDeviceActiveKey } from '@/libs/constant';
export const useDeviceStore = defineStore('deviceStore', () => {
  const isActive = ref(false);
  const deviceFourceReloadData = ref(false);
  const setAppStateChange =async (state: boolean) => {
    const latestDeviceActive = await loadStorage<number>(LatestDeviceActiveKey, false);
    isActive.value = state;
    if (state) {
      const currentTimeTamp = getCurrentTimestamp();
      const diffminutes = getDateDiffMinutes(
        latestDeviceActive || 0,
        currentTimeTamp
      );
      if (diffminutes >= 30) {
        deviceFourceReloadData.value = true;
      }
    } else {
      await saveStorage(LatestDeviceActiveKey, getCurrentTimestamp());
      deviceFourceReloadData.value = false;
    }
  };
  return {
    isActive,
    setAppStateChange,
    deviceFourceReloadData
  };
});
