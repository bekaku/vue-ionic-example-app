<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useTheme } from '@/composables/useTheme';
import type { ISeriresCategories } from '@/types/chart';
import {
    IonCardContent,
    IonCol,
    IonRow
} from '@ionic/vue';
import ChartArea from '@/components/chart/ChartArea.vue';
import ChartPie from '@/components/chart/ChartPie.vue';
import ChartRadar from '@/components/chart/ChartRadar.vue';
import ChartRadial from '@/components/chart/ChartRadial.vue';
import ChartSparklines from '@/components/chart/ChartSparklines.vue';
const { isDark } = useTheme();
const chartData: ISeriresCategories = {
    categories: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    series: [
        {
            name: 'Access',
            data: [32, 26, 57, 21, 8, 6, 14, 39, 10, 7, 9, 25],
        },
        {
            name: 'Post',
            data: [10, 8, 30, 21, 27, 10, 9, 40, 20, 10, 50, 12],
        },
        {
            name: 'Repost',
            data: [8, 10, 15, 21, 4, 15, 10, 50, 8, 0, 9, 25],
        },
        {
            name: 'Comment',
            data: [1, 0, 2, 4, 0, 0, 1, 2, 0, 0, 1, 11],
        },
        {
            name: 'Feel',
            data: [20, 10, 40, 16, 0, 5, 19, 1, 5, 0, 1, 4],
        },
        {
            name: 'Share',
            data: [1, 10, 11, 21, 17, 36, 51, 30, 15, 24, 56, 8],
        },
        {
            name: 'Read',
            data: [75, 38, 25, 70, 3, 2, 45, 35, 9, 6, 11, 24],
        },
        {
            name: 'Learn',
            data: [22, 0, 3, 2, 45, 11, 31, 20, 22, 10, 12, 21],
        },
        {
            name: 'Reward',
            data: [30, 1, 13, 1, 0, 0, 3, 0, 3, 0, 20, 15],
        },
    ],
};
const chartData2: ISeriresCategories = {
    categories: ['January', 'February', 'March', 'April', 'May', 'June'],
    series: [
        {
            name: 'Access',
            data: [80, 50, 30, 40, 100, 20],
        },
        {
            name: 'Post',
            data: [20, 30, 40, 80, 20, 80],
        },
        {
            name: 'Repost',
            data: [44, 76, 78, 13, 43, 10],
        },
    ],
};

const appleStockPrices: ISeriresCategories = {
    categories: ['AAPL'],
    series: [
        {
            name: 'AAPL',
            data: [
                1382.54, 1285.23, 1688.76, 1090.12, 1307.65, 1285.98, 1309.34, 1311.56,
                1393.24, 1300.87, 1188.98, 1091.45, 1193.67, 1335.23, 1302.87, 1370.98,
                1103.34, 1295.78, 817.34, 1395.87,
            ],
        },
    ],
};

