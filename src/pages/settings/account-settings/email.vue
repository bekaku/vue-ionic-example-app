<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button default-href="/settings/account-settings">
          </base-back-button>
        </ion-buttons>
        <ion-title> {{ t('base.emailEdit') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :disabled="!canSubmit" @click="onSubmit">
            <ion-icon :icon="checkmarkOutline" slot="start"></ion-icon>
            {{ t('base.submit') }}
          </ion-button>
        </ion-buttons>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-card class="card-clear">
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-input v-model="entity.email" type="email" label-placement="stacked"
                :label="t('base.emailEdit')"></ion-input>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { useAuthenStore } from '@/stores/authenStore';
import type { UserPersonalEditRequest } from '@/types/models';
import { validateEmail } from '@/utils/appUtil';
import UserService from '@/api/UserService';
import { checkmarkOutline } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import {
  IonPage,
  IonList,
  IonItem,
  IonButtons,
  IonButton,
  IonInput,
  IonIcon,
  IonContent,
  IonHeader,
  IonTitle,
  IonCardContent,
  IonCard,
} from '@ionic/vue';
import BaseToolbar from '@/components/base/BaseToolbar.vue';
import BaseBackButton from '@/components/base/BaseBackButton.vue';
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
