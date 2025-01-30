import { config } from '@/utils/Constant';
import { getConfig as getAppConfig } from '@/utils/AppUtil';
export const useConfig = () => {
  const getEnv = <T>(key: string) => {
    const env = import.meta.env;
    return env[key] as unknown as T || undefined;
  };
  const getConfig = (key: string) => {
    return config[key as keyof typeof config] || undefined;
  };
  const isDevMode = () => {
    return import.meta.env.DEV;
  };
  const getConfigPublic = (key: string) => {
    return config[key as keyof typeof config] || undefined;
  };
  const getConfigPublicType = <T>(key: string): T => {
    return getAppConfig<T>(key) as T;
  };
  const isTestMode = () => {
    return import.meta.env.VITE_DEV_MODE == 'true' && !isDevMode();
  }
  const isDevelopMode = () => {
    return import.meta.env.VITE_DEV_MODE == 'true' && isDevMode();
  }
  const isProdMode = () => {
    return import.meta.env.VITE_DEV_MODE == 'false' && !isDevMode();
  }
  return {
    getEnv,
    getConfig,
    getConfigPublic,
    isDevMode,
    getConfigPublicType,
    isTestMode,
    isDevelopMode,
    isProdMode
  };
};
