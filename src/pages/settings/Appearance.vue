<script setup lang="ts">
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import { useLang } from '@/composables/useLang';
import { availableThemes, useTheme } from '@/composables/useTheme';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import { checkmarkCircle } from 'ionicons/icons';
const { t } = useLang();
const { onSetTheme, currentTheme } = useTheme();
</script>
<template>
  <BasePage :page-title="t('base.appearance')" fullscreen :content-padding="false" show-back-link>
    <BaseCard flat :title="t('base.mode')">
      <ion-list>
        <ion-item v-for="theme in availableThemes" :key="theme.key" lines="none" @click="onSetTheme(theme.key)">
          <ion-icon slot="start" :icon="theme.icon" />
          <ion-label>{{ t(theme.text) }}</ion-label>
          <ion-icon v-if="theme.key == currentTheme" slot="end" color="primary" :icon="checkmarkCircle" />
        </ion-item>
      </ion-list>
    </BaseCard>
  </BasePage>
</template>