<script setup lang="ts">
import AuthenService from '@/api/AuthenService';
import UserService from '@/api/UserService';
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseSpinner from '@/components/base/BaseSpinner.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { usePaging } from '@/composables/usePaging';
import type { AccessTokenDto } from '@/types/models';
import { FORMAT_DATETIME } from '@/utils/dateUtil';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/vue';
import { ellipse, laptop, logoAndroid, logoApple, trash } from 'ionicons/icons';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
const LoadMore = defineAsyncComponent(
  () => import('@/components/base/BaseLoadMore.vue'),
);
const { t } = useLang();
const { appLoading, appConfirm, appFormatDateTime } = useBase();
const { removeAccessTokenSession } = AuthenService();
const { currentAuthSession } = UserService();
const { pages } = usePaging(10);
const sessionList = ref<AccessTokenDto[]>([]);
const sessionLoading = ref(true);
const isInfiniteDisabled = ref(false);
const fristLoaded = ref(false);
const pageParam = computed(
  () =>
    `?page=${pages.value.current > 0 ? pages.value.current - 1 : 0}&size=${pages.value.itemsPerPage
    }`,
);
const loadNextPage = async () => {
  pages.value.current++;
  await loadSeesionLogined();
};
const loadSeesionLogined = async (): Promise<void> => {
  sessionLoading.value = true;
  const res = await currentAuthSession(pageParam.value);
  if (res) {
    if (res.length > 0) {
      sessionList.value.push(...res);
      if (res.length < pages.value.itemsPerPage) {
        isInfiniteDisabled.value = true;
      }
    } else {
      isInfiniteDisabled.value = true;
    }
  } else {
    isInfiniteDisabled.value = true;
  }
  if (!fristLoaded.value) {
    fristLoaded.value = true;
  }
  sessionLoading.value = false;
};
onMounted(() => {
  loadSeesionLogined();
});
const onDeleteSession = async (index: number) => {
  const conf = await appConfirm(t('authSessions'), t('base.deleteConfirm'));
  if (conf) {
    const item = sessionList.value[index];
    if (item) {
      const loading: any = await appLoading();
      loading.present();
      const res = await removeAccessTokenSession(item.id);
      loading.dismiss();
      if (res && res.status == 'OK') {
        sessionList.value.splice(index, 1);
      }
    }
  }
};
</script>
<template>
  <BasePage :page-title="t('authSessions')" fullscreen show-back-link
    page-default-back-link="/settings/account-settings">
    <BaseCard clear>
      <template v-if="!fristLoaded">
        <BaseSpinner />
      </template>
      <template v-else>
        <ion-list>
          <ion-item lines="none">
            <ion-label class="ion-text-wrap">
              <p>{{ t('authSessionsHelp') }}</p>
            </ion-label>
          </ion-item>
          <ion-item v-for="(item, index) in sessionList" :key="index">
            <ion-icon slot="start" :icon="item.loginFrom == 'WEB'
              ? laptop
              : item.loginFrom == 'IOS'
                ? logoApple
                : logoAndroid
              " />
            <ion-label>
              <span class="q-text-weight-medium">[{{ item.ipAddredd }}]</span>
              <p>
                <span class="text-grey-8"> {{ item.hostName }}</span>
                <span v-if="item.activeNow">
                  <ion-icon :icon="ellipse" class="text-success" />
                </span>
              </p>

              <p>
                {{
                  t('lastestActive')
                  + ' '
                  + appFormatDateTime(item.lastestActive, FORMAT_DATETIME)
                }}
              </p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button @click="onDeleteSession(index)">
                <ion-icon :icon="trash" color="danger" />
              </ion-button>
            </ion-buttons>
          </ion-item>
        </ion-list>

        <load-more v-if="!isInfiniteDisabled" :loading="sessionLoading" :frist-loaded="fristLoaded"
          :is-infinite-disabled="isInfiniteDisabled" :label="t('base.loadMore')" @on-next-page="loadNextPage" />
      </template>
    </BaseCard>
  </BasePage>
</template>