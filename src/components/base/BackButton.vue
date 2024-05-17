<template>
  <ion-back-button
    :text="text ? text : t('base.back')"
    :icon="icon ? icon : chevronBack"
    :default-href="defaultHref"
  ></ion-back-button>
  <!-- <ion-back-button
    :text="text ? text : isAppPlatfrom('ios') ? t('base.back') : undefined"
    :icon="icon ? icon : isAppPlatfrom('ios') ? chevronBack : arrowBack"
    :default-href="defaultHref"
  ></ion-back-button> -->
</template>
<script setup lang="ts">
import { useDevice } from '@/composables/UseDevice';
import { useLang } from '@/composables/UseLang';
import { arrowBack, chevronBack } from 'ionicons/icons';
import { IonBackButton } from '@ionic/vue';
defineProps({
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: undefined,
  },
  defaultHref: {
    type: String,
    default: '/tabs/home',
  },
});
const { isAppPlatfrom } = useDevice();
const { t } = useLang();
</script>
