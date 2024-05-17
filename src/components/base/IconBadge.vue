<template>
  <ion-button :router-link="to" :color="textColor" class="button-badge">
    <ion-icon slot="icon-only" :icon="icon"></ion-icon>
    <ion-badge v-if="no" :color="color">{{ no }}</ion-badge>
  </ion-button>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IonButton, IonIcon, IonBadge } from '@ionic/vue';
defineProps({
  no: {
    type: String as PropType<string | number>,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  textColor: {
    type: String,
    default: 'primary',
  },
  color: {
    type: String,
    default: 'danger',
  },
  to: {
    type: String as PropType<string | undefined>,
    default: undefined,
  },
});
</script>
<style scoped>
ion-badge {
  position: absolute;
  font-size: 11px;
  right: -1px;
  top: 1px;
  --padding-bottom: 3px;
  --padding-end: 3px;
  --padding-start: 3px;
  --padding-top: 3px;
}
.md ion-badge {
  right: -5px;
  top: -2px;
  font-weight: 100;
}
ion-button {
  margin: 5px;
  width: 40px;
  height: 40px;
  position: relative;
}

/* Setting Overflow Visible */
ion-button.button-badge::part(native) {
  overflow: visible;
}
</style>
