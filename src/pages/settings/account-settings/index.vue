<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseTextHeader from '@/components/base/BaseTextHeader.vue';
import { useLang } from '@/composables/useLang';
import { useAuthenStore } from '@/stores/authenStore';
import { } from '@/types/models';
import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader
} from '@ionic/vue';
import { biPencil } from '@quasar/extras/bootstrap-icons';
import {
  keyOutline,
  mailOutline,
  pencilOutline,
  shieldOutline
} from 'ionicons/icons';
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
const BaseResult = defineAsyncComponent(
  () => import('@/components/base/BaseResult.vue'),
);
const { t } = useLang();
const authenStore = useAuthenStore();

const items = ref<any[]>([]);
onMounted(() => {
  onReload();
});
const onReload = () => {
  items.value = [
    {
      header: true,
      title: 'base.privateData',
      canShow: true,
    },
    {
      title: 'base.editPhoto',
      avatar: authenStore.auth?.avatar?.thumbnail,
      endIcon: pencilOutline,
      link: '/settings/account-settings/photo',
      canShow: true,
    },
    {
      header: true,
      title: 'page.settingsSecurity',
      canShow: true,
    },
    {
      title: 'updatePassword',
      startIcon: keyOutline,
      endIcon: pencilOutline,
      link: '/settings/account-settings/password',
      canShow: true,
    },
    {
      title: 'authSessions',
      startIcon: shieldOutline,
      button: 'base.view',
      link: '/settings/account-settings/auth-session',
      canShow: true,
    },
    {
      header: true,
      title: 'contactInfo',
      canShow: true,
    },
    {
      title: 'base.emailEdit',
      subTitle: authenStore.auth?.email,
      startIcon: mailOutline,
      endIcon: pencilOutline,
      link: '/settings/account-settings/email',
      canShow: true,
    },
  ];
};
watch(authenStore, () => {
  onReload();
});
</script>
<template>
  <BasePage :page-title="t('base.accountSetting')" fullscreen show-back-link page-default-back-link="/tabs/other">
    <BaseCard>
      <template v-if="authenStore.auth">
        <ion-list>
          <template v-for="(item, index) in items" :key="index">
            <template v-if="item.canShow">
              <template v-if="item.header">
                <BaseTextHeader :header="false" icon-set="bootstrap-icons" class="text-muted" :label="t(item.title)" />
              </template>
              <template v-else>
                <ion-item button :detail="false" :router-link="item.link ? item.link : '#'">
                  <ion-avatar v-if="item.avatar" slot="start">
                    <img :src="item.avatar" alt="avatar">
                  </ion-avatar>
                  <ion-icon v-else-if="item.startIcon" slot="start" :icon="item.startIcon" />

                  <ion-label>
                    {{ t(item.title) }}
                    <p v-if="item.subTitle">{{ item.subTitle }}</p>
                    <div>
                      <template v-if="item.button">
                        <ion-button fill="solid" shape="round" mode="ios" class="text-white">
                          {{ t(item.button) }}
                        </ion-button>
                      </template>
                    </div>
                  </ion-label>
                  <ion-icon v-if="item.endIcon" slot="end" :icon="item.endIcon" />
                </ion-item>
              </template>
            </template>
          </template>
        </ion-list>
      </template>
      <template v-else>
        <base-result status="error" :description="t('error.dataNotfound')" />
      </template>
    </BaseCard>
  </BasePage>
</template>