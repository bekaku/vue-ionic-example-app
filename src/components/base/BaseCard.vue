<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/vue';
const { flat = true, bordered = false, textCapitalize=false } = defineProps<{
    bordered?: boolean
    flat?: boolean
    title?: string
    subtitle?: string
    textCapitalize?: boolean
}>();
</script>
<template>
    <IonCard v-bind="$attrs" :class="{ 'no-shadow': flat, 'app-border': bordered }" class="q-ma-md">
        <!-- <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" /> -->
        <slot name="header">
            <ion-card-header v-if="title || subtitle">
                <ion-card-title v-if="title">{{ title }}</ion-card-title>
                <ion-card-subtitle :class="{ 'ion-text-capitalize': textCapitalize }" v-if="subtitle">{{ subtitle }}</ion-card-subtitle>
            </ion-card-header>
        </slot>
        <slot />
    </IonCard>
</template>
