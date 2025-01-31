import { useAuthenStore } from '@/stores/authenStore';
import type { UserDto } from '@/types/models';
import { AppAuthTokenKey, FcmTokenKey } from '@/libs/constant';
import { loadStorage } from '@/utils/storageUtil';
import { useNotification } from './useNotification';
import { useLang } from '@/composables/useLang';
import { useTheme } from './useTheme';
import { useMenu } from './useMenu';

export const useInitApp = () => {
  const authenStore = useAuthenStore();
  const { addListeners, onRefreshFcmToken } = useNotification();
  const { initLang } = useLang();
  const { initTheme } = useTheme();
  const { initialAppNav } = useMenu();
  const initAuthen = async (): Promise<UserDto | null | undefined> => {
    const jwtKey = await loadStorage<string>(AppAuthTokenKey);
    if (jwtKey) {
      if (!authenStore.auth) {
        await authenStore.initialAuthDataProcess();
      }
      if (authenStore.auth) {
        manageNotificationToken(authenStore.auth);
        await initialAppNav();
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
