<script setup lang="ts">
/*
<BaseRefresher @on-refresh="handleRefresh" />
const handleRefresh = async (event: any) => {
    if (!event) {
        return;
    }
    await onReload();
    event.target.complete();
};
*/
import { useLang } from '@/composables/useLang';
import {
    IonRefresher,
    IonRefresherContent
} from '@ionic/vue';
defineProps<{
    pullingText?: string
    refreshingText?: string
}>();
const { t } = useLang();
const emit = defineEmits<{
    'on-refresh': [event: any]
}>();
const handleRefresh = (event: any) => {
    emit('on-refresh', event);
}
</script>
<template>
    <IonRefresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ion-refresh="handleRefresh($event)">
        <IonRefresherContent :pulling-text="pullingText || t('base.pullToRefresh')" refreshing-spinner="circles"
            :refreshing-text="`${refreshingText || t('base.pleaseWait')}...`" />
    </IonRefresher>
</template>