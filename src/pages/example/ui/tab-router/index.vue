<script setup lang="ts">
import BaseTabs from '@/components/base/BaseTabs.vue';
import type { LabelValue } from '@/types/common';
import { IonPage } from '@ionic/vue';
import {
  biApp,
  biInputCursorText,
  biPerson,
  biPersonCircle,
} from '@quasar/extras/bootstrap-icons';
import { ref } from 'vue';
const groupTabs = ref<LabelValue<string>[]>([
  {
    label: 'Tab1',
    value: 'avatar',
    icon: { name: biPersonCircle, iconSet: 'bootstrap-icons' },
    to: '/example/ui/tabs-router/tab1',
  },
  {
    label: 'Tab2',
    value: 'button',
    icon: { name: biApp, iconSet: 'bootstrap-icons' },
    to: '/example/ui/tabs-router/tab2',
  },
  {
    label: 'Tab3',
    value: 'input',
    icon: { name: biInputCursorText, iconSet: 'bootstrap-icons' },
    to: '/example/ui/tabs-router/tab3',
  },
  {
    label: 'Tab4',
    value: 'user',
    icon: { name: biPerson, iconSet: 'bootstrap-icons' },
    to: '/example/ui/tabs-router/tab4',
  },
]);

const onTabChange = (name: any) => {
  console.log('onTabChange', name);
};
</script>
<template>
  <IonPage>
    <BaseTabs :items="groupTabs" is-router @on-change="onTabChange" />
  </IonPage>
</template>
