<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button
            default-href="/settings/account-settings"
          ></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('base.privateData') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :disabled="!canSubmit" @click="onSubmit">
            <ion-icon :icon="checkmarkOutline" slot="start"></ion-icon>
            {{ t('base.submit') }}
          </ion-button>
        </ion-buttons>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-card class="ion-no-margin no-border-radius">
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-input
                v-model="entity.fullName"
                label-placement="stacked"
                :label="t('base.editName')"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input
                v-model="entity.positionName"
                label-placement="stacked"
                :label="t('model.user_data.positionName')"
              ></ion-input>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { useAuthenStore } from '@/stores/AuthenStore';
import { UserPersonalEditRequest } from '@/types/Models';
import UserService from '@/api/UserService';
import { checkmarkOutline } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
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
import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BackButton.vue';

const { t } = useLang();
const { onBack, WeeLoading } = useBase();
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
  const loading: any = await WeeLoading();
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
