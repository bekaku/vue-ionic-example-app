import UserNotifyService from '@/api/UserNotifyService';
import { useNotificationStore } from '@/stores/notificationStore';
import type { NotificationCount, NotifyFunctionType } from '@/types/models';
import { AppAuthRefeshTokenKey, FCM_USER_TOPIC, FcmTokenKey, NotifyKey } from '@/libs/constant';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import { FCM } from '@capacitor-community/fcm';
import { PushNotifications } from '@capacitor/push-notifications';
import { toastController } from '@ionic/vue';
import { useBase } from './useBase';
import { useDevice } from './useDevice';
import { useLang } from './useLang';
import { useAppStorage } from './useAppStorage';

export const useNotification = () => {
  const {
    updateFcmSetting,
    refreshFcmToken,
    findCountAllNotRead,
    updateReadNotify
  } = UserNotifyService();
  const { getCurrentUserToken } = useAppStorage()
  const { isWeb } = useDevice();
  const { notify, setNotify } = useNotificationStore();
  const { t } = useLang();
  const { appNavigateTo } = useBase();
  const onRefreshFcmToken = async () => {
    const refeshTokenKey = await loadStorage<string>(AppAuthRefeshTokenKey);
    const fcmToken = await loadStorage<string>(FcmTokenKey);
    if (!refeshTokenKey || !fcmToken) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
    await refreshFcmToken({
      refreshToken: {
        refreshToken: refeshTokenKey,
        fcmToken
      }
    });
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const onUpdateFcmSetting = async (isON: boolean) => {
    // const refeshTokenKey = await loadStorage<string>(AppAuthRefeshTokenKey);
     const currentToken = await getCurrentUserToken();
    const fcmToken = await loadStorage<string>(FcmTokenKey);
    await updateFcmSetting({
      refreshToken: {
        refreshToken: currentToken?.refreshToken || null,
        fcmToken,
        fcmEnable: isON
      }
    });
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const isNotifyPermited = async (): Promise<boolean> => {
    const web = await isWeb();
    if (web) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
    const isPermited = await isUserGranted();
    if (!isPermited) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const addListeners = async (from: string, updateToServer: boolean = true) => {
    const isPermited = await isNotifyPermited();
    if (!isPermited) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    const fcmToken = await loadStorage<string>(FcmTokenKey);
    await PushNotifications.addListener('registration', async (token: any) => {
      console.log('PushNotifications > fcmToken from storage', fcmToken);

      if (token.value) {
        console.log('PushNotifications > registration', token.value);
        await saveStorage(FcmTokenKey, token.value, true);
      }
      // if (
      //     (!fcmToken || fcmToken != token.value) &&
      //     updateToServer
      // ) {
      //     await saveStorage(FcmTokenKey, token.value);
      // }
      return new Promise((resolve) => {
        resolve(token.value);
      });
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    return new Promise((resolve) => {
      resolve(null);
    });
  };
  const addNotifyListeners = async () => {
    const isPermited = await isNotifyPermited();
    if (!isPermited) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: any) => {
        // console.log(
        //   'Push notification received Data',
        //   JSON.stringify(notification)
        // );
        const title = notification.title;
        const message = notification.body;
        const notificatoinId
          = notification.data && notification?.data?.notificatoinId
            ? (notification?.data?.notificatoinId as number)
            : undefined;

        const functionId
          = notification.data && notification.data.functionId
            ? (notification.data.functionId as number)
            : undefined;

        const functionCode
          = notification.data && notification.data.functionCode
            ? (notification.data.functionCode as NotifyFunctionType)
            : undefined;

        reciveNotificationToast(
          title,
          message,
          functionCode,
          functionId,
          notificatoinId
        );
        return new Promise((resolve) => {
          resolve(true);
        });
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (res: any) => {
        // console.log(
        //   'Push notification action performed Data',
        //   JSON.stringify(res)
        // );
        const notificatoinId
          = res
            && res.notification
            && res.notification.data
            && res.notification.data.notificatoinId
            ? res.notification.data.notificatoinId
            : undefined;
        const functionId
          = res
            && res.notification
            && res.notification.data
            && res.notification.data.functionId
            ? res.notification.data.functionId
            : undefined;

        const functionCode
          = res
            && res.notification
            && res.notification.data
            && res.notification.data.functionCode
            ? (res.notification.data.functionCode as NotifyFunctionType)
            : undefined;

        onNotifyView(functionCode, functionId, notificatoinId);
      }
    );

    return new Promise((resolve) => {
      resolve(true);
    });
  };

  const reciveNotificationToast = async (
    title: string | undefined,
    message: string | undefined,
    functionCode: NotifyFunctionType | undefined,
    functionId: number | undefined,
    notificatoinId: number | undefined
  ) => {
    if (notificatoinId && notificatoinId > 0 && functionCode != 'CHAT') {
      notify.lastestId = notificatoinId;
      notify.totalNotify++;
      if (message) {
        const toast = await toastController.create({
          header: title,
          message,
          duration: 1000 * 3,
          position: 'top',
          buttons: [
            {
              text: t('base.view'),
              role: 'info',
              handler: () => {
                onNotifyView(functionCode, functionId, notificatoinId);
              }
            },
            {
              text: t('base.close'),
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        await toast.present();
      }
    }
  };
  const onNotifyView = (
    functionCode: NotifyFunctionType | undefined,
    functionId: number | undefined,
    notificatoinId: number | undefined,
    updateReadToServer = true
  ) => {
    if (notificatoinId && updateReadToServer) {
      updateReadNotify(notificatoinId);
    }
    if (functionCode && functionId) {
      if (
        functionCode == 'SYSTEM_ANNOUNMENT'
        || functionCode == 'LIKE_POST'
      ) {
        appNavigateTo(`/post/view/${functionId}`);
        // eslint-disable-next-line no-empty
      } else if (functionCode == 'CHAT') {
      }
    }
  };

  const isUserGranted = async () => {
    const permStatus = await PushNotifications.checkPermissions();
    return new Promise((resolve) => {
      resolve(permStatus.receive === 'granted');
    });
  };
  const registerNotifications = async () => {
    const web = await isWeb();
    if (web) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('registerNotifications > User denied permissions!');
    }
    await PushNotifications.register();
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const unregisterNotifications = async () => {
    const web = await isWeb();
    if (web) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
    await PushNotifications.unregister();
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const subscribeTopic = async (topic: string) => {
    try {
      FCM.subscribeTo({ topic });
    } catch (error) {
      console.error('subscribeTopic', error);
    }

    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const unSubscribeTopic = async (topic: string) => {
    try {
      FCM.unsubscribeFrom({ topic });
    } catch (error) {
      console.error('unSubscribeTopic', error);
    }

    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const deleteInstance = async () => {
    try {
      FCM.deleteInstance();
    } catch (error) {
      console.error('deleteInstance', error);
    }

    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const removeAllListeners = async () => {
    await PushNotifications.removeAllListeners();
    await PushNotifications.unregister();
  };
  const generateUserTopic = (userId: number) => {
    return FCM_USER_TOPIC + userId;
  };

  const userSubscribeFcm = async (
    updateToServer: boolean = true,
    userId: number | null | undefined = undefined
  ) => {
    await registerNotifications();
    const token = await addListeners('userSubscribeFcm', updateToServer);
    if (userId) {
      await registerTopic(userId);
    }
    return new Promise((resolve) => {
      resolve(token);
    });
  };
  const userUnSubscribeFcm = async (
    userId: number | undefined = undefined,
    updateSetting = true,
    isRemoveAllListeners = true
  ) => {
    if (userId) {
      await unRegisterTopic(userId);
      if (updateSetting) {
        await onUpdateFcmSetting(false);
      }
    }

    if (isRemoveAllListeners) {
      const web = await isWeb();
      if (!web) {
        await removeAllListeners();
      }
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const registerTopic = async (userId: number) => {
    const isPermited = await isNotifyPermited();
    if (!isPermited) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    if (!userId) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    const userTopic = generateUserTopic(userId);
    await subscribeTopic(userTopic);
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const unRegisterTopic = async (userId: number) => {
    const isPermited = await isNotifyPermited();
    if (!isPermited) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    if (!userId) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    const userTopic = generateUserTopic(userId);
    await unSubscribeTopic(userTopic);
    await deleteInstance();
    return new Promise((resolve) => {
      resolve(true);
    });
  };

  const removeAllDeliveredNotify = async () => {
    // const isPermited = await isNotifyPermited();
    // if (isPermited) {
    //   await PushNotifications.removeAllDeliveredNotifications();
    // }
    const web = await isWeb();
    if (!web) {
      await PushNotifications.removeAllDeliveredNotifications();
    }
  };
  const fetchNotReadNotify = async () => {
    const notifyCount = await loadStorage<NotificationCount>(NotifyKey, true);
    const res = await findCountAllNotRead(
      notifyCount && notifyCount.lastestId
        ? notifyCount.lastestId
        : 0
    );
    if (res && res.lastestId && res.totalNotify) {
      setNotify(res);
    }
  };
  return {
    addListeners,
    registerNotifications,
    removeAllListeners,
    subscribeTopic,
    unSubscribeTopic,
    deleteInstance,
    generateUserTopic,
    userSubscribeFcm,
    userUnSubscribeFcm,
    reciveNotificationToast,
    onNotifyView,
    registerTopic,
    unRegisterTopic,
    onRefreshFcmToken,
    onUpdateFcmSetting,
    addNotifyListeners,
    removeAllDeliveredNotify,
    fetchNotReadNotify,
    unregisterNotifications
  };
};
