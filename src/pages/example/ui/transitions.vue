<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseTransitionWrapper from '@/components/base/BaseTransitionWrapper.vue';
import { IonCardContent } from '@ionic/vue';
import { ref } from 'vue';
const fade = ref(false);
const slideLeft = ref(false);
const slideRight = ref(false);
const slideUp = ref(false);
const slideDown = ref(false);
const zoom = ref(false);
const bounce = ref(false);

const text
  = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
</script>
<template>
  <BasePage page-title="Transition">
    <BaseCard title="Fade">
      <ion-card-content>
        <BaseButton :label="fade ? 'Hide me' : ' Show me'" @click="fade = !fade" />
        <BaseTransitionWrapper name="fade">
           <div v-if="fade" class="div text-h5 q-pa-md">{{ text }}</div>
        </BaseTransitionWrapper>
      </ion-card-content>
    </BaseCard>
    <BaseCard title="Slide Left">
      <ion-card-content>
        <BaseButton :label="slideLeft ? 'Hide me' : ' Show me'" @click="slideLeft = !slideLeft" />
        <BaseTransitionWrapper name="slide-left">
           <div v-if="slideLeft" class="div text-h5 q-pa-md">{{ text }}</div>
        </BaseTransitionWrapper>
      </ion-card-content>
    </BaseCard>
    <BaseCard title="Slide Right">
      <ion-card-content>
        <BaseButton :label="fade ? 'Hide me' : ' Show me'" @click="slideRight = !slideRight" />
        <BaseTransitionWrapper name="slide-right">
           <div v-if="slideRight" class="div text-h5 q-pa-md">{{ text }}</div>
        </BaseTransitionWrapper>
      </ion-card-content>
    </BaseCard>
    <BaseCard title="Slide Up">
      <ion-card-content>
        <BaseButton :label="slideUp ? 'Hide me' : ' Show me'" @click="slideUp = !slideUp" />
        <BaseTransitionWrapper name="slide-up">
           <div v-if="slideUp" class="div text-h5 q-pa-md">{{ text }}</div>
        </BaseTransitionWrapper>
      </ion-card-content>
    </BaseCard>
    <BaseCard title="Slide down">
      <ion-card-content>
        <BaseButton :label="slideDown ? 'Hide me' : ' Show me'" @click="slideDown = !slideDown" />
        <BaseTransitionWrapper name="slide-down">
           <div v-if="slideDown" class="div text-h5 q-pa-md">{{ text }}</div>
        </BaseTransitionWrapper>
      </ion-card-content>
    </BaseCard>
    <BaseCard title="Zoom">
      <ion-card-content>
        <BaseButton :label="zoom ? 'Hide me' : ' Show me'" @click="zoom = !zoom" />
        <BaseTransitionWrapper name="zoom">
           <div v-if="zoom" class="div text-h5 q-pa-md">{{ text }}</div>
        </BaseTransitionWrapper>
      </ion-card-content>
    </BaseCard>
    <BaseCard title="Bounce">
      <ion-card-content>
        <BaseButton :label="bounce ? 'Hide me' : ' Show me'" @click="bounce = !bounce" />
        <BaseTransitionWrapper name="bounce">
           <div v-if="bounce" class="div text-h5 q-pa-md">{{ text }}</div>
        </BaseTransitionWrapper>
      </ion-card-content>
    </BaseCard>
  </BasePage>
</template>
