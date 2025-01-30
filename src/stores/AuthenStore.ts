import appAxios from '@/plugins/Axios';
import type { UserDto } from '@/types/Models';
import { canRefreshToken } from '@/utils/JwtUtil';
import { defineStore } from 'pinia';
// import router from '@/router';
import { useConfig } from '@/composables/UseConfig';
import type { RefeshTokenStatus } from '@/types/Common';
import { AppAuthRefeshTokenKey, AppAuthTokenKey, RefreshTokenProcessAtt } from '@/utils/Constant';
import { loadStorage, saveStorage } from '@/utils/StorageUtil';
import { computed, ref } from 'vue';
import { useAppStore } from './appStore';

export const useAuthenStore = defineStore('authenStore', () => {
  const appStore = useAppStore();
  const auth = ref<UserDto | null>();
  const refreshTokenTimeout = ref<any>(null);
  const refreshTokenTimeoutNo = ref<number>(0);
  const sessionExpired = ref<boolean>(false);
  const initial = ref<boolean>(false);
  const { getEnv, isDevMode } = useConfig();
  const devMode = isDevMode();

  const tokenKey = computed(() => auth.value?.token)
  const loginedCover = computed(() => auth.value && auth.value.cover?.image ? auth.value.cover?.image : '')
  const loginedAvatar = computed(() => auth.value?.avatar?.image)
  const loginedDisplay = computed(() => auth.value?.username)

  const refreshToken = async (): Promise<RefeshTokenStatus | undefined> => {
    await saveStorage(RefreshTokenProcessAtt, true);
    const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
    if (authTokenKey) {
      const refreshIt = await canRefreshToken(authTokenKey, devMode, 'authenStore > refreshToken');
      if (refreshIt) {
        const refreshRes = await refreshTokenProcess();
        return new Promise(resolve => resolve(refreshRes));
      }
    }
    await saveStorage(RefreshTokenProcessAtt, false);
    return new Promise(resolve => resolve({
      status: true,
      fourceLogout: false
    }));
  }
  const refreshTokenProcess = async (): Promise<RefeshTokenStatus | undefined> => {
    // const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
    const refreshToken = await loadStorage<string>(AppAuthRefeshTokenKey);
    // const localeVal = await loadStorage<string>(LocaleKey);
    // appAxios.defaults.headers.Authorization = `Bearer ${authTokenKey}`;
    // appAxios.defaults.headers['Accept-Language'] = localeVal;
    appAxios.defaults.baseURL = getEnv<string>('VITE_API_BASE_URL');
    appAxios.defaults.responseType = 'json';
    appAxios.defaults.headers['Content-Type'] = 'application/json';
    const response = await appAxios({
      method: 'POST',
      url: '/api/auth/refreshToken',
      data: {
        refreshToken: {
          refreshToken
        }
      }
    });
    if (devMode) {
      console.log(`api ${appAxios.defaults.baseURL}/api/auth/refreshToken`, response);
    }
    if (response && response.status == 200 && response.data && response.data.refreshToken && response.data.authenticationToken) {
      await saveStorage(AppAuthRefeshTokenKey, response.data.refreshToken);
      await saveStorage(AppAuthTokenKey, response.data.authenticationToken);
      sessionExpired.value = false;
      await saveStorage(RefreshTokenProcessAtt, false);
      return new Promise(resolve => resolve({
        status: true,
        token: response.data.authenticationToken,
        fourceLogout: false
      }));
    } else if (response && response.status == 401) {
      sessionExpired.value = true;
      // router.push('/auth/login');
      // router.replace('/auth/login');
      await saveStorage(RefreshTokenProcessAtt, false);
      return new Promise(resolve => resolve({
        status: false,
        fourceLogout: true
      }));
    }

    return new Promise(resolve => resolve(undefined));
  }
  const initialAuthData = async (): Promise<number> => {
    const status = await initialAuthDataProcess();
    return new Promise((resolve /* reject */) => {
      resolve(status);
    });
  }
  const initialAuthDataProcess = async (): Promise<number> => {
    const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
    if (authTokenKey) {
      appAxios.defaults.headers.Authorization = `Bearer ${authTokenKey}`;
      appAxios.defaults.responseType = 'json';
      appAxios.defaults.headers['Content-Type'] = 'application/json';
      const response = await appAxios({
        method: 'GET',
        url: '/api/user/currentUserData'
      });
      if (devMode) {
        console.log('initialAuthDataProcess > /api/user/currentUserData', response);
      }
      if (response && response.status == 200) {
        setAuthen(response.data);
        if (response.data.permissions && response.data.permissions.length > 0) {
          appStore.setPermissions(response.data.permissions);
        }
      }
      setInitial(true);
      return new Promise(resolve => resolve(response.status));
    }
    return new Promise(resolve => resolve(200));
  }
  const setInitial = (status: boolean) => {
    initial.value = status;
  }
  const setAuthen = (item: UserDto) => {
    auth.value = item;
  }
  const logout = () => {
    auth.value = undefined;
  }
  return {
    auth,
    refreshTokenTimeout,
    refreshTokenTimeoutNo,
    sessionExpired,
    initial,
    tokenKey,
    loginedCover,
    loginedAvatar,
    loginedDisplay,
    setAuthen,
    logout,
    initialAuthData,
    refreshTokenProcess,
    refreshToken,
    initialAuthDataProcess
  }
});
