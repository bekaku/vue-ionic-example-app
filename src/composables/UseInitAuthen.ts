import { UserDto } from '@/types/Models';
import { useAuthenStore } from '@/stores/AuthenStore';
import { usePermissionStore } from '@/stores/PermissionStore';
import UserSerivce from '@/api/UserService';
import PermissionService from '@/api/PermissionService';
import { AppAuthTokenKey, FcmTokenKey } from '@/utils/Constant';
import { useNotification } from './UseNotification';
import { loadStorage } from '@/utils/StorageUtil';

export const useInitAuthen = () => {
  const authenStore = useAuthenStore();
  const permissionStore = usePermissionStore();
  const { getUserSessionData } = UserSerivce();
  const { userAcl } = PermissionService();
  const { addListeners, onRefreshFcmToken } = useNotification();
  const initAuth = async (): Promise<UserDto | null> => {
    const jwtKey = await loadStorage<string>(AppAuthTokenKey);
    if (jwtKey) {
      let userData: UserDto | null = null;
      if (!authenStore.auth) {
        userData = await getUserSessionData();
        if (!userData) {
          return new Promise((resolve) => {
            resolve(null);
          });
        }
        authenStore.setAuthen(userData);
      } else {
        userData = authenStore.auth;
      }
      // redirect if require deference path home
      await fetcAcl();
      manageNotifucationToken(userData);
      return new Promise((resolve) => {
        resolve(userData);
      });
    }
    return new Promise((resolve) => {
      resolve(null);
    });
  };
  const manageNotifucationToken = async (user: UserDto) => {
    await addListeners('useInitAuthen/manageNotifucationToken');
    const serverFcmToken = user.fcmToken;
    const fcmToken = await loadStorage<string>(FcmTokenKey);
    if (fcmToken && fcmToken != 'null' && serverFcmToken && serverFcmToken != 'null') {
      if (fcmToken != serverFcmToken) {
        onRefreshFcmToken();
      }
    }
  };
  const fetcAcl = async () => {
    const res = await userAcl();
    if (res && res.frontendPermissions && res.frontendPermissions.length > 0) {
      permissionStore.setFrontendPermissions(res.frontendPermissions);
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  };
  const canLoadFrontendLayout = () => {
    return true;
  };
  return {
    initAuth,
    canLoadFrontendLayout
  };
};
