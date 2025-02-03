<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import {
    IonCardContent,
    IonRow
} from '@ionic/vue';
import { serverOutline, settingsOutline } from 'ionicons/icons';
import { defineAsyncComponent, ref } from 'vue';

const BaseDialog = defineAsyncComponent(() => import('@/components/base/BaseDialog.vue'));
const { t } = useLang();
const { appConfirm } = useBase();
const dialog = ref<boolean>(false);
const dialogConfirmToClose = ref<boolean>(false);

const showModal = ref<boolean>(false);
const modalConfirmToClose = ref<boolean>(false);

const onConfirmToClose = async () => {
    const conf = await appConfirm(t('app.monogram'), 'Are you sure to close this dialog?');
    if (conf) {
        dialogConfirmToClose.value = false;
    }
}
const onConfirmToCloseModal = async () => {
    const conf = await appConfirm(t('app.monogram'), 'Are you sure to close this dialog?');
    if (conf) {
        modalConfirmToClose.value = false;
    }
}
</script>
<template>
    <base-layout page-title="Dialog" fullscreen show-back-link>
        <BaseCard flat title="Dialog">
            <ion-card-content>
                <ion-row class="q-gutter-md">
                    <BaseButton label="Simple dialog" @click="dialog = true" />
                    <BaseButton label="Confirm to close" @click="dialogConfirmToClose = true" />
                </ion-row>
            </ion-card-content>
        </BaseCard>
        <BaseCard flat title="Modal">
            <ion-card-content>
                <ion-row class="q-gutter-md">
                    <BaseButton label="Simple dialog" @click="showModal = true" />
                    <BaseButton label="Confirm to close" @click="modalConfirmToClose = true" />
                </ion-row>
            </ion-card-content>
        </BaseCard>

        <base-dialog v-if="dialog" v-model="dialog" title="Dialog title" :icon="settingsOutline">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas
            eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus
            minima, porro labore.
        </base-dialog>
        <base-dialog v-if="dialogConfirmToClose" v-model="dialogConfirmToClose" title="Confirm to close title"
            :icon="serverOutline" :auto-close="false" @on-close="onConfirmToClose">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas
            eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus
            minima, porro labore.
        </base-dialog>

        <BaseModal v-if="showModal" v-model="showModal" title="Modal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas
            eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus
            minima, porro labore.
        </BaseModal>
        <BaseModal v-if="modalConfirmToClose" v-model="modalConfirmToClose" :auto-close="false"
            title="Confirm to close" :initial-breakpoint="1" :breakpoints="[1]" @on-close="onConfirmToCloseModal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas
            eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus
            minima, porro labore.
        </BaseModal>
    </base-layout>
</template>
