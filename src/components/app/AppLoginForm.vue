<script setup lang="ts">
import UserService from '@/api/UserService';
import { useAppStorage } from '@/composables/useAppStorage';
import { useAuthen } from '@/composables/useAuthen';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { useNotification } from '@/composables/useNotification';
import { PolicyLink } from '@/libs/constant';
import type { RefreshTokenResponse } from '@/types/models';
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
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
  alertCircleOutline,
} from 'ionicons/icons';
import { computed, defineAsyncComponent, ref } from 'vue';
import BaseAlert from '../base/BaseAlert.vue';
import BaseButton from '../base/BaseButton.vue';

const BaseIcon = defineAsyncComponent(
  () => import('@/components/base/BaseIcon.vue'),
);
const {
  verifyDuplicate = false,
  autoRedirect = true,
  redirectTo = '/',
} = defineProps<{
  recoveryPasswordBtn?: boolean;
  recoveryPasswordForm?: boolean;
  verifyDuplicate?: boolean;
  autoRedirect?: boolean;
  redirectTo?: string;
}>();
const emit = defineEmits<{
  'on-success': [RefreshTokenResponse | null];
}>();
const { singinProcess } = useAuthen();
const { verifyUserByEmailOrUsername } = UserService();
const { registerTopic } = useNotification();
const { t, currenLocaleItem } = useLang();
const { appNavigateTo, appToast, inputSanitizeHtml } = useBase();
const { getAllJwtTokens } = useAppStorage();
const email = ref<string | undefined>('admin@mydomain.com');
const password = ref<string | undefined>('P@ssw0rd');
const showPassword = ref<boolean>(false);
const acceptedTerm = ref<boolean>(false);
const loading = ref(false);
const redirectTimeout = ref<any>(null);
const veryfySuccess = ref<boolean>(!verifyDuplicate);
const showError = ref<boolean>(false);
const errorMessage = ref<string | undefined>();
const validateUsername = computed(() => {
  return !!email.value && email.value.trim().length >= 4;
});
const canSubmit = computed(() => {
  return (
    validateUsername.value && !!password.value && password.value.length >= 4
  );
});
const onSubmit = async () => {
  if (!canSubmit.value || loading.value || !email.value || !password.value) {
    return;
  }
  if (!acceptedTerm.value) {
    appToast({
      text: t('error.termAcceptEnpty'),
    });
    return;
  }

  loading.value = true;
  try {
    const response = await singinProcess(email.value, password.value);
    if (
      autoRedirect &&
      redirectTo &&
      response != null &&
      response.authenticationToken
    ) {
      await registerTopic(response.userId);
      redirectTimeout.value = setTimeout(() => {
        window.location.replace(redirectTo || '/');
      }, 350);
      loading.value = false;
      appToast({
        text: t('success.loginSuccess'),
      });
      emit('on-success', response);
    }
  } catch (error) {
    console.error('AppLoginForm', error);
    emit('on-success', null);
  } finally {
    loading.value = false;
  }
};
const onVeryfyAccount = async () => {
  if (!email.value) {
    return;
  }
  showError.value = false;
  loading.value = true;
  try {
    const response = await verifyUserByEmailOrUsername(
      inputSanitizeHtml(email.value),
    );
    if (response && response.userId != null) {
      const allJwts = await getAllJwtTokens();
      if (allJwts && allJwts.length > 0) {
        const jwtExist = allJwts.find((jwt) => jwt.userId == response.userId);
        if (jwtExist) {
          veryfySuccess.value = false;
          showError.value = true;
          errorMessage.value = t('error.userNameDuplicateInDevice');
        } else {
          veryfySuccess.value = true;
          showError.value = false;
          errorMessage.value = undefined;
        }
      }
    } else {
      veryfySuccess.value = false;
      showError.value = true;
      errorMessage.value = t('error.emailOrUsernameNotFound');
    }
  } catch (error) {
    console.error('AppLoginForm', error);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <form @submit.prevent="onSubmit" @keydown.enter="onSubmit">
    <ion-row>
      <ion-col>
        <BaseAlert
          v-if="showError && errorMessage"
          :message="errorMessage"
          :icon="alertCircleOutline"
          radius
          type="is-danger"
          class="q-mb-sm"
          closeable
        />
        <slot name="top">
          <div class="q-my-lg">
            <ion-text class="ion-text-center">
              <div class="q-text-h5 q-text-weight-bolder">
                {{ t('authen.login') }}
              </div>
            </ion-text>
          </div>
        </slot>
        <ion-list lines="none">
          <ion-item>
            <div class="wee-login-input">
              <base-icon
                :name="personOutline"
                icon-set="ion"
                color="grey-8"
              ></base-icon>
              <ion-input
                v-model="email"
                class="q-ml-md"
                :disabled="loading"
                :placeholder="t('base.emailOrUsername')"
              ></ion-input>
            </div>
          </ion-item>
          <template v-if="veryfySuccess">
            <ion-item>
              <div class="wee-login-input">
                <base-icon
                  :name="keyOutline"
                  icon-set="ion"
                  color="grey-8"
                ></base-icon>
                <ion-input
                  v-model="password"
                  class="q-ml-md"
                  :disabled="loading"
                  :type="!showPassword ? 'password' : 'text'"
                  :placeholder="t('authen.password')"
                ></ion-input>
                <ion-button
                  fill="clear"
                  size="small"
                  @click="showPassword = !showPassword"
                >
                  <ion-icon
                    :icon="showPassword ? eyeOutline : eyeOffOutline"
                  ></ion-icon>
                </ion-button>
              </div>
            </ion-item>
            <ion-item :button="false" lines="none">
              <ion-checkbox v-model="acceptedTerm" label-placement="end">
                {{ t('base.termAcceptText') }}
                <a
                  class="app-text-link"
                  :href="PolicyLink"
                  target="_blank"
                  @click="$event.stopPropagation()"
                >
                  {{ t('base.termAcceptText2') }}
                </a>
              </ion-checkbox>
            </ion-item>
          </template>
          <ion-item
            button
            :detail="true"
            lines="none"
            @click="appNavigateTo('/settings/languge')"
          >
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
        <template v-if="verifyDuplicate && !veryfySuccess">
          <BaseButton
            :disabled="!validateUsername || loading"
            :loading="loading"
            full
            @click="onVeryfyAccount"
          >
            <ion-spinner v-if="loading" name="dots" color="white"></ion-spinner>
            <template v-else>
              {{ t('base.continue') }}
            </template>
          </BaseButton>
        </template>
        <template v-else-if="veryfySuccess">
          <ion-button
            mode="ios"
            expand="block"
            class="text-white q-mx-sm"
            :disabled="!canSubmit || !acceptedTerm"
            type="submit"
          >
            <ion-spinner v-if="loading" name="dots" color="white"></ion-spinner>
            <template v-else>
              {{ t('authen.login') }}
            </template>
          </ion-button>
        </template>
        <ion-button
          fill="clear"
          class="ion-margin-vertical"
          expand="block"
          size="small"
          router-link="/auth/forgot-password"
        >
          {{ t('authen.forgetPassword') }}
        </ion-button>
        <slot name="additionalAction" />
      </ion-col>
    </ion-row>
  </form>
</template>
<style lang="scss" scoped>
ion-item.wee-login-input {
  --background: rgba(0, 0, 0, 0);
}

.wee-login-input {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 15px 0;
  background: var(--wee-messenger-inputarea-bg);
  border-radius: 15px;
  padding: 5px 15px;
}

body[color-theme='dark'] .wee-login-input {
  // background: #2d2d2e;
  background: var(--app-bg-color-theme-dark);
}
</style>
