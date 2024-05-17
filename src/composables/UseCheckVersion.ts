import { AppVersionDto, PlatformType } from '@/types/Models';
import UtilService from '@/api/UtilService';
import { isAppException } from '@/utils/AppUtil';
import { useConfig } from './UseConfig';
import { useDevice } from './UseDevice';
import { ref } from 'vue';
export const useCheckVersion = () => {
  const { getConfigPublic } = useConfig();
  const { getPlatformType } = useDevice();
  const { getAppVersion } = UtilService();
  const platForm = ref<PlatformType>();
  const appVersion = ref<AppVersionDto>();
  const userVersion = ref<any>(getConfigPublic('appVersion'));
  const haveVersionUpdate = ref(false);

  const fetchVersion = async () => {
    const res = await getAppVersion();
    if (res) {
      appVersion.value = res;
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const checkVersion = async () => {
    await fetchVersion();
    platForm.value = await getPlatformType();
    if (appVersion.value && !appVersion.value.puaseUpdate) {
      if (
        platForm.value == 'ANDROID' &&
        userVersion.value != appVersion.value.appVersionAndroid
      ) {
        haveVersionUpdate.value = true;
      } else if (
        platForm.value == 'IOS' &&
        userVersion.value != appVersion.value.appVersionIos
      ) {
        haveVersionUpdate.value = true;
      }
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  return {
    checkVersion,
    appVersion,
    haveVersionUpdate,
    userVersion,
    platForm
  };
};
