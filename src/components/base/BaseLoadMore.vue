<template>
  <ion-row>
    <ion-col>
      <template v-if="button">
        <ion-button :color="!color ? (isDark ? 'dark' : 'light') : ''" :class="color ? color : ''" :size
          :expand="full ? 'block' : undefined" :fill="fill" @click="$emit('on-next-page')">
          <BaseSpinner v-if="loading && showLoading" />
          <template v-else>
            {{ label || $t('base.loadMore') }}
          </template>
          <ion-icon v-if="!loading" slot="end" :icon></ion-icon>
        </ion-button>
      </template>
      <template v-else>
        <BaseSpinner v-if="loading && showLoading" />
        <base-link-text v-else :label="label || $t('base.loadMore')" :color="color" @click="$emit('on-next-page')" />
      </template>
    </ion-col>
  </ion-row>
</template>
<script setup lang="ts">
import BaseLinkText from '@/components/base/BaseLinkText.vue';
import { useTheme } from '@/composables/useTheme';
import type { IonicColor } from '@/types/common';
import { IonButton, IonCol, IonIcon, IonRow } from '@ionic/vue';
import { chevronDownOutline } from 'ionicons/icons';
import BaseSpinner from './BaseSpinner.vue';
const {
  icon = chevronDownOutline,
  loading = false,
  showLoading = true,
  button = true,
  fill = 'solid',
  full = true
} = defineProps<{
  fristLoaded?: boolean
  center?: boolean
  icon?: string
  isInfiniteDisabled?: boolean
  loading?: boolean
  showLoading?: boolean
  button?: boolean
  label?: string
  size?: 'small' | 'default' | 'large'
  color?: IonicColor
  fill?: 'default' | 'solid' | 'clear' | 'outline'
  full?: boolean
}>();
defineEmits(['on-next-page']);
const { isDark } = useTheme();
</script>
