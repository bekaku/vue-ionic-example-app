import { useAxios } from '@/composables/UseAxios';
import { ApiListResponse, IAcl, Permission } from '@/types/Models';
export default () => {
  const { callAxiosV2 } = useAxios();
  const userAcl = async (getMenuList: number = 0): Promise<IAcl | null> => {
    return await callAxiosV2<IAcl>({
      API: `/api/permission/userAcl?getMenuList=${getMenuList}`,
      method: 'GET'
    });
  };
  const findAll = async (q: string): Promise<ApiListResponse<Permission> | null> => {
    return await callAxiosV2<ApiListResponse<Permission>>({
      API: `/api/permission${q}`,
      method: 'GET'
    });
  };
  return {
    userAcl,
    findAll
  };
};
