import { ILocales } from '@/types/Common';
import { DefaultLocale, LocaleKey } from '@/utils/Constant';
import { useLangugeAndThemeStore } from '@/stores/LangugeAndThemeStore';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';
import { loadStorage, saveStorage } from '@/utils/StorageUtil';

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
export const LanguageManager = () => {
  const langugeAndThemeStore = useLangugeAndThemeStore();
  const { locale } = useI18n();
  //   const getUserLocale = (): string => cookies.get(LocaleKey) || DefaultLocale;
  // const userLocale = useStorage<string>(LocaleKey, DefaultLocale);
  // watchers
  watch(langugeAndThemeStore, async (state) => {
    if (state.locale) {
      await setLocale(state.locale);
    }
  });

  const setLocale = async (lang: string) => {
    locale.value = lang;
    // userLocale.value = lang;
    await saveStorage(LocaleKey, lang);
    langugeAndThemeStore.setLocale(lang);
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  // init locale
  const initLang = async () => {
    const lang = await loadStorage<string>(LocaleKey);
    if (lang) {
      await setLocale(lang);
    } else {
      await setLocale(DefaultLocale);
    }

    // setLocale(userLocale.value);
  };
  return {
    initLang
  };
};
