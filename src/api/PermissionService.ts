import { useApi } from '@/composables/useApi';
import type { IAcl, Permission } from '@/types/models';
import type { ApiListResponse } from '@/types/common';
export default () => {
  const api = useApi();
  const userAcl = async (getMenuList: number = 0): Promise<IAcl | null> => {
    return await api<IAcl>(`/api/permission/userAcl?getMenuList=${getMenuList}`);
  };
  const findAll = async (q: string): Promise<ApiListResponse<Permission> | null> => {
    return await api<ApiListResponse<Permission>>(`/api/permission${q}`);
  };
  return {
    userAcl,
    findAll
  };
};
