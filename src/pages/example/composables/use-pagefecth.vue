<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseInfiniteScroll from '@/components/base/BaseInfiniteScroll.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseLoadMore from '@/components/base/BaseLoadMore.vue';
import BaseRefresher from '@/components/base/BaseRefresher.vue';
import SkeletonListItem from '@/components/skeleton/SkeletonListItem.vue';
import { usePagefecth } from '@/composables/usePageFetch';
import type { Permission } from '@/types/models';
import {
    IonCardContent,
    IonItem,
    IonLabel,
    IonList
} from '@ionic/vue';
import { onMounted } from 'vue';
const {
    isInfiniteDisabled,
    loading,
    firstLoaded,
    dataList,
    pages,
    loadData,
    onReload,
    onNextPage,
} = usePagefecth<Permission>({
    apiEndpoint: '/api/permission',
    defaultSort: { column: 'id', mode: 'desc' },
    itemsPerPage: 4,
    concatList: true,
});
onMounted(async () => {
    await loadData();
})
const handleRefresh = async (event: any) => {
    if (!event) {
        return;
    }
    await onReload();
    event.target.complete();
};
const onInfinite = async (event: any) => {
    if (!event) {
        return;
    }
    await onNextPage();
    event.target.complete();
};
</script>
<template>
    <BaseLayout page-title="usePageFetch" fullscreen show-back-link>
        <BaseRefresher @on-refresh="handleRefresh" />
        <BaseCard title="usePageFetch" subtitle="Composables">
            <ion-card-content>
                <p>Total elements : {{ pages?.totalElements }} (Pull down to refresh)</p>
                <SkeletonListItem v-if="!firstLoaded" :items="3" />
                <IonList>
                    <IonItem v-for="(item, index) in dataList" :key="`${index}-${item.id}`">
                        <div slot="start">
                            {{ index + 1 }}
                        </div>
                        <IonLabel>
                            {{ item.description }}
                            <p> {{ item.code }}</p>
                        </IonLabel>
                    </IonItem>
                </IonList>
                <BaseLoadMore v-if="firstLoaded && !isInfiniteDisabled" :loading="loading" :frist-loaded="firstLoaded"
                    :is-infinite-disabled="isInfiniteDisabled" @on-next-page="onNextPage" />
            </ion-card-content>
        </BaseCard>
        <BaseInfiniteScroll v-if="!isInfiniteDisabled" :disabled="isInfiniteDisabled" @on-infinite="onInfinite" />
    </BaseLayout>
</template>
