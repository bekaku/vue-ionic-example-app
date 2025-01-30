import { useAuthenStore } from '@/stores/AuthenStore';
import type { UserDto } from '@/types/Models';
import { AppAuthTokenKey, FcmTokenKey } from '@/utils/Constant';
import { loadStorage } from '@/utils/StorageUtil';
import { useNotification } from './UseNotification';
import { useLang } from '@/composables/UseLang';
import { useTheme } from './UseTheme';

export const useInitApp = () => {
  const authenStore = useAuthenStore();
  const { addListeners, onRefreshFcmToken } = useNotification();
  const { initLang } = useLang();
  const { initTheme } = useTheme();
  const initAuthen = async (): Promise<UserDto | null | undefined> => {
    const jwtKey = await loadStorage<string>(AppAuthTokenKey);
    if (jwtKey) {
      if (!authenStore.auth) {
        await authenStore.initialAuthDataProcess();
      }
      if (authenStore.auth) {
        manageNotificationToken(authenStore.auth);
      }
      return new Promise((resolve) => {
        resolve(authenStore.auth);
      });
    }
    return new Promise((resolve) => {
      resolve(null);
    });
  };
  const manageNotificationToken = async (user: UserDto) => {
    await addListeners('useInitAuthen/manageNotificationToken');
    const serverFcmToken = user.fcmToken;
    const fcmToken = await loadStorage<string>(FcmTokenKey);
    if (fcmToken && fcmToken != 'null' && serverFcmToken && serverFcmToken != 'null') {
      if (fcmToken != serverFcmToken) {
        onRefreshFcmToken();
      }
    }
  };
  const initThemeLanguge = () => {
    initLang();
    initTheme();
  }
  const canLoadFrontendLayout = () => {
    return true;
  };
  return {
    initAuthen,
    initThemeLanguge,
    canLoadFrontendLayout
  };
};
