<script setup lang="ts" generic="T">
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import type {
  InfiniteScrollCustomEvent, RefresherCustomEvent
} from '@ionic/vue';
import {
  IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import { chevronDownCircleOutline } from 'ionicons/icons';
import { useTemplateRef } from 'vue';
const {
  minItemSize = 35,
  itemSize = 35,
  emitUpdate = true,
  scrollAreaHeight = '100%',
  items,
  buffer = 200,
  poolSize = 2000,
  pageMode = false,
  keyField = 'id',
  pageModeFullPage = true,
  isInfiniteDisabled = false,
  infinitePosition = 'bottom',
  inifinite=false,
  refresher=false,
} = defineProps<{
  minItemSize?: number
  itemSize?: number
  buffer?: number
  poolSize?: number
  emitUpdate?: boolean
  pageMode?: boolean
  pageModeFullPage?: boolean
  scrollAreaHeight?: string
  minHeight?: string
  keyField?: string
  isInfiniteDisabled?: boolean
  infinitePosition?: 'bottom' | 'top'
  items: T[],
  inifinite?: boolean
  refresher?: boolean
}>();


// const emit = defineEmits<{
//   onUpdate: [val: VirtualScrollerUpdate];
// }>();

const emit = defineEmits(['on-update', 'scroll-start', 'scroll-end', 'on-infinite', 'on-refresh']);
const appRecycleScrollerRef = useTemplateRef<any>('appRecycleScrollerRef');
const onScrollToItem = (index: number | undefined) => {
  if (index == undefined) {
    return;
  }
  console.log('onScrollToItem', index);
  if (appRecycleScrollerRef.value) {
    appRecycleScrollerRef.value.scrollToItem(index);
  }
};
const onScrollToBottom = () => {
  console.log('onScrollToBottom', appRecycleScrollerRef.value);
  // if (appRecycleScrollerRef.value) {
    // appRecycleScrollerRef.value.scrollToBottom();
  // }
};
const onUpdate = (viewStartIndex: number, viewEndIndex: number, visibleStartIndex: number, visibleEndIndex: number) => {
  console.log(`${viewStartIndex}-[${visibleStartIndex}-${visibleEndIndex}]-${viewEndIndex}`);
  // if (visibleEndIndex == viewEndIndex) {
  //   console.log('isBottom');
  // } else if (viewStartIndex == 0 && visibleStartIndex == 0) {
  //   console.log('isTop');
  // } else {
  //   console.log('scrolling');
  // }
  emit('on-update', {
    viewStartIndex, viewEndIndex, visibleStartIndex, visibleEndIndex
  });
};
const onScrollStart = () => {
  emit('scroll-start')
};
const onScrollEnd = () => {
  emit('scroll-end')
};
const onResize = () => {
};
const onInfinite = (ev: InfiniteScrollCustomEvent) => {
  // console.log('ionInfinite', ev);
  emit('on-infinite', ev)
};
const onRefresh = (ev: RefresherCustomEvent) => {
  emit('on-refresh', ev)
  setTimeout(() => {
    ev.target.complete();
  }, 500);
};
defineExpose({
  onScrollToBottom, onScrollToItem
});
</script>

<template>
  <ion-refresher v-if="refresher" slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ion-refresh="onRefresh($event)">
    <ion-refresher-content :pulling-icon="chevronDownCircleOutline" refreshing-spinner="circles" pulling-text="Pulling"
      refreshing-text="Refreshing..." />
  </ion-refresher>
  <RecycleScroller v-bind="$attrs" ref="appRecycleScrollerRef" class="ion-content-scroll-host scroller"
    :key-field="keyField" :items="items" :min-item-size="minItemSize" :emit-update="emitUpdate" :page-mode="pageMode"
    :buffer="buffer" @resize="onResize" @update="onUpdate">
    <template #before>
      <ion-infinite-scroll v-if="inifinite &&infinitePosition=='top'" :disabled="isInfiniteDisabled" :position="infinitePosition" @ion-infinite="onInfinite">
        <ion-infinite-scroll-content loadingSpinner="bubbles" />
      </ion-infinite-scroll>
      <slot name="slotBefore"></slot>
    </template>
    <template #default="{ item, index }">
      <slot v-bind="{ item, index }"></slot>
    </template>

    <template #after>
      <ion-infinite-scroll v-if="inifinite &&infinitePosition=='bottom'" :disabled="isInfiniteDisabled" :position="infinitePosition" @ion-infinite="onInfinite">
        <ion-infinite-scroll-content loadingSpinner="bubbles" />
      </ion-infinite-scroll>
      <slot name="slotAfter"></slot>
    </template>
  </RecycleScroller>
</template>

<style scoped lang="scss">
.scroller {
  height: v-bind(scrollAreaHeight);
  //height: 100%;
  overflow-y: auto;
}
</style>
