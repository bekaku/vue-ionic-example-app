<template>
  <ion-page>
    <ion-content fullscreen scroll-y class="ion-no-padding ion-no-margin">
      <div class="login-holder">
        <div class="header-section" :class="{ 'bg-primary': !isDark }">
          <ion-row>
            <ion-col class="ion-text-center q-mt-xl">
              <img src="/icon_white.png" style="width: 120px; height: auto" />
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
            <ion-row
              class="ion-align-items-center"
              style="height: 50vh"
              v-if="isDeviceRooted"
            >
              <ion-col class="q-pa-md">
                <base-result
                  status="error"
                  icon-size="128px"
                  :description="t('error.deviceRootDetect')"
                >
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
                              <base-icon
                                :icon="personOutline"
                                icon-set="ion"
                                color="text-grey-8"
                              ></base-icon>
                              <ion-input
                                class="q-ml-md"
                                :disabled="loading"
                                v-model="email"
                                :placeholder="t('base.emailOrUsername')"
                              ></ion-input>
                            </div>
                          </ion-item>
                          <ion-item>
                            <div class="wee-login-input">
                              <base-icon
                                :icon="keyOutline"
                                icon-set="ion"
                                color="text-grey-8"
                              ></base-icon>
                              <ion-input
                                class="q-ml-md"
                                :disabled="loading"
                                :type="!showPassword ? 'password' : 'text'"
                                v-model="password"
                                :placeholder="t('authen.password')"
                              ></ion-input>
                              <ion-button
                                fill="clear"
                                size="small"
                                @click="showPassword = !showPassword"
                              >
                                <ion-icon
                                  :icon="
                                    showPassword ? eyeOutline : eyeOffOutline
                                  "
                                ></ion-icon>
                              </ion-button>
                            </div>
                          </ion-item>
                          <ion-item :button="false" lines="none">
                            <ion-checkbox
                              v-model="acceptedTerm"
                              label-placement="end"
                            >
                              {{ t('base.termAcceptText') }}
                              <a
                                @click="$event.stopPropagation()"
                                class="app-text-link"
                                :href="PolicyLink"
                                target="_blank"
                              >
                                {{ t('base.termAcceptText2') }}
                              </a>
                            </ion-checkbox>
                          </ion-item>
                          <ion-item
                            button
                            @click="WeeGoTo('/settings/languge')"
                            :detail="true"
                            lines="none"
                          >
                            <ion-icon
                              :icon="globeOutline"
                              slot="start"
                            ></ion-icon>
                            <ion-label>
                              {{ t('base.language') }}
                              <p class="ion-text-capitalize">
                                {{ t('base.translations') }}
                              </p>
                            </ion-label>
                            <ion-text
                              slot="end"
                              class="text-muted text-caption"
                            >
                              {{ currenLocale?.name }}
                            </ion-text>
                          </ion-item>
                        </ion-list>
                      </ion-col>
                      <ion-col size="12" class="q-mt-md">
                        <ion-button
                          mode="ios"
                          expand="block"
                          class="text-white"
                          :disabled="!canSubmit || !acceptedTerm"
                          type="submit"
                        >
                          <ion-spinner
                            v-if="loading"
                            name="dots"
                            color="white"
                          ></ion-spinner>
                          <template v-else>
                            {{ t('authen.login') }}
                          </template>
                        </ion-button>
                        <ion-button
                          fill="clear"
                          class="ion-margin-vertical"
                          expand="block"
                          size="small"
                          router-link="/auth/forgot-password"
                        >
                          {{ t('authen.forgetPassword') }}
                        </ion-button>
                        <div
                          class="ion-text-center q-text-smaller q-text-muted q-mt-lg"
                        >
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
import { loadStorage, saveStorage } from '@/utils/StorageUtil';
import {
  computed,
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
import AuthenService from '@/api/AuthenService';
import { getYearNow } from '@/utils/DateUtil';
import { isAppException } from '@/utils/AppUtil';
import { useLangugeAndThemeStore } from '@/stores/LangugeAndThemeStore';
import { useNotification } from '@/composables/UseNotification';
import { useConfig } from '@/composables/UseConfig';
import { useAuthen } from '@/composables/UseAuthen';
import { useLang } from '@/composables/UseLang';
import { useBase } from '@/composables/UseBase';
import { useTheme } from '@/composables/UseTheme';
import { useDevice } from '@/composables/UseDevice';
import { availableLocales } from '@/utils/LangUtil';
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
  DefaultColor,
  DeviceIdAtt,
  FcmTokenKey,
  PolicyLink,
} from '@/utils/Constant';
import AppModeDetect from '@/components/app/AppModeDetect.vue';
declare let window: any;

const BaseIcon = defineAsyncComponent(
  () => import('@/components/base/Icon.vue'),
);
const BaseResult = defineAsyncComponent(
  () => import('@/components/base/Result.vue'),
);
const {
  setStatusBarColor,
  Style: StatusStyle,
  setDefaultStatusBar,
} = useTheme();
const langugeAndThemeStore = useLangugeAndThemeStore();
const { registerTopic, userSubscribeFcm } = useNotification();
const { singin } = AuthenService();
const { getConfigPublic } = useConfig();
const { setAuthenticationCookies, destroyAuthDataAndRedirect } = useAuthen();
const { t } = useLang();
const { WeeGoTo, WeeToast, isDark } = useBase();
const { getPlatformType, getDeviceId } = useDevice();
const email = ref<string | undefined>('admin@mydomain.com');
const password = ref<string | undefined>('P@ssw0rd');
const showPassword = ref<boolean>(false);
const acceptedTerm = ref<boolean>(false);
const userVersion = ref(getConfigPublic('appVersion'));
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
    WeeToast({
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
      fcmToken: fcmToken,
      // fcmToken: localStorage.getItem(FcmTokenKey),
      deviceId: deviceId.value ? deviceId.value : null,
    },
  });
  if (!isAppException(response)) {
    if (response.authenticationToken) {
      await setAuthenticationCookies(response);
      await registerTopic(response.userId);
      window.location.replace('/');
      loading.value = false;
      WeeToast({
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

const currenLocale = computed(() =>
  availableLocales.find((t) => t.iso == langugeAndThemeStore.locale),
);
</script>
<style scoped lang="scss">
@import '@/assets/css/login.scss';

ion-content {
  --background: var(--v-color-white);
}
</style>
