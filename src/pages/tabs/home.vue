<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseImage from '@/components/base/BaseImage.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseSegment from '@/components/base/BaseSegment.vue';
import ChartArea from '@/components/chart/ChartArea.vue';
import ChartSparklines from '@/components/chart/ChartSparklines.vue';
import UserItem from '@/components/user/UserItem.vue';
import { useLang } from '@/composables/useLang';
import { useTheme } from '@/composables/useTheme';
import {
  dashBaordRecentSalseItems,
  dashBaordStatisticItems,
  dashboardChartData,
  dashboardSparkLineItems,
} from '@/libs/data';
import { useAuthenStore } from '@/stores/authenStore';
import { IonList } from '@ionic/vue';
import {
  arrowForwardOutline,
  arrowUpOutline,
  barChartOutline,
  chatbubbleEllipsesOutline,
  colorPaletteOutline,
  optionsOutline,
} from 'ionicons/icons';
import { computed, ref } from 'vue';

const authenStore = useAuthenStore();
const { t, locale } = useLang();
const { isDark } = useTheme();
const section = ref('overview');
const sections = computed(() =>
  ['overview', 'analytics', 'activity'].map((value) => ({
    label: t(`dashboard.${value}`),
    value,
  })),
);
const shortcuts = computed(() => [
  {
    label: t('nav.chats'),
    description: t('dashboard.chatHint'),
    to: '/tabs/chat',
    icon: chatbubbleEllipsesOutline,
  },
  {
    label: t('dashboard.charts'),
    description: t('dashboard.chartHint'),
    to: '/example/charts',
    icon: barChartOutline,
  },
  {
    label: t('base.setting'),
    description: t('dashboard.settingsHint'),
    to: '/tabs/other',
    icon: optionsOutline,
  },
]);
const statKeys = ['revenue', 'subscriptions', 'sales', 'active'];
const trendKeys = ['revenueTrend', 'pageViews', 'bounceRate', 'saleRate'];
const chartSeries = computed(() =>
  dashboardChartData.series.slice(3, 6).map((item, index) => ({
    ...item,
    name: t(`dashboard.series${index}`),
  })),
);
const chartCategories = computed(() =>
  dashboardChartData.categories.map((_, index) =>
    new Intl.DateTimeFormat(locale.value, { month: 'short' }).format(
      new Date(2026, index, 1),
    ),
  ),
);
</script>

