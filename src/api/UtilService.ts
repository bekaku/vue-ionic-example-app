import { useAxios } from '@/composables/useAxios';
import type { OgMeta, AppVersionDto } from '@/types/models';
export default () => {
  const { callAxios } = useAxios();
  const getOgMeta = async (link: string): Promise<OgMeta | null> => {
    return await callAxios<OgMeta>({
      API: `/api/public/getOgMeta?url=${encodeURIComponent(link)}`,
      method: 'GET'
    });
  };
  const getAppVersion = async (): Promise<AppVersionDto | null> => {
    return {
      'fourceUpdate': false,
      'puaseUpdate': false,
      'codeVersion': 1,
      'appVersionIos': '1.0.0.dev',
      'appVersionAndroid': '1.0.0.dev'
    }
    // return await callAxios<AppVersionDto>({
    //   API: '/api/public/appVersion',
    //   method: 'GET'
    // });
  };
  return {
    getOgMeta,
    getAppVersion
  };
};
