<script setup lang="ts">
import UserService from '@/api/UserService';
import BasePage from '@/components/base/BasePage.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { useAuthenStore } from '@/stores/authenStore';
import type { UserPersonalEditRequest } from '@/types/models';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonIcon,
  IonInput,
  IonItem,
  IonList
} from '@ionic/vue';
import { checkmarkOutline } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';

const { t } = useLang();
const { onBack, appLoading } = useBase();
const authenStore = useAuthenStore();
const { updatePersonalData } = UserService();
const entity = ref<UserPersonalEditRequest>({
  fullName: '',
  positionName: '',
  teamLeaderName: '',
});
onMounted(() => {
  if (authenStore.auth) {
    if (authenStore.auth.username) {
      entity.value.fullName = authenStore.auth.username;
    }
  }
});
const canSubmit = computed(() => {
  return entity.value.fullName && entity.value.fullName.length >= 4;
});
const onSubmit = async () => {
  const loading: any = await appLoading();
  loading.present();
  const res = await updatePersonalData(entity.value);
  loading.dismiss();
  // if (authenStore.auth && authenStore.auth.userData) {
  //   authenStore.auth.userData.fullName = entity.value.fullName;
  //   authenStore.auth.userData.positionName = entity.value.positionName;
  //   authenStore.auth.userData.teamLeaderName = entity.value.teamLeaderName;
  // }
  onBack();
};
</script>
<template>
  <BasePage :page-title="t('base.privateData')" fullscreen show-back-link
    page-default-back-link="/settings/account-settings">
    <template #end>
      <ion-buttons>
        <ion-button :disabled="!canSubmit" @click="onSubmit">
          <ion-icon slot="start" :icon="checkmarkOutline" />
          {{ t('base.submit') }}
        </ion-button>
      </ion-buttons>
    </template>
    <ion-card class="ion-no-margin no-border-radius">
      <ion-card-content>
        <ion-list>
          <ion-item>
            <ion-input v-model="entity.fullName" label-placement="stacked" :label="t('base.editName')" />
          </ion-item>
          <ion-item>
            <ion-input v-model="entity.positionName" label-placement="stacked"
              :label="t('model.user_data.positionName')" />
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </BasePage>
</template>