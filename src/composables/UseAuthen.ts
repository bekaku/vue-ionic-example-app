import { useAuthenStore } from '@/stores/AuthenStore';
import AuthenService from '@/api/AuthenService';
import { RefreshTokenResponse, UserDto } from '@/types/Models';
import { useBase } from './UseBase';
import { useLang } from './UseLang';
import { useCache } from './UseCache';
import { useNotification } from './UseNotification';
import { cordovaClearCach } from '@/utils/AppUtil';
import {
  saveStorage,
  loadStorage,
  removeStorage
} from '@/utils/StorageUtil';
import {
  AppAuthRefeshTokenKey,
  AppAuthTokenCreatedKey,
  AppAuthTokenExpireKey,
  AppAuthTokenKey
} from '@/utils/Constant';

export const useAuthen = () => {
  const authenStore = useAuthenStore();
  const { WeeConfirm, WeeLoading, WeeGoTo } = useBase();
  const { t } = useLang();
  const { logoutClear } = useCache();
  const { userUnSubscribeFcm, unregisterNotifications } = useNotification();
  const { singoutToServer, refreshToken } = AuthenService();
  // const {
  //   authTokenKey,
  //   refeshTokenKey,
  //   authTokenExpireKey,
  //   authTokenCreatedKey
  // } = useCache();

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
    const conf = await WeeConfirm(t('app.monogram'), t('helper.logoutConfirm'));
    if (conf) {
      const loading: any = await WeeLoading();
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
    return;
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
        email: mail ? mail : ''
      }
    });
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const destroyAuthData = () => {
    return new Promise(async (resolve) => {
      await removeStorage(AppAuthTokenKey);
      await removeStorage(AppAuthRefeshTokenKey);
      await removeStorage(AppAuthTokenExpireKey);
      await removeStorage(AppAuthTokenCreatedKey);
      await cordovaClearCach();
      await logoutClear();
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
      // WeeGoTo('/auth/login', true);
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
