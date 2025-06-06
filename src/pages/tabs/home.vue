<script setup lang="ts">
import { useAuthenStore } from '@/stores/authenStore';

import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseSegment from '@/components/base/BaseSegment.vue';
import BaseTextHeader from '@/components/base/BaseTextHeader.vue';
import ChartArea from '@/components/chart/ChartArea.vue';
import ChartSparklines from '@/components/chart/ChartSparklines.vue';
import NotificationAppNotification from '@/components/notification/AppNotification.vue';
import UserItem from '@/components/user/UserItem.vue';
import { useTheme } from '@/composables/useTheme';
import {
  dashBaordRecentSalseItems,
  dashBaordStatisticItems,
  dashboardChartData,
  dashboardHeroItems,
  dashboardSparkLineItems,
} from '@/libs/data';
import type { LabelValue } from '@/types/common';
import {
  IonBadge,
  IonButtons,
  IonCardContent,
  IonImg,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/vue';
import { biMusicNote } from '@quasar/extras/bootstrap-icons';
import { searchOutline } from 'ionicons/icons';
import { ref } from 'vue';
const authenStore = useAuthenStore();
const { isDark } = useTheme();
const toggleModel = ref<string>('overview');
const statisticItems = ref<LabelValue<string>[]>(dashBaordStatisticItems);
const recentSalseItems = ref<LabelValue<string>[]>(dashBaordRecentSalseItems);
</script>
<template>
  <BasePage
    :page-title="authenStore?.loginedDisplay || 'Home'"
    :show-back-link="false"
  >
    <template #start>
      <ion-img
        slot="start"
        style="width: 40px; height: 40px"
        :src="!isDark ? '/logo/logo.png' : '/logo/logo-white.png'"
      />
    </template>
    <template #actions-end>
      <ion-buttons slot="end">
        <notification-app-notification />
        <BaseButton
          clear
          :icon="{ name: searchOutline, iconSet: 'ion' }"
          icon-only
          :icon-size="28"
          to="/search"
        />
      </ion-buttons>
    </template>

    <BaseCard :bordered="false">
      <BaseTextHeader
        title="Dashboard"
        subtitle="Top picks for you. Updated daily."
        class="q-px-md"
        :icon="{ name: biMusicNote, iconSet: 'bootstrap-icons' }"
      />
      <IonCardContent>
        <BaseSegment
          v-model="toggleModel"
          :items="[
            { label: 'Overview', value: 'overview' },
            { label: 'Analytics', value: 'analytics' },
            { label: 'Reports', value: 'reports' },
          ]"
          layout="icon-end"
        />
      </IonCardContent>
    </BaseCard>
    <BaseCard title="Recommended">
      <IonItem v-for="(item, index) in dashboardHeroItems" :key="index">
          <BaseIcon
            slot="start"
            :name="item.icon?.name || ''"
            :iconSet="item.icon?.iconSet"
          />
        <IonLabel>
          <h2>{{ item.label }}</h2>
          <p>{{ item.description }}</p>
        </IonLabel>
        <BaseButton slot="end" clear label="Explore" :to="item.to" />
      </IonItem>
    </BaseCard>

    <BaseCard title="Statistics">
      <IonList>
        <IonItem v-for="(item, index) in statisticItems" :key="index">
          <IonLabel>
            <h2>{{ item.label }}</h2>
            <div class="q-text-h5 q-text-weight-bold">{{ item.value }}</div>
            <p>{{ item.description }}</p>
          </IonLabel>
          <BaseIcon
            slot="end"
            :name="item.icon?.name || ''"
            :iconSet="item.icon?.iconSet"
            class="text-muted"
          />
        </IonItem>
      </IonList>
    </BaseCard>
    <BaseCard title="Display">
      <IonList>
        <IonItem
          v-for="(item, index) in dashboardSparkLineItems"
          :key="index"
          lines="none"
        >
          <IonLabel>
            <h2>{{ item.label }}</h2>
            <p>
              {{ item.description }}
              <IonBadge :class="`bg-${item.bg}`" :style="{ color: item.color }">
                {{ item.value }}
              </IonBadge>
            </p>
          </IonLabel>
          <div slot="end">
            <ChartSparklines
              style="width: 155px"
              height="65"
              :chart-id="`sparkline-area-${index}`"
              :stroke-width="1"
              strokestyle="smooth"
              :colors="[item.color]"
              :series="item.series"
              :categories="item.categories"
              :dark="isDark"
            />
          </div>
        </IonItem>
      </IonList>
    </BaseCard>
    <BaseCard title="Overview">
      <ChartArea
        class="q-my-sm"
        chart-id="chart-bar"
        height="250"
        type="bar"
        :colors="['#64748B', '#94A3B8', '#CBD5E1']"
        :series="dashboardChartData.series.slice(3, 6)"
        :categories="dashboardChartData.categories"
        :label-rotate="-45"
        strokestyle="smooth"
        :xaxis-tickamount="4"
        :dark="isDark"
      />
    </BaseCard>
    <BaseCard title="Recent Sales" caption="You made 265 sales this month.">
      <IonList>
        <UserItem
          v-for="(item, index) in recentSalseItems"
          :key="index"
          :avatar="{
            src: item.avatar?.src || '/images/no_picture_thumb.jpg',
            size: 42,
          }"
          :name="item.label"
          :description="item.description"
        >
          <template #end>
            <div class="q-text-subtitle1 q-text-black q-text-weight-bold">
              {{ item.value }}
            </div>
          </template>
        </UserItem>
      </IonList>
    </BaseCard>
  </BasePage>
</template>
