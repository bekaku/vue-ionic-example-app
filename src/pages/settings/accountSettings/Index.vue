<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button default-href="/tabs/other"></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('base.accountSetting') }}</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-card class="ion-no-margin no-border-radius no-shadow">
        <template v-if="authenStore.auth">
          <ion-list>
            <template v-for="(item, index) in items" :key="index">
              <template v-if="item.canShow">
                <template v-if="item.header">
                  <ion-list-header>
                    <ion-label>{{ t(item.title) }}</ion-label>
                  </ion-list-header>
                </template>
                <template v-else>
                  <ion-item
                    button
                    :detail="false"
                    :router-link="item.link ? item.link : '#'"
                  >
                    <ion-avatar v-if="item.avatar" slot="start">
                      <img :src="item.avatar" alt="avatar" />
                    </ion-avatar>
                    <ion-icon
                      v-else-if="item.startIcon"
                      :icon="item.startIcon"
                      slot="start"
                    >
                    </ion-icon>

                    <ion-label>
                      {{ t(item.title) }}
                      <p v-if="item.subTitle">{{ item.subTitle }}</p>
                      <div>
                        <template v-if="item.button">
                          <ion-button
                            fill="solid"
                            shape="round"
                            mode="ios"
                            class="text-white"
                          >
                            {{ t(item.button) }}
                          </ion-button>
                        </template>
                      </div>
                    </ion-label>

                    <ion-icon
                      v-if="item.endIcon"
                      :icon="item.endIcon"
                      slot="end"
                    ></ion-icon>
                  </ion-item>
                </template>
              </template>
            </template>
          </ion-list>
        </template>
        <template v-else>
          <base-result status="error" :description="t('error.dataNotfound')">
          </base-result>
        </template>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {} from '@/types/Models';
import {
  pencilOutline,
  keyOutline,
  shieldOutline,
  mailOutline,
  callOutline,
} from 'ionicons/icons';
import { useAuthenStore } from '@/stores/AuthenStore';
import { useLang } from '@/composables/UseLang';
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonListHeader,
  IonIcon,
  IonAvatar,
  IonContent,
  IonHeader,
  IonTitle,
  IonCard,
} from '@ionic/vue';
import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BackButton.vue';
const BaseResult = defineAsyncComponent(
  () => import('@/components/base/Result.vue'),
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
      title: 'base.editName',
      subTitle: authenStore.auth?.userData?.fullName,
      endIcon: pencilOutline,
      link: '/settings/account-settings/personal',
      canShow: true,
    },
    {
      title: 'model.user_data.positionName',
      subTitle: authenStore.auth?.userData?.positionName,
      endIcon: pencilOutline,
      link: '/settings/account-settings/personal',
      canShow: true,
    },
    {
      title: 'model.user_data.teamLeaderName',
      subTitle: authenStore.auth?.userData?.teamLeaderName,
      endIcon: pencilOutline,
      link: '/settings/account-settings/personal',
      canShow:
        authenStore.auth &&
        authenStore.auth.currentOrganization &&
        authenStore.auth.currentOrganization.directSubordinates &&
        authenStore.auth.currentOrganization.directSubordinates > 0,
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
    {
      title: 'base.phoneEdit',
      subTitle: authenStore.auth?.userData?.mobilePhone,
      startIcon: callOutline,
      endIcon: pencilOutline,
      link: '/settings/account-settings/phone',
      canShow: true,
    },
  ];
};
watch(authenStore, () => {
  onReload();
});
</script>
