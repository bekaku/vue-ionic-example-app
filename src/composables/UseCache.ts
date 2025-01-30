import type { CacheDateAndKey } from '@/types/Common';
import { isObjectEmpty } from '@/utils/AppUtil';
import {
  CacheDateCheckKey,
  NotifyKey
} from '@/utils/Constant';
import { getDateNow, getMonthNow, getYearNow } from '@/utils/DateUtil';
import { loadStorage, removeStorage, saveStorage } from '@/utils/StorageUtil';

export const useCache = () => {
  const getCacheKeyList = async (): Promise<CacheDateAndKey[]> => {
    const cacheKeyCheckList = await loadStorage<CacheDateAndKey[]>(CacheDateCheckKey, true);
    if (cacheKeyCheckList && cacheKeyCheckList.length > 0) {
      return new Promise(resolve => resolve(cacheKeyCheckList));
    }
    return new Promise(resolve => resolve([]));
  };
  const saveCacheKeyList = async (items: CacheDateAndKey[]) => {
    await saveStorage(CacheDateCheckKey, items, true);
  }
  const findByKey = async (k: string): Promise<CacheDateAndKey | undefined> => {
    const cacheKeyCheckList = await getCacheKeyList();
    if (cacheKeyCheckList && cacheKeyCheckList.length > 0) {
      const items = cacheKeyCheckList.find((e: CacheDateAndKey) => e.key == k)
      return new Promise(resolve => resolve(items));
    }
    return new Promise(resolve => resolve(undefined));
  };
  const findIndexByKey = async (k: string): Promise<number> => {
    const cacheKeyCheckList = await getCacheKeyList();
    if (cacheKeyCheckList.length == 0) {
      return new Promise(resolve => resolve(-1));
    }
    const items = cacheKeyCheckList.findIndex((e: CacheDateAndKey) => e.key == k)
    return new Promise(resolve => resolve(items));
  };

  const onRemoveKey = async (k: string): Promise<void> => {
    const index = await findIndexByKey(k);
    if (index >= 0) {
      const cacheKeyCheckList = await getCacheKeyList();
      cacheKeyCheckList.splice(index, 1);
      await saveCacheKeyList(cacheKeyCheckList);
    }
  };
  const onAddNewKey = async (k: string): Promise<void> => {
    const item = await findByKey(k);
    let cacheKeyCheckList = await getCacheKeyList();
    if (!cacheKeyCheckList) {
      cacheKeyCheckList = [];
    }
    if (!item) {
      const d = getDateNow();
      cacheKeyCheckList.push({
        key: k,
        date: d.toLocaleDateString()
      });
      await saveCacheKeyList(cacheKeyCheckList);
    }
  };
  const onUpdateKey = async (
    k: string,
    period: 'DAY' | 'MONTH' | 'YEAR' = 'DAY'
  ): Promise<void> => {
    await onRemoveKey(k);
    if (period == 'DAY') {
      await onAddNewKey(k);
    } else if (period == 'YEAR') {
      await onAddNewYearKey(k);
    }
  };
  const canFecthToServerToday = async (k: string): Promise<boolean> => {
    const item = await findByKey(k);
    if (!item) {
      return true;
    }

    const d = getDateNow();
    return new Promise(resolve => resolve(item.date != d.toLocaleDateString()));
  };
  const canFecthToServerMonth = async (k: string): Promise<boolean> => {
    const item = await findByKey(k);
    if (!item) {
      return true;
    }
    const m = getMonthNow();
    return new Promise(resolve => resolve(item.date != m));
  };
  const canFecthToServerYear = async (k: string): Promise<boolean> => {
    const item = await findByKey(k);
    if (!item) {
      return new Promise(resolve => resolve(true));
    }
    const y = getYearNow();
    return new Promise(resolve => resolve(item.date != y));
  };
  const onAddNewYearKey = async (k: string): Promise<void> => {
    const item = await findByKey(k);
    if (!item) {
      const cacheKeyCheckList = await getCacheKeyList();
      cacheKeyCheckList.push({
        key: k,
        date: getYearNow()
      });
      await saveCacheKeyList(cacheKeyCheckList);
    }
  };
  const destroyCache = async () => {
    await removeStorage(CacheDateCheckKey);
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
    logoutClear,
    fetchFromCacheToday,
    fetchFromCacheMonth,
    fetchFromCacheList,
  };
};
