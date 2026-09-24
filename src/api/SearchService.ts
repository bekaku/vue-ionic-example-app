import { useApi } from '@/composables/useApi';
import { SearchParamiter } from '@/libs/constant';
import type { ISearch } from '@/types/models';
export default () => {
  const api = useApi();
  const searchApi = async (
    page: number,
    size: number,
    q: string
  ): Promise<ISearch[] | null> => {
    return await api<ISearch[]>(`/api/search?page=${page}&size=${size}&${SearchParamiter}=${encodeURIComponent(q)}`);
  };
  return {
    searchApi
  };
};
