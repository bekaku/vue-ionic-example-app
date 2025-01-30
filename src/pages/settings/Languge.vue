<template>
  <base-layout :page-title="t('base.language')" fullscreen :content-padding="false" show-back-link>
    <IonicCard flat :title="t('base.chooseLanguge')">
      <ion-list>
        <ion-item lines="none" v-for="lang in availableLocales" :key="lang.iso" @click="onSwichLanguge(lang.iso)">
          <ion-label>{{ lang.name }}</ion-label>
          <ion-icon v-if="lang.iso == locale" slot="end" color="primary" :icon="checkmarkCircle"></ion-icon>
        </ion-item>
      </ion-list>
    </IonicCard>
  </base-layout>
</template>
<script setup lang="ts">
import UserService from '@/api/UserService';
import BaseLayout from '@/components/base/BaseLayout.vue';
import IonicCard from '@/components/ionic/IonicCard.vue';
import { availableLocales, useLang } from '@/composables/UseLang';
import { useAuthenStore } from '@/stores/AuthenStore';
import type { AppLocale } from '@/types/Common';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import { checkmarkCircle } from 'ionicons/icons';


const authenStore = useAuthenStore();
const { updateDefaultLocale } = UserService();
const { t, setLocale, locale } = useLang();
const onSwichLanguge = async (l: AppLocale) => {
  setLocale(l);
  if (authenStore.auth) {
    await updateDefaultLocale(l);
    window.location.replace('/');
  }
}
</script>
