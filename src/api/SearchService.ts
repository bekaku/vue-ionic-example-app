import { useAxios } from '@/composables/useAxios';
import { SearchParamiter } from '@/libs/constant';
import type { ISearch } from '@/types/models';
export default () => {
  const { callAxios } = useAxios();
  const searchApi = async (
    page: number,
    size: number,
    q: string
  ): Promise<ISearch[] | null> => {
    return await callAxios<ISearch[]>({
      API: `/api/search?page=${page}&size=${size}&${SearchParamiter}=${encodeURIComponent(
        q
      )}`,
      method: 'GET'
    });
  };
  return {
    searchApi
  };
};
