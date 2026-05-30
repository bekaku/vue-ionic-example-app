import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getCurrentTimestamp, getDateDiffMinutes } from '@/utils/dateUtil';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import { LatestDeviceActiveKey } from '@/libs/constant';
export const useDeviceStore = defineStore('deviceStore', () => {
  const isActive = ref(false);
  const deviceFourceReloadData = ref(false);
  const setAppStateChange = async (state: boolean) => {
  const latestDeviceActive = await loadStorage<number>(LatestDeviceActiveKey, true);
    isActive.value = state;
    const currentTimeTamp = getCurrentTimestamp();
    if (state) {
      const diffminutes = getDateDiffMinutes(
        Number.parseInt(latestDeviceActive + '') || 0,
        currentTimeTamp
      );
      if (diffminutes > 0 && diffminutes >= 15) {
        deviceFourceReloadData.value = true;
      }
    } else {
      await saveStorage(LatestDeviceActiveKey, currentTimeTamp, true);
      deviceFourceReloadData.value = false;
    }
  };
  return {
    isActive,
    setAppStateChange,
    deviceFourceReloadData
  };
});
