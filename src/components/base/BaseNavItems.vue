<script setup lang="ts">
import { useLang } from '@/composables/useLang';
import type { IMenu } from '@/types/common';
import { IonCardHeader, IonCardSubtitle, IonCol, IonList, IonRow } from '@ionic/vue';
import BaseCard from './BaseCard.vue';
import BaseNavItem from './BaseNavItem.vue';

const { menuItems, iconSize = 20 } = defineProps<{
    menuItems: IMenu[]
    iconSize?: number
}>();
const { t } = useLang();
</script>
<template>
    <IonRow class="ion-no-margin ion-no-padding">
        <IonCol class="ion-no-margin ion-no-padding">
            <slot name="top" />
            <template v-if="menuItems.length > 0">
                <template v-for="(item, index) in menuItems" :key="`parent-${index}`">
                    <BaseCard>
                        <template v-if="item.header" #header>
                            <IonCardHeader>
                                <IonCardSubtitle>
                                    {{ item?.translate !== false ? t(`${item.header}`) : item.header }}
                                </IonCardSubtitle>
                            </IonCardHeader>
                        </template>
                        <template v-if="item.pages && item.pages.length > 0">
                            <template v-for="(page, pageIndex) in item.pages"
                                :key="`parent-${index}-page-${pageIndex}`">
                                <template v-if="!page.items">
                                    <BaseNavItem :item="page" :icon-size="iconSize" />
                                </template>
                                <template v-else>
                                    <BaseNavItem :item="page" lines="inset" />
                                    <IonList class="q-pl-md">
                                        <BaseNavItem v-for="(pageItem, pageItemIndex) in page.items"
                                            :key="`parent-${index}-page-${pageIndex}-sub-${pageItemIndex}`"
                                            :item="pageItem" :icon-size="iconSize" />
                                    </IonList>
                                </template>
                            </template>
                        </template>
                    </BaseCard>
                </template>
            </template>
            <slot name="bottom" />
        </IonCol>
    </IonRow>
</template>