<template>
  <BasePage
    class="home-page"
    :page-title="t('app.name')"
    :show-back-link="false"
    :fullscreen="false"
    header-no-border
  >
    <template #start>
      <BaseImage
        slot="start"
        class="home-logo"
        :src="isDark ? '/logo/logo-white.png' : '/logo/logo.png'"
        :alt="t('app.name')"
        fit="contain"
      />
    </template>
    <template #actions-end>
      <BaseButton
        clear
        round
        icon-only
        class="home-appearance"
        :aria-label="t('base.appearance')"
        :icon="{ name: colorPaletteOutline, iconSet: 'ion' }"
        to="/settings/appearance"
      />
    </template>

    <main class="home-layout">
      <header class="home-intro">
        <div>
          <p class="home-eyebrow">
            {{
              authenStore.loginedDisplay
                ? t('dashboard.greeting', { name: authenStore.loginedDisplay })
                : t('dashboard.greetingDefault')
            }}
          </p>
          <h1>{{ t('dashboard.title') }}</h1>
          <p class="home-subtitle">{{ t('dashboard.subtitle') }}</p>
        </div>
        <span class="home-demo">{{ t('dashboard.demoData') }}</span>
      </header>

      <BaseSegment
        v-model="section"
        class="home-sections"
        :items="sections"
        :scrollable="false"
        :aria-label="t('dashboard.sections')"
      />

      <div
        v-if="section === 'overview'"
        class="home-overview"
        data-testid="overview-panel"
      >
        <BaseCard class="home-revenue" :margin="false" flat>
          <div class="home-revenue-top">
            <span>{{ t('dashboard.revenue') }}</span>
            <span class="home-period">{{ t('thisMonth') }}</span>
          </div>
          <strong class="home-revenue-value">{{
            dashBaordStatisticItems[0].value
          }}</strong>
          <div class="home-revenue-bottom">
            <span class="home-growth"
              ><BaseIcon
                :name="arrowUpOutline"
                icon-set="ion"
                :size="14"
                style="top: 0"
              />
              +20.1%</span
            >
            <span>{{ t('dashboard.fromLastMonth') }}</span>
          </div>
          <BaseButton
            class="home-revenue-action"
            clear
            @click="section = 'analytics'"
          >
            {{ t('dashboard.viewAnalytics') }}
            <BaseIcon
              slot="end"
              :name="arrowForwardOutline"
              icon-set="ion"
              :size="18"
              style="top: 0"
            />
          </BaseButton>
        </BaseCard>

        <section class="home-stat-grid" :aria-label="t('dashboard.statistics')">
          <BaseCard
            v-for="(item, index) in dashBaordStatisticItems.slice(1)"
            :key="statKeys[index + 1]"
            class="home-stat"
            :margin="false"
            flat
          >
            <BaseIcon
              v-if="item.icon"
              v-bind="item.icon"
              class="home-stat-icon"
              :size="22"
            />
            <h2>{{ t(`dashboard.${statKeys[index + 1]}`) }}</h2>
            <strong>{{ item.value }}</strong>
            <p>{{ t(`dashboard.change${index + 1}`) }}</p>
          </BaseCard>
        </section>

        <section
          class="home-shortcuts"
          :aria-labelledby="'home-shortcuts-title'"
        >
          <div class="home-section-heading">
            <h2 id="home-shortcuts-title">{{ t('dashboard.quickAccess') }}</h2>
          </div>
          <div class="home-shortcut-grid">
            <BaseButton
              v-for="item in shortcuts"
              :key="item.to"
              class="home-shortcut"
              clear
              :to="item.to"
            >
              <span class="home-shortcut-content">
                <span class="home-shortcut-icon"
                  ><BaseIcon
                    :name="item.icon"
                    icon-set="ion"
                    :size="25"
                    style="top: 0"
                /></span>
                <strong>{{ item.label }}</strong>
                <span>{{ item.description }}</span>
              </span>
            </BaseButton>
          </div>
        </section>
      </div>

      <section
        v-if="section === 'analytics'"
        class="home-analytics"
        data-testid="analytics-panel"
        :aria-label="t('dashboard.analytics')"
      >
        <BaseCard :margin="false" flat class="home-chart">
          <div class="home-section-heading">
            <h2>{{ t('dashboard.engagement') }}</h2>
            <span>{{ t('dashboard.demoData') }}</span>
          </div>
          <ChartArea
            :key="locale"
            chart-id="home-engagement"
            height="270"
            type="bar"
            :series="chartSeries"
            :categories="chartCategories"
            :label-rotate="-45"
            :xaxis-tickamount="4"
            :dark="isDark"
            :mode="isDark ? 'dark' : 'light'"
          />
        </BaseCard>
        <div class="home-trend-grid">
          <BaseCard
            v-for="(item, index) in dashboardSparkLineItems"
            :key="`${locale}-${index}`"
            class="home-trend"
            :margin="false"
            flat
          >
            <h2>{{ t(`dashboard.${trendKeys[index]}`) }}</h2>
            <div class="home-trend-value">
              <strong>{{ item.description }}</strong
              ><span>{{ item.value }}</span>
            </div>
            <ChartSparklines
              :chart-id="`home-trend-${index}`"
              height="80"
              :series="item.series"
              :categories="item.categories"
              :mode="isDark ? 'dark' : 'light'"
              :stroke-width="2"
              strokestyle="smooth"
              :tooltip-enable="false"
            />
          </BaseCard>
        </div>
      </section>

      <section
        v-if="section !== 'analytics'"
        class="home-activity"
        data-testid="activity-panel"
        aria-labelledby="home-activity-title"
      >
        <div class="home-section-heading">
          <h2 id="home-activity-title">{{ t('dashboard.recentSales') }}</h2>
          <BaseButton
            v-if="section === 'overview'"
            clear
            size="small"
            @click="section = 'activity'"
            >{{ t('dashboard.viewAll') }}</BaseButton
          >
        </div>
        <BaseCard :margin="false" flat class="home-sales">
          <IonList>
            <UserItem
              v-for="item in dashBaordRecentSalseItems.slice(
                0,
                section === 'overview' ? 3 : undefined,
              )"
              :key="item.description"
              :avatar="{
                src: item.avatar?.src || '/images/no_picture_thumb.jpg',
                size: 42,
              }"
              :name="item.label"
              :lines-name="1"
              :lines-description="1"
              :description="item.description"
            >
              <template #end
                ><strong class="home-sale-value">{{
                  item.value
                }}</strong></template
              >
            </UserItem>
          </IonList>
        </BaseCard>
      </section>
    </main>
  </BasePage>
