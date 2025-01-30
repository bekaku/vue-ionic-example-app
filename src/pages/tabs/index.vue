<script setup lang="ts">
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
import { useTabStore } from '@/stores/TabStore';
import { TabsName } from '@/utils/Constant';
import {
  IonPage,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonBadge
} from '@ionic/vue';
import {
  homeOutline,
  chatbubbleOutline,
  ellipsisHorizontalOutline,
  home,
  chatbubble,
  ellipsisHorizontal
} from 'ionicons/icons';
import { onUnmounted, ref } from 'vue';
const { t } = useLang();
const { WeeGoTo } = useBase();
const tabStore = useTabStore();
const to = ref();
const iconSize = 40;
const beforeTabChange = (ev: any) => {
  // do something before tab change
  if (tabStore.countClick == 0) {
    tabStore.setCountClick(2);
  } else {
    tabStore.setCountClick(1);
  }
};
const afterTabChange = (ev: any) => {
  // do something after tab change
  tabStore.setCurrentTab(ev.tab);
};
const onTabClick = (ev: any) => {
  to.value = setTimeout(() => {
    if (tabStore.currentTab != 'TabsName.POST') {
      tabStore.increaseCount();
    }
  }, 200);
};

onUnmounted(() => {
  if (to.value) {
    clearTimeout(to.value);
  }
});
</script>

<template>
  <ion-page>
    <ion-tabs @ion-tabs-will-change="beforeTabChange" @ion-tabs-did-change="afterTabChange">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" @click="onTabClick">
        <ion-tab-button :tab="TabsName.HOME" href="/tabs/home">
          <ion-icon v-if="TabsName.HOME === tabStore.currentTab" :icon="home" />
          <ion-icon v-else :icon="homeOutline" />
          <ion-label>{{ t('base.home') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button :tab="TabsName.CHAT" href="/tabs/chat">
          <ion-badge color="danger">
            {{ '99+' }}
          </ion-badge>
          <ion-icon v-if="TabsName.CHAT === tabStore.currentTab" :icon="chatbubble" />
          <ion-icon v-else :icon="chatbubbleOutline" />
          <ion-label>{{ t('nav.chats') }}</ion-label>
        </ion-tab-button>
        <ion-tab-button :tab="TabsName.OTHER" href="/tabs/other">
          <ion-icon :icon="TabsName.OTHER === tabStore.currentTab ? ellipsisHorizontal : ellipsisHorizontalOutline" />
          <ion-label>{{ t('base.other') }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>
<style lang="scss" scoped>
/*
.text-size {
  font-size: 12px;
}
*/
</style>
