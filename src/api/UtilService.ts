import { useApi } from '@/composables/useApi';
import type { OgMeta, AppVersionDto } from '@/types/models';
export default () => {
  const api = useApi();
  const getOgMeta = async (link: string): Promise<OgMeta | null> => {
    return await api<OgMeta>(`/api/public/getOgMeta?url=${encodeURIComponent(link)}`);
  };
  const getAppVersion = async (): Promise<AppVersionDto | null> => {
    return {
      'fourceUpdate': false,
      'puaseUpdate': false,
      'codeVersion': 1,
      'appVersionIos': '1.0.0.dev',
      'appVersionAndroid': '1.0.0.dev'
    }
    // return await api<AppVersionDto>('/api/public/appVersion');
  };
  return {
    getOgMeta,
    getAppVersion
  };
};
