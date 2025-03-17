<script setup lang="ts">
import type { IconSetType } from '@/types/common';
import { IonItem, IonLabel, IonRow, IonText } from '@ionic/vue';
import BaseIcon from './BaseIcon.vue';

const { iconSet = 'ion', header = true } = defineProps<{
  label: string
  caption?: string
  icon?: string
  iconSet?: IconSetType
  header?: boolean
}>();
</script>
<template>
  <IonItem lines="none">
    <IonLabel>
      <IonText :class="{ 'q-text-h5 q-text-weight-bold': header }">
        <IonRow class="ion-align-items-center">
          <slot name="icon">
            <BaseIcon v-if="icon" :icon="icon" :icon-set="iconSet" class="q-mr-xs" />
          </slot>
          {{ label }}
        </IonRow>
      </IonText>
      <p v-if="caption">{{ caption }}</p>
    </IonLabel>
  </IonItem>
</template>
<style lang="css" scoped>
ion-item {
  --background: #00000000;
}
</style>