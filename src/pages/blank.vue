<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import BaseDropdownMenu from '@/components/base/BaseDropdownMenu.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseSearchBar from '@/components/base/BaseSearchBar.vue'
import BaseSegment from '@/components/base/BaseSegment.vue'
import { useLang } from '@/composables/useLang'
import type { LabelValue } from '@/types/common'
import { IonButtons, IonCardContent, IonToolbar } from '@ionic/vue'
import { biCopy, biPencil, biTrash } from '@quasar/extras/bootstrap-icons'
import { ref } from 'vue'
const { t } = useLang()
const tabModel = ref<string>('yourGroup')
const segmentItems = ref<LabelValue<string>[]>([
  {
    value: 'yourGroup',
    label: t('meetingRoom.yourGroup'),
  },
  {
    value: 'permanentCloseGroup',
    label: t('meetingRoom.permanentCloseGroup'),
  },
])

const menus = ref<LabelValue<number>[]>([
  {
    label: 'Edit',
    description: 'edit this item',
    icon: { name: biPencil, iconSet: 'bootstrap-icons' },
    fetch: false,
    value: 1,
  },
  {
    label: 'Delete',
    icon: { name: biTrash, iconSet: 'bootstrap-icons' },
    color: 'danger',
    fetch: false,
    value: 2,
  },
  {
    label: 'Copy',
    description: 'Copy this item',
    icon: { name: biCopy, iconSet: 'bootstrap-icons' },
    fetch: false,
    value: 3,
  },
])
const onSearchChange = (val: string | undefined | null) => {
  console.log('onSearchChange', val)
}
</script>
<template>
  <BasePage :page-title="t('meetingRoom.title')" fullscreen show-back-link>
    <template #headerBottom>
      <IonToolbar>
        <BaseSearchBar
          placeholder="Search bar..."
          @on-change="onSearchChange"
        />
      </IonToolbar>
    </template>
    <template #actions-end>
      <ion-buttons>
        <BaseDropdownMenu :items="menus" />
      </ion-buttons>
    </template>
    <base-segment
      v-model="tabModel"
      class="q-ma-md"
      :items="segmentItems"
      layout="icon-end"
    />
    <BaseCard title="Blank Page" subtitle="Just test page">
      <ion-card-content> Blank page </ion-card-content>
    </BaseCard>
  </BasePage>
</template>
