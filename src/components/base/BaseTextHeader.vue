<script setup lang="ts">
import type { IconSetType } from '@/types/common';
import type { IconProps } from '@/types/props';
import { IonItem, IonLabel, IonRow, IonText } from '@ionic/vue';
import BaseIcon from './BaseIcon.vue';

const { header = true } = defineProps<{
  title: string;
  subtitle?: string;
  icon?: IconProps;
  iconSet?: IconSetType;
  header?: boolean;
}>();
</script>
<template>
  <IonItem v-bind="$attrs" lines="none">
    <IonLabel>
      <IonText :class="{ 'q-text-h5 q-text-weight-bold': header }">
        <IonRow class="ion-align-items-center">
          <slot name="icon">
            <BaseIcon v-if="icon" v-bind="icon" class="q-mr-xs" />
          </slot>
          {{ title }}
        </IonRow>
      </IonText>
      <p v-if="subtitle">{{ subtitle }}</p>
    </IonLabel>
    <div slot="end">
      <slot name="end" />
    </div>
  </IonItem>
</template>
<style lang="css" scoped>
ion-item {
  --background: #00000000;
}
</style>
