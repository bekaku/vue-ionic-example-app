<script setup lang="ts">
import PermissionService from '@/api/PermissionService';
import type { Permission } from '@/types/models';
import { useLang } from '@/composables/useLang';
import { usePaging } from '@/composables/usePaging';
import { useSort } from '@/composables/useSort';
import BaseRefresher from '@/components/base/BaseRefresher.vue';
import {
  IonPage,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonTextarea,
  IonListHeader,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonToggle,
  IonIcon,
  IonAvatar,
  IonNote,
  IonText,
  IonModal,
  IonContent,
  IonHeader,
  IonTitle,
  IonRadioGroup,
  IonRadio,
  IonCardTitle,
  IonCardHeader,
  IonProgressBar,
  IonCardSubtitle,
  IonChip,
  IonImg,
  IonThumbnail,
  IonSkeletonText,
  IonRippleEffect,
  IonPopover,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRange,
  IonCardContent,
  IonBadge,
  IonGrid,
  IonSearchbar,
  IonCard,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
} from '@ionic/vue';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';
const BaseResult = defineAsyncComponent(() => import('@/components/base/BaseResult.vue'));
const BaseLoadMore = defineAsyncComponent(() => import('@/components/base/BaseLoadMore.vue'));
const BaseSpinner = defineAsyncComponent(() => import('@/components/base/BaseSpinner.vue'));
const { t } = useLang();
const { pages, resetPaging } = usePaging(5);
const { sort, sortMode } = useSort({
  column: 'id',
  mode: 'desc',
});
const { findAll } = PermissionService();
const isInfiniteDisabled = ref(false);
const fristLoaded = ref(false);
const loading = ref(false);

const items = ref<Permission[]>([]);
const pageParam = computed(
  () =>
    `?page=${pages.value.current > 0 ? pages.value.current - 1 : 0}&size=${pages.value.itemsPerPage
    }&sort=${sort.value.column},${sort.value.mode}`,
);
onMounted(async () => {
  loadData();
});
const resetData = () => {
  resetPaging();
  items.value = [];
  fristLoaded.value = false;
  isInfiniteDisabled.value = false;
};
const doRefresh = async (event: any) => {
  resetData();
  await loadData();
  if (event) {
    event.target.complete();
  }
};
const loadData = async () => {
  const res = await findAll(pageParam.value);
  if (res) {
    items.value.push(...res.dataList);
    if (res.last || res.totalElements == 0) {
      isInfiniteDisabled.value = true;
    }
  } else {
    isInfiniteDisabled.value = true;
  }
  if (!fristLoaded.value) {
    fristLoaded.value = true;
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};
const loadNextPage = async () => {
  pages.value.current++;
  await loadData();
};
</script>
<template>
  <BasePage page-title="Temp fetch">
    <BaseRefresher @on-refresh="doRefresh" />
    <BaseCard flat title="Test Page" subtitle="Just test page">
      <ion-card-content>
        <template v-if="!fristLoaded">
          <base-spinner />
        </template>
        <template v-else>
          <ion-row v-if="items.length == 0">
            <ion-col>
              <base-result :icon-size-alt="32" :show-icon="true" status="empty" :description="t('cartEmpty')"
                full-height />
            </ion-col>
          </ion-row>
          <template v-else>
            <BaseLoadMore v-if="fristLoaded && !isInfiniteDisabled" :loading="loading" :frist-loaded="fristLoaded"
              :is-infinite-disabled="isInfiniteDisabled" @on-next-page="loadNextPage" />
          </template>
        </template>
      </ion-card-content>
    </BaseCard>
  </BasePage>
</template>