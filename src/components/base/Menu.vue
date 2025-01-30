<template>
  <ion-button :fill="fill" @click="openPopover($event)">
    <ion-icon slot="icon-only" :icon="icon"></ion-icon>
  </ion-button>
  <ion-popover
    :is-open="popoverOpen"
    :event="event"
    @did-dismiss="popoverOpen = false"
  >
    <ion-content>
      <ion-list>
        <menu-item
          v-for="(item, index) in items"
          :key="index"
          :item="item"
          @on-select="onSelect"
        >
        </menu-item>
        <slot name="extraItem"></slot>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>
<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue';
import type { IMenuItem } from '@/types/Models';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonList,
  IonPopover,
} from '@ionic/vue';
import { ellipsisVertical } from 'ionicons/icons';
import type { PropType } from 'vue';
import { ref } from 'vue';
defineProps({
  icon: {
    type: String,
    default: ellipsisVertical,
  },
  fill: {
    type: String as PropType<'clear' | 'outline' | 'solid' | 'default'>,
    default: 'clear',
  },
  items: {
    type: Array as PropType<IMenuItem[]>,
    default: () => [],
  },
});
const emit = defineEmits(['onSelect']);
const popoverOpen = ref(false);
const event = ref<Event>();
const openPopover = (e: Event) => {
  event.value = e;
  popoverOpen.value = true;
};
const closePopup = () => {
  event.value = undefined;
  popoverOpen.value = false;
};
const onSelect = (item: IMenuItem) => {
  closePopup();
  emit('onSelect', item);
};
</script>
<style scoped lang="scss">
ion-popover {
  /* --width: 355px; */
  &::part(content) {
    min-width: 250px;
  }
}
</style>
