import AuthenService from '@/api/AuthenService';
import { useAuthenStore } from '@/stores/authenStore';
import type { RefreshTokenResponse, UserDto } from '@/types/models';
import { cordovaClearCach } from '@/utils/appUtil';
import {
  AppAuthRefeshTokenKey,
  AppAuthTokenCreatedKey,
  AppAuthTokenExpireKey,
  AppAuthTokenKey
} from '@/libs/constant';
import {
  loadStorage,
  removeStorage,
  saveStorage
} from '@/utils/storageUtil';
import { useBase } from './useBase';
import { useCache } from './useCache';
import { useLang } from './useLang';
import { useNotification } from './useNotification';

export const useAuthen = () => {
  const authenStore = useAuthenStore();
  const { appConfirm, appLoading, } = useBase();
  const { t } = useLang();
  const { logoutClear } = useCache();
  const { userUnSubscribeFcm, unregisterNotifications } = useNotification();
  const { singoutToServer, } = AuthenService();

  const setAuthen = (auth: UserDto | null) => {
    if (auth != null) {
      authenStore.setAuthen(auth);
    }
  };
  const setAuthenticationCookies = async (
    authResponse: RefreshTokenResponse
  ) => {
    // authTokenKey.value = authResponse.authenticationToken;
    // refeshTokenKey.value = authResponse.refreshToken;
    // authTokenExpireKey.value = authResponse.expiresAt;
    // authTokenCreatedKey.value = Date.now().toString();

    await saveStorage(AppAuthTokenKey, authResponse.authenticationToken);
    await saveStorage(AppAuthRefeshTokenKey, authResponse.refreshToken);
    await saveStorage(AppAuthTokenExpireKey, authResponse.expiresAt);
    await saveStorage(AppAuthTokenCreatedKey, Date.now().toString());
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const signOut = async () => {
    const conf = await appConfirm(t('app.monogram'), t('helper.logoutConfirm'));
    if (conf) {
      const loading: any = await appLoading();
      loading.present();
      await unregisterNotifications();
      if (authenStore.auth?.id) {
        await userUnSubscribeFcm(authenStore.auth?.id, false);
      }
      const jwtKey = await loadStorage<string>(AppAuthRefeshTokenKey);
      await logoutToServer(jwtKey);
      // await logoutToServer(refeshTokenKey.value);
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
      refreshToken: {
        refreshToken: refeshTokenKey,
        email: mail || ''
      }
    });
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const destroyAuthData = async () => {
    await removeStorage(AppAuthTokenKey);
    await removeStorage(AppAuthRefeshTokenKey);
    await removeStorage(AppAuthTokenExpireKey);
    await removeStorage(AppAuthTokenCreatedKey);
    await cordovaClearCach();
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
      window.location.replace('/auth/login');
      // appNavigateTo('/auth/login', true);
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  return {
    signOut,
    setAuthen,
    destroyAuthDataAndRedirect,
    setAuthenticationCookies,
    logoutToServer
  };
};
