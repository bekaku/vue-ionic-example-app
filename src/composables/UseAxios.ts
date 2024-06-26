import { AxiosKey } from '@/plugins/AxiosSymbols';
import { AppException, RequestType, ResponseMessage } from '@/types/Common';
import { isAppException, isServerException, isServerResponseMessage } from '@/utils/AppUtil';
import { injectStrict } from '@/utils/InjectTyped';
import { App } from '@capacitor/app';
import { toastController } from '@ionic/vue';
import { AxiosResponse } from 'axios';
import { alertCircle, closeOutline, exitOutline } from 'ionicons/icons';
import { onUnmounted, ref } from 'vue';
import { useBase } from './UseBase';
import { useConfig } from './UseConfig';
import { AppAuthTokenKey, LocaleKey } from '@/utils/Constant';
import { loadStorage } from '@/utils/StorageUtil';

export const useAxios = () => {
  const sessionTimeOutRef = ref();
  const $appAxios = injectStrict(AxiosKey); // it's typed now
  const { WeeToast } = useBase();
  const { isDevMode, getConfigPublicType } = useConfig();
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
    WeeToast({
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
    WeeToast({
      text: response.message,
      closeIcon: closeOutline,
      time: 3 * 1000,
      color:
        response.status == 'OK' || response.status == 'CREATED'
          ? undefined
          : 'danger'
    });
  };
  const callAxiosV2 = async <T>(req: RequestType): Promise<T | null> => {
    const res = await callAxios<T>(req);
    return await validateServerResponse<T>(res);
  };
  const callAxiosFile = async <T>(req: RequestType): Promise<any> => {
    return new Promise(async (resolve /*reject*/) => {
      const response = await callAxiosProcess<T>(req, false);
      resolve(response);
    });
  };
  const callAxios = async <T>(req: RequestType): Promise<T> => {
    return new Promise(async (resolve /*reject*/) => {
      const response = await callAxiosProcess<T>(req);
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
  };
  const callAxiosProcess = <T>(req: RequestType, logDev: boolean = true): Promise<AxiosResponse<T>> => {
    return new Promise(async (resolve /*reject*/) => {
      const jwtKey = await loadStorage<string>(AppAuthTokenKey);
      $appAxios.defaults.headers.Authorization = `Bearer ${jwtKey}`;
      // $appAxios.defaults.headers['Accept-Language'] = await loadStorage<string>(LocaleKey);

      if (req.baseURL != undefined) {
        $appAxios.defaults.baseURL = req.baseURL;
      } else {
        $appAxios.defaults.baseURL = getConfigPublicType<string>('apiBaseUrl');
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
            console.error(`api `, error.response.status);

            console.error(`api ${$appAxios.defaults.baseURL}${req.API}`, req, error);
          }
          if (error?.response && error?.response?.status) {
            if (error.response.status != 401 && error.response.status != 403) {
              showErrorToast(error);
            }
          }
          resolve(error);
        });
    });
  };


  const showErrorToast = async (error: any) => {
    const toast = await toastController.create({
      header: error.code,
      message: error.message,
      icon: alertCircle,
      duration: 5 * 1000,
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
  return { callAxios, callAxiosV2, validateServerResponse, callAxiosFile, callAxiosProcess };
};
