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
      API: '/api/appUser/currentUserData',
      method: 'GET'
    });
  };
  const updateUserAvatar = async (
    fileManagerId: number
  ): Promise<ResponseMessage | null> => {
    return await callAxios<ResponseMessage>({
      API: `/api/appUser/updateUserAvatar?fileManagerId=${fileManagerId}`,
      method: 'PUT'
    });
  };
  const updateUserCover = async (
    fileManagerId: number
  ): Promise<ResponseMessage | null> => {
    return await callAxios<ResponseMessage>({
      API: `/api/appUser/updateUserCover?fileManagerId=${fileManagerId}`,
      method: 'PUT'
    });
  };
  const updateDefaultLocale = async (locale: AppLocale): Promise<UserDto | null> => {
    return await callAxios<UserDto>({
      API: `/api/appUser/updateDefaultLocale?locale=${locale}`,
      method: 'PUT'
    });
  };
  const findPublicUserData = async (
    userId: number
  ): Promise<UserDto | null> => {
    return await callAxios<UserDto>({
      API: `/api/appUser/findPublicUserData/${userId}`,
      method: 'GET'
    });
  };
  const updatePersonalData = async (
    req: UserPersonalEditRequest
  ): Promise<ResponseMessage | null> => {
    return await callAxios<ResponseMessage>({
      API: '/api/appUser/updatePersonalData',
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
      API: '/api/appUser/updateEmail',
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
      API: '/api/appUser/selfUpdatePassword',
      method: 'PUT',
      body: { data: req }
    });
  };
  const currentAuthSession = async (q: string): Promise<AccessTokenDto[] | null> => {
    return await callAxios<AccessTokenDto[]>({
      API: `/api/appUser/currentAuthSession${q}`,
      method: 'GET'
    });
  };
  const findAllUserActiveByUserAuth = async (): Promise<UserDto[] | null> => {
    return await callAxios<UserDto[]>({
      API: '/api/appUser/findAllUserActiveByUserAuth',
      method: 'GET'
    });
  };
  const findLoginedProfile = async (
    refreshToken: RefreshTokenRequest
  ): Promise<LoginedProfileItem | null> => {
    return await callAxios<LoginedProfileItem>({
      API: '/api/appUser/findLoginedProfile',
      method: 'POST',
      body: { data: refreshToken },
    });
  };
  const findAllLoginedProfile = async (
  ): Promise<LoginedProfileItem[] | null> => {
    return await callAxios<LoginedProfileItem[]>({
      API: '/api/appUser/findAllLoginedProfile',
      method: 'GET',
    });
  };
  const verifyUserByEmailOrUsername = async (
    userNameOrEmail: string
  ): Promise<RefreshTokenResponse | null> => {
    return await callAxios<RefreshTokenResponse>({
      API: '/api/appUser/verifyUserByEmailOrUsername',
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
