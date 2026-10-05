<script setup lang="ts">
import { useRbac } from '@/composables/useRBAC';
import type { AppColor, LabelValue } from '@/types/common';
import {
  IonRouterOutlet,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
} from '@ionic/vue';
import { computed, ref } from 'vue';
import BaseIcon from './BaseIcon.vue';

const {
  items,
  activeColor = 'primary',
  color,
  filterAcl = true,
  position = 'bottom',
  initTab,
  isRouter = false,
} = defineProps<{
  initTab?: string;
  activeColor?: AppColor;
  position?: 'bottom' | 'top';
  items: LabelValue<any>[];
  color?: AppColor;
  filterAcl?: boolean;
  keepAlive?: boolean;
  isRouter?: boolean;
}>();
const { hasPermission } = useRbac();
const currentTab = ref<string>(initTab || items[0]?.value || '');
const emit = defineEmits<{
  'on-will-change': [tabName: string];
  'on-change': [tabName: string];
}>();
const canShow = (item: LabelValue<any>) => {
  return item.rbac == undefined || hasPermission(item.rbac);
};
const getItems = computed<LabelValue<any>[]>(() => {
  return filterAcl ? items.filter((t) => canShow(t) === true) : items;
});

const onWillChange = (ev: any) => {
  emit('on-will-change', ev.tab);
};
const onDidChange = (ev: any) => {
  emit('on-change', ev.tab);
  currentTab.value = ev.tab;
};
</script>
<template>
  <IonTabs
    v-if="getItems.length > 0"
    @ion-tabs-will-change="onWillChange"
    @ion-tabs-did-change="onDidChange"
  >
    <slot v-if="!isRouter">
      <template
        v-for="(itemPanel, index) in getItems"
        :key="`tab-panel-${index}-${itemPanel.value}`"
      >
        <IonTab :tab="itemPanel.value">
          <div :id="`${index}-${itemPanel.value}-tab-panel`">
            <slot :name="itemPanel.value" />
          </div>
        </IonTab>
      </template>
    </slot>
    <ion-router-outlet v-if="isRouter" />
    <IonTabBar
      :slot="position"
      class="app-tab-bar"
      :class="{ 'app-tab-bar-top': position === 'top' }"
      :style="{ '--app-tabs-count': getItems.length }"
    >
      <IonTabButton
        v-for="(item, index) in getItems"
        :key="`tab-btn-${index}-${item.value}`"
        :tab="item.value"
        :disabled="item.disable"
        :href="item.to || undefined"
      >
        <span
          v-if="item.icon"
          class="tab-icon"
          aria-hidden="true"
          :class="
            currentTab === item.value
              ? `text-${activeColor}`
              : color
                ? `text-${color}`
                : undefined
          "
        >
          <BaseIcon v-bind="item.icon" :size="23" style="top: 0" />
        </span>
        <IonLabel
          :class="
            currentTab === item.value
              ? `text-${activeColor}`
              : color
                ? `text-${color}`
                : undefined
          "
        >
          {{ item.label }}
        </IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
</template>
