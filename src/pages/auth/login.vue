<template>
  <ion-page>
    <ion-content fullscreen scroll-y class="ion-no-padding ion-no-margin">
      <div class="login-holder">
        <div class="header-section" :class="{ 'bg-primary': !isDark }">
          <ion-row>
            <ion-col class="ion-text-center q-mt-xl">
              <img src="/logo/logo-white.png" style="width: 120px; height: auto" />
            </ion-col>
          </ion-row>
          <div class="area">
            <ul class="circles">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
        <div class="wee-login">
          <ion-grid class="ion-no-padding">
            <ion-row v-if="isDeviceRooted" class="ion-align-items-center" style="height: 50vh">
              <ion-col class="q-pa-md">
                <base-result status="error" :icon-size="128" :description="t('error.deviceRootDetect')">
                </base-result>
              </ion-col>
            </ion-row>
            <ion-row v-else class="ion-align-items-center">
              <ion-col>
                <ion-card class="card-clear">
                  <form @submit.prevent="onSubmit" @keydown.enter="onSubmit">
                    <ion-row class="ion-padding ion-margin-horizontal">
                      <ion-col>
                        <div class="q-my-lg">
                          <ion-text class="ion-text-center">
                            <div class="q-text-h5 q-text-weight-bolder">
                              {{ t('authen.login') }}
                            </div>
                          </ion-text>
                        </div>

                        <ion-list lines="none">
                          <ion-item>
                            <div class="wee-login-input">
                              <base-icon :name="personOutline" icon-set="ion" color="grey-8"></base-icon>
                              <ion-input v-model="email" class="q-ml-md" :disabled="loading"
                                :placeholder="t('base.emailOrUsername')"></ion-input>
                            </div>
                          </ion-item>
                          <ion-item>
                            <div class="wee-login-input">
                              <base-icon :name="keyOutline" icon-set="ion" color="grey-8"></base-icon>
                              <ion-input v-model="password" class="q-ml-md" :disabled="loading"
                                :type="!showPassword ? 'password' : 'text'" :placeholder="t('authen.password')"></ion-input>
                              <ion-button fill="clear" size="small" @click="showPassword = !showPassword">
                                <ion-icon :icon="showPassword ? eyeOutline : eyeOffOutline
                                  "></ion-icon>
                              </ion-button>
                            </div>
                          </ion-item>
                          <ion-item :button="false" lines="none">
                            <ion-checkbox v-model="acceptedTerm" label-placement="end">
                              {{ t('base.termAcceptText') }}
                              <a class="app-text-link" :href="PolicyLink" target="_blank"
                                @click="$event.stopPropagation()">
                                {{ t('base.termAcceptText2') }}
                              </a>
                            </ion-checkbox>
                          </ion-item>
                          <ion-item button :detail="true" lines="none" @click="appNavigateTo('/settings/languge')">
                            <ion-icon slot="start" :icon="globeOutline"></ion-icon>
                            <ion-label>
                              {{ t('base.language') }}
                              <p class="ion-text-capitalize">
                                {{ t('base.translations') }}
                              </p>
                            </ion-label>
                            <ion-text slot="end" class="text-muted text-caption">
                              {{ currenLocaleItem?.name }}
                            </ion-text>
                          </ion-item>
                        </ion-list>
                      </ion-col>
                      <ion-col size="12" class="q-mt-md">
                        <ion-button mode="ios" expand="block" class="text-white" :disabled="!canSubmit || !acceptedTerm"
                          type="submit">
                          <ion-spinner v-if="loading" name="dots" color="white"></ion-spinner>
                          <template v-else>
                            {{ t('authen.login') }}
                          </template>
                        </ion-button>
                        <ion-button fill="clear" class="ion-margin-vertical" expand="block" size="small"
                          router-link="/auth/forgot-password">
                          {{ t('authen.forgetPassword') }}
                        </ion-button>
                        <div class="ion-text-center q-text-smaller q-text-muted q-mt-lg">
                          <p>{{ t('app.appVersion', [userVersion]) }}</p>
                          <div>
                            {{ `@ ${getYearNow()} ${t('app.monogram')}` }}
                          </div>
                          <app-mode-detect class="q-mt-sm" />
                        </div>
                      </ion-col>
                    </ion-row>
                  </form>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import AuthenService from '@/api/AuthenService';
