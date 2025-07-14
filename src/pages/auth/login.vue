<script setup lang="ts">
import AppLoginForm from '@/components/app/AppLoginForm.vue';
import AppModeDetect from '@/components/app/AppModeDetect.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseSpinner from '@/components/base/BaseSpinner.vue';
import { useAppStorage } from '@/composables/useAppStorage';
import { useAuthen } from '@/composables/useAuthen';
import { useConfig } from '@/composables/useConfig';
import { useLang } from '@/composables/useLang';
import { useNotification } from '@/composables/useNotification';
import { useTheme } from '@/composables/useTheme';
import { DefaultColor } from '@/libs/constant';
import { getYearNow } from '@/utils/dateUtil';
import {
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
} from '@ionic/vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
const {
  setStatusBarColor,
  Style: StatusStyle,
  setDefaultStatusBar,
} = useTheme();
const { userSubscribeFcm } = useNotification();
const { getEnv } = useConfig();
const { destroyAuthDataAndRedirect } = useAuthen();
const { t } = useLang();
const { isDark } = useTheme();
const { getCurrentUserToken } = useAppStorage();
const userVersion = ref(getEnv<string>('VITE_APP_VERSION'));
const pageTimeout = ref<any>();
const initialized = ref(false);
onBeforeUnmount(() => {
  setDefaultStatusBar();
});
onMounted(async () => {
  await validateIsLogedIn();
  await userSubscribeFcm(false);
  await setStatusBarColor(DefaultColor, StatusStyle.Dark);
});
const validateIsLogedIn = async () => {
  const currentToken = await getCurrentUserToken();
  if (currentToken && currentToken.authenticationToken) {
    console.log('currentToken', currentToken);
    window.location.replace('/tabs/home');
  } else {
    await destroyAuthDataAndRedirect(false);
  }

  return new Promise((resolve) => {
    pageTimeout.value = setTimeout(() => {
      initialized.value = true;
      resolve(true);
    }, 100);
  });
};
onBeforeUnmount(() => {
  setDefaultStatusBar();
  if (pageTimeout.value) {
    clearTimeout(pageTimeout.value);
  }
});
</script>
<template>
  <ion-page>
    <ion-content fullscreen scroll-y class="ion-no-padding ion-no-margin">
      <div class="login-holder">
        <div
          v-if="initialized"
          class="header-section"
          :class="{ 'bg-primary': !isDark }"
        >
          <ion-row>
            <ion-col class="ion-text-center q-mt-xl">
              <img
                src="/logo/logo-white.png"
                style="width: 120px; height: auto"
              />
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
            <ion-row v-if="initialized" class="ion-align-items-center">
              <ion-col>
                <ion-card class="no-shadow">
                  <AppLoginForm>
                    <template #additionalAction>
                      <div
                        class="ion-text-center q-text-smaller q-text-muted q-my-lg"
                      >
                        <p>{{ t('app.appVersion', [userVersion]) }}</p>
                        <div>
                          {{ `@ ${getYearNow()} ${t('app.monogram')}` }}
                        </div>
                        <app-mode-detect class="q-mt-sm" />
                      </div>
                    </template>
                  </AppLoginForm>
                </ion-card>
              </ion-col>
            </ion-row>
            <ion-row
              v-else
              class="ion-align-items-center"
              style="height: 100vh"
            >
              <ion-col class="ion-no-padding">
                <BaseCard>
                  <div class="ion-text-center">
                    <p>{{ t('base.pleaseWait') }}</p>
                    <p>
                      <BaseSpinner />
                    </p>
                  </div>
                </BaseCard>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
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
