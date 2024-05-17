import appAxios from '@/plugins/Axios';
import { UserDto } from '@/types/Models';
import { canRefreshToken, getRefreshTokenTimeout } from '@/utils/JwtUtil';
import { defineStore } from 'pinia';
// import router from '@/router';
import { RefeshTokenStatus } from '@/types/Common';
import { getConfig } from '@/utils/AppUtil';
import { AppAuthRefeshTokenKey, AppAuthTokenKey, LocaleKey } from '@/utils/Constant';
import { loadStorage, saveStorage } from '@/utils/StorageUtil';

export const useAuthenStore = defineStore('authenStore', {
  state: () => {
    return {
      auth: undefined as UserDto | undefined,
      refreshTokenTimeout: null as any,
      refreshTokenTimeoutNo: 0,
      devMode: process.env.NODE_ENV == 'development',
      sessionExpired: false
    };
  },
  getters: {
    tokenKey: (state) => state.auth?.token,
    loginedCover: (state) =>
      state.auth && state.auth.cover?.image ? state.auth.cover?.image : '',
    loginedAvatar: (state) => state.auth?.avatar?.image,
    loginedDisplay: (state) => state.auth?.username,
  },
  actions: {
    async refreshToken(): Promise<RefeshTokenStatus> {
      // const authTokenKey = localStorage.getItem(AppAuthTokenKey);
      // const refreshToken = localStorage.getItem(AppAuthRefeshTokenKey);
      // const localeVal = localStorage.getItem(LocaleKey);
      const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
      const refreshToken = await loadStorage<string>(AppAuthRefeshTokenKey);
      const localeVal = await loadStorage<string>(LocaleKey);
      if (authTokenKey) {
        const refreshIt = await canRefreshToken(authTokenKey, this.devMode, 'authenStore > refreshToken');
        if (refreshIt) {
          appAxios.defaults.headers.Authorization = `Bearer ${authTokenKey}`;
          appAxios.defaults.headers['Accept-Language'] = localeVal;
          appAxios.defaults.baseURL = getConfig<string>('apiBaseUrl');
          appAxios.defaults.responseType = 'json';
          appAxios.defaults.headers['Content-Type'] = 'application/json';
          const response = await appAxios({
            method: 'POST',
            url: '/api/auth/refreshToken',
            data: {
              refreshToken: {
                refreshToken: refreshToken
              }
            }
          });
          if (this.devMode) {
            console.log(`api ${appAxios.defaults.baseURL}/api/auth/refreshToken`, response);
          }
          if (response && response.status == 200 && response.data && response.data.refreshToken && response.data.authenticationToken) {
            // localStorage.setItem(AppAuthRefeshTokenKey, response.data.refreshToken);
            // localStorage.setItem(AppAuthTokenKey, response.data.authenticationToken);
            await saveStorage(AppAuthRefeshTokenKey, response.data.refreshToken);
            await saveStorage(AppAuthTokenKey, response.data.authenticationToken);
            this.sessionExpired = false;
            await this.startRefreshTokenTimer();
          } else if (response && response.status == 401) {
            this.sessionExpired = true;
            // router.push('/auth/login');
            // router.replace('/auth/login');
            return new Promise((resolve /*reject*/) => {
              resolve({
                status: false,
                fourceLogout: true
              });
            });
          }
        } else {
          await this.startRefreshTokenTimer();
        }
      }
      return new Promise((resolve /*reject*/) => {
        resolve({
          status: true,
          fourceLogout: false
        });
      });
    },
    async startRefreshTokenTimer() {
      return new Promise(async (resolve /*reject*/) => {
        // const authTokenKey = localStorage.getItem(AppAuthTokenKey);
        const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
        if (authTokenKey) {
          this.refreshTokenTimeoutNo = await getRefreshTokenTimeout(authTokenKey);
          // this.refreshTokenTimeout = setTimeout(this.refreshToken, 10 * 1000);
          if (this.devMode) {
            console.log('startRefreshTokenTimer {}', this.refreshTokenTimeoutNo);
          }
          if (this.refreshTokenTimeoutNo > 0) {
            if (this.devMode) {
              console.log('Start Timer');
            }
            this.refreshTokenTimeout = setTimeout(this.refreshToken, this.refreshTokenTimeoutNo);
          }
        }
        resolve(true);
      });
    },
    stopRefreshTokenTimer() {
      return new Promise(async (resolve /*reject*/) => {
        if (this.refreshTokenTimeout) {
          clearTimeout(this.refreshTokenTimeout);
          this.refreshTokenTimeout = null;
        }
        resolve(true);
      });

    },
    async stopAndRestartRefreshTokenTimer() {
      await this.stopRefreshTokenTimer();
      await this.refreshToken();
      return new Promise(async (resolve /*reject*/) => {
        resolve(true);
      });
    },
    async initialAuthData() {
      return new Promise(async (resolve /*reject*/) => {
        const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
        // const authTokenKey = localStorage.getItem(AppAuthTokenKey);
        if (authTokenKey) {
          appAxios.defaults.headers.Authorization = `Bearer ${authTokenKey}`;
          appAxios.defaults.responseType = 'json';
          appAxios.defaults.headers['Content-Type'] = 'application/json';
          const response = await appAxios({
            method: 'GET',
            url: '/api/user/currentUserData'
          });
          if (response && response.status == 200) {
            this.setAuthen(response.data);
          }
        }
        resolve(true);
      });
    },
    setAuthen(item: UserDto) {
      this.auth = item;
    },
    logout() {
      this.auth = undefined;
    },
  }
});
