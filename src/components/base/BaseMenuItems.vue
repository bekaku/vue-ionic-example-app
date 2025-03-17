<script setup lang="ts" generic="T">
import { useLang } from '@/composables/useLang';
import type { LabelValue } from '@/types/common';
import { IonCardHeader, IonCardSubtitle, IonCol, IonList, IonRow } from '@ionic/vue';
import BaseCard from './BaseCard.vue';
import BaseMenuItem from './BaseMenuItem.vue';

const { items, iconSize = 20, detail=true } = defineProps<{
    items: LabelValue<T>[]
    iconSize?: number
    detail?: boolean
}>();
const { t } = useLang();
</script>
<template>
    <IonRow class="ion-no-margin ion-no-padding">
        <IonCol class="ion-no-margin ion-no-padding">
            <slot name="top" />
            <template v-if="items.length > 0">
                <template v-for="(item, index) in items" :key="`parent-${index}`">
                    <BaseCard>
                        <template v-if="item.label" #header>
                            <IonCardHeader>
                                <IonCardSubtitle>
                                    {{ item?.translateLabel !== false ? t(`${item.label}`) : item.label }}
                                </IonCardSubtitle>
                            </IonCardHeader>
                        </template>
                        <template v-if="item.children && item.children.length > 0">
                            <template v-for="(page, pageIndex) in item.children"
                                :key="`parent-${index}-page-${pageIndex}`">
                                <template v-if="!page.children">
                                    <BaseMenuItem :item="page" :icon-size="iconSize" :detail>
                                        <template #end="{ item: menuItem }">
                                            <slot name="end" v-bind="{ menuItem }" />
                                        </template>
                                    </BaseMenuItem>
                                </template>
                                <template v-else>
                                    <BaseMenuItem :item="page" lines="inset" :detail>
                                        <template #end="{ item: menuItem }">
                                            <slot name="end" v-bind="{ menuItem }" />
                                        </template>
                                    </BaseMenuItem>
                                    <IonList class="q-pl-md">
                                        <BaseMenuItem v-for="(pageItem, pageItemIndex) in page.children"
                                            :key="`parent-${index}-page-${pageIndex}-sub-${pageItemIndex}`"
                                            :item="pageItem" :icon-size="iconSize" :detail>
                                            <template #end="{ item: menuItem }">
                                                <slot name="end" v-bind="{ menuItem }" />
                                            </template>
                                        </BaseMenuItem>
                                    </IonList>
                                </template>
                            </template>
                        </template>
                        <template v-else>
                            <BaseMenuItem :item="item" :detail>
                                <template #end="{ item: menuItem }">
                                    <slot name="end" v-bind="{ menuItem }" />
                                </template>
                            </BaseMenuItem>
                        </template>
                    </BaseCard>
                </template>
            </template>
            <slot name="bottom" />
        </IonCol>
    </IonRow>
</template>
