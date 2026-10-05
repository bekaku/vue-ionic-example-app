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
import { useDateFns } from '@/composables/useDateFns';
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
const { formatDateBy } = useDateFns(locale);
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
    formatDateBy(new Date(2026, index, 1), 'MMM'),
  ),
);
</script>

<template>
  <BasePage
    class="home-page"
    :page-title="t('app.name')"
    :show-back-link="false"
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

    <main class="app-page home-layout">
      <header class="home-intro app-enter">
        <div>
          <p class="app-eyebrow">
            {{
              authenStore.loginedDisplay
                ? t('dashboard.greeting', { name: authenStore.loginedDisplay })
                : t('dashboard.greetingDefault')
            }}
          </p>
          <h1 class="app-title-xl">{{ t('dashboard.title') }}</h1>
          <p class="home-subtitle app-muted">{{ t('dashboard.subtitle') }}</p>
        </div>
        <span class="app-chip">{{ t('dashboard.demoData') }}</span>
      </header>

      <BaseSegment
        v-model="section"
        class="home-sections app-enter"
        style="--app-enter-index: 1"
        :items="sections"
        :scrollable="false"
        :aria-label="t('dashboard.sections')"
      />

      <div
        v-if="section === 'overview'"
        class="home-overview"
        data-testid="overview-panel"
      >
        <BaseCard
          class="home-revenue app-surface app-surface-hero app-enter"
          style="--app-enter-index: 2"
          :margin="false"
        >
          <div class="home-revenue-top">
            <span class="app-eyebrow">{{ t('dashboard.revenue') }}</span>
            <span class="app-chip app-chip-glass">{{ t('thisMonth') }}</span>
          </div>
          <strong class="app-display home-revenue-value">{{
            dashBaordStatisticItems[0].value
          }}</strong>
          <div class="home-revenue-bottom">
            <span class="app-chip app-chip-glass app-num"
              ><BaseIcon
                :name="arrowUpOutline"
                icon-set="ion"
                :size="14"
                style="top: 0"
              />
              +20.1%</span
            >
            <span class="app-muted">{{ t('dashboard.fromLastMonth') }}</span>
          </div>
          <BaseButton
            class="home-revenue-action"
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

        <section
          class="app-grid home-stat-grid"
          :aria-label="t('dashboard.statistics')"
        >
          <BaseCard
            v-for="(item, index) in dashBaordStatisticItems.slice(1)"
            :key="statKeys[index + 1]"
            class="home-stat app-surface app-enter"
            :class="{ 'home-stat-wide': statKeys[index + 1] === 'active' }"
            :style="{ '--app-enter-index': index + 3 }"
            :margin="false"
          >
            <span class="app-icon-tile home-stat-icon">
              <BaseIcon v-if="item.icon" v-bind="item.icon" :size="20" />
            </span>
            <div class="home-stat-body">
              <h2>
                <span
                  v-if="statKeys[index + 1] === 'active'"
                  class="app-live-dot"
                  aria-hidden="true"
                />
                {{ t(`dashboard.${statKeys[index + 1]}`) }}
              </h2>
              <strong class="app-num">{{ item.value }}</strong>
              <p>{{ t(`dashboard.change${index + 1}`) }}</p>
            </div>
          </BaseCard>
        </section>

        <section
          class="app-section home-shortcuts app-enter"
          style="--app-enter-index: 6"
          aria-labelledby="home-shortcuts-title"
        >
          <div class="app-section-header">
            <h2 id="home-shortcuts-title">{{ t('dashboard.quickAccess') }}</h2>
          </div>
          <div class="app-grid home-shortcut-grid" style="--app-grid-cols: 3">
            <BaseButton
              v-for="item in shortcuts"
              :key="item.to"
              class="home-shortcut"
              clear
              :to="item.to"
            >
              <span class="home-shortcut-content">
                <span class="app-icon-tile"
                  ><BaseIcon
                    :name="item.icon"
                    icon-set="ion"
                    :size="22"
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
        <BaseCard :margin="false" class="home-chart app-surface app-enter">
          <div class="app-section-header">
            <h2>{{ t('dashboard.engagement') }}</h2>
            <span class="app-chip">{{ t('dashboard.demoData') }}</span>
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
        <div class="app-grid home-trend-grid">
          <BaseCard
            v-for="(item, index) in dashboardSparkLineItems"
            :key="`${locale}-${index}`"
            class="home-trend app-surface app-enter"
            :style="{ '--app-enter-index': index + 1 }"
            :margin="false"
          >
            <h2>{{ t(`dashboard.${trendKeys[index]}`) }}</h2>
            <div class="home-trend-value">
              <strong class="app-num">{{ item.description }}</strong
              ><span class="app-chip app-chip-accent">{{ item.value }}</span>
            </div>
            <ChartSparklines
              :chart-id="`home-trend-${index}`"
              height="72"
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
        class="app-section home-activity app-enter"
        style="--app-enter-index: 7"
        data-testid="activity-panel"
        aria-labelledby="home-activity-title"
      >
        <div class="app-section-header">
          <h2 id="home-activity-title">{{ t('dashboard.recentSales') }}</h2>
          <BaseButton
            v-if="section === 'overview'"
            clear
            size="small"
            @click="section = 'activity'"
            >{{ t('dashboard.viewAll') }}</BaseButton
          >
        </div>
        <BaseCard :margin="false" class="app-surface app-surface-flush">
          <IonList>
            <UserItem
              v-for="item in dashBaordRecentSalseItems.slice(
                0,
                section === 'overview' ? 3 : undefined,
              )"
              :key="item.description"
              :avatar="{
                src: item.avatar?.src || '/images/no_picture_thumb.jpg',
                size: 44,
              }"
              :name="item.label"
              :lines-name="1"
              :lines-description="1"
              :description="item.description"
            >
              <template #end
                ><strong class="home-sale-value app-num">{{
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
/* Look comes from mobile-ui.scss utilities; only Home-specific layout here. */
.home-logo {
  width: 30px;
  height: 30px;
  margin-inline-start: 18px;
}
.home-appearance {
  width: 44px;
  height: 44px;
  --color: var(--app-text-strong);
}
.home-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-top: 8px;

  .app-eyebrow {
    margin-bottom: 6px;
  }
}
.home-subtitle {
  margin: 8px 0 0;
  font-size: 0.9375rem;
  line-height: 1.6;
}
.home-sections {
  max-width: 440px;
}
.home-overview,
.home-analytics {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}
.home-revenue-top,
.home-revenue-bottom,
.home-trend-value {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.home-revenue-top {
  justify-content: space-between;
}
.home-revenue-value {
  display: block;
  margin: 20px 0 12px;
}
.home-revenue-bottom {
  font-size: 0.8125rem;
}
.home-revenue-action {
  margin: 22px 0 0;
  --background: color-mix(in srgb, var(--color-white) 18%, transparent);
  --background-activated: color-mix(in srgb, var(--color-white) 28%, transparent);
  --background-hover: color-mix(in srgb, var(--color-white) 24%, transparent);
  --color: var(--app-text-on-hero);
  --border-radius: var(--app-radius-full);
  --box-shadow: none;
  --padding-start: 16px;
  --padding-end: 14px;
  font-size: 0.875rem;
}
.home-stat {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
.home-stat-wide {
  grid-column: 1 / -1;
  flex-direction: row;
  align-items: center;

  .home-stat-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: baseline;
    column-gap: 12px;
    flex: 1;
  }
  h2 {
    grid-column: 1;
  }
  strong {
    grid-row: 1 / span 2;
    grid-column: 2;
    align-self: center;
  }
  p {
    grid-column: 1;
  }
}
.home-stat-icon {
  --app-icon-tile-size: 40px;
}
.home-stat h2,
.home-trend h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px;
  color: var(--app-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.5;
}
.home-stat strong {
  display: block;
  color: var(--app-text-strong);
  font-size: 1.625rem;
  font-weight: 700;
  line-height: 1.25;
  white-space: nowrap;
}
.home-stat p {
  margin: 6px 0 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--app-text-positive);
}
.home-shortcut {
  display: block;
  height: auto;
  margin: 0;
  --background: var(--app-bg-surface);
  --background-hover: var(--app-bg-accent);
  --background-activated: var(--app-bg-accent);
  --color: var(--app-text-strong);
  --border-radius: var(--app-radius-card);
  --padding-start: 8px;
  --padding-end: 8px;
  --box-shadow: var(--app-shadow-card);
  border-radius: var(--app-radius-card);
}
.home-shortcut-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 0 16px;
  white-space: normal;

  .app-icon-tile {
    margin-bottom: 6px;
  }
  strong {
    font-size: 0.875rem;
    font-weight: 700;
  }
  > span:last-child {
    color: var(--app-text-muted);
    font-size: 0.6875rem;
    font-weight: 400;
    line-height: 1.5;
  }
}
.home-sale-value {
  color: var(--app-text-strong);
  font-size: 0.9375rem;
  white-space: nowrap;
}
.home-activity :deep(ion-item) {
  --min-height: 72px;
}
.home-activity :deep(ion-label) {
  min-width: 0;
}
.home-chart {
  padding: 20px 12px 8px;

  .app-section-header {
    padding-inline: 8px;
  }
}
.home-trend {
  padding: 16px;
}
.home-trend-value {
  justify-content: space-between;
  margin: 4px 0 8px;

  strong {
    color: var(--app-text-strong);
    font-size: 1.375rem;
  }
}

@media (min-width: 760px) {
  .home-layout {
    padding-inline: 32px;
  }
  .home-overview {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  }
  .home-shortcuts {
    grid-column: 1 / -1;
  }
  .home-trend-grid {
    --app-grid-cols: 4;
  }
}
@media (max-width: 359px) {
  .home-intro {
    flex-direction: column;
  }
  .home-shortcut-grid {
    gap: 8px;
  }
  .home-stat strong {
    font-size: 1.375rem;
  }
}
</style>
