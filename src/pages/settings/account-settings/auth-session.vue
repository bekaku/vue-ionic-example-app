<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button default-href="/settings/account-settings"></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('authSessions') }}</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-card class="ion-no-margin no-border-radius">
        <template v-if="!fristLoaded">
          <Spinner />
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
                "></ion-icon>
              <ion-label>
                <span class="q-text-weight-medium">[{{ item.ipAddredd }}]</span>
                <p>
                  <span class="text-grey-8"> {{ item.hostName }}</span>
                  <span v-if="item.activeNow">
                    <ion-icon :icon="ellipse" class="text-success"></ion-icon>
                  </span>
                </p>

                <p>
                  {{
                    t('lastestActive')
                    + ' '
                    + AppFormatDateTime(item.lastestActive, FORMAT_DATETIME)
                  }}
                </p>
              </ion-label>
              <ion-buttons slot="end">
                <ion-button @click="onDeleteSession(index)">
                  <ion-icon :icon="trash" color="danger"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-item>
          </ion-list>

          <load-more v-if="!isInfiniteDisabled" :loading="sessionLoading" :frist-loaded="fristLoaded"
            :is-infinite-disabled="isInfiniteDisabled" :label="t('base.loadMore')" @on-next-page="loadNextPage">
          </load-more>
        </template>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import type { AccessTokenDto } from '@/types/Models';
import { FORMAT_DATETIME } from '@/utils/DateUtil';
import UserService from '@/api/UserService';
import AuthenService from '@/api/AuthenService';
import { logoAndroid, logoApple, laptop, ellipse, trash } from 'ionicons/icons';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonHeader,
  IonTitle,
  IonCard,
} from '@ionic/vue';
import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BaseBackButton.vue';
import Spinner from '@/components/base/Spinner.vue';
import { usePaging } from '@/composables/UsePaging';
const LoadMore = defineAsyncComponent(
  () => import('@/components/LoadMore.vue'),
);
const { t } = useLang();
const { WeeLoading, WeeConfirm, AppFormatDateTime } = useBase();
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
  const conf = await WeeConfirm(t('authSessions'), t('base.deleteConfirm'));
  if (conf) {
    const item = sessionList.value[index];
    if (item) {
      const loading: any = await WeeLoading();
      loading.present();
      const res = await removeAccessTokenSession(item.id);
      loading.dismiss();
      if (res.status == 'OK') {
        sessionList.value.splice(index, 1);
      }
    }
  }
};
</script>
