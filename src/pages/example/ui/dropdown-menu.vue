<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseDropdownMenu from '@/components/base/BaseDropdownMenu.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import type { LabelValue } from '@/types/common';
import {
    IonCardContent,
    IonRow
} from '@ionic/vue';
import { biCopy, biTrash } from '@quasar/extras/bootstrap-icons';
import { pencilOutline, settingsOutline } from 'ionicons/icons';
import { ref } from 'vue';
const menus = ref<LabelValue<number>[]>([
    {
        label: 'Edit',
        description: 'edit this item',
        icon: pencilOutline,
        iconSet: 'ion',
        value: 1
    },
    {
        label: 'Delete',
        icon: biTrash,
        iconSet: 'bootstrap-icons',
        color: 'danger',
        value: 2
    },
    {
        label: 'Copy',
        description: 'Copy this item',
        iconSet: 'bootstrap-icons',
        icon: biCopy,
        value: 3
    }
]);
const menus2: LabelValue<number>[] = [
    {
        label: 'Cody Fisher',
        value: 1,
        description: 'Fisher',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar11.jpg'
    },
    {
        label: 'Robert Fox',
        value: 2,
        description: 'Fox',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar12.jpg',
    },
    {
        label: 'Esther Howard',
        value: 3,
        description: 'Howard',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar13.jpg',
    },
    {
        label: 'Darlene Robertson',
        value: 4,
        description: 'Robertson',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar9.jpg',
    },
    {
        label: 'Ralph Edwards',
        value: 5,
        description: 'Edwards',
        avatar: 'https://www.primefaces.org/cdn/primevue/images/landing/apps/avatar6.png'
    },
];
</script>
<template>
    <base-layout page-title="Dropdown" fullscreen show-back-link>
        <template #actions-end>
            <BaseDropdownMenu :items="menus" />
        </template>
        <BaseCard flat title="Dropdown menu">
            <ion-card-content>
                <ion-row class="q-gutter-md">
                    <BaseDropdownMenu :items="menus" :icon="settingsOutline" />
                    <BaseDropdownMenu :items="menus" label="Text only" text-only />
                    <BaseDropdownMenu :items="menus2" label="Open menu" :outline="false" :clear="false" />
                    <BaseDropdownMenu avatar="https://cdn.quasar.dev/img/avatar3.jpg" :items="menus" label="Setting"
                        outline :clear="false" />
                </ion-row>
            </ion-card-content>
        </BaseCard>
    </base-layout>
</template>
