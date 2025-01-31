import { Device } from '@capacitor/device';
import type { OsPlatForm } from '@/types/common';
import type { IPlatForm, PlatformType } from '@/types/models';
import { isPlatform, getPlatforms } from '@ionic/vue';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import { LatestSyncActiveStatusKey } from '@/libs/constant';
import { getCurrentTimestamp, getDateDiffMinutes } from '@/utils/dateUtil';

export const useDevice = () => {
  const isIOS = async (): Promise<boolean> => {
    const info = await Device.getInfo();
    return new Promise((resolve) => {
      resolve(info.operatingSystem === 'ios');
    });
  };

  const isAppPlatfrom = (os: OsPlatForm) => {
    return isPlatform(os);
  };
  const getAppPlatForm = () => {
    return getPlatforms();
  };
  const getPlatFormId = (): IPlatForm => {
    return isPlatform('ios') ? 2 : 1;
  };
  const getDeviceInfo = async (): Promise<any> => {
    const info = await Device.getInfo();
    return new Promise((resolve) => {
      resolve(info);
    });
  };
  const getDeviceId = async (): Promise<string | undefined> => {
    const ID = await Device.getId();
    return new Promise((resolve) => {
      resolve(ID ? ID.identifier : undefined);
    });
  };
  const isWeb = async (): Promise<boolean> => {
    const info = await Device.getInfo();
    return new Promise((resolve) => {
      resolve(info.platform == 'web');
    });
  };

  const getPlatformType = async (): Promise<PlatformType> => {
    const isIos = await isIOS();
    return new Promise((resolve) => {
      resolve(isIos ? 'IOS' : 'ANDROID');
    });
  };
  const canSyncActiveStatusToServer = async (): Promise<boolean> => {
    const latestSyncActiveStatus = await loadStorage<number>(LatestSyncActiveStatusKey, false);
    const currentTimeTamp = getCurrentTimestamp();
    let diffminutes;
    if (latestSyncActiveStatus && latestSyncActiveStatus > 0) {
      diffminutes = getDateDiffMinutes(latestSyncActiveStatus,
        currentTimeTamp
      );
    } else {
      await setSysncActiveStatus();
      return new Promise(resolve => resolve(true));
    }
    if (diffminutes && diffminutes >= 5) {
      await setSysncActiveStatus();
      return new Promise(resolve => resolve(true));
    }
    return new Promise(resolve => resolve(false));
  };
  const setSysncActiveStatus = async () => {
    await saveStorage(LatestSyncActiveStatusKey, getCurrentTimestamp(), false);
    return new Promise(resolve => resolve(true));
  };
  return {
    isIOS,
    isAppPlatfrom,
    getAppPlatForm,
    getPlatFormId,
    getDeviceInfo,
    isWeb,
    getPlatformType,
    getDeviceId,
    canSyncActiveStatusToServer
  };
};
