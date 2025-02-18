<script setup lang="ts">
import BaseAlert from '@/components/base/BaseAlert.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseResult from '@/components/base/BaseResult.vue';
import { useLang } from '@/composables/useLang';
import {
    IonCardContent
} from '@ionic/vue';
import { biImage } from '@quasar/extras/bootstrap-icons';
import { batteryHalfOutline, checkmarkOutline, eyeOffOutline, lockClosedOutline, shieldOutline } from 'ionicons/icons';
const { t } = useLang();
</script>
<template>
    <BaseLayout page-title="Result" fullscreen show-back-link>
        <BaseCard title="Alert">
            <ion-card-content class="q-gutter-y-lg">
                <BaseAlert type="is-primary" :icon="batteryHalfOutline" message="This is primary!!" />
                <BaseAlert type="is-warning" :icon="eyeOffOutline" message="This is warning!!" :radius="false" :closeable="false" />
                <BaseAlert type="is-danger" :icon="biImage" icon-set="bootstrap-icons" message="This is danger!!" />
                <BaseAlert type="is-info" :icon="lockClosedOutline" message="This is info!!" />
                <BaseAlert type="is-light" :icon="batteryHalfOutline" message="This is light!!" />
                <BaseAlert type="is-link" :icon="shieldOutline" message="This is link!!" />
                <BaseAlert type="is-success" :icon="checkmarkOutline" message="This is success!!" />
            </ion-card-content>
            <ion-card-content class="q-gutter-y-lg">
                <BaseAlert type="is-primary" :icon="batteryHalfOutline" message="This is primary!!" secondary />
                <BaseAlert type="is-warning" :icon="eyeOffOutline" message="This is warning!!" :radius="false" :closeable="false" secondary />
                <BaseAlert type="is-danger" :icon="biImage" icon-set="bootstrap-icons" message="This is danger!!" secondary />
                <BaseAlert type="is-info" :icon="lockClosedOutline" message="This is info!!" secondary />
                <BaseAlert type="is-light" :icon="batteryHalfOutline" message="This is light!!" secondary />
                <BaseAlert type="is-link" :icon="shieldOutline" message="This is link!!" secondary />
                <BaseAlert type="is-success" :icon="checkmarkOutline" message="This is success!!" secondary />
            </ion-card-content>
        </BaseCard>
        <BaseCard title="Result">
            <ion-card-content class="q-gutter-y-lg">
                <BaseResult :description="t('error.dataNotfound')" status="empty" />
                <base-result title="404" description="Not found" status="404" />
                <base-result description="Error" status="error" />
                <base-result title="Custom icon" description="Info" :icon="batteryHalfOutline" icon-set="ion"
                    status="info" />
                <base-result description="Success" status="success" />
                <base-result description="Warning" status="warning" />
            </ion-card-content>
        </BaseCard>
    </BaseLayout>
</template>
