<template>
  <base-layout :page-title="t('base.appearance')" fullscreen :content-padding="false" show-back-link>
    <BaseCard flat :title="t('base.mode')">
      <ion-list>
        <ion-item lines="none" v-for="theme in availableThemes" :key="theme.key" @click="onSetTheme(theme.key)">
          <ion-icon :icon="theme.icon" slot="start"></ion-icon>
          <ion-label>{{ t(theme.text) }}</ion-label>
          <ion-icon v-if="theme.key == currentTheme" slot="end" color="primary" :icon="checkmarkCircle"></ion-icon>
        </ion-item>
      </ion-list>
    </BaseCard>
  </base-layout>
</template>
<script setup lang="ts">
import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import { useLang } from '@/composables/useLang';
import { availableThemes, useTheme } from '@/composables/useTheme';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import { checkmarkCircle } from 'ionicons/icons';
const { t } = useLang();
const { onSetTheme, currentTheme } = useTheme();
</script>
