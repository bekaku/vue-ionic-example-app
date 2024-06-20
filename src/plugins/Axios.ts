import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppAuthRefeshTokenKey, AppAuthTokenKey, config, DefaultApiCLient, LocaleKey } from '@/utils/Constant';
import { loadStorage, saveStorage } from '@/utils/StorageUtil';
// import authInterceptor from './AxiosInterceptor';
import router from '../router';
import { getTokenStatus } from '@/utils/JwtUtil';
import { getConfig as getAppConfig } from '@/utils/AppUtil';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const appAxiosInstance = axios.create({
  // baseURL: process.env.NODE_ENV == 'development' ? 'http://192.168.7.249:8080' : 'https://api.example.com',
  baseURL: config.apiBaseUrl,
  withCredentials: false,
  timeout: config.timeOut || 3 * 60000, // 60000 = 1 minute, 0 = no timeout
  headers: {
    // Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept-Apiclient': DefaultApiCLient
    // 'Accept-Language': DefaultLocale,
  },
  validateStatus: (status) => status < 400 // Resolve only if the status code is less than 400
  // validateStatus: (status) => status <= 500 // Resolve only if the status code is less than 500
});
appAxiosInstance.interceptors.request.use(async (config) => {
  // let jwtKey = await loadStorage<string>(AppAuthTokenKey);
  config.headers['Accept-Language'] = await loadStorage<string>(LocaleKey);
  // if (jwtKey) {
  //   config.headers.Authorization = `Bearer ${jwtKey}`;
  // }
  return config;
}, error => {
  return Promise.reject(error);
});

// appAxiosInstance.interceptors.response.use(undefined, await authInterceptor(appAxiosInstance));

interface FailedRequests {
  resolve: (value: AxiosResponse) => void;
  reject: (value: AxiosError) => void;
  config: AxiosRequestConfig;
  error: AxiosError;
}

let isRefreshing = false;
let failedQueue: FailedRequests[] = [];
const processQueue = (error: any, token: any = null) => {
  console.log('processQueue', failedQueue.length);
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
appAxiosInstance.interceptors.response.use(function (response) {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  const refreshToken = await loadStorage<string>(AppAuthRefeshTokenKey);
  if (refreshToken && error.response.status === 403 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({
          resolve, reject,
          config: originalRequest,
          error: error
        });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return appAxiosInstance(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    let currentToken = await loadStorage<string>(AppAuthTokenKey);
    if (currentToken) {
      const currentExpireStatus = await getTokenStatus(currentToken);
      if (currentExpireStatus && currentExpireStatus == 'VALID') {
        originalRequest.headers['Authorization'] = 'Bearer ' + currentToken;
        return appAxiosInstance(originalRequest);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise(function (resolve, reject) {
      appAxiosInstance.defaults.baseURL = getAppConfig<string>('apiBaseUrl');
      appAxiosInstance.defaults.responseType = 'json';
      appAxiosInstance.defaults.headers['Content-Type'] = 'application/json';
      appAxiosInstance.post('/api/auth/refreshToken', {
        refreshToken: {
          refreshToken: refreshToken
        }
      })
        .then(async ({ data }) => {
          // if (data && data.refreshToken && data.authenticationToken) {
          await saveStorage(AppAuthRefeshTokenKey, data?.refreshToken);
          await saveStorage(AppAuthTokenKey, data?.authenticationToken);
          originalRequest.headers['Authorization'] = 'Bearer ' + data?.authenticationToken;
          processQueue(null, data?.authenticationToken);
          resolve(appAxiosInstance(originalRequest));
        })
        .catch((errRefesh: any) => {
          isRefreshing = false;
          processQueue(errRefesh, null);
          if (errRefesh?.response && errRefesh?.response?.status) {
            if (errRefesh.response.status == 401) {
              router.replace('/auth/login');
            }
          }
          resolve(errRefesh);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
  return Promise.reject(error);

});
export default appAxiosInstance;
