<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseImage from '@/components/base/BaseImage.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseSwiperSlides from '@/components/base/BaseSwiperSlides.vue';
import type { SlideOptions } from '@/types/common';
import {
  IonCardContent,
  IonItem,
  IonLabel,
  IonRow
} from '@ionic/vue';
import { useTemplateRef } from 'vue';
const testSwiperRef = useTemplateRef<InstanceType<typeof BaseSwiperSlides>>('testSwiperRef');
const slideOpts: SlideOptions = {
  initialSlide: 0,
  slidesPerView: 2.2,
  spaceBetween: 5,
  centeredSlides: false,
  navigation: true,
  autoplay: false,
  // style: {
  //     '--swiper-navigation-color': '#00aba9',
  //     '--swiper-pagination-color': '#00aba9',
  // },
  loop: false,
  pagination: true,
  paginationDynamic: true,
  paginationType: 'bullets',
  effect: 'slide',
  zoom: true
};
const slideOptsVertical: SlideOptions = {
  initialSlide: 0,
  speed: 400,
  slidesPerView: 3.2,
  spaceBetween: 5,
  centeredSlides: false,
  navigation: true,
  autoplay: false,
  pagination: true,
  paginationDynamic: false,
  paginationType: 'progressbar',
  direction: 'vertical',
  effect: 'slide',
  zoom: true
};
const items = [
  {
    id: 1,
    name: 'Cody Fisher',
    time: '12.30',
    new: 9,
    online: true,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar11.jpg',
    message: 'Hey there! I\'ve heard about PrimeVue. Any cool tips for getting started?'
  },
  {
    id: 2,
    name: 'PrimeTek Team',
    time: '12.30',
    new: 0,
    online: true,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar2.png',
    message: 'Let\'s implement PrimeVue. Elevating our UI game! 🚀'
  },
  {
    id: 3,
    name: 'Robert Fox',
    time: '12.30',
    new: 8,
    online: true,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar12.jpg',
    message: 'Interesting! PrimeVue sounds amazing. What\'s your favorite feature?\n'
  },
  {
    id: 4,
    name: 'Esther Howard',
    time: '12.30',
    new: 1,
    online: false,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar13.jpg',
    message: 'Quick one, team! Anyone'
  },
  {
    id: 5,
    name: 'Darlene Robertson',
    time: '12.30',
    new: 0,
    online: false,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar9.jpg',
    message: 'ust explored PrimeVue\'s themes'
  },
  {
    id: 6,
    name: 'Ralph Edwards',
    time: '12.30',
    new: 0,
    online: false,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar6.png',
    message: 'PrimeVue is a game-changer, righ'
  },
  {
    id: 7,
    name: 'Darrell Steward',
    time: '12.30',
    new: 0,
    online: true,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar7.png',
    message: 'Reflecting on PrimeVue\'s impact o'
  },
  {
    id: 8,
    name: 'PrimeTek Team',
    time: '12.30',
    new: 0,
    online: false,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar-primetek.png',
    message: 'Let\'s implement PrimeVue'
  },
  {
    id: 9,
    name: 'Cody Fisher',
    time: '12.30',
    new: 9,
    online: true,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar11.jpg',
    message: 'Hey there! I\'ve heard about PrimeVue. Any cool tips for getting started?'
  },
  {
    id: 10,
    name: 'PrimeTek Team',
    time: '12.30',
    new: 0,
    online: true,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar2.png',
    message: 'Let\'s implement PrimeVue. Elevating our UI game! 🚀'
  },
  {
    id: 11,
    name: 'Robert Fox',
    time: '12.30',
    new: 8,
    online: true,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar12.jpg',
    message: 'Interesting! PrimeVue sounds amazing. What\'s your favorite feature?\n'
  },
  {
    id: 12,
    name: 'Esther Howard',
    time: '12.30',
    new: 1,
    online: false,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar13.jpg',
    message: 'Quick one, team! Anyone'
  },
  {
    id: 13,
    name: 'Darlene Robertson',
    time: '12.30',
    new: 0,
    online: false,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar9.jpg',
    message: 'ust explored PrimeVue\'s themes'
  },
  {
    id: 14,
    name: 'Ralph Edwards',
    time: '12.30',
    new: 0,
    online: false,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar6.png',
    message: 'PrimeVue is a game-changer, righ'
  },
  {
    id: 15,
    name: 'Darrell Steward',
    time: '12.30',
    new: 0,
    online: true,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar7.png',
    message: 'Reflecting on PrimeVue\'s impact o'
  },
  {
    id: 16,
    name: 'PrimeTek Team',
    time: '12.30',
    new: 0,
    online: false,
    image: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar-primetek.png',
    message: 'Let\'s implement PrimeVue'
  }
];
</script>
<template>
  <BasePage page-title="Swipper" fullscreen show-back-link>
    <BaseCard title="Horizontal">
      <ion-card-content>
        <base-swiper-slides ref="testSwiperRef" :params="slideOpts">
          <swiper-slide v-for="(item, i) in items" :key="i">
            <BaseCard :flat="false">
              <BaseImage :src="item.image" />
              <ion-item>
                <IonLabel class="ion-text-nowrap">
                  {{ item.name }}
                  <p> {{ item.time }}</p>
                </IonLabel>
              </ion-item>
            </BaseCard>
          </swiper-slide>

          <template #start>
            Slot start
          </template>
          <template #end>
            <div v-if="testSwiperRef">
              <ion-row class="ion-justify-content-center">
                <BaseButton @click="testSwiperRef.onPrev()">
                  Prev
                </BaseButton>
                <BaseButton @click="testSwiperRef.onNext()">
                  Next
                </BaseButton>
              </ion-row>
            </div>
          </template>
        </base-swiper-slides>
      </ion-card-content>
    </BaseCard>
    <BaseCard title="Virtical">
      <ion-card-content>
        <base-swiper-slides :params="slideOptsVertical" style="height: 400px;">
          <swiper-slide v-for="(item, i) in items" :key="`virtical-${i}`">
            <BaseCard :flat="false" style="height: 105px;">
              <ion-item lines="none">
                <BaseImage slot="start" :src="item.image" style="height: 100px;width: 75px;" />
                <IonLabel class="ion-text-nowrap">
                  {{ item.name }}
                  <p> {{ item.time }}</p>
                </IonLabel>
              </ion-item>
            </BaseCard>
          </swiper-slide>
        </base-swiper-slides>
      </ion-card-content>
    </BaseCard>

    <BaseCard title="Card">
      <ion-card-content>
        <ion-row class="ion-justify-content-center">
          <base-swiper-slides :params="{
            slidesPerView: 1,
            spaceBetween: 5,
            navigation: true,
            pagination: true,
            paginationDynamic: true,
            paginationType: 'bullets',
            effect: 'cards',
            grabCursor: true,
            loop: false,
            speed: 800
          }" :initial-timeout="500" style="height: 350px; width: 250px;">
            <swiper-slide v-for="(item, i) in items" :key="`card-${i}`">
              <BaseCard :flat="false" style="height: 300px;">
                <BaseImage :src="item.image" />
                <ion-item lines="none" class="q-text-center">
                  <IonLabel class="ion-text-nowrap">
                    {{ item.name }}
                    <p> {{ item.time }}</p>
                  </IonLabel>
                </ion-item>
              </BaseCard>
            </swiper-slide>
          </base-swiper-slides>
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard title="Grid">
      <ion-card-content>
        <base-swiper-slides :params="{
          initialSlide: 0,
          slidesPerView: 2.3,
          spaceBetween: 0,
          pagination: true,
          navigation: true,
          gridRows: 2
        }" style="height: 350px;">
          <swiper-slide v-for="(item, i) in items" :key="`gird-row-${i}`">
            <base-card :flat="false" class="text-center q-my-sm" style="height: 120px;">
              <BaseImage :src="item.image" style="height: 70px;" />
              <ion-item lines="none" class="q-text-center">
                <IonLabel class="ion-text-nowrap">
                  {{ item.name }}
                </IonLabel>
              </ion-item>
            </base-card>
          </swiper-slide>
        </base-swiper-slides>
      </ion-card-content>
    </BaseCard>
</BasePage>
</template>
