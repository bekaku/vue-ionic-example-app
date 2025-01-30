import { Preferences } from '@capacitor/preferences';
import { DeviceIdAtt, FcmTokenKey, LocaleKey, RefreshTokenProcessAtt, ThemeKey } from '@/utils/Constant';
import type { KeyValue } from '@/types/Common';

export const saveStorage = async (key: string, value: any, isJson = false): Promise<boolean> => {
  await Preferences.set({
    key,
    value: isJson ? JSON.stringify(value) : value
  });
  return new Promise((resolve) => {
    resolve(true);
  });
};
export const loadStorage = async <T>(key: string, parseJson = false): Promise<T | null> => {
  const ret = await Preferences.get({ key });
  return new Promise((resolve) => {
    if (ret && ret.value) {
      resolve(parseJson ? JSON.parse(ret.value) : ret.value as T);
    }
    resolve(null);
  });
};
export const removeStorage = async (key: string, from: string | undefined = undefined): Promise<boolean> => {
  await Preferences.remove({ key });
  return new Promise((resolve) => {
    resolve(true);
  });
};
export const clearStorage = async (exceptKeys: string[] = [LocaleKey, ThemeKey, FcmTokenKey, DeviceIdAtt, RefreshTokenProcessAtt]): Promise<boolean> => {
  const exceptItems: KeyValue[] = [];
  if (exceptKeys.length > 0) {
    for (const k of exceptKeys) {
      const val = await loadStorage<any>(k);
      exceptItems.push({
        key: k,
        value: val
      });
    }
  }
  await Preferences.clear();
  if (exceptItems.length > 0) {
    for (const item of exceptItems) {
      await saveStorage(item.key, item.value);
    }
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};
