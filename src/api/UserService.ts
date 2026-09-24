import type { ApiFetchResponse } from '@/composables/useApi';
import { useApi } from '@/composables/useApi';
import type { AppLocale, LoginedProfileItem, ResponseMessage } from '@/types/common';
import type {
  AccessTokenDto,
  IdType,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserChangePasswordRequest,
  UserDto,
  UserPersonalEditRequest
} from '@/types/models';

export default () => {
  const api = useApi();
  const getUserSessionData = async (): Promise<UserDto | null> => {
    return await api<UserDto>('/api/appUser/currentUserData');
  };
  const updateUserAvatar = async (
    fileManagerId: IdType
  ): Promise<ResponseMessage | null> => {
    return await api<ResponseMessage>(`/api/appUser/updateUserAvatar?fileManagerId=${fileManagerId}`, { method: 'PUT' });
  };
  const updateUserCover = async (
    fileManagerId: IdType
  ): Promise<ResponseMessage | null> => {
    return await api<ResponseMessage>(`/api/appUser/updateUserCover?fileManagerId=${fileManagerId}`, { method: 'PUT' });
  };
  const updateDefaultLocale = async (locale: AppLocale): Promise<UserDto | null> => {
    return await api<UserDto>(`/api/appUser/updateDefaultLocale?locale=${locale}`, { method: 'PUT' });
  };
  const findPublicUserData = async (
    userId: number
  ): Promise<UserDto | null> => {
    return await api<UserDto>(`/api/appUser/findPublicUserData/${userId}`);
  };
  const updatePersonalData = async (
    req: UserPersonalEditRequest
  ): Promise<ApiFetchResponse<ResponseMessage>> => {
    return await api.raw<ResponseMessage>('/api/appUser/updatePersonalData', { method: 'PUT', body: { req } });
  };
  const updateEmail = async (
    req: UserPersonalEditRequest
  ): Promise<ApiFetchResponse<ResponseMessage>> => {
    return await api.raw<ResponseMessage>('/api/appUser/updateEmail', { method: 'PUT', body: { req } });
  };
  const selfUpdatePassword = async (
    req: UserChangePasswordRequest
  ): Promise<ApiFetchResponse<ResponseMessage>> => {
    return await api.raw<ResponseMessage>('/api/appUser/selfUpdatePassword', { method: 'PUT', body: { req } });
  };
  const currentAuthSession = async (q: string): Promise<AccessTokenDto[] | null> => {
    return await api<AccessTokenDto[]>(`/api/appUser/currentAuthSession${q}`);
  };
  const findAllUserActiveByUserAuth = async (): Promise<UserDto[] | null> => {
    return await api<UserDto[]>('/api/appUser/findAllUserActiveByUserAuth');
  };
  const findLoginedProfile = async (
    refreshToken: RefreshTokenRequest
  ): Promise<LoginedProfileItem | null> => {
    return await api<LoginedProfileItem>('/api/appUser/findLoginedProfile', { method: 'POST', body: { refreshToken } });
  };
  const findAllLoginedProfile = async (
  ): Promise<LoginedProfileItem[] | null> => {
    return await api<LoginedProfileItem[]>('/api/appUser/findAllLoginedProfile');
  };
  const verifyUserByEmailOrUsername = async (
    userNameOrEmail: string
  ): Promise<RefreshTokenResponse | null> => {
    return await api<RefreshTokenResponse>('/api/appUser/verifyUserByEmailOrUsername', { method: 'POST', body: { emailOrUsername: userNameOrEmail } });
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