import AppModeDetect from '@/components/app/AppModeDetect.vue';
import { useAuthen } from '@/composables/useAuthen';
import { useBase } from '@/composables/useBase';
import { useConfig } from '@/composables/useConfig';
import { useDevice } from '@/composables/useDevice';
import { useLang } from '@/composables/useLang';
import { useNotification } from '@/composables/useNotification';
import { useTheme } from '@/composables/useTheme';
import {
  DefaultColor,
  DeviceIdAtt,
  FcmTokenKey,
  PolicyLink,
} from '@/libs/constant';
import { isAppException } from '@/utils/appUtil';
import { getYearNow } from '@/utils/dateUtil';
import { loadStorage, saveStorage } from '@/utils/storageUtil';
import {
  IonButton,
  IonCard,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
} from '@ionic/vue';
import {
  eyeOffOutline,
  eyeOutline,
  globeOutline,
  keyOutline,
  personOutline,
} from 'ionicons/icons';
import {
  computed,
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
declare let window: any;

const BaseIcon = defineAsyncComponent(
  () => import('@/components/base/BaseIcon.vue'),
);
const BaseResult = defineAsyncComponent(
  () => import('@/components/base/BaseResult.vue'),
);
const {
  setStatusBarColor,
  Style: StatusStyle,
  setDefaultStatusBar,
} = useTheme();
const { registerTopic, userSubscribeFcm } = useNotification();
const { singin } = AuthenService();
const { getEnv } = useConfig();
const { setAuthenticationCookies, destroyAuthDataAndRedirect } = useAuthen();
const { t, currenLocaleItem } = useLang();
const { appNavigateTo, appToast } = useBase();
const { isDark } = useTheme();
const { getPlatformType, getDeviceId } = useDevice();
const email = ref<string | undefined>('admin@mydomain.com');
const password = ref<string | undefined>('P@ssw0rd');
const showPassword = ref<boolean>(false);
const acceptedTerm = ref<boolean>(false);
const userVersion = ref(getEnv<string>('VITE_APP_VERSION'));
const loading = ref(true);
const deviceId = ref();
const isDeviceRooted = ref(false);
onBeforeUnmount(() => {
  setDefaultStatusBar();
});
onMounted(async () => {
  await appInitial(false);
  await userSubscribeFcm(false);
});
const detectRoot = () => {
  if (window && window?.IRoot) {
    window?.IRoot?.isRooted(appInitial, detectRootFailure);
  } else {
    appInitial();
  }
};
const detectRootFailure = () => {
  console.error('Device root detectRootFailure');
};
const appInitial = async (isRoot = false) => {
  loading.value = false;
  if (!isRoot) {
    deviceId.value = await getDeviceId();
    await destroyAuthDataAndRedirect(false);
    setStatusBarColor(DefaultColor, StatusStyle.Dark);
  } else {
    isDeviceRooted.value = true;
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};
const onSubmit = async () => {
  if (!canSubmit.value || loading.value) {
    return;
  }
  if (!acceptedTerm.value) {
    appToast({
      text: t('error.termAcceptEnpty'),
    });
    return;
  }

  loading.value = true;

  await saveStorage(DeviceIdAtt, deviceId.value);
  const platform = await getPlatformType();
  const fcmToken = await loadStorage<string>(FcmTokenKey);
  const response = await singin({
    user: {
      emailOrUsername: email.value,
      password: password.value,
      loginFrom: platform,
      fcmToken,
      deviceId: deviceId.value ? deviceId.value : null,
    },
  });
  if (response && !isAppException(response)) {
    if (response.authenticationToken) {
      await setAuthenticationCookies(response);
      await registerTopic(response.userId);
      window.location.replace('/');
      loading.value = false;
      appToast({
        text: t('success.loginSuccess'),
      });
    }
  } else {
    loading.value = false;
  }
};
const canSubmit = computed(() => {
  if (!email.value || !password.value) {
    return false;
  }

  return email.value.length >= 4 && password.value.length >= 4;
});
</script>
<style scoped lang="scss">
// @import '@/assets/css/login.scss';

ion-content {
  --background: var(--v-color-white);
}

.login-holder {
  height: 100vh;
  overflow: auto;
}

.wee-login {
  margin: auto;
  position: relative;
}

.header-section {
  // background: #3a9ec1;
  //  background: -webkit-linear-gradient(to bottom, #3a9ec1, #add8e7);
  // background: linear-gradient(to bottom, #3a9ec1, #add8e7);
  border: 1px solid transparent;
  height: 185px;
  //max-width: 480px;
  margin: auto;
  position: relative;
  // background-image: url(/login-cover.jpg);
  // background-size: cover;
  // background-repeat: no-repeat;
  // background-position: center center;
}

ion-item.wee-login-input {
  --background: rgba(0, 0, 0, 0);
}

.wee-login-input {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 26px 0;
  background: var(--wee-messenger-inputarea-bg);
  border-radius: 15px;
  padding: 5px 15px;
}

body[color-theme='dark'] .wee-login-input {
  // background: #2d2d2e;
  background: var(--app-bg-color-theme-dark);
}

/* .wee-login-input input {
  background-color: black !important;
} */

.context {
  width: 100%;
  position: absolute;
  top: 50vh;

}

.context h1 {
  text-align: center;
  color: #fff;
  font-size: 50px;
}


.circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circles li {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  animation: animate 25s linear infinite;
  bottom: -150px;

}

.circles li:nth-child(1) {
  left: 25%;
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}


.circles li:nth-child(2) {
  left: 10%;
  width: 20px;
  height: 20px;
  animation-delay: 2s;
  animation-duration: 12s;
}

.circles li:nth-child(3) {
  left: 70%;
  width: 20px;
  height: 20px;
  animation-delay: 4s;
}

.circles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  animation-delay: 0s;
  animation-duration: 18s;
}

.circles li:nth-child(5) {
  left: 65%;
  width: 20px;
  height: 20px;
  animation-delay: 0s;
}

.circles li:nth-child(6) {
  left: 75%;
  width: 110px;
  height: 110px;
  animation-delay: 3s;
}

.circles li:nth-child(7) {
  left: 35%;
  width: 150px;
  height: 150px;
  animation-delay: 7s;
}

.circles li:nth-child(8) {
  left: 50%;
  width: 25px;
  height: 25px;
  animation-delay: 15s;
  animation-duration: 45s;
}

.circles li:nth-child(9) {
  left: 20%;
  width: 15px;
  height: 15px;
  animation-delay: 2s;
  animation-duration: 35s;
}

.circles li:nth-child(10) {
  left: 85%;
  width: 150px;
  height: 150px;
  animation-delay: 0s;
  animation-duration: 11s;
}


@keyframes animate {

  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }

  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }

}
</style>
