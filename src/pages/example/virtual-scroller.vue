<script setup lang="ts">
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseVirtualScrollerDynamic from '@/components/base/BaseVirtualScrollerDynamic.vue';
import BaseVirtualScrollerRecycle from '@/components/base/BaseVirtualScrollerRecycle.vue';
import type { VirtualScrollerUpdate } from '@/types/common';
import type {
    InfiniteScrollCustomEvent
} from '@ionic/vue';
import {
    IonCardContent,
    IonCol,
    IonItem,
    IonLabel,
    IonRow
} from '@ionic/vue';
import { onMounted, ref, useTemplateRef } from 'vue';

const scrollerDynamicRef = useTemplateRef<any>('scrollerDynamicRef');
const scrollerRecycleRef = useTemplateRef<any>('scrollerRecycleRef');
const scrollPosition = ref<number>(10);
const items = ref<any[]>([]);
const dataList = ref<any[]>([])
const updateItem = ref<VirtualScrollerUpdate>();
onMounted(() => {
    // for (let i = 0; i < maxSize; i++) {
    //     dataList.value.push({
    //         id: (i + 1),
    //         label: 'Option ' + (i + 1)
    //     })
    // }
    generateItemsDynamic();
    generateItems();
})

const generateItemsDynamic = () => {
    let count = dataList.value.length;
    for (let i = 0; i < 40; i++) {
        count++;
        dataList.value.push({
            id: count,
            label: 'Option ' + count
        })
    }
};
const generateItems = () => {
    let count = items.value.length;
    for (let i = 0; i < 40; i++) {
        count++;
        items.value.push({
            id: count,
            label: 'Option ' + count
        })
    }
};
const onInfiniteDynamic = (ev: InfiniteScrollCustomEvent | undefined) => {
    console.log('onInfiniteDynamic', ev);
    setTimeout(async () => {
        generateItemsDynamic();
        if (ev) {
            await ev.target.complete();
        }
    }, 500);
};

const onInfiniteRecycle = (ev: InfiniteScrollCustomEvent | undefined) => {
    console.log('onInfiniteRecycle', ev);
    setTimeout(async () => {
        generateItems();
        if (ev) {
            await ev.target.complete();
        }
    }, 500);
};
const onVirtualScrollUpdate = (item: VirtualScrollerUpdate) => {
    // console.log('onVirtualScrollUpdate', item);
    updateItem.value = item;
};
const onScrollTo = (index: number) => {
    if (scrollerDynamicRef.value) {
        scrollerDynamicRef.value.onScrollToItem(index);
    }
}
const scrollToBottom = () => {
    if (scrollerDynamicRef.value) {
        scrollerDynamicRef.value.onScrollToBottom();
    }
};
const scrollTo = () => {
    if (scrollerRecycleRef.value) {
        scrollerRecycleRef.value.onScrollToItem(scrollPosition.value || 0);
    }
}
</script>
<template>
    <BasePage page-title="Virtual scroller" fullscreen show-back-link>
         <BaseCard title="Dynamic Scroller">
            <ion-card-content>
                <p v-if="updateItem">
                    ({{
                        `${updateItem.viewStartIndex}-[${updateItem.visibleStartIndex}-${updateItem.visibleEndIndex}]-${updateItem.viewEndIndex}`
                    }})
                </p>
                <IonRow>
                    <IonCol>
                        <BaseButton full label="Scroll to bottom" @click="scrollToBottom" />
                    </IonCol>
                    <IonCol>
                        <BaseButton full label="Scroll to top" @click="onScrollTo(0)" />
                    </IonCol>
                </IonRow>
            </ion-card-content>
            <BaseVirtualScrollerDynamic ref="scrollerDynamicRef" class="q-pa-sm" key-field="id" :items="dataList"
                :min-item-size="24" scroll-area-height="200px" inifinite @on-update="onVirtualScrollUpdate" @on-infinite="onInfiniteDynamic">
                <template #slotBefore>
                    Before Slot
                </template>
                <template #default="{ item, index, /*active */ }">
                    <IonItem :key="index">
                        <IonLabel>
                            #{{ index }} - {{ item.label }}
                        </IonLabel>
                    </IonItem>
                </template>
                <template #slotAfter>
                    After Slot
                </template>
            </BaseVirtualScrollerDynamic>
        </BaseCard>

        <BaseCard title="Recycle Scroller + infinite-scroll">
            <BaseInput v-model="scrollPosition" label="Scroll to" type="number">
                <template #end>
                    <BaseButton label="Go" @click="scrollTo" />
                </template>
            </BaseInput>
            <BaseVirtualScrollerRecycle id="scroll-chat-target-id" ref="scrollerRecycleRef" style="padding-bottom:65px"
                :items="items" inifinite scroll-area-height="200px" :min-item-size="42" @on-infinite="onInfiniteRecycle">
                <template #slotBefore>
                    Slot before
                </template>
                <template #default="{ item, index, }">
                    <IonItem :key="index">
                        <BaseAvatar slot="start" src="https://cdn.quasar.dev/img/avatar.png" />
                        <IonLabel>
                            #{{ index }} - {{ item.label }}
                        </IonLabel>
                    </IonItem>
                </template>

                <template #slotAfter>
                    Slot after
                </template>
            </BaseVirtualScrollerRecycle>
        </BaseCard>
    </BasePage>
</template>
