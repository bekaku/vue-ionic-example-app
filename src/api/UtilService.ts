import { useAxios } from '@/composables/UseAxios';
import type { OgMeta, AppVersionDto } from '@/types/Models';
export default () => {
  const { callAxiosV2, validateServerResponse } = useAxios();
  const getOgMeta = async (link: string): Promise<OgMeta | null> => {
    return await callAxiosV2<OgMeta>({
      API: `/api/public/getOgMeta?url=${link}`,
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
    // return await callAxiosV2<AppVersionDto>({
    //   API: '/api/public/appVersion',
    //   method: 'GET'
    // });
  };
  return {
    getOgMeta,
    getAppVersion
  };
};
