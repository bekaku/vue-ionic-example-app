<script setup lang="ts">
import UserService from '@/api/UserService';
import BasePage from '@/components/base/BasePage.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { useAuthenStore } from '@/stores/authenStore';
import type { Country, CountryCode } from '@/types/common';
import type { UserPersonalEditRequest } from '@/types/models';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/vue';
import { checkmarkOutline, chevronDownOutline } from 'ionicons/icons';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { computed, onMounted, ref } from 'vue';
const { t } = useLang();
const { onBack, appLoading } = useBase();
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
  const loading: any = await appLoading();
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
<template>
  <BasePage :page-title="t('base.phoneEdit')" fullscreen show-back-link
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
            <ion-button slot="start" fill="clear" @click="show = true">
              {{ countryCode }}
              <ion-icon slot="end" :icon="chevronDownOutline" />
            </ion-button>

            <ion-input v-model="entity.mobilePhone" :maxlength="20" type="tel" label-placement="stacked"
              :label="t('base.phoneEdit')" />
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
  </BasePage>
</template>