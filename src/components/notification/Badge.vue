<template>
  <ion-button fill="clear">
    <ion-icon
      :icon="notificationsOutline"
      slot="icon-only"
      :class="textColor"
    ></ion-icon>
    <ion-badge v-if="no && no != '0'" :color="color">
      {{ badgeNo }}
    </ion-badge>
  </ion-button>
</template>

<script setup lang="ts">
import { IonBadge, IonButton, IonIcon } from '@ionic/vue';
import { notificationsOutline } from 'ionicons/icons';
import type { PropType } from 'vue';
import { computed } from 'vue';
const props = defineProps({
  no: {
    type: Number as PropType<string | number>,
    default: 0,
  },
  icon: {
    type: String,
    default: '',
  },
  textColor: {
    type: String as PropType<string | undefined>,
    default: undefined,
  },
  color: {
    type: String,
    default: 'danger',
  },
});
const badgeNo = computed(() =>
  (props.no as number) > 99 ? '99+' : props.no + '',
);
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
}

/* ion-button {
  margin: 0px;
  width: 45px;
  height: 45px;
  position: relative;
} */

/* Setting Overflow Visible */
ion-button.button-badge::part(native) {
  overflow: visible;
}
</style>
