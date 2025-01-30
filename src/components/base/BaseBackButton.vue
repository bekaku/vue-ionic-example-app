<template>
  <ion-back-button :text="text ? text : ''" :icon="icon ? icon : arrowBack" :class="color" class="q-ml-xs q-px-sm"
    :default-href="defaultHref"></ion-back-button>
  <!--  <ion-back-button-->
  <!--    :text="text ? text : t('base.back')"-->
  <!--    :icon="icon ? icon : chevronBack"-->
  <!--    :default-href="defaultHref"-->
  <!--  ></ion-back-button>-->
</template>
<script setup lang="ts">
import { IonBackButton } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';

const { color = 'text-black', defaultHref = '/tabs/home' } = defineProps<{
  text?: string
  color?: string
  icon?: string
  defaultHref?: string
}>()
</script>
