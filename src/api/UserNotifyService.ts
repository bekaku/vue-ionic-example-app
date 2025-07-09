import { useAxios } from '@/composables/useAxios';
import type {
  NotificationCount,
  NotificationDto,
  RefreshTokenRequest
} from '@/types/models';
export default () => {
  const { callAxios } = useAxios();
  const findAllByUser = async (
    page: number,
    size: number,
  ): Promise<NotificationDto[] | null> => {
    return new Promise((resolve /* reject */) => {
      resolve([]);
    });
    // return await callAxios<NotificationDto[]>({
    //   API: `/api/userNotify/findAllByUser?page=${page}&size=${size}`,
    //   method: 'GET'
    // });
  };
  const refreshFcmToken = async (
    refreshToken: RefreshTokenRequest
  ): Promise<void> => {
    if (refreshToken && refreshToken.refreshToken.fcmToken) {
      await callAxios<void>({
        API: '/api/user/refreshFcmToken',
        method: 'PUT',
        body: refreshToken
      });
    }
  };
  const updateFcmSetting = async (
    refreshToken: RefreshTokenRequest
  ): Promise<void> => {
    await callAxios<void>({
      API: '/api/user/updateFcmSetting',
      method: 'PUT',
      body: refreshToken
    });
  };
  const findCountAllNotRead = async (
    lastNOtifyId: number
  ): Promise<NotificationCount | null> => {
    return new Promise((resolve /* reject */) => {
      resolve(null);
    });
    // return await callAxios<NotificationCount>({
    //   API: `/api/userNotify/findCountAllNotRead?lastestNotifyId=${lastNOtifyId}`,
    //   method: 'GET'
    // });
  };
  const updateReadNotify = async (notifyId: number): Promise<void | null> => {
    return new Promise((resolve /* reject */) => {
      resolve(null);
    });
    // return await callAxios<void>({
    //   API: `/api/userNotify/updateReadNotify/${notifyId}`,
    //   method: 'PUT'
    // });
  };
  const updateReadNotifyAll = async (): Promise<void | null> => {
    return new Promise((resolve /* reject */) => {
      resolve(null);
    });
    // return await callAxios<void>({
    //   API: '/api/userNotify/updateReadNotifyAll',
    //   method: 'PUT'
    // });
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
