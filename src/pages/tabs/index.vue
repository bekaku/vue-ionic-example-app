<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';
import { useLang } from '@/composables/useLang';
import { TabsName } from '@/libs/constant';
import { useTabStore } from '@/stores/tabStore';
import {
  IonBadge,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue';
import {
  chatbubble,
  chatbubbleOutline,
  ellipsisHorizontal,
  ellipsisHorizontalOutline,
  home,
  homeOutline,
} from 'ionicons/icons';
import { onUnmounted, ref } from 'vue';
const { t } = useLang();
const tabStore = useTabStore();
const to = ref();
const beforeTabChange = (/* ev: any */) => {
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
const onTabClick = (/* ev: any */) => {
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
  <ion-page class="tabs-shell">
    <ion-tabs
      @ion-tabs-will-change="beforeTabChange"
      @ion-tabs-did-change="afterTabChange"
    >
      <ion-router-outlet />
      <ion-tab-bar
        class="floating-tab-bar app-tab-bar"
        slot="bottom"
        @click="onTabClick"
      >
        <ion-tab-button :tab="TabsName.HOME" href="/tabs/home">
          <span class="tab-icon" aria-hidden="true">
            <BaseIcon
              :name="TabsName.HOME === tabStore.currentTab ? home : homeOutline"
              icon-set="ion"
              :size="23"
              style="top: 0"
            />
          </span>
          <ion-label>{{ t('base.home') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button :tab="TabsName.CHAT" href="/tabs/chat">
          <ion-badge color="danger">
            {{ '99+' }}
          </ion-badge>
          <span class="tab-icon" aria-hidden="true">
            <BaseIcon
              :name="
                TabsName.CHAT === tabStore.currentTab
                  ? chatbubble
                  : chatbubbleOutline
              "
              icon-set="ion"
              :size="23"
              style="top: 0"
            />
          </span>
          <ion-label>{{ t('nav.chats') }}</ion-label>
        </ion-tab-button>
        <ion-tab-button :tab="TabsName.OTHER" href="/tabs/other">
          <span class="tab-icon" aria-hidden="true">
            <BaseIcon
              :name="
                TabsName.OTHER === tabStore.currentTab
                  ? ellipsisHorizontal
                  : ellipsisHorizontalOutline
              "
              icon-set="ion"
              :size="23"
              style="top: 0"
            />
          </span>
          <ion-label>{{ t('base.other') }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>
<style lang="scss" scoped>
/* Keep this bar in Ionic's layout flow so every tab reserves its height. */
.tabs-shell ion-tabs {
  background: var(--app-bg-page);
}
</style>
