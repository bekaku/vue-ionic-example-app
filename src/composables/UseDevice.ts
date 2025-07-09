import { Device } from '@capacitor/device';
import type { OsPlatForm } from '@/types/common';
import type { IPlatForm, PlatformType } from '@/types/models';
import { isPlatform, getPlatforms } from '@ionic/vue';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import { LatestSyncActiveStatusKey } from '@/libs/constant';
import { getCurrentTimestamp, getDateDiffMinutes } from '@/utils/dateUtil';
import { DeviceSecurityDetect } from '@capacitor-community/device-security-detect';
import { SafeArea } from 'capacitor-plugin-safe-area'
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
  const isRootDetected = async (): Promise<boolean> => {
    const web = await isWeb();
    if (web) {
      return new Promise(resolve => resolve(false));
    }
    const { value } = await DeviceSecurityDetect.isJailBreakOrRooted();
    return new Promise(resolve => resolve(value));
  }
   const setSafeArea = () => {
    // document.body.setAttribute('safe-area', 'edge-to-edge');
    SafeArea.getSafeAreaInsets().then(async (data) => {
      const { insets } = data
      const info = await getDeviceInfo();
      // document.body.style.setProperty('--ion-safe-area-top', `${insets.top}px`)
      // document.body.style.setProperty('--ion-safe-area-right', `${insets.right}px`,)
      // document.body.style.setProperty('--ion-safe-area-bottom', `${insets.bottom}px`,)
      // document.body.style.setProperty('--ion-safe-area-left', `${insets.left}px`)
      if (info.operatingSystem=='android' && info?.androidSDKVersion && info?.androidSDKVersion >= 35) {
        document.body.setAttribute('safe-area', 'edge-to-edge');
        document.documentElement.style.setProperty('--app-safe-area-top', `${insets.top}px`)
        document.documentElement.style.setProperty('--app-safe-area-right', `${insets.right}px`)
        document.documentElement.style.setProperty('--app-safe-area-bottom', `${insets.bottom}px`)
        document.documentElement.style.setProperty('--app-safe-area-left', `${insets.left}px`)
      }
      // document.documentElement.style.setProperty(
      //   '--ion-safe-area-top',
      //   `${insets.top}px`,
      // )
      // document.documentElement.style.setProperty(
      //   '--ion-safe-area-right',
      //   `${insets.right}px`,
      // )
      // document.documentElement.style.setProperty(
      //   '--ion-safe-area-bottom',
      //   `${insets.bottom}px`,
      // )
      // document.documentElement.style.setProperty(
      //   '--ion-safe-area-left',
      //   `${insets.left}px`,
      // )
      // safeAreaStyle.value = {
      //   paddingTop: `${insets.top}px`,
      //   paddingBottom: `${insets.bottom}px`,
      //   paddingLeft: `${insets.left}px`,
      //   paddingRight: `${insets.right}px`,
      //   border: '1px solid red',
      // }
    })
  }
  return {
    isIOS,
    isAppPlatfrom,
    getAppPlatForm,
    getPlatFormId,
    getDeviceInfo,
    isWeb,
    getPlatformType,
    getDeviceId,
    canSyncActiveStatusToServer,
    isRootDetected,
    setSafeArea,
    setSysncActiveStatus
  };
};
