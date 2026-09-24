import type { UserDto } from '@/types/models';
import { defineStore } from 'pinia';
// import router from '@/router';
import { useApi } from '@/composables/useApi';
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
  const api = useApi();
  const auth = ref<UserDto | null>();
  const alreadyFetchLoginedProfile = ref<boolean>(false);
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
      // app mount waits for this call, keep startup short instead of the 180s default
      const response = await api.raw<UserDto>('/api/appUser/currentUserData', { notify: false, timeout: 15000 });
      if (devMode) {
        console.log('initialAuthDataProcess > /api/appUser/currentUserData', response);
      }
      if (response && response.status == 200 && response._data) {
        setAuthen(response._data);
        if (response._data.permissions && response._data.permissions.length > 0) {
          appStore.setPermissions(response._data.permissions);
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
  const setFetchLoginedProfile = (status: boolean) => {
    alreadyFetchLoginedProfile.value = status;
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
    setLoginedItems,
    setFetchLoginedProfile,
    alreadyFetchLoginedProfile
  }
});