const simpleSeries: number[] = [44, 55, 41, 37, 22, 43, 21];
const simpleCategories: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
];
</script>
<template>
    <BasePage page-title="Charts" fullscreen show-back-link>
        <BaseCard title="Radial">
            <IonRow class="ion-justify-content-center">
                <ChartRadial chart-id="radial-1" :series="simpleSeries.slice(0, 3)"
                    :categories="simpleCategories.slice(0, 3)" />
            </IonRow>
            <IonRow class="ion-justify-content-center">
                <ChartRadial chart-id="radial-2" height="250" val-unit="%" :colors="['#8D6E63']"
                    :series="simpleSeries.slice(0, 1)" :categories="simpleCategories.slice(0, 1)" />
            </IonRow>
            <IonRow class="ion-justify-content-center">
                <ChartRadial chart-id="radial-3" semi stoke-line-cap="square" :start-angle="-90" :end-angle="90"
                    :colors="['#647C64']" :series="simpleSeries.slice(1, 2)" :categories="simpleCategories.slice(1, 2)"
                    :show-legend="false" />
            </IonRow>
            <IonRow class="ion-justify-content-center">
                <ChartRadial chart-id="radial-4" val-unit="%" :colors="['#8E8CD8']" :start-angle="-180" :end-angle="360"
                    :show-legend="false" :grid-padding="{
                        bottom: -100,
                    }" :series="simpleSeries.slice(2, 3)" :categories="simpleCategories.slice(2, 3)" />
            </IonRow>
        </BaseCard>
        <BaseCard title="Sparklines">
            <IonRow>
                <IonCol size="6">
                    <ChartSparklines height="100" chart-id="sparkline-area" :stroke-width="1" strokestyle="smooth"
                        :colors="['#9E9E9E']" :series="appleStockPrices.series"
                        :categories="appleStockPrices.categories" />
                </IonCol>
                <IonCol size="6">
                    <ChartSparklines height="100" chart-id="sparkline-area-2" :stroke-width="1" strokestyle="straight"
                        :colors="['#607D8B']" :series="appleStockPrices.series"
                        :categories="appleStockPrices.categories" />
                </IonCol>
                <IonCol size="6">
                    <ChartSparklines height="100" chart-id="sparkline-line" type="line" :stroke-width="3"
                        :colors="['#607D8B']" :series="appleStockPrices.series"
                        :categories="appleStockPrices.categories" />
                </IonCol>
                <IonCol size="6">
                    <ChartSparklines height="100" chart-id="sparkline-bar" type="bar" :stroke-width="1"
                        :colors="['#8D6E63']" :series="appleStockPrices.series"
                        :categories="appleStockPrices.categories" />
                </IonCol>
            </IonRow>
        </BaseCard>

        <BaseCard title="Radar">
            <IonRow class="ion-justify-content-center">
                <ChartRadar chart-id="chart-radar" height="350" :markers="3" :colors="['#8D6E63', '#9E9E9E', '#607D8B']"
                    :series="chartData2.series" :categories="chartData2.categories" />
            </IonRow>
            <IonRow class="ion-justify-content-center">
                <ChartRadar chart-id="chart-radar-2" height="350" :markers="0" show-data-labels :colors="['#4E342E']"
                    :grid-colors="!isDark ? ['#f8f8f8', '#fff'] : ['#383a42', '#717886']
                        " :series="chartData2.series.slice(0, 1)" :categories="chartData2.categories" />
            </IonRow>
        </BaseCard>

        <BaseCard title="Area">
            <IonRow class="ion-justify-content-center">
                <ChartArea class="q-my-sm" chart-id="chart-area" height="350" palette="palette1" type="area"
                    :stroke-width="2" :colors="['#8D6E63', '#9E9E9E', '#607D8B']" :series="chartData.series.slice(0, 3)"
                    :categories="chartData.categories" strokestyle="smooth" :label-rotate="-90" />
            </IonRow>
            <IonRow class="ion-justify-content-center">
                <ChartArea class="q-my-sm" chart-id="chart-area-2" height="350" type="area" :stroke-width="2"
                    :colors="['#847545', '#68768A', '#767676']" :series="chartData.series.slice(0, 3)"
                    :categories="chartData.categories" strokestyle="straight" :xaxis-tickamount="3" />
            </IonRow>
        </BaseCard>
        <BaseCard title="Line">
            <IonRow class="ion-justify-content-center">
                <ChartArea class="q-my-sm" chart-id="chart-line" height="350" palette="palette1" type="line"
                    :series="chartData.series.slice(6, 9)" :categories="chartData.categories" strokestyle="straight"
                    :label-rotate="-45" :stroke-width="3" />
            </IonRow>
            <IonRow class="ion-justify-content-center">
                <ChartArea class="q-my-sm" chart-id="chart-line-2" height="350" palette="palette8" type="line"
                    :series="chartData.series.slice(6, 9)" :categories="chartData.categories" strokestyle="smooth"
                    :xaxis-tickamount="3" :stroke-width="3" />
            </IonRow>
        </BaseCard>
        <BaseCard title="Bar">
            <IonRow class="ion-justify-content-center">
                <ChartArea class="q-my-sm" chart-id="chart-bar" height="350" palette="palette3" type="bar"
                    :series="chartData.series.slice(3, 6)" :categories="chartData.categories" strokestyle="smooth"
                     :xaxis-tickamount="3" />
            </IonRow>
            <IonRow class="ion-justify-content-center">
                <ChartArea class="q-my-sm" chart-id="chart-bar-simple" height="350" palette="palette3" type="bar"
                    :opacity="0.3" :series="chartData.series.slice(0, 1)" :categories="chartData.categories"
                    strokestyle="smooth" :label-rotate="-90" />
            </IonRow>
            <IonRow class="ion-justify-content-center">
                <ChartArea class="q-my-sm" chart-id="chart-bar-horizontal" height="350" palette="palette4" type="bar"
                    horizontal :series="chartData.series.slice(0, 1)" :categories="chartData.categories"
                    strokestyle="smooth" />
            </IonRow>
        </BaseCard>
        <BaseCard title="Pie/Donuts">
            <IonRow class="ion-justify-content-center">
                <ChartPie class="q-my-sm" chart-id="chart-pine" height="350" palette="palette1" type="pie"
                    :series="simpleSeries" :categories="simpleCategories" />
            </IonRow>
            <IonRow class="ion-justify-content-center">
                <ChartPie class="q-my-sm" chart-id="chart-donut" height="350" palette="palette5" type="donut" :colors="[
                    '#FFB900',
                    '#E74856',
                    '#0078D7',
                    '#0099BC',
                    '#7A7574',
                    '#00CC6A',
                    '#8E8CD8',
                ]" :series="simpleSeries" :categories="simpleCategories" />
            </IonRow>
        </BaseCard>
    </BasePage>
</template>
