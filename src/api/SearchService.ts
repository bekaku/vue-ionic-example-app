import { useAxios } from '@/composables/UseAxios';
import { ISearch } from '@/types/Models';
import { SearchParamiter } from '@/utils/Constant';
export default () => {
  const { callAxios, validateServerResponse } = useAxios();
  const searchApi = async (
    page: number,
    size: number,
    q: string
  ): Promise<ISearch[] | null> => {
    const res = await callAxios<ISearch[]>({
      API: `/api/search?page=${page}&size=${size}&${SearchParamiter}=${encodeURIComponent(
        q
      )}`,
      method: 'GET'
    });
    return await validateServerResponse<ISearch[]>(res);
  };
  return {
    searchApi
  };
};
