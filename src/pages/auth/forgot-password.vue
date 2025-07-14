<template>
  <BasePage
    :page-title="t('authen.forgetPassword')"
    fullscreen
    light
    :content-padding="false"
    page-default-back-link="/auth/login"
  >
    <ion-row class="ion-align-items-center" style="height: 80vh">
      <ion-col class="ion-no-padding ion-no-margin">
        <base-swiper-slides
          v-model:slideAction="slideAction"
          :paramiters="{
            pagination: false,
            allowTouchMove: false,
            initialSlide: 0,
          }"
        >
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

              <BaseInput
                v-model="entity.email"
                label-placement="stacked"
                :icon="{
                  name: mailOutline,
                }"
                :label="t('base.email')"
              />
              <ion-item
                v-if="
                  isMailValid !== true &&
                  entity.email &&
                  entity.email.length > 0
                "
              >
                <ion-label class="ion-text-wrap">
                  <p class="text-red">
                    {{ isMailValid }}
                  </p>
                </ion-label>
              </ion-item>
              <ion-button
                expand="block"
                class="q-py-sm"
                :disabled="isMailValid !== true"
                @click="requestVerifyCode"
              >
                {{ t('base.continue') }}
              </ion-button>
            </div>
          </app-swiper-slide>

          <app-swiper-slide class="swiper-slide">
            <div v-if="step === 2" class="slide">
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
              <BaseInput
                v-model="entity.token"
                label-placement="stacked"
                :icon="{
                  name: keyOutline,
                }"
                :label="t('authen.verificationCode')"
              />
            </div>
          </app-swiper-slide>
          <app-swiper-slide class="swiper-slide">
            <div v-if="step === 3" class="slide">
              <password-form
                v-model:newPassword="entity.newPassword"
                v-model:loading="loading"
                @on-submit="setNewPassword"
              ></password-form>
            </div>
          </app-swiper-slide>
        </base-swiper-slides>
      </ion-col>
    </ion-row>
  </BasePage>
</template>
<script setup lang="ts">
import AuthenService from '@/api/AuthenService';
import PasswordForm from '@/components/app/PasswordForm.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseSwiperSlides from '@/components/base/SwiperSlides.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { useValidation } from '@/composables/useValidation';
import type {
  AppException,
  ForgotPasswordRequest,
  ResponseMessage,
} from '@/types/common';
import {
  IonButton,
  IonCol,
  IonItem,
  IonLabel,
  IonRow
} from '@ionic/vue';
import {
  alertCircleOutline,
  closeOutline,
  keyOutline,
  mailOutline,
} from 'ionicons/icons';
import { SwiperSlide as AppSwiperSlide } from 'swiper/vue';
import { computed, ref, watch } from 'vue';

const { appLoading, appNavigateTo, appToast } = useBase();
const { t } = useLang();
const slideAction = ref<'next' | 'prev' | undefined>(undefined);

const { requestVerifyCodeToResetPwd, sendVerifyCodeToResetPwd, resetPassword } =
  AuthenService();
const { requireEmail } = useValidation();
const entity = ref<ForgotPasswordRequest>({
  email: '',
  token: '',
  newPassword: '',
  confirmPassword: '',
});
const loading = ref(false);
const step = ref<number>(1);
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
    step.value = 2;
    if (responseData.message) {
      appToast({
        headerText: t('authen.verification'),
        text: responseData.message,
        icon: mailOutline,
        color: 'success',
        closeIcon: closeOutline,
        time: 3000,
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
    step.value = 3;
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
      time: 3000,
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
        time: 3000,
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
