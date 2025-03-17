import { AppAuthRefeshTokenKey, AppAuthTokenKey, DefaultApiCLient, LocaleKey } from '@/libs/constant';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
// import authInterceptor from './AxiosInterceptor';
import { getTokenStatus } from '@/utils/jwtUtil';
import router from '../router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

const appAxiosInstance = axios.create({
  // baseURL: process.env.NODE_ENV == 'development' ? 'http://192.168.7.249:8080' : 'https://api.example.com',
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  timeout: import.meta.env.VITE_API_TIMOUT || 3 * 60000, // 60000 = 1 minute, 0 = no timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept-Apiclient': DefaultApiCLient
  },
  validateStatus: status => status < 400 // Resolve only if the status code is less than 400
});

interface FailedRequests {
  resolve: (value: AxiosResponse) => void
  reject: (value: AxiosError) => void
  config: AxiosRequestConfig
  error: AxiosError
}

let isRefreshing = false;
let failedQueue: FailedRequests[] = [];
const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
appAxiosInstance.interceptors.request.use(async (config) => {
  const [token, locale] = await Promise.all([
    loadStorage<string>(AppAuthTokenKey),
    loadStorage<string>(LocaleKey)
  ]);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (locale) {
    config.headers['Accept-Language'] = locale;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


appAxiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response?.status !== 403 || originalRequest._retry) {
    return Promise.reject(error);
  }
  const refreshToken = await loadStorage<string>(AppAuthRefeshTokenKey);
  if (!refreshToken) {
    return Promise.reject(error);
  }


  const currentToken = await loadStorage<string>(AppAuthTokenKey);
  if (currentToken) {
    const currentExpireStatus = await getTokenStatus(currentToken);
    if (currentExpireStatus && currentExpireStatus == 'VALID') {
      originalRequest.headers.Authorization = 'Bearer ' + currentToken;
      return appAxiosInstance(originalRequest);
    }
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject, config: originalRequest, error });
    }).then((token) => {
      originalRequest.headers.Authorization = 'Bearer ' + token;
      return appAxiosInstance(originalRequest);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  isRefreshing = true;
  originalRequest._retry = true;
  try {
    console.log('Refreshing token:', { refreshToken, isRefreshing, queueLength: failedQueue.length });
    appAxiosInstance.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
    appAxiosInstance.defaults.responseType = 'json';
    appAxiosInstance.defaults.headers['Content-Type'] = 'application/json';
    const { data } = await appAxiosInstance.post('/api/auth/refreshToken', {
      refreshToken: {
        refreshToken
      }
    })

    const newToken = data?.authenticationToken;
    const newRefreshToken = data?.refreshToken;
    await Promise.all([
      saveStorage(AppAuthTokenKey, newToken),
      saveStorage(AppAuthRefeshTokenKey, newRefreshToken)
    ]);
    appAxiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    processQueue(null, newToken);
    return appAxiosInstance(originalRequest);
  } catch (refreshError: any) {
    processQueue(refreshError, null);
    if (refreshError?.response && refreshError?.response?.status) {
      if (refreshError.response.status == 401) {
        router.replace('/auth/login');
      }
    }
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
});
export default appAxiosInstance;
