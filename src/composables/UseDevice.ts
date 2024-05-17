import { Device } from '@capacitor/device';
import { OsPlatForm } from '@/types/Common';
import { IPlatForm, PlatformType } from '@/types/Models';
import { isPlatform, getPlatforms } from '@ionic/vue';

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

  return {
    isIOS,
    isAppPlatfrom,
    getAppPlatForm,
    getPlatFormId,
    getDeviceInfo,
    isWeb,
    getPlatformType,
    getDeviceId
  };
};