</template>

<style scoped lang="scss">
.home-logo {
  width: 32px;
  height: 32px;
  margin-inline-start: 20px;
}
.home-appearance {
  width: 44px;
  height: 44px;
  --color: var(--app-text-strong);
}
.home-layout :deep(ion-card) {
  margin: 0;
  --background: var(--app-bg-elevated);
}
.home-layout {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 20px 32px;
  color: var(--app-text-body);
}
.home-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}
.home-eyebrow {
  margin: 0 0 8px;
  color: var(--app-text-muted);
  font-size: 0.875rem;
}
h1 {
  margin: 0;
  color: var(--app-text-strong);
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.025em;
}
.home-subtitle {
  margin: 10px 0 0;
  color: var(--app-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
}
.home-demo {
  flex-shrink: 0;
  padding: 6px 10px;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  font-size: 0.6875rem;
  color: var(--app-text-muted);
}
.home-sections {
  max-width: 440px;
  margin-bottom: 24px;
  padding: 5px;
  border-radius: 16px;
  background: var(--app-border-light);
}
.home-sections :deep(ion-segment-button) {
  --border-radius: 12px;
  --color: var(--app-text-muted);
  --color-checked: var(--app-text-strong);
  min-height: 40px;
  font-weight: 500;
}
.home-sections :deep(ion-label) {
  font-size: 0.8125rem;
  white-space: normal;
}
.home-overview {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
}
.home-revenue {
  position: relative;
  padding: 24px;
  background: var(--app-bg-accent);
  border: 1px solid color-mix(in srgb, var(--app-text-accent) 14%, transparent);
  color: var(--app-text-accent);
}
.home-revenue-top,
.home-revenue-bottom,
.home-trend-value {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.home-revenue-top {
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 500;
}
.home-period {
  padding: 6px 10px;
  border-radius: 20px;
  background: var(--app-bg-surface);
  color: var(--app-text-muted);
  font-size: 0.75rem;
}
.home-revenue-value {
  display: block;
  margin: 18px 0 14px;
  color: var(--app-text-strong);
  font-size: clamp(2rem, 7vw, 3rem);
  line-height: 1.15;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
}
.home-revenue-bottom {
  font-size: 0.75rem;
  color: var(--app-text-muted);
}
.home-growth {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 5px 8px;
  border-radius: 20px;
  background: var(--app-bg-positive);
  color: var(--app-text-positive);
  font-weight: 700;
}
.home-revenue-action {
  margin: 18px 0 -8px -10px;
  --color: var(--app-text-accent);
  font-size: 0.8125rem;
}
.home-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.home-stat {
  min-width: 0;
  padding: 16px 12px;
  border: 1px solid var(--app-border-light);
}
.home-stat-icon {
  color: var(--app-text-accent);
  margin-bottom: 14px;
}
.home-stat h2,
.home-trend h2 {
  margin: 0 0 8px;
  color: var(--app-text-muted);
  font-size: 0.75rem;
  line-height: 1.6;
  font-weight: 500;
}
.home-stat strong {
  display: block;
  color: var(--app-text-strong);
  font-size: clamp(1rem, 3.7vw, 1.5rem);
  white-space: nowrap;
  letter-spacing: -0.02em;
}
.home-stat p {
  margin: 8px 0 0;
  font-size: 0.6875rem;
  line-height: 1.6;
  color: var(--app-text-positive);
}
.home-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 8px 0 14px;
}
.home-section-heading h2 {
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.5;
  font-weight: 700;
  color: var(--app-text-strong);
}
.home-section-heading > span {
  font-size: 0.75rem;
  color: var(--app-text-muted);
}
.home-shortcut-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.home-shortcut {
  display: block;
  height: auto;
  min-height: 128px;
  margin: 0;
  --background: var(--app-bg-surface);
  --background-hover: var(--app-bg-accent);
  --color: var(--app-text-strong);
  --border-radius: 20px;
  --padding-start: 10px;
  --padding-end: 10px;
  border: 1px solid var(--app-border-light);
  border-radius: 20px;
}
.home-shortcut-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 8px;
  white-space: normal;
}
.home-shortcut-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--app-bg-accent);
  color: var(--app-text-accent);
  margin-bottom: 4px;
}
.home-shortcut-content strong {
  font-size: 0.8125rem;
}
.home-shortcut-content > span:last-child {
  font-size: 0.6875rem;
  line-height: 1.5;
  color: var(--app-text-muted);
  font-weight: 400;
}
.home-activity {
  margin-top: 24px;
}
.home-sales {
  padding: 6px 0;
  border: 1px solid var(--app-border-light);
}
.home-sales ion-list {
  background: transparent;
  padding: 0;
}
.home-sales :deep(ion-item) {
  --min-height: 76px;
  --padding-start: 16px;
  --inner-padding-end: 16px;
}
.home-sales :deep(ion-label) {
  min-width: 0;
}
.home-sale-value {
  color: var(--app-text-strong);
  font-size: 0.875rem;
  white-space: nowrap;
}
.home-analytics {
  display: grid;
  gap: 20px;
}
.home-chart {
  padding: 20px 12px 8px;
  border: 1px solid var(--app-border-light);
}
.home-chart .home-section-heading {
  padding-inline: 8px;
}
.home-trend-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.home-trend {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--app-border-light);
}
.home-trend-value {
  justify-content: space-between;
  margin-bottom: 16px;
}
.home-trend-value strong {
  font-size: 1.375rem;
  color: var(--app-text-strong);
}
.home-trend-value span {
  font-size: 0.75rem;
  color: var(--app-text-accent);
}

@media (min-width: 760px) {
  .home-layout {
    padding: 36px 32px;
  }
  .home-overview {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
  }
  .home-shortcuts {
    grid-column: 1 / -1;
  }
  .home-stat-grid {
    gap: 16px;
  }
  .home-stat {
    padding: 24px 16px;
  }
  .home-stat strong {
    font-size: 1.5rem;
  }
  .home-stat h2 {
    font-size: 0.875rem;
  }
  .home-trend-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 359px) {
  .home-layout {
    padding-inline: 12px;
  }
  .home-intro {
    flex-direction: column;
  }
  .home-stat-grid,
  .home-shortcut-grid {
    gap: 8px;
  }
  .home-sale-value {
    font-size: 0.75rem;
  }
  .home-sales :deep(ion-item) {
    --padding-start: 12px;
    --inner-padding-end: 12px;
  }
}
</style>
