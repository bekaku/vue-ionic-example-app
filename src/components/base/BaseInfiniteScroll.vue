<script setup lang="ts">
/*
<BaseInfiniteScroll v-if="!isInfiniteDisabled" :disabled="isInfiniteDisabled" @on-infinite="onInfinite" />
const onInfinite = async (event: any) => {
    if (!event) {
        return;
    }
    await onNextPage();
    event.target.complete();
};
*/
import { useLang } from '@/composables/useLang';
import {
    IonInfiniteScroll,
    IonInfiniteScrollContent
} from '@ionic/vue';
const { position = 'bottom', disabled = false, threshold = '15%' } = defineProps<{
    disabled?: boolean
    loadingText?: string
    position?: 'bottom' | 'top'
    threshold?: string
}>();
const { t } = useLang();
const emit = defineEmits<{
    'on-infinite': [event: any]
}>();
const ionInfinite = (event: any) => {
    emit('on-infinite', event);
}
</script>
<template>
    <IonInfiniteScroll :disabled :position :threshold @ion-infinite="ionInfinite">
        <IonInfiniteScrollContent :loading-text="`${loadingText || t('base.pleaseWait')}...`" />
    </IonInfiniteScroll>
</template>