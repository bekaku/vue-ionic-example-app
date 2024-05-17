<template>
  <ion-button :fill="fill" @click="openPopover($event)">
    <ion-icon slot="icon-only" :icon="icon"></ion-icon>
  </ion-button>
  <ion-popover
    :is-open="popoverOpen"
    :event="event"
    @didDismiss="popoverOpen = false"
  >
    <ion-content>
      <ion-list>
        <menu-item
          v-for="(item, index) in items"
          :key="index"
          :item="item"
          @on-select="onSelect"
        >
          <template
            v-if="item.iconSs && item.iconSs == 'satisfactionBtn'"
            #start
          >
            <SatisfactionBtnIcon slot="start" />
          </template>
        </menu-item>
        <slot name="extraItem"></slot>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>
<script setup lang="ts">
import { PropType, defineAsyncComponent, ref } from 'vue';
import { IMenuItem } from '@/types/Models';
import {
  IonButton,
  IonContent,
  IonPopover,
  IonIcon,
  IonList,
} from '@ionic/vue';
import { ellipsisVertical } from 'ionicons/icons';
import MenuItem from '@/components/MenuItem.vue';
const SatisfactionBtnIcon = defineAsyncComponent(
  () => import('@/components/icon/SatisfactionBtnIcon.vue'),
);
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
const popoverOpen = ref(false);
const event = ref<Event>();
const emit = defineEmits(['onSelect']);
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
