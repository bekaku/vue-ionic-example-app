import { useAppStore } from '@/stores/appStore';
import type { AppLocale, ILocales } from '@/types/Common';
import { DefaultLocale, LocaleKey } from '@/utils/Constant';
import { loadStorage, saveStorage } from '@/utils/StorageUtil';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const availableLocales: ILocales[] = [
  {
    name: 'English',
    iso: 'en',
    flag: '🇺🇸'
  },
  {
    name: 'ไทย',
    iso: 'th',
    flag: 'TH'
  }
];
export const useLang = () => {
  const { t, locale } = useI18n({ useScope: 'global' });
  const { setCurrentLocale } = useAppStore();
  const currenLocaleItem = computed(() =>
    availableLocales.find(t => t.iso == locale.value),
  );
  const setLocale = async (lang: AppLocale) => {
    locale.value = lang;
    await saveStorage(LocaleKey, lang);
    setCurrentLocale(lang);
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const initLang = async () => {
    const lang = await loadStorage<string>(LocaleKey) as AppLocale;
    if (lang) {
      await setLocale(lang);
    } else {
      await setLocale(DefaultLocale);
    }
  };
  return {
    t,
    locale,
    currenLocaleItem,
    initLang,
    setLocale
  };
};
