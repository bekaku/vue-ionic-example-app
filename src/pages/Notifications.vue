<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('base.notification') }}</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-refresher
        slot="fixed"
        :pull-factor="0.5"
        :pull-min="100"
        :pull-max="200"
        @ionRefresh="doRefresh($event)"
      >
        <ion-refresher-content class="refresher"></ion-refresher-content>
      </ion-refresher>
      <ion-card class="ion-no-margin no-shadow no-border-radius q-pt-lg">
        <skeleton-list-item
          v-if="!fristLoaded"
          :items="10"
        ></skeleton-list-item>
        <template v-else>
          <ion-button fill="clear" expand="block" @click="updateReadAll">
            <ion-icon :icon="checkmarkDone" slot="start"></ion-icon>
            {{ t('base.markAsreadAll') }}
          </ion-button>

          <template v-if="items.length == 0">
            <base-result status="empty" :description="t('error.dataNotfound')">
            </base-result>
          </template>
          <load-more
            v-if="fristLoaded && !isInfiniteDisabled"
            :loading="loading"
            :frist-loaded="fristLoaded"
            :is-infinite-disabled="isInfiniteDisabled"
            :label="t('base.loadMore')"
            @on-next-page="loadNextPage"
          >
          </load-more>
          <ion-infinite-scroll
            @ionInfinite="loadNextPage($event)"
            threshold="15%"
            id="notify-infinite-scroll"
            :disabled="isInfiniteDisabled"
          >
            <ion-infinite-scroll-content
              loading-spinner="dots"
              class="loadingspinner"
            >
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </template>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { NotificationDto } from '@/types/Models';
import UserNotifyService from '@/api/UserNotifyService';
import { checkmarkDone } from 'ionicons/icons';
import { InfiniteScrollCustomEvent } from '@ionic/vue';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useLang } from '@/composables/UseLang';
import { useNotification } from '@/composables/UseNotification';
import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BackButton.vue';
import {
  IonPage,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonHeader,
  IonTitle,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonCard,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import BaseResult from '@/components/base/Result.vue';
import LoadMore from '@/components/LoadMore.vue';
import SkeletonListItem from '@/components/skeleton/ListItem.vue';
const { t } = useLang();
const { findAllByUser, updateReadNotifyAll } = UserNotifyService();
const { onNotifyView, removeAllDeliveredNotify } = useNotification();
const items = ref<NotificationDto[]>([]);
const isInfiniteDisabled = ref(false);
const currentPage = ref(1);
const currentPageSize = ref(10);
const fristLoaded = ref(false);
const loading = ref(false);
onMounted(async () => {
  await fetchDataData();
  await removeAllDeliveredNotify();
});

const fetchDataData = async () => {
  loading.value = true;
  const res = await findAllByUser(currentPage.value, currentPageSize.value);
  if (res && res.length == 0) {
    isInfiniteDisabled.value = true;
  } else if (res && res.length > 0) {
    items.value.push(...res);
  }
  if (!fristLoaded.value) {
    fristLoaded.value = true;
  }
  loading.value = false;
  return new Promise((resolve) => {
    resolve(true);
  });
};
const loadNextPage = async (ev: InfiniteScrollCustomEvent) => {
  currentPage.value++;
  await fetchDataData();
  if (ev) {
    await ev.target.complete();
  }
};
const onItemClick = (index: number) => {
  const item = items.value[index];
  if (item) {
    onNotifyView(item.functionCode, item.functionId, item.id, !item.readStatus);
    if (!item.readStatus) {
      item.readStatus = true;
    }
  }
};
const updateReadAll = async () => {
  const list = items.value;
  for (const item of list) {
    item.readStatus = true;
  }
  await updateReadNotifyAll();
};
const doRefresh = async (event: any) => {
  fristLoaded.value = false;
  currentPage.value = 1;
  isInfiniteDisabled.value = false;
  items.value = [];
  await fetchDataData();
  if (event) {
    event.target.complete();
  }
};
</script>
<style lang="scss" scoped>
ion-icon.circle {
  --ionicon-stroke-width: 16px;
  font-size: 10px;
}

.item-background-new {
  --ion-item-background: #f3fbfa;
}

.item-background-new-dark {
  --ion-item-background: var(--second-bg-color-theme-dark);
}

.scroller {
  height: 100%;
}
</style>
