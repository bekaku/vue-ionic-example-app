<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseTabs from '@/components/base/BaseTabs.vue';
import type { LabelValue } from '@/types/common';
import {
  IonCardContent
} from '@ionic/vue';
import {
  chatbubble,
  home,
  image,
  informationCircle,
  videocam
} from 'ionicons/icons';
import { ref } from 'vue';
const groupTabs = ref<LabelValue<string>[]>([
  {
    label: 'Home',
    value: 'home',
    icon: { name: home },
  },
  {
    label: 'About',
    value: 'about',
    icon: { name: informationCircle },
  },
  {
    label: 'Review',
    value: 'review',
    icon: { name: chatbubble },
  },
  {
    label: 'Photos',
    value: 'photos',
    icon: { name: image },
  },
  {
    label: 'Videos',
    value: 'videos',
    icon: { name: videocam },
    disable: true,
  },
]);

const onTabChange = (name: any) => {
  console.log('onTabChange', name);
};
</script>
<template>
  <BasePage page-title="Tabs" fullscreen>
    <BaseTabs :items="groupTabs" active-color="brown" @on-change="onTabChange">
      <template #home>
        <BaseCard>
          <IonCardContent> Home </IonCardContent>
        </BaseCard>
      </template>
      <template #about>
        <BaseCard>
          <IonCardContent> About </IonCardContent>
        </BaseCard>
      </template>
      <template #review>
        <BaseCard>
          <IonCardContent> Review </IonCardContent>
        </BaseCard>
      </template>
      <template #photos>
        <BaseCard>
          <IonCardContent> Photo </IonCardContent>
        </BaseCard>
      </template>
      <template #videos>
        <BaseCard>
          <IonCardContent> Videos </IonCardContent>
        </BaseCard>
      </template>
    </BaseTabs>
  </BasePage>
</template>
