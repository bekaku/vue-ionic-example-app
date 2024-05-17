import { LanguageManager } from './LangUtil';
import { ThemeManager } from './ThemeUtil';
export const AppSetup = () => {
  // use language manager
  const { initLang } = LanguageManager();
  const { initTheme } = ThemeManager();
  initLang();
  initTheme();
};
