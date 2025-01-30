import { useAxios } from '@/composables/UseAxios';
import type {
  NotificationCount,
  RefreshTokenRequest,
  NotificationDto
} from '@/types/Models';
import {
  NotifyFunctionType
} from '@/types/Models';
export default () => {
  const { callAxiosV2 } = useAxios();
  const findAllByUser = async (
    page: number,
    size: number,
  ): Promise<NotificationDto[] | null> => {
    return new Promise((resolve /* reject */) => {
      resolve([]);
    });
    // return await callAxiosV2<NotificationDto[]>({
    //   API: `/api/userNotify/findAllByUser?page=${page}&size=${size}`,
    //   method: 'GET'
    // });
  };
  const refreshFcmToken = async (
    refreshToken: RefreshTokenRequest
  ): Promise<void> => {
    if (refreshToken && refreshToken.refreshToken.fcmToken) {
      await callAxiosV2<void>({
        API: '/api/user/refreshFcmToken',
        method: 'PUT',
        body: refreshToken
      });
    }
  };
  const updateFcmSetting = async (
    refreshToken: RefreshTokenRequest
  ): Promise<void> => {
    await callAxiosV2<void>({
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
    // return await callAxiosV2<NotificationCount>({
    //   API: `/api/userNotify/findCountAllNotRead?lastestNotifyId=${lastNOtifyId}`,
    //   method: 'GET'
    // });
  };
  const updateReadNotify = async (notifyId: number): Promise<void | null> => {
    return new Promise((resolve /* reject */) => {
      resolve(null);
    });
    // return await callAxiosV2<void>({
    //   API: `/api/userNotify/updateReadNotify/${notifyId}`,
    //   method: 'PUT'
    // });
  };
  const updateReadNotifyAll = async (): Promise<void | null> => {
    return new Promise((resolve /* reject */) => {
      resolve(null);
    });
    // return await callAxiosV2<void>({
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
