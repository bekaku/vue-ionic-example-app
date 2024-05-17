import { useAppStorage } from '@/composables/UseAppStorage';
import { CacheDateAndKey } from '@/types/Common';
import {
  NotificationCount
} from '@/types/Models';
import { isObjectEmpty } from '@/utils/AppUtil';
import {
  CacheDateCheckKey,
  CacheKey,
  FcmTokenKey,
  LatestDeviceActiveKey,
  NotifyKey,
  RefreshTokenProcessAtt
} from '@/utils/Constant';
import { getDateNow, getMonthNow, getYearNow } from '@/utils/DateUtil';
import { removeStorage } from '@/utils/StorageUtil';

export const useCache = () => {
  const { storage: latestDeviceActive } = useAppStorage<number>(LatestDeviceActiveKey, 0, false);
  const { storage: refreshTokenProcessing } = useAppStorage<boolean>(RefreshTokenProcessAtt, false, false);
  const { storage: cacheKeyCheckList } = useAppStorage<CacheDateAndKey[]>(CacheDateCheckKey, []);
  const { storage: fcmSetting } = useAppStorage<boolean>(CacheKey.FCM_SETTING, true, false);
  const { storage: fcmToken } = useAppStorage<string>(FcmTokenKey, '', false);
  const { storage: cacheNotifyCount } = useAppStorage<NotificationCount>(NotifyKey, { lastestId: 0, totalNotify: 0 });

  const findByKey = (k: string): CacheDateAndKey | undefined => {
    if (cacheKeyCheckList.value && cacheKeyCheckList.value.length > 0) {
      return cacheKeyCheckList.value.find((e: CacheDateAndKey) => e.key == k);
    }
    return undefined;
  };
  const findIndexByKey = (k: string): number => {
    if (!cacheKeyCheckList.value) {
      return -1;
    }
    return cacheKeyCheckList.value.findIndex(
      (e: CacheDateAndKey) => e.key == k
    );
  };

  const onRemoveKey = (k: string): void => {
    const index = findIndexByKey(k);
    if (index >= 0) {
      cacheKeyCheckList.value.splice(index, 1);
    }
  };
  const onAddNewKey = (k: string): void => {
    const item = findByKey(k);
    if (!cacheKeyCheckList.value) {
      cacheKeyCheckList.value = [];
    }
    if (!item) {
      const d = getDateNow();
      cacheKeyCheckList.value.push({
        key: k,
        date: d.toLocaleDateString()
      });
    }
  };
  const onUpdateKey = (
    k: string,
    period: 'DAY' | 'MONTH' | 'YEAR' = 'DAY'
  ): void => {
    onRemoveKey(k);
    if (period == 'DAY') {
      onAddNewKey(k);
    } else if (period == 'YEAR') {
      onAddNewYearKey(k);
    }
  };
  const canFecthToServerToday = (k: string): boolean => {
    const item = findByKey(k);
    if (!item) {
      return true;
    }

    const d = getDateNow();
    return item.date != d.toLocaleDateString();
  };
  const canFecthToServerMonth = (k: string): boolean => {
    const item = findByKey(k);
    if (!item) {
      return true;
    }
    const m = getMonthNow();
    return item.date != m;
  };
  const canFecthToServerYear = (k: string): boolean => {
    const item = findByKey(k);
    if (!item) {
      return true;
    }
    const y = getYearNow();
    return item.date != y;
  };
  const onAddNewYearKey = (k: string): void => {
    const item = findByKey(k);
    if (!item) {
      cacheKeyCheckList.value.push({
        key: k,
        date: getYearNow()
      });
    }
  };
  const destroyCache = async () => {
    cacheKeyCheckList.value = [];
    return new Promise((resolve) => {
      resolve(true);
    });
  };

  const logoutClear = async () => {
    await removeStorage(NotifyKey);
    await destroyCache();
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const fetchFromCacheToday = (key: string, cache: any) => {
    const canFetchToServer = canFecthToServerToday(key);
    return !canFetchToServer && cache && !isObjectEmpty(cache);
  };
  const fetchFromCacheMonth = (key: string, cache: any) => {
    const canFetchToServer = canFecthToServerMonth(key);
    return !canFetchToServer && cache && !isObjectEmpty(cache);
  };
  const fetchFromCacheList = (canFetchToServer: boolean, cache: any) => {
    return !canFetchToServer && cache && cache.length > 0;
  };
  return {
    findByKey,
    onAddNewKey,
    onUpdateKey,
    destroyCache,
    canFecthToServerToday,
    canFecthToServerYear,
    fcmSetting,
    fcmToken,
    cacheNotifyCount,
    logoutClear,
    latestDeviceActive,
    fetchFromCacheToday,
    fetchFromCacheMonth,
    fetchFromCacheList,
    refreshTokenProcessing
  };
};
