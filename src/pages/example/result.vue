<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseResult from '@/components/base/BaseResult.vue';
import { useLang } from '@/composables/useLang';
import {
    IonCardContent
} from '@ionic/vue';
import { biImage } from '@quasar/extras/bootstrap-icons';
import { batteryHalfOutline } from 'ionicons/icons';
const { t } = useLang();
</script>
<template>
    <BaseLayout page-title="Result" fullscreen show-back-link>
        <BaseCard title="Result">
            <ion-card-content class="q-gutter-y-lg">
                <BaseResult :description="t('error.dataNotfound')" status="empty" />
                <base-result title="404" description="Not found" status="404" />
                <base-result description="Error" status="error" />
                <base-result title="Custom icon" description="Info" :icon="batteryHalfOutline" icon-set="ion" status="info" />
                <base-result description="Success" status="success" />
                <base-result description="Warning" status="warning" />
            </ion-card-content>
        </BaseCard>
    </BaseLayout>
</template>
