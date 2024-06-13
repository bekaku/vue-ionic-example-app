import appAxios from '@/plugins/Axios';
import { UserDto } from '@/types/Models';
import { canRefreshToken, getRefreshTokenTimeout } from '@/utils/JwtUtil';
import { defineStore } from 'pinia';
// import router from '@/router';
import { RefeshTokenStatus } from '@/types/Common';
import { getConfig } from '@/utils/AppUtil';
import { AppAuthRefeshTokenKey, AppAuthTokenKey, LocaleKey, RefreshTokenProcessAtt } from '@/utils/Constant';
import { loadStorage, saveStorage } from '@/utils/StorageUtil';

export const useAuthenStore = defineStore('authenStore', {
  state: () => {
    return {
      auth: undefined as UserDto | undefined,
      refreshTokenTimeout: null as any,
      refreshTokenTimeoutNo: 0,
      devMode: process.env.NODE_ENV == 'development',
      sessionExpired: false,
      initial: false
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
      return new Promise(async (resolve /*reject*/) => {
        await saveStorage(RefreshTokenProcessAtt, true);
        const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
        if (authTokenKey) {
          const refreshIt = await canRefreshToken(authTokenKey, this.devMode, 'authenStore > refreshToken');
          if (refreshIt) {
            const refreshRes = await this.refreshTokenProcess();
            resolve(refreshRes);
          }
        }
        await saveStorage(RefreshTokenProcessAtt, false);
        resolve({
          status: true,
          fourceLogout: false
        });
      });
    },
    async refreshTokenProcess(): Promise<RefeshTokenStatus> {
      return new Promise(async (resolve /*reject*/) => {
        // const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
        const refreshToken = await loadStorage<string>(AppAuthRefeshTokenKey);
        // const localeVal = await loadStorage<string>(LocaleKey);
        // appAxios.defaults.headers.Authorization = `Bearer ${authTokenKey}`;
        // appAxios.defaults.headers['Accept-Language'] = localeVal;
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
          await saveStorage(AppAuthRefeshTokenKey, response.data.refreshToken);
          await saveStorage(AppAuthTokenKey, response.data.authenticationToken);
          this.sessionExpired = false;
          await saveStorage(RefreshTokenProcessAtt, false);
          resolve({
            status: true,
            token: response.data.authenticationToken,
            fourceLogout: false
          });

        } else if (response && response.status == 401) {
          this.sessionExpired = true;
          // router.push('/auth/login');
          // router.replace('/auth/login');
          await saveStorage(RefreshTokenProcessAtt, false);
          resolve({
            status: false,
            fourceLogout: true
          });
        }
      });
    },
    async startRefreshTokenTimer() {
      // return new Promise(async (resolve /*reject*/) => {
      //   const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
      //   if (authTokenKey) {
      //     this.refreshTokenTimeoutNo = await getRefreshTokenTimeout(authTokenKey);
      //     if (this.devMode) {
      //       console.log('startRefreshTokenTimer {}', this.refreshTokenTimeoutNo);
      //     }
      //     if (this.refreshTokenTimeoutNo > 0) {
      //       if (this.devMode) {
      //         console.log('Start Timer');
      //       }
      //       this.refreshTokenTimeout = setTimeout(() => {
      //         this.refreshToken();
      //       }, this.refreshTokenTimeoutNo);
      //     }
      //   }
      //   resolve(true);
      // });
      return new Promise(async (resolve) => resolve(true));
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
        const status = await this.initialAuthDataProcess();
        resolve(status);
      });
    },
    async initialAuthDataProcess() {
      return new Promise(async (resolve /*reject*/) => {
        const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
        if (authTokenKey) {
          // appAxios.defaults.headers.Authorization = `Bearer ${authTokenKey}`;
          appAxios.defaults.responseType = 'json';
          appAxios.defaults.headers['Content-Type'] = 'application/json';
          const response = await appAxios({
            method: 'GET',
            url: '/api/user/currentUserData'
          });
          if (this.devMode) {
            console.log('initialAuthDataProcess > /api/user/currentUserData', response);
          }
          if (response && response.status == 200) {
            this.setAuthen(response.data);
          }
          this.setInitial(true);
          resolve(response.status);
        }
        resolve(200);
      });
    },
    setInitial(status: boolean) {
      this.initial = status;
    },
    setAuthen(item: UserDto) {
      this.auth = item;
    },
    logout() {
      this.auth = undefined;
    },
  }
});
