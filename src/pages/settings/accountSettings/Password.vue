<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button
            default-href="/settings/account-settings"
          ></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('updatePassword') }}</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <password-form
        v-model:currentPassword="currentPassword"
        v-model:newPassword="newPassword"
        v-model:logoutAllDevice="logoutAllDevice"
        v-model:loading="loading"
        show-current-password
        show-logout
        @on-submit="onSubmit"
        :submit-label="t('updatePassword')"
        action-align="left"
      ></password-form>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import UserService from '@/api/UserService';
import { useAuthen } from '@/composables/UseAuthen';
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
import { onBeforeUnmount, ref } from 'vue';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
} from '@ionic/vue';
import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BackButton.vue';
import PasswordForm from '@/components/app/PasswordForm.vue';

const { t } = useLang();
const { WeeLoading } = useBase();
const { selfUpdatePassword } = UserService();
const { signOut } = useAuthen();
const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const rePassword = ref<string>('');
const logoutAllDevice = ref(true);
const timeout = ref<any>(null);
const loading = ref(false);

const onSubmit = async () => {
  const loading: any = await WeeLoading();
  loading.present();
  const res = await selfUpdatePassword({
    userChangePasswordRequest: {
      password: currentPassword.value,
      newPassword: newPassword.value,
      logoutAllDevice: logoutAllDevice.value,
    },
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
