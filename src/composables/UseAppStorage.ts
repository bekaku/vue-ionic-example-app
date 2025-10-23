import { AppAuthCuurentUserKey, AppAuthRefeshTokenKey, AppAuthTokenKey } from '@/libs/constant';
import type { StorageItem } from '@/types/common';
import type { RefreshTokenResponse } from '@/types/models';
import { loadStorage, removeStorage, saveStorage } from '@/utils/storageUtil';
import { Preferences } from '@capacitor/preferences';
import { ref } from 'vue';
import { useDevice } from './useDevice';
import { cordovaClearCach } from '@/utils/appUtil';
import { PushNotifications } from '@capacitor/push-notifications';
export const useAppStorage = () => {
  const { isWeb } = useDevice();
  const redirectTimeout = ref<any>(null)
  const storageKeys = async () => await Preferences.keys();
  // const storageGet = async (key: string) => await Preferences.get({ key });
  // const storageSet = async (key: string, value: any) => await Preferences.set({ key, value });
  // const storageRemove = async (key: string) => await Preferences.remove({ key });
  // const storageClear = async () => await Preferences.clear();

  const getAllJwtTokens = async (): Promise<StorageItem[]> => {
    const keys = await storageKeys();
    // Map each key to a promise that resolves to a StorageItem
    const itemPromises = keys.keys
      .filter(k => k.startsWith(`${AppAuthTokenKey}_`))
      .map(async (k): Promise<StorageItem> => { // Explicitly type the return of the map callback
        const v = await loadStorage(k);
        return {
          key: k,
          value: v,
          userId: k.replace(`${AppAuthTokenKey}_`, '')
        };
      });

    // Wait for all item promises to resolve
    const items = await Promise.all(itemPromises);
    return items;
  };
  const getAllRefreshTokens = async (): Promise<StorageItem[]> => {
    const keys = await storageKeys();
    // Map each key to a promise that resolves to a StorageItem
    const itemPromises = keys.keys
      .filter(k => k.startsWith(`${AppAuthRefeshTokenKey}_`))
      .map(async (k): Promise<StorageItem> => { // Explicitly type the return of the map callback
        const v = await loadStorage(k);
        return {
          key: k,
          value: v,
          userId: k.replace(`${AppAuthRefeshTokenKey}_`, '')
        };
      });

    // Wait for all item promises to resolve
    const items = await Promise.all(itemPromises);
    return items;
  };

  const getCurrentUserToken = async (): Promise<RefreshTokenResponse | null> => {
    const currentUID = await loadStorage<string | null>(AppAuthCuurentUserKey);
    if (!currentUID) {
      return null;
    }
    const jwt = await loadStorage<string | null>(`${AppAuthTokenKey}_${currentUID}`);
    const refreshKey = await loadStorage<string | null>(`${AppAuthRefeshTokenKey}_${currentUID}`);
    if (!jwt || !refreshKey) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    return new Promise((resolve) => {
      resolve({
        userId: Number.parseInt(currentUID),
        authenticationToken: jwt,
        refreshToken: refreshKey,
      });
    });
  };
  const setAuthToken = async (authResponse: RefreshTokenResponse) => {
    if (!authResponse?.userId) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
    await saveStorage(`${AppAuthTokenKey}_${authResponse.userId}`, authResponse.authenticationToken);
    await saveStorage(`${AppAuthRefeshTokenKey}_${authResponse.userId}`, authResponse.refreshToken);
    await setCurrentUser(authResponse.userId);
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const setCurrentUser = async (uid: number | string): Promise<boolean> => {
    await saveStorage(AppAuthCuurentUserKey, '' + uid);
    return new Promise((resolve) => {
      resolve(true);
    });
  }
   const removeAuthCookiesByUserID = async (userId: number | string): Promise<void> => {
    await removeStorage(`${AppAuthTokenKey}_${userId}`);
    await removeStorage(`${AppAuthRefeshTokenKey}_${userId}`);
    return new Promise(resolve => resolve());
  }
  const removeAuthToken = async () => {
    const currentUID = await loadStorage<string | null>(AppAuthCuurentUserKey);
    if (currentUID) {
      // await removeStorage(`${AppAuthTokenKey}_${currentUID}`);
      // await removeStorage(`${AppAuthRefeshTokenKey}_${currentUID}`);
      await removeAuthCookiesByUserID(currentUID);
      // set another user
      const activeJwtTokens = await getAllJwtTokens()
      if (activeJwtTokens && activeJwtTokens.length > 0) {
        const firstToken = activeJwtTokens[0]
        if (firstToken && firstToken.userId) {
          await setCurrentUser(firstToken.userId);
        }
      } else {
        await onClearAllToken();
      }
    } else {
      // if not found current user remove all
      const jwtTokens = await getAllJwtTokens()
      if (jwtTokens && jwtTokens.length > 0) {
        for (const cookie of jwtTokens) {
          if (cookie.key) {
            await removeStorage(cookie.key);
          }
        }
      }
      const jwtRefreshTokens = await getAllRefreshTokens()
      if (jwtRefreshTokens && jwtRefreshTokens.length > 0) {
        for (const tokenRefresh of jwtRefreshTokens) {
          if (tokenRefresh.key) {
            await removeStorage(tokenRefresh.key);
          }
        }
      }
      await onClearAllToken();
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const onClearAllToken = async () => {
    await removeStorage(AppAuthCuurentUserKey);
    await cordovaClearCach();

    // remove FCM notification
    const web = await isWeb();
    if (!web) {
      await PushNotifications.removeAllListeners();
      await PushNotifications.unregister();
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  }
  const validateUserExist = async (userId: number | string): Promise<boolean> => {
    const jwtTokens = await getAllJwtTokens()
    if (!jwtTokens || jwtTokens.length == 0) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
    const jwtToken = jwtTokens.find(t => t.userId == userId);
    if (jwtToken) {
      return new Promise((resolve) => {
        resolve(true);
      });
    }
    return new Promise((resolve) => {
      resolve(false);
    });
  }

  const switchUser = async (userId: number | string) => {
    const currentUID = await loadStorage<string | null>(AppAuthCuurentUserKey);
    if (!currentUID || currentUID == userId) {
      return;
    }
    // validate user exist in cookies
    const exist = await validateUserExist(userId);
    if (!exist) {
      return;
    }
    await setCurrentUser(userId);
    redirectTimeout.value = setTimeout(() => {
      window.location.replace('/')
    }, 100)
  }
  return {
    storageKeys,
    getAllJwtTokens,
    getAllRefreshTokens,
    getCurrentUserToken,
    setAuthToken,
    switchUser,
    removeAuthToken,
    removeAuthCookiesByUserID
  }
};
