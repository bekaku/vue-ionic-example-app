import type {
  IdType,
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse
} from '@/types/models';
import type { AppException, ForgotPasswordRequest, ResponseMessage } from '@/types/common';
import type { ApiFetchResponse } from '@/composables/useApi';
import { ApiFetchError, useApi } from '@/composables/useApi';
export default () => {
  const api = useApi();

  // forgot-password pages read status + body themselves, so a 4xx response is returned instead of thrown
  const rawResponse = async <T>(request: string, body: object): Promise<ApiFetchResponse<T>> => {
    try {
      return await api.raw<T>(request, { method: 'POST', body, notify: false });
    } catch (error) {
      if (error instanceof ApiFetchError && error.response) {
        return error.response;
      }
      throw error;
    }
  };

  const singin = async (
    loginRequest: LoginRequest
  ): Promise<RefreshTokenResponse | null> => {
    return await api<RefreshTokenResponse>('/api/auth/loginApi', { method: 'POST', body: { ...loginRequest } });
  };

  const singoutToServer = async (
    refreshToken: RefreshTokenRequest
  ): Promise<ResponseMessage | null> => {
    return await api<ResponseMessage>('/api/auth/logoutApi', { method: 'POST', body: { ...refreshToken } });
  };
  const refreshToken = async (
    refreshToken: RefreshTokenRequest
  ): Promise<RefreshTokenResponse | null> => {
    return await api<RefreshTokenResponse>('/api/auth/refreshTokenApi', { method: 'POST', body: { ...refreshToken } });
  };
  const removeAccessTokenSession = async (
    id: IdType
  ): Promise<ApiFetchResponse<ResponseMessage>> => {
    return await api.raw<ResponseMessage>(`/api/appUser/removeAccessTokenSession?id=${id}`, { method: 'DELETE' });
  };
  // Forgot password
  const requestVerifyCodeToResetPwd = async (
    req: ForgotPasswordRequest
  ): Promise<ApiFetchResponse<ResponseMessage | AppException>> => {
    return await rawResponse<ResponseMessage | AppException>('/api/auth/requestVerifyCodeToResetPwd', { ...req });
  };
  const sendVerifyCodeToResetPwd = async (
    req: ForgotPasswordRequest
  ): Promise<ApiFetchResponse<ResponseMessage | AppException>> => {
    return await rawResponse<ResponseMessage | AppException>('/api/auth/sendVerifyCodeToResetPwd', { ...req });
  };
  const resetPassword = async (
    req: ForgotPasswordRequest
  ): Promise<ApiFetchResponse<ResponseMessage | AppException>> => {
    return await rawResponse<ResponseMessage | AppException>('/api/auth/resetPassword', { ...req });
  };
  return {
    singin,
    singoutToServer,
    refreshToken,
    removeAccessTokenSession,
    requestVerifyCodeToResetPwd,
    sendVerifyCodeToResetPwd,
    resetPassword
  };
};
