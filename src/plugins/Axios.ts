import axios, { AxiosInstance } from 'axios';
import { DefaultApiCLient, config, AppAuthTokenKey, LocaleKey, AppAuthRefeshTokenKey } from '@/utils/Constant';
import { loadStorage, saveStorage } from '@/utils/StorageUtil';
import router from '../router';

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

// for multiple requests
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

appAxiosInstance.interceptors.request.use(async (config) => {
  // let jwtKey = await loadStorage<string>(AppAuthTokenKey);
  config.headers['Accept-Language'] = await loadStorage<string>(LocaleKey);
  // config.headers.Authorization = `Bearer ${jwtKey}`;
  console.log('appAxiosInstance.interceptors.request', config.url);
  return config;
}, error => {
  return Promise.reject(error);
});

appAxiosInstance.interceptors.response.use(function (response) {
  return response;
}, async (error) => {

  const originalRequest = error.config;

  if (error.response.status === 403 && !originalRequest._retry) {

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        console.warn('isRefreshing > failedQueue.push', originalRequest.url);
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return appAxiosInstance(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = await loadStorage<string>(AppAuthRefeshTokenKey);
    return new Promise(function (resolve, reject) {
      appAxiosInstance.post('/api/auth/refreshToken', {
        refreshToken: {
          refreshToken: refreshToken
        }
      })
        .then(async ({ data }) => {
          await saveStorage(AppAuthRefeshTokenKey, data.refreshToken);
          await saveStorage(AppAuthTokenKey, data.authenticationToken);
          appAxiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + data.authenticationToken;
          originalRequest.headers['Authorization'] = 'Bearer ' + data.authenticationToken;
          processQueue(null, data.authenticationToken);
          resolve(appAxiosInstance(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          router.replace('/auth/login');
          resolve(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }

  return Promise.reject(error);
});
export default appAxiosInstance;
