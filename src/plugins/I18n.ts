import { createI18n } from 'vue-i18n';
import en from '../locales/en';
import th from '../locales/th';
// import en from "../locales/en.json";
// import th from "../locales/th.json";
import { DefaultLocale, LocaleKey } from '@/utils/Constant';
import { loadStorage } from '@/utils/StorageUtil';

// export default createI18n({
//   legacy: false,
//   globalInjection: true,
//   locale: DefaultLocale,
//   // locale: useLocalStorage(LocaleKey, DefaultLocale).value,
//   messages: {
//     en,
//     th
//   }
// });
let i18n: any;

export async function setI18nLanguage() {
  const locale = await loadStorage<string>(LocaleKey);
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale || DefaultLocale;
  } else {
    i18n.global.locale.value = locale || DefaultLocale;
  }
  // if (document && document?.querySelector) {
  //   document.querySelector('html').setAttribute('lang', locale || DefaultLocale);
  // }
}

export default function setupI18n() {
  if (!i18n) {
    // let locale = localStorage.getItem('lang') || 'pt';
    i18n = createI18n({
      legacy: false,
      globalInjection: true,
      locale: DefaultLocale,
      // locale: useLocalStorage(LocaleKey, DefaultLocale).value,
      messages: {
        en,
        th
      }
    });
    setI18nLanguage().then(r => console.log('i18n setup completed'));
  }
  return i18n;
}