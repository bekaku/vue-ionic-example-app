<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button
            default-href="/settings/account-settings"
          ></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('base.phoneEdit') }}</ion-title>
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
              <ion-button slot="start" fill="clear" @click="show = true">
                {{ countryCode }}
                <ion-icon :icon="chevronDownOutline" slot="end"></ion-icon>
              </ion-button>

              <ion-input
                v-model="entity.mobilePhone"
                :maxlength="20"
                type="tel"
                label-placement="stacked"
                :label="t('base.phoneEdit')"
              ></ion-input>
            </ion-item>
            <ion-item v-if="!phoneValid">
              <ion-label class="ion-text-wrap">
                <p class="text-red">
                  {{ t('error.validatePhone') }}
                </p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>

    <!-- <lazy-base-modal
        v-if="show"
        :model-value="show"
        title="Select country"
        :initial-breakpoint="1"
        :breakpoints="[0, 1]"
        @update:modelValue="(newVal : boolean) => show=newVal"
        @on-close="show = false"
      >
        <ion-item
          v-for="(item, index) in countryList"
          :key="index"
          button
          :detail="false"
        >
          <ion-label> {{ item.name }} </ion-label>
          <ion-icon
            v-if="countryCode == item.code"
            slot="end"
            :icon="checkmarkOutline"
          ></ion-icon>
        </ion-item>
      </lazy-base-modal> -->
  </ion-page>
</template>
<script setup lang="ts">
import { useAuthenStore } from '@/stores/AuthenStore';
import type { UserPersonalEditRequest } from '@/types/Models';
import type { CountryCode, Country } from '@/types/Common';
import UserService from '@/api/UserService';
import { checkmarkOutline, chevronDownOutline } from 'ionicons/icons';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { computed, onMounted, ref } from 'vue';
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
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
import BaseBackButton from '@/components/base/BaseBackButton.vue';
const { t } = useLang();
const { onBack, WeeLoading } = useBase();
const authenStore = useAuthenStore();
const { updatePersonalData } = UserService();

const countryCode = ref<CountryCode>('TH');
const show = ref(false);
const countryList = ref<Country[]>([
  {
    code: 'TH',
    no: 66,
    name: 'Thailand',
  },
]);
const entity = ref<UserPersonalEditRequest>({
  mobilePhone: '',
});

onMounted(() => {
  // if (
  //   authenStore.auth &&
  //   authenStore.auth.userData &&
  //   authenStore.auth.userData.mobilePhone
  // ) {
  //   entity.value.mobilePhone = authenStore.auth.userData.mobilePhone;
  // }
});
const canSubmit = computed(() => {
  return entity.value.mobilePhone && phoneValid.value;
});
const phoneValid = computed(() => {
  return entity.value.mobilePhone
    ? isValidPhoneNumber(entity.value.mobilePhone, countryCode.value)
    : false;
});
const onSubmit = async () => {
  const loading: any = await WeeLoading();
  loading.present();
  const res = await updatePersonalData(entity.value);
  loading.dismiss();

  if (res && res.status == 'OK') {
    // if (authenStore.auth && authenStore.auth.userData) {
    //   authenStore.auth.userData.mobilePhone = entity.value.mobilePhone;
    // }

    onBack();
  }
};
</script>
