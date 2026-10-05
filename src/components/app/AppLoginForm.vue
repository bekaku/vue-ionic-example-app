<script setup lang="ts">
import UserService from '@/api/UserService';
import { useAppStorage } from '@/composables/useAppStorage';
import { useAuthen } from '@/composables/useAuthen';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { useNotification } from '@/composables/useNotification';
import { PolicyLink } from '@/libs/constant';
import type { RefreshTokenResponse } from '@/types/models';
import { IonCheckbox, IonInput, IonSpinner } from '@ionic/vue';
import {
  alertCircleOutline,
  chevronForwardOutline,
  eyeOffOutline,
  eyeOutline,
  globeOutline,
  lockClosedOutline,
  personOutline,
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
  showLanguage = true,
} = defineProps<{
  recoveryPasswordBtn?: boolean;
  recoveryPasswordForm?: boolean;
  verifyDuplicate?: boolean;
  autoRedirect?: boolean;
  redirectTo?: string;
  /** Render the language chip; login.vue shows its own in the top bar */
  showLanguage?: boolean;
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
  <form class="login-form" @submit.prevent="onSubmit" @keydown.enter="onSubmit">
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
      <h1 class="login-title">{{ t('authen.login') }}</h1>
    </slot>

    <div class="app-form">
      <label class="app-field">
        <BaseIcon :name="personOutline" icon-set="ion" style="top: 0" />
        <ion-input
          v-model="email"
          :disabled="loading"
          autocomplete="username"
          inputmode="email"
          label-placement="floating"
          :label="t('base.emailOrUsername')"
        />
      </label>
      <label v-if="veryfySuccess" class="app-field">
        <BaseIcon :name="lockClosedOutline" icon-set="ion" style="top: 0" />
        <ion-input
          v-model="password"
          :disabled="loading"
          autocomplete="current-password"
          :type="!showPassword ? 'password' : 'text'"
          label-placement="floating"
          :label="t('authen.password')"
        />
        <BaseButton
          clear
          round
          icon-only
          :aria-label="
            t(showPassword ? 'authen.hidePassword' : 'authen.showPassword')
          "
          :icon="{
            name: showPassword ? eyeOutline : eyeOffOutline,
            iconSet: 'ion',
          }"
          @click="showPassword = !showPassword"
        />
      </label>
    </div>

    <ion-checkbox
      v-if="veryfySuccess"
      v-model="acceptedTerm"
      class="login-terms"
      label-placement="end"
      justify="start"
    >
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

    <div class="login-actions">
      <BaseButton
        v-if="verifyDuplicate && !veryfySuccess"
        class="login-submit"
        :disabled="!validateUsername || loading"
        full
        @click="onVeryfyAccount"
      >
        <ion-spinner v-if="loading" name="dots" color="light" />
        <template v-else>{{ t('base.continue') }}</template>
      </BaseButton>
      <BaseButton
        v-else-if="veryfySuccess"
        class="login-submit"
        type="submit"
        full
        :disabled="!canSubmit || !acceptedTerm"
      >
        <ion-spinner v-if="loading" name="dots" color="light" />
        <template v-else>{{ t('authen.login') }}</template>
      </BaseButton>
      <BaseButton clear size="small" to="/auth/forgot-password">
        {{ t('authen.forgetPassword') }}
      </BaseButton>
    </div>

    <div v-if="showLanguage" class="login-language">
      <BaseButton
        clear
        size="small"
        class="login-language-btn"
        @click="appNavigateTo('/settings/languge')"
      >
        <BaseIcon
          slot="start"
          :name="globeOutline"
          icon-set="ion"
          :size="16"
          style="top: 0"
        />
        {{ t('base.language') }} · {{ currenLocaleItem?.name }}
        <BaseIcon
          slot="end"
          :name="chevronForwardOutline"
          icon-set="ion"
          :size="14"
          style="top: 0"
        />
      </BaseButton>
    </div>
    <slot name="additionalAction" />
  </form>
</template>
<style lang="scss" scoped>
.login-form {
  display: grid;
  gap: 20px;
}
.login-title {
  margin: 0 0 4px;
  color: var(--app-text-strong);
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
}
/* Long Thai/English consent text wraps instead of being cut off */
.login-terms {
  --size: 22px;
  --checkbox-background-checked: var(--ion-color-primary);
  --border-color: var(--app-text-muted);
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--app-text-muted);
}
.login-terms::part(label) {
  overflow: visible;
  white-space: normal;
  text-overflow: clip;
}
.login-actions {
  display: grid;
  gap: 4px;
  justify-items: center;
}
.login-submit {
  position: relative;
  width: 100%;
  height: 56px;
  margin: 0;
  --background: linear-gradient(
    135deg,
    var(--ion-color-primary-tint) 0%,
    var(--ion-color-primary-shade) 100%
  );
  --color: var(--ion-color-primary-contrast);
  --background-activated: var(--background);
  --border-radius: var(--app-radius-full);
  --box-shadow: 0 12px 28px -10px
      color-mix(in srgb, var(--ion-color-primary) 75%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--color-white) 30%, transparent);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}
/* Light sweep across the enabled button */
.login-submit:not(.button-disabled)::part(native)::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 35%,
    color-mix(in srgb, var(--color-white) 28%, transparent) 50%,
    transparent 65%
  );
  transform: translateX(-100%);
  animation: login-sheen 3.2s var(--app-ease-out) 0.6s infinite;
}
.login-submit.button-disabled {
  --background: var(--app-bg-sunken);
  --color: var(--app-text-muted);
  --box-shadow: none;
  opacity: 1;
}
@keyframes login-sheen {
  60%,
  100% {
    transform: translateX(100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .login-submit::part(native)::after {
    animation: none;
  }
}
.login-language {
  display: flex;
  justify-content: center;
}
.login-language-btn {
  --color: var(--app-text-muted);
  --background: var(--app-bg-sunken);
  --border-radius: var(--app-radius-full);
  --padding-start: 14px;
  --padding-end: 12px;
  font-size: 0.8125rem;
}
</style>
