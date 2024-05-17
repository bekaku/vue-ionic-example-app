import { useAxios } from '@/composables/UseAxios';
import { IAcl } from '@/types/Models';
export default () => {
  const { callAxiosV2 } = useAxios();
  const userAcl = async (getMenuList: number = 0): Promise<IAcl | null> => {
    return await callAxiosV2<IAcl>({
      API: `/api/permission/userAcl?getMenuList=${getMenuList}`,
      method: 'GET'
    });
  };

  return {
    userAcl
  };
};
