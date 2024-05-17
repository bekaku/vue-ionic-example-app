import { config, Devmode } from "@/utils/Constant";
import {getConfig as getAppConfig} from "@/utils/AppUtil";
export const useConfig = () => {
  const getConfig = (key: string) => {
    return config[key as keyof typeof config] || undefined;
  };
  const isDevMode = () => {
    return process.env.NODE_ENV == 'development';
  };
  const getConfigPublic = (key: string) => {
    return config[key as keyof typeof config] || undefined;
  };
  const getConfigPublicType = <T>(key: string): T => {
    return getAppConfig<T>(key) as T;
  };
  const isTestMode = () => {
    return Devmode && !isDevMode();
  }
  const isDevelopMode = () => {
    return Devmode && isDevMode();
  }
  const isProdMode = () => {
    return !Devmode && !isDevMode();
  }
  return {
    getConfig,
    getConfigPublic,
    isDevMode,
    getConfigPublicType,
    isTestMode,
    isDevelopMode,
    isProdMode
  };
};
