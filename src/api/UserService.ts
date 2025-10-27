import { useAxios, } from '@/composables/useAxios';
import type { AppLocale, LoginedProfileItem, ResponseMessage } from '@/types/common';
import type {
  AccessTokenDto,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserChangePasswordRequest,
  UserDto,
  UserPersonalEditRequest
} from '@/types/models';

export default () => {
  const { callAxios } = useAxios();
  const getUserSessionData = async (): Promise<UserDto | null> => {
    return await callAxios<UserDto>({
      API: '/api/user/currentUserData',
      method: 'GET'
    });
  };
  const updateUserAvatar = async (
    fileManagerId: number
  ): Promise<ResponseMessage | null> => {
    return await callAxios<ResponseMessage>({
      API: `/api/user/updateUserAvatar?fileManagerId=${fileManagerId}`,
      method: 'PUT'
    });
  };
  const updateUserCover = async (
    fileManagerId: number
  ): Promise<ResponseMessage | null> => {
    return await callAxios<ResponseMessage>({
      API: `/api/user/updateUserCover?fileManagerId=${fileManagerId}`,
      method: 'PUT'
    });
  };
  const updateDefaultLocale = async (locale: AppLocale): Promise<UserDto | null> => {
    return await callAxios<UserDto>({
      API: `/api/user/updateDefaultLocale?locale=${locale}`,
      method: 'PUT'
    });
  };
  const findPublicUserData = async (
    userId: number
  ): Promise<UserDto | null> => {
    return await callAxios<UserDto>({
      API: `/api/user/findPublicUserData/${userId}`,
      method: 'GET'
    });
  };
  const updatePersonalData = async (
    req: UserPersonalEditRequest
  ): Promise<ResponseMessage | null> => {
    return await callAxios<ResponseMessage>({
      API: '/api/user/updatePersonalData',
      method: 'PUT',
      body: {
        data: req
      }
    });
  };
  const updateEmail = async (
    req: UserPersonalEditRequest
  ): Promise<ResponseMessage | null> => {
    return await callAxios<ResponseMessage>({
      API: '/api/user/updateEmail',
      method: 'PUT',
      body: {
        data: req
      }
    });
  };
  const selfUpdatePassword = async (
    req: UserChangePasswordRequest
  ): Promise<ResponseMessage | null> => {
    return await callAxios<ResponseMessage>({
      API: '/api/user/selfUpdatePassword',
      method: 'PUT',
      body: { data: req }
    });
  };
  const currentAuthSession = async (q: string): Promise<AccessTokenDto[] | null> => {
    return await callAxios<AccessTokenDto[]>({
      API: `/api/user/currentAuthSession${q}`,
      method: 'GET'
    });
  };
  const findAllUserActiveByUserAuth = async (): Promise<UserDto[] | null> => {
    return await callAxios<UserDto[]>({
      API: '/api/user/findAllUserActiveByUserAuth',
      method: 'GET'
    });
  };
  const findLoginedProfile = async (
    refreshToken: RefreshTokenRequest
  ): Promise<LoginedProfileItem | null> => {
    return await callAxios<LoginedProfileItem>({
      API: '/api/user/findLoginedProfile',
      method: 'POST',
      body: { data: refreshToken },
    });
  };
  const findAllLoginedProfile = async (
  ): Promise<LoginedProfileItem[] | null> => {
    return await callAxios<LoginedProfileItem[]>({
      API: '/api/user/findAllLoginedProfile',
      method: 'GET',
    });
  };
  const verifyUserByEmailOrUsername = async (
    userNameOrEmail: string
  ): Promise<RefreshTokenResponse | null> => {
    return await callAxios<RefreshTokenResponse>({
      API: '/api/user/verifyUserByEmailOrUsername',
      method: 'POST',
      body: {
        data: {
          emailOrUsername: userNameOrEmail
        }
      },
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
    findAllUserActiveByUserAuth,
    findLoginedProfile,
    findAllLoginedProfile,
    verifyUserByEmailOrUsername
  };
};
