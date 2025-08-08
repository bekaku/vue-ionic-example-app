import { AxiosKey } from '@/plugins/axiosSymbols';
import type { AppException, RequestType, ResponseMessage } from '@/types/common';
import { isAppException, isServerException, isServerResponseMessage } from '@/utils/appUtil';
import { injectStrict } from '@/utils/injectTyped';
import { App } from '@capacitor/app';
import { toastController } from '@ionic/vue';
import type { AxiosResponse } from 'axios';
import { alertCircle, closeOutline, exitOutline } from 'ionicons/icons';
import { onUnmounted, ref } from 'vue';
import { useBase } from './useBase';
import { useConfig } from './useConfig';
import { useDevice } from './useDevice';

export const useAxios = () => {
  const sessionTimeOutRef = ref();
  const $appAxios = injectStrict(AxiosKey); // it's typed now
  const { appToast } = useBase();
  const { canSyncActiveStatusToServer } = useDevice();
  const { isDevMode, getEnv } = useConfig();
  onUnmounted(() => {
    if (sessionTimeOutRef.value) {
      clearTimeout(sessionTimeOutRef.value);
    }
  });
  const validateServerResponse = <T>(res: T): Promise<T | null> => {
    if (!res) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    if (isAppException(res) || isServerException(res)) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }
    return new Promise((resolve) => {
      resolve(res);
    });
  };
  const notifyException = (response: AppException): void => {
    appToast({
      text: `${response.message} : ${response.errors?.join(
        ','
      )}`,
      icon: alertCircle,
      time: 5 * 1000,
      color: 'danger',
      closeIcon: closeOutline
    });
  };
  const notifyServerMessage = (response: ResponseMessage): void => {
    if (!response.message) {
      return;
    }
    appToast({
      text: response.message,
      closeIcon: closeOutline,
      time: 3 * 1000,
      color:
        response.status == 'OK' || response.status == 'CREATED'
          ? undefined
          : 'danger'
    });
  };
  const callAxiosFile = async <T>(req: RequestType): Promise<any> => {
    const response = await callAxiosProcess<T>(req, false);
    return new Promise((resolve /* reject */) => {
      resolve(response);
    });
  };
  const callAxios = async <T>(req: RequestType): Promise<T | null> => {
    const response = await callAxiosProcess<T>(req);
    return new Promise((resolve /* reject */) => {
      if (response.status != 401 && response.status != 403) {
        if (response.data) {
          if (isAppException(response.data)) {
            notifyException(response.data);
          } else if (isServerResponseMessage(response.data)) {
            notifyServerMessage(response.data);
          }
        }
      }
      resolve(response.data as T);
    }
    );


    // return new Promise(async (resolve, reject) => {
    //   callAxiosProcess<T>(req)
    //     .then(async (response) => {
    //       if (response.status != 401 && response.status != 403) {
    //         if (response.data) {
    //           if (isAppException(response.data)) {
    //             notifyException(response.data);
    //           } else if (isServerResponseMessage(response.data)) {
    //             notifyServerMessage(response.data);
    //           }
    //         }
    //       }
    //       const finalResponse = await validateServerResponse<T>(response.data);
    //       resolve(finalResponse);
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
  };
  const callAxiosProcess = async <T>(req: RequestType, logDev: boolean = true): Promise<AxiosResponse<T>> => {
    // const jwtKey = await loadStorage<string>(AppAuthTokenKey);
    const cahSyncOnlineStatus = await canSyncActiveStatusToServer();
    return new Promise((resolve, reject) => {
      // $appAxios.defaults.headers.Authorization = `Bearer ${jwtKey}`;
      // $appAxios.defaults.headers['Accept-Language'] = await loadStorage<string>(LocaleKey);

      if (req.baseURL != undefined) {
        $appAxios.defaults.baseURL = req.baseURL;
      } else if (req.clearBaseUrl === true) {
        $appAxios.defaults.baseURL = '';
      } else {
        $appAxios.defaults.baseURL = getEnv<string>('VITE_API_BASE_URL');
      }
      if (req.contentType) {
        $appAxios.defaults.headers['Content-Type'] = req.contentType;
      } else {
        $appAxios.defaults.headers['Content-Type'] = 'application/json';
      }
      if (req.responseType != undefined) {
        $appAxios.defaults.responseType = req.responseType;
      } else {
        $appAxios.defaults.responseType = 'json';
      }
      $appAxios.defaults.headers['X-Sync-Active'] = cahSyncOnlineStatus ? '1' : '0';
      $appAxios({
        method: req.method,
        url: req.API,
        data: req.body ? req.body : undefined
      })
        .then((response: any) => {
          if (isDevMode() && logDev) {
            console.log(`api ${$appAxios.defaults.baseURL}${req.API}`, req, logDev ? response : '');
          }
          resolve(response as AxiosResponse<T>);
        })
        .catch((error: any) => {
          if (isDevMode()) {
            console.error(`api ${$appAxios.defaults.baseURL}${req.API}`, req, error);
          }
          if (error?.response?.status != 401 && error?.response?.status != 403) {
            showErrorToast(error);
          }
          reject(error);
        });
    });
  };


  const showErrorToast = async (error: any) => {
    const responseData = error?.response?.data;
    const message = responseData?.message;
    const errors = responseData?.errors && responseData?.errors.length > 0 ? responseData?.errors.toString() : undefined;
    const toast = await toastController.create({
      header: message || error.code,
      message: errors || error.message,
      icon: alertCircle,
      duration: 15 * 1000,
      mode: 'ios',
      color: 'danger',
      buttons: [
        {
          // text: t('base.close'),
          icon: closeOutline,
          role: 'cancel',
          handler: () => {
          }
        },
        {
          // text: t('base.appExit'),
          icon: exitOutline,
          role: 'info',
          handler: () => {
            App.exitApp();
          }
        }
      ]
    });
    await toast.present();
  };
  return { callAxios, validateServerResponse, callAxiosFile, callAxiosProcess };
};
