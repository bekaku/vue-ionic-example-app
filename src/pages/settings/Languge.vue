<template>
  <base-layout
    :page-title="t('base.language')"
    fullscreen
    :content-padding="false"
    show-back-link
  >
    <ion-card>
      <ion-list>
        <ion-item lines="none">
          <ion-label>
            <h2 class="text-muted">{{ t('base.chooseLanguge') }}</h2>
          </ion-label>
        </ion-item>
        <ion-item
          lines="none"
          v-for="lang in availableLocales"
          :key="lang.iso"
          @click="langugeAndThemeStore.setLocale(lang.iso)"
        >
          <ion-label>{{ lang.name }}</ion-label>
          <ion-icon
            v-if="lang.iso == langugeAndThemeStore.locale"
            slot="end"
            color="primary"
            :icon="checkmarkCircle"
          ></ion-icon>
        </ion-item>
      </ion-list>
    </ion-card>
  </base-layout>
</template>
<script setup lang="ts">
import { useLangugeAndThemeStore } from '@/stores/LangugeAndThemeStore';
import { availableLocales } from '@/utils/LangUtil';
import { AppLocale } from '@/types/Models';
import { checkmarkCircle } from 'ionicons/icons';
import UserService from '@/api/UserService';
import { useAuthenStore } from '@/stores/AuthenStore';
import { watch } from 'vue';
import { useLang } from '@/composables/UseLang';
import { useCache } from '@/composables/UseCache';
import { IonList, IonItem, IonLabel, IonIcon, IonCard } from '@ionic/vue';
import BaseLayout from '@/components/base/Layout.vue';
const authenStore = useAuthenStore();
const { updateDefaultLocale } = UserService();
const langugeAndThemeStore = useLangugeAndThemeStore();
const { destroyCache } = useCache();
const { t } = useLang();
const onChangeToServer = async () => {
  if (authenStore.auth) {
    await updateDefaultLocale(langugeAndThemeStore.locale as AppLocale);
  }
};
watch(langugeAndThemeStore, (state) => {
  if (state.locale) {
    onChangeToServer();
    destroyCache();

    window.location.replace('/');
  }
});
</script>
