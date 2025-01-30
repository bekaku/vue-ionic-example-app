import { useAxios, } from '@/composables/UseAxios';
import type { AppLocale, ResponseMessage } from '@/types/Common';
import type {
  AccessTokenDto,
  UserChangePasswordRequest,
  UserDto,
  UserPersonalEditRequest
} from '@/types/Models';

export default () => {
  const { callAxiosV2 } = useAxios();
  const getUserSessionData = async (): Promise<UserDto | null> => {
    return await callAxiosV2<UserDto>({
      API: '/api/user/currentUserData',
      method: 'GET'
    });
  };
  const updateUserAvatar = async (
    fileManagerId: number
  ): Promise<ResponseMessage | null> => {
    return await callAxiosV2<ResponseMessage>({
      API: `/api/user/updateUserAvatar?fileManagerId=${fileManagerId}`,
      method: 'PUT'
    });
  };
  const updateUserCover = async (
    fileManagerId: number
  ): Promise<ResponseMessage | null> => {
    return await callAxiosV2<ResponseMessage>({
      API: `/api/user/updateUserCover?fileManagerId=${fileManagerId}`,
      method: 'PUT'
    });
  };
  const updateDefaultLocale = async (locale: AppLocale): Promise<UserDto | null> => {
    return await callAxiosV2<UserDto>({
      API: `/api/user/updateDefaultLocale?locale=${locale}`,
      method: 'PUT'
    });
  };
  const findPublicUserData = async (
    userId: number
  ): Promise<UserDto | null> => {
    return await callAxiosV2<UserDto>({
      API: `/api/user/findPublicUserData/${userId}`,
      method: 'GET'
    });
  };
  const updatePersonalData = async (
    req: UserPersonalEditRequest
  ): Promise<ResponseMessage | null> => {
    return await callAxiosV2<ResponseMessage>({
      API: '/api/user/updatePersonalData',
      method: 'PUT',
      body: {
        user: req
      }
    });
  };
  const updateEmail = async (
    req: UserPersonalEditRequest
  ): Promise<ResponseMessage | null> => {
    return await callAxiosV2<ResponseMessage>({
      API: '/api/user/updateEmail',
      method: 'PUT',
      body: {
        user: req
      }
    });
  };
  const selfUpdatePassword = async (
    req: UserChangePasswordRequest
  ): Promise<ResponseMessage | null> => {
    return await callAxiosV2<ResponseMessage>({
      API: '/api/user/selfUpdatePassword',
      method: 'PUT',
      body: req
    });
  };
  const currentAuthSession = async (q: string): Promise<AccessTokenDto[] | null> => {
    return await callAxiosV2<AccessTokenDto[]>({
      API: `/api/user/currentAuthSession${q}`,
      method: 'GET'
    });
  };
  const findAllUserActiveByUserAuth = async (): Promise<UserDto[] | null> => {
    return await callAxiosV2<UserDto[]>({
      API: '/api/user/findAllUserActiveByUserAuth',
      method: 'GET'
    });
  };
  return {
    getUserSessionData,
    findPublicUserData,
    updateDefaultLocale,
    updatePersonalData,
    updateEmail,
    selfUpdatePassword,
    currentAuthSession,
    updateUserAvatar,
    updateUserCover,
    findAllUserActiveByUserAuth
  };
};
