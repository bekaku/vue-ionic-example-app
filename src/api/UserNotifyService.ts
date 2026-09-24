import { useApi } from '@/composables/useApi';
import type {
  NotificationCount,
  NotificationDto,
  RefreshTokenRequest
} from '@/types/models';
export default () => {
  const api = useApi();
  const findAllByUser = async (
    page: number,
    size: number,
  ): Promise<NotificationDto[] | null> => {
    return new Promise((resolve /* reject */) => {
      resolve([]);
    });
    // return await api<NotificationDto[]>(`/api/userNotify/findAllByUser?page=${page}&size=${size}`);
  };
  const refreshFcmToken = async (
    refreshToken: RefreshTokenRequest
  ): Promise<void> => {
    if (refreshToken && refreshToken.fcmToken) {
      await api<void>('/api/appUser/refreshFcmToken', { method: 'PUT', body: { refreshToken } });
    }
  };
  const updateFcmSetting = async (
    refreshToken: RefreshTokenRequest
  ): Promise<void> => {
    await api<void>('/api/appUser/updateFcmSetting', { method: 'PUT', body: { refreshToken } });
  };
  const findCountAllNotRead = async (
    lastNOtifyId: number
  ): Promise<NotificationCount | null> => {
    return new Promise((resolve /* reject */) => {
      resolve(null);
    });
    // return await api<NotificationCount>(`/api/userNotify/findCountAllNotRead?lastestNotifyId=${lastNOtifyId}`);
  };
  const updateReadNotify = async (notifyId: number): Promise<void | null> => {
    return new Promise((resolve /* reject */) => {
      resolve(null);
    });
    // return await api<void>(`/api/userNotify/updateReadNotify/${notifyId}`, { method: 'PUT' });
  };
  const updateReadNotifyAll = async (): Promise<void | null> => {
    return new Promise((resolve /* reject */) => {
      resolve(null);
    });
    // return await api<void>('/api/userNotify/updateReadNotifyAll', { method: 'PUT' });
  };
  return {
    refreshFcmToken,
    updateFcmSetting,
    findCountAllNotRead,
    updateReadNotify,
    updateReadNotifyAll,
    findAllByUser
  };
};
