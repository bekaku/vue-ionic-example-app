<script setup lang="ts">
import { IonIcon, IonItem, IonLabel, IonRow, IonText } from '@ionic/vue';

defineProps<{
  label: string
  caption?: string
  icon?: string
}>();
</script>
<template>
  <IonItem lines="none">
    <IonLabel>
      <IonText class="q-text-h5 q-text-weight-bold">
        <IonRow class="ion-align-items-center">
          <slot name="icon">
            <ion-icon v-if="icon" :icon="icon" class="q-mr-xs"></ion-icon>
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