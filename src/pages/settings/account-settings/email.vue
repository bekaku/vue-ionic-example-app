<script setup lang="ts">
import UserService from '@/api/UserService';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { useAuthenStore } from '@/stores/authenStore';
import type { UserPersonalEditRequest } from '@/types/models';
import { validateEmail } from '@/utils/appUtil';
import {
  IonButton,
  IonButtons,
  IonIcon
} from '@ionic/vue';
import { checkmarkOutline, mailOutline } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
const { t } = useLang();
const { onBack, appLoading } = useBase();
const authenStore = useAuthenStore();
const { updateEmail } = UserService();
const entity = ref<UserPersonalEditRequest>({
  email: '',
});

onMounted(() => {
  if (authenStore.auth && authenStore.auth.email) {
    entity.value.email = authenStore.auth.email;
  }
});
const canSubmit = computed(() => {
  return entity.value.email && emailValid.value;
});
const emailValid = computed(() => {
  return entity.value.email ? validateEmail(entity.value.email) : false;
});
const onSubmit = async () => {
  const loading: any = await appLoading();
  loading.present();
  const res = await updateEmail(entity.value);
  loading.dismiss();

  if (res && res.status == 'OK') {
    if (authenStore.auth) {
      authenStore.auth.email = entity.value.email as string;
    }

    onBack();
  }
};
</script>
<template>
  <BasePage :page-title="t('authSessions')" fullscreen show-back-link
    page-default-back-link="/settings/account-settings">
    <template #end>
      <ion-buttons>
        <ion-button :disabled="!canSubmit" @click="onSubmit">
          <ion-icon slot="start" :icon="checkmarkOutline" />
          {{ t('base.submit') }}
        </ion-button>
      </ion-buttons>
    </template>
    <BaseCard>
      <BaseInput v-model="entity.email" :icon="mailOutline" type="email" :label="t('base.emailEdit')" />
    </BaseCard>
  </BasePage>
</template>