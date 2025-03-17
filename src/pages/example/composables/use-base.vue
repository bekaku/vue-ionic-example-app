<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import {
    IonButtons,
    IonCardContent,
    IonRow
} from '@ionic/vue';
import { alertCircleOutline, checkmarkCircle, closeOutline, colorPaletteOutline, copyOutline, hourglassOutline, notificationsOutline, returnUpForwardOutline, trashBinOutline } from 'ionicons/icons';
import { ref } from 'vue';
const { appLoading, appToast, appConfirm, writeToClipboard, appNavigateTo } = useBase();
const { t } = useLang();
const textModel = ref<string>('Text to copy');
const confirm = async () => {
    const conf = await appConfirm(t('app.monogram'), t('base.deleteConfirm'));
    if (conf) {
        appToast({
            headerText: 'Confirm',
            text: 'User confirm!',
            icon: checkmarkCircle,
            color: 'success',
            time: 3000
        });
    } else {
        appToast({
            headerText: 'Cancel',
            text: 'User cancel!',
            icon: alertCircleOutline,
            color: 'danger',
            time: 3000
        });
    }
};
const confirm2 = async () => {
    const conf = await appConfirm(
        'You want to leave now!!',
        'Custome confirm btn text', {
        okayText: 'I\'m sure',
        cancelText: 'Nope!',
    }
    );
    console.log('confirm2', conf);
};
const toaster = () => {
    appToast({
        headerText: 'Title',
        text: 'Test defult app toast message!',
        icon: colorPaletteOutline,
        closeIcon: closeOutline,
    });
};
const loader = async () => {
    const loading: any = await appLoading();
    loading.present();
    setTimeout(() => {
        loading.dismiss();
    }, 3000);
};
const onCopyText = async () => {
    await writeToClipboard(textModel.value);
};
</script>
<template>
    <BasePage page-title="useBase" fullscreen show-back-link>
        <BaseCard title="useBase" subtitle="Composables">
            <ion-card-content>
                <ion-row class="q-gutter-md">
                    <BaseButton :icon="notificationsOutline" label="show toast" color="warning" @click="toaster" />
                    <BaseButton :icon="trashBinOutline" label="show confirm" color="danger" @click="confirm" />
                    <BaseButton label="show confirm Custom Btn" @click="confirm2" />
                    <BaseButton :icon="hourglassOutline" label="show loading" color="primary" outline unelevated
                        @click="loader" />
                    <BaseButton :icon="returnUpForwardOutline" label="Navigate to" outline
                        @click="appNavigateTo('/example/image-view')" />
                </ion-row>
                <BaseInput v-model="textModel" label="Copy text">
                    <template #end>
                        <IonButtons>
                            <BaseButton clear icon-only :icon="copyOutline" @click="onCopyText" />
                        </IonButtons>
                    </template>
                </BaseInput>
            </ion-card-content>
        </BaseCard>
    </BasePage>
</template>
