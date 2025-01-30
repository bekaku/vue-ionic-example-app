<template>
  <base-layout :page-title="t('base.appearance')" fullscreen :content-padding="false" show-back-link>
    <IonicCard flat :title="t('base.mode')">
      <ion-list>
        <ion-item lines="none" v-for="theme in availableThemes" :key="theme.key" @click="onSetTheme(theme.key)">
          <ion-icon :icon="theme.icon" slot="start"></ion-icon>
          <ion-label>{{ t(theme.text) }}</ion-label>
          <ion-icon v-if="theme.key == currentTheme" slot="end" color="primary" :icon="checkmarkCircle"></ion-icon>
        </ion-item>
      </ion-list>
    </IonicCard>
  </base-layout>
</template>
<script setup lang="ts">
import BaseLayout from '@/components/base/BaseLayout.vue';
import { useLang } from '@/composables/UseLang';
import { availableThemes, useTheme } from '@/composables/UseTheme';
import { IonCard, IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import { checkmarkCircle } from 'ionicons/icons';
import IonicCard from '@/components/ionic/IonicCard.vue';
const { t } = useLang();
const { onSetTheme, currentTheme } = useTheme();
</script>
