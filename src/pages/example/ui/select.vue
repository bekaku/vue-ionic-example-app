<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseSelectDialog from '@/components/base/BaseSelectDialog.vue';
import BaseSelectItem from '@/components/base/BaseSelectItem.vue';
import BaseTextHeader from '@/components/base/BaseTextHeader.vue';
import type { LabelValue } from '@/types/common';
import {
    IonCardContent
} from '@ionic/vue';
import { chevronExpandOutline, logoApple, logoFacebook, logoGithub, logoGoogle, logoTwitter } from 'ionicons/icons';
import { ref } from 'vue';
const singleModel = ref<number | null>();
const multipleModel = ref<number[]>([]);
const itemSingle = ref<number | null>(null);
const itemSingle2 = ref<number | null>(null);
const itemMultiple = ref<number[]>([]);
const itemMultiple2 = ref<number[]>([]);

const dialog1 = ref<boolean>(false);

const simpleItems: LabelValue<number>[] = [
    {
        label: 'Google',
        value: 1,
        description: 'Fox',
        icon: logoGoogle
    },
    {
        label: 'Facebook',
        value: 2,
        icon: logoFacebook
    },
    {
        label: 'Twitter',
        value: 3,
        icon: logoTwitter
    },
    {
        label: 'Apple',
        value: 4,
        icon: logoApple
    },
    {
        label: 'Github',
        value: 5,
        icon: logoGithub
    },
];
const simpleItems2: LabelValue<number>[] = [
    {
        label: 'Cody Fisher',
        value: 6,
        description: 'Fisher',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar11.jpg'
    },
    {
        label: 'Robert Fox',
        value: 7,
        description: 'Fox',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar12.jpg',
    },
    {
        label: 'Esther Howard',
        value: 8,
        description: 'Howard',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar13.jpg',
    },
    {
        label: 'Darlene Robertson',
        value: 9,
        description: 'Robertson',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar9.jpg',
    },
    {
        label: 'Ralph Edwards',
        value: 10,
        description: 'Edwards',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar6.png'
    },
];
const onSingleChange = (item: number | number[] | undefined | null) => {
    console.log('onSingleChange', item);
}
const onMultipleChange = (items: number | number[] | undefined | null) => {
    console.log('onMultipleChange', items);
}
</script>
<template>
    <BasePage page-title="Select" fullscreen show-back-link>
        <BaseCard title="Dialog/Item">
            <IonCardContent class="q-gutter-md">
                <BaseButton label="Open select dialog" full :icon="chevronExpandOutline" @click="dialog1 = true" />
                <BaseSelectItem v-model="itemSingle" :items="simpleItems2" :multiple="false" required
                    label="Select single user" />
                <BaseSelectItem v-model="itemSingle2" :items="simpleItems" :multiple="false" :can-filter="false"
                    label="Select single 2" />
                <BaseSelectItem v-model="itemMultiple" :items="simpleItems2" multiple label="Select multiple user" />
                <BaseSelectItem v-model="itemMultiple2" :items="simpleItems" multiple label="Select multiple 2" />
            </IonCardContent>
        </BaseCard>

        <BaseTextHeader label="Inline Single select" />
        <BaseSelect v-model="singleModel" :items="simpleItems" :multiple="false" check-color="danger"
            @on-change="onSingleChange">
            <template #top>
                <div class="q-pa-md">
                    Selected : {{ singleModel }}
                </div>
            </template>
        </BaseSelect>

        <BaseTextHeader label="Inline Multiple select" />
        <BaseSelect v-model="multipleModel" :items="simpleItems2" multiple :avatar-size="32"
            @on-change="onMultipleChange">
            <template #top>
                <div class="q-pa-md">
                    Selected : {{ multipleModel }}
                </div>
            </template>
        </BaseSelect>

        <BaseSelectDialog v-model="singleModel" v-model:show="dialog1" :items="simpleItems2" :multiple="false"
            title="Select users" />
    </BasePage>
</template>
