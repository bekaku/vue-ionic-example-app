<script setup lang="ts">
import UserService from '@/api/UserService';
import PasswordForm from '@/components/app/PasswordForm.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useAuthen } from '@/composables/useAuthen';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { onBeforeUnmount, ref } from 'vue';

const { t } = useLang();
const { appLoading } = useBase();
const { selfUpdatePassword } = UserService();
const { signOut } = useAuthen();
const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const logoutAllDevice = ref(true);
const timeout = ref<any>(null);
const loading = ref(false);

const onSubmit = async () => {
  const loading: any = await appLoading();
  loading.present();
  const res = await selfUpdatePassword({
    password: currentPassword.value,
    newPassword: newPassword.value,
    logoutAllDevice: logoutAllDevice.value,
  });
  loading.dismiss();
  if (res && res.status == 'OK') {
    timeout.value = setTimeout(() => {
      signOut();
    }, 500);
  }
};
onBeforeUnmount(() => {
  if (timeout.value) {
    clearTimeout(timeout.value);
    timeout.value = null;
  }
});
</script>
<template>
  <BasePage
    :page-title="t('updatePassword')"
    fullscreen
    show-back-link
    page-default-back-link="/settings/account-settings"
  >
    <password-form
      v-model:currentPassword="currentPassword"
      v-model:newPassword="newPassword"
      v-model:logoutAllDevice="logoutAllDevice"
      v-model:loading="loading"
      show-current-password
      show-logout
      :submit-label="t('updatePassword')"
      action-align="left"
      @on-submit="onSubmit"
    />
  </BasePage>
</template>
