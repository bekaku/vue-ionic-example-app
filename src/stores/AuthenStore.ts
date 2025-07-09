import appAxios from '@/plugins/axios';
import type { UserDto } from '@/types/models';
import { defineStore } from 'pinia';
// import router from '@/router';
import { useAppStorage } from '@/composables/useAppStorage';
import { useConfig } from '@/composables/useConfig';
import { computed, ref } from 'vue';
import { useAppStore } from './appStore';
import type { LoginedProfileItem } from '@/types/common';

export const useAuthenStore = defineStore('authenStore', () => {
  const {
    getCurrentUserToken,
  } = useAppStorage()
  const appStore = useAppStore();
  const auth = ref<UserDto | null>();
   const loginedItems = ref<LoginedProfileItem[]>([]);
  const refreshTokenTimeout = ref<any>(null);
  const refreshTokenTimeoutNo = ref<number>(0);
  const sessionExpired = ref<boolean>(false);
  const initial = ref<boolean>(false);
  const { isDevMode } = useConfig();
  const devMode = isDevMode();

  const tokenKey = computed(() => auth.value?.token)
  const loginedCover = computed(() => auth.value && auth.value.cover?.image ? auth.value.cover?.image : '')
  const loginedAvatar = computed(() => auth.value?.avatar?.image)
  const loginedDisplay = computed(() => auth.value?.username)

  const initialAuthData = async (): Promise<number> => {
    const status = await initialAuthDataProcess();
    return new Promise((resolve /* reject */) => {
      resolve(status);
    });
  }
  const initialAuthDataProcess = async (): Promise<number> => {
    const currentToken = await getCurrentUserToken();
    // const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
    if (currentToken && currentToken?.authenticationToken) {
      appAxios.defaults.headers.Authorization = `Bearer ${currentToken.authenticationToken}`;
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
    const setLoginedItems = (items: LoginedProfileItem[]) => {
    loginedItems.value = items;
  }
  const logout = () => {
    auth.value = undefined;
  }
  return {
    auth,
    loginedItems,
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
    initialAuthDataProcess,
    setLoginedItems
  }
});
