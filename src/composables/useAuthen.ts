import AuthenService from '@/api/AuthenService';
import {
  DeviceIdAtt,
  FcmTokenKey
} from '@/libs/constant';
import { useAuthenStore } from '@/stores/authenStore';
import type { RefreshTokenResponse, UserDto } from '@/types/models';
import {
  loadStorage,
  saveStorage
} from '@/utils/storageUtil';
import { useAppStorage } from './useAppStorage';
import { useBase } from './useBase';
import { useCache } from './useCache';
import { useDevice } from './useDevice';
import { useLang } from './useLang';
import { useNotification } from './useNotification';
import { useTheme } from './useTheme';
import { useMenu } from './useMenu';

export const useAuthen = () => {
  const { setAuthToken, removeAuthToken, getCurrentUserToken, switchUser } = useAppStorage();
  const authenStore = useAuthenStore();
  const { appConfirm, appLoading, } = useBase();
  const { getPlatformType, getDeviceId, setSysncActiveStatus } = useDevice()
  const { logoutClear } = useCache();
  const { userUnSubscribeFcm } = useNotification();
  const { singin, singoutToServer, } = AuthenService();
  const { addListeners, onRefreshFcmToken } = useNotification();
  const { t, initLang } = useLang();
  const { initTheme } = useTheme();
  const { initialAppNav } = useMenu();
  const initAuthen = async (): Promise<UserDto | null | undefined> => {
    const { getCurrentUserToken } = useAppStorage()
    const currentToken = await getCurrentUserToken();
    // const jwtKey = await loadStorage<string>(AppAuthTokenKey);
    if (currentToken && currentToken.authenticationToken) {
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
  const setAuthen = (auth: UserDto | null) => {
    if (auth != null) {
      authenStore.setAuthen(auth);
    }
  };
  const singinProcess = async (emailOrUsername: string, password: string): Promise<RefreshTokenResponse | null> => {
    const deviceId = await getDeviceId()
    await saveStorage(DeviceIdAtt, deviceId)
    const platform = await getPlatformType()
    const fcmToken = await loadStorage<string>(FcmTokenKey)
    const response = await singin({
      emailOrUsername,
      password,
      loginFrom: platform,
      fcmToken,
      deviceId: deviceId || null,
    })
    if (response && response.authenticationToken) {
      await setAuthToken(response)
      setSysncActiveStatus()
    }

    return new Promise((resolve) => {
      resolve(response);
    });
  }
  const signOut = async () => {
    const conf = await appConfirm(t('app.monogram'), t('helper.logoutConfirm'));
    if (conf) {
      const loading: any = await appLoading();
      loading.present();
      // await unregisterNotifications();
      if (authenStore.auth?.id) {
        await userUnSubscribeFcm(authenStore.auth?.id, false, false);
      }
      const currentToken = await getCurrentUserToken();
      await logoutToServer(currentToken?.refreshToken || null);
      loading.dismiss();
      await destroyAuthDataAndRedirect();
    }
  };
  const logoutToServer = async (
    refeshTokenKey: string | null,
    mail: string | undefined = undefined
  ) => {
    if (!refeshTokenKey && !mail) {
      return new Promise((resolve) => {
        resolve(true);
      });
    }

    await singoutToServer({
      refreshToken: refeshTokenKey,
      email: mail || ''
    });
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const destroyAuthData = async () => {
    await removeAuthToken();
    await logoutClear();
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const destroyAuthDataAndRedirect = async (
    forceRedirectToLoginPage = true
  ) => {
    await destroyAuthData();
    authenStore.logout();
    if (forceRedirectToLoginPage) {
      window.location.replace('/');
      // window.location.replace('/auth/login');
      // appNavigateTo('/auth/login', true);
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const onSwithUser = async (userId: number | string) => {
    if (!userId) {
      return;
    }
    await logoutClear();
    await switchUser(userId)
  }
  return {
    initThemeLanguge,
    initAuthen,
    signOut,
    setAuthen,
    destroyAuthDataAndRedirect,
    logoutToServer,
    singinProcess,
    onSwithUser
  };
};
