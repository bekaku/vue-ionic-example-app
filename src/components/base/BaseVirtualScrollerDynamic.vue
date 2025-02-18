<script setup lang="ts" generic="T">
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import type { InfiniteScrollCustomEvent } from '@ionic/vue';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import { ref } from 'vue';
const {
  minItemSize = 200,
  emitUpdate = true,
  scrollAreaHeight = '100%',
  items,
  keyField = 'id',
  buffer = 800,
  poolSize = 2000,
  pageMode = false,
  isInfiniteDisabled = false,
  inifinite = false,
  infinitePosition = 'bottom'
} = defineProps<{
  minItemSize?: number
  buffer?: number
  poolSize?: number
  emitUpdate?: boolean
  pageMode?: boolean
  scrollAreaHeight?: string
  minHeight?: string
  keyField?: string
  isInfiniteDisabled?: boolean
  inifinite?: boolean
  infinitePosition?: 'bottom' | 'top'
  items: T[]
}>();


// const emit = defineEmits<{
//   onUpdate: [val: VirtualScrollerUpdate];
// }>();

const emit = defineEmits(['on-update', 'scroll-start', 'scroll-end', 'on-infinite']);
const appScrollerRef = ref<any>();
const onScrollToItem = (index: number | undefined) => {
  if (index == undefined) {
    return;
  }
  if (appScrollerRef.value) {
    appScrollerRef.value.scrollToItem(index);
  }
};
const onScrollToBottom = () => {
  if (appScrollerRef.value) {
    appScrollerRef.value.scrollToBottom();
  }
};
const onUpdate = (viewStartIndex: number, viewEndIndex: number, visibleStartIndex: number, visibleEndIndex: number) => {
  // console.log(`${viewStartIndex}-[${visibleStartIndex}-${visibleEndIndex}]-${viewEndIndex}`);
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
const ionInfinite = (ev: InfiniteScrollCustomEvent) => {
  emit('on-infinite', ev);
};
defineExpose({
  onScrollToBottom, onScrollToItem
});
</script>

<template>
<DynamicScroller v-bind="$attrs" ref="appScrollerRef" class="ion-content-scroll-host scroller" :items="items"
    :emit-update="emitUpdate" :key-field="keyField" :min-item-size="minItemSize" :buffer="buffer" :page-mode="pageMode"
    @scroll-start="onScrollStart" @scroll-end="onScrollEnd" @resize="onResize" @update="onUpdate">
    <template #before>
      <ion-infinite-scroll v-if="inifinite && infinitePosition=='top'" :disabled="isInfiniteDisabled" threshold="100px" position="top" @ion-infinite="ionInfinite">
        <ion-infinite-scroll-content loadingSpinner="bubbles" />
      </ion-infinite-scroll>
      <slot name="slotBefore"></slot>
    </template>
    <template #default="{ item, index, active }">
      <DynamicScrollerItem :item="item" :active="active" :data-index="index" :data-active="active">
        <slot v-bind="{ item, index, active }"></slot>
      </DynamicScrollerItem>
    </template>
    <template #after>
      <ion-infinite-scroll v-if="inifinite && infinitePosition=='bottom'" :disabled="isInfiniteDisabled" threshold="100px" position="bottom" @ion-infinite="ionInfinite">
        <ion-infinite-scroll-content loadingSpinner="bubbles" />
      </ion-infinite-scroll>
      <slot name="slotAfter"></slot>
    </template>
  </DynamicScroller>
</template>

<style scoped lang="scss">
.scroller {
  height: v-bind(scrollAreaHeight);
  //height: 100%;
  overflow-y: auto;
}
</style>
