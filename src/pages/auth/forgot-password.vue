<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button text="" default-href="/auth/login"></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('authen.forgetPassword') }}</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-content fullscreen class="ion-padding" :scroll-y="false">
        <ion-row class="ion-align-items-center" style="height: 80vh">
          <ion-col class="ion-no-padding ion-no-margin">
            <base-swiper-slides :paramiters="{
              pagination: false,
              allowTouchMove: false,
              initialSlide: 0
            }" v-model:slideAction="slideAction">
              <app-swiper-slide class="swiper-slide">
                <div class="slide">
                  <div class="q-pa-md text-center">
                    <div class="q-text-h5">
                      {{ t('authen.verification') }}
                    </div>
                    <div class="q-text-caption">
                      {{ t('authen.forgotPwdTitle') }}
                    </div>
                    <div class="q-text-small text-muted">
                      {{ t('authen.forgotPwdSubtitle') }}
                    </div>
                  </div>

                  <ion-item lines="none">
                    <ion-icon slot="start" :icon="mailOutline" />
                    <ion-input v-model="entity.email" label-placement="stacked" :label="t('base.email')"></ion-input>
                  </ion-item>
                  <ion-item v-if="isMailValid !== true && entity.email && entity.email.length > 0">
                    <ion-label class="ion-text-wrap">
                      <p class="text-red">
                        {{ isMailValid }}
                      </p>
                    </ion-label>
                  </ion-item>
                  <ion-button expand="block" class="q-py-sm" @click="requestVerifyCode" :disabled="isMailValid !== true">
                    {{ t('base.continue') }}
                  </ion-button>
                </div>
              </app-swiper-slide>

              <app-swiper-slide class="swiper-slide">
                <div class="slide">
                  <div class="q-pa-md">
                    <div class="q-text-h5">
                      {{ t('authen.verificationCode') }}
                    </div>

                    <div class="q-text-body1">
                      {{ t('authen.login_main_helper4') }}
                    </div>
                    <div class="q-text-subtitle2">
                      {{ t('authen.login_main_helper5') }}
                    </div>
                    <div class="q-text-subtitle2 text-danger">
                      {{ t('authen.login_main_helper6') }}
                    </div>
                  </div>
                  <ion-item lines="none">
                    <ion-icon slot="start" :icon="keyOutline" />
                    <ion-input v-model="entity.token" label-placement="stacked"
                      :label="t('authen.verificationCode')"></ion-input>
                  </ion-item>
                </div>
              </app-swiper-slide>
              <app-swiper-slide class="swiper-slide">
                <div class="slide">
                  <password-form v-model:newPassword="entity.newPassword" v-model:loading="loading"
                    @on-submit="setNewPassword"></password-form>
                </div>
              </app-swiper-slide>
            </base-swiper-slides>
          </ion-col>
        </ion-row>
      </ion-content>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { SwiperSlide as AppSwiperSlide } from 'swiper/vue';
import { alertCircleOutline, closeOutline, keyOutline, mailOutline } from 'ionicons/icons';
import { computed, ref, watch } from 'vue';
import BaseSwiperSlides from '@/components/base/SwiperSlides.vue';
import BaseToolbar from '@/components/base/BaseToolbar.vue';
import BaseBackButton from '@/components/base/BaseBackButton.vue';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle
} from '@ionic/vue';
import AuthenService from '@/api/AuthenService';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { useValidation } from '@/composables/useValidation';
import PasswordForm from '@/components/app/PasswordForm.vue'
import type { AppException, ForgotPasswordRequest, ResponseMessage } from '@/types/common';

const { appLoading, appNavigateTo, appToast } = useBase();
const { t } = useLang();
const slideAction = ref<'next' | 'prev' | undefined>(undefined);

const { requestVerifyCodeToResetPwd, sendVerifyCodeToResetPwd, resetPassword }
  = AuthenService();
const { requireEmail } = useValidation();
const entity = ref<ForgotPasswordRequest>({
  email: '',
  token: '',
  newPassword: '',
  confirmPassword: '',
});
const loading = ref(false);
const isMailValid = computed(() => requireEmail(entity.value.email));

const requestVerifyCode = async () => {
  if (!entity.value.email) {
    return;
  }
  const loading: any = await appLoading();
  loading.present();
  const res = await requestVerifyCodeToResetPwd(entity.value);
  loading.dismiss();
  if (res && res.status && res.status == 200) {
    const responseData = res.data as ResponseMessage;
    if (responseData.message) {
      appToast({
        headerText: t('authen.verification'),
        text: responseData.message,
        icon: mailOutline,
        color: 'success',
        closeIcon: closeOutline,
        time: 3000
      });
    }
    slideAction.value = 'next';
  } else if (res && res.data) {
    notifyError(res.data as AppException);
  }
};
const verifyCode = async (code?: string) => {
  console.log('verifyCode', code);
  if (!code || !entity.value.email) {
    return;
  }
  entity.value.token = code;
  const loading: any = await appLoading();
  loading.present();
  const res = await sendVerifyCodeToResetPwd(entity.value);
  loading.dismiss();
  if (res && res.status != undefined && res.status != 200) {
    notifyError(res.data as AppException);
  } else {
    slideAction.value = 'next';
  }
};
const notifyError = async (error: AppException) => {
  if (error.errors) {
    appToast({
      headerText: t('authen.forgetPassword'),
      text: error.errors.toString(),
      icon: alertCircleOutline,
      color: 'danger',
      closeIcon: closeOutline,
      time: 3000
    });
  }
};
const setNewPassword = async () => {
  if (!entity.value.token || !entity.value.email || !entity.value.newPassword) {
    return;
  }
  const loading: any = await appLoading();
  loading.present();
  const res = await resetPassword(entity.value);
  loading.dismiss();
  if (res && res.status && res.status == 200) {
    const responseData = res.data as ResponseMessage;
    if (responseData.message) {
      await appToast({
        headerText: t('authen.setPassword'),
        text: responseData.message,
        icon: mailOutline,
        color: 'success',
        closeIcon: closeOutline,
        time: 3000
      });
    }
    appNavigateTo('/auth/login');
  } else if (res && res.data) {
    notifyError(res.data as AppException);
  }
};
watch(
  () => entity.value.token,
  async (newtoken: any) => {
    if (newtoken && newtoken.length == 6) {
      verifyCode(newtoken);
    }
  },
);
</script>
