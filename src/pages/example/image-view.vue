<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseFileItems from '@/components/base/BaseFileItems.vue';
import BaseImageView from '@/components/base/BaseImageView.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseTextHeader from '@/components/base/BaseTextHeader.vue';
import { useTheme } from '@/composables/useTheme';
import { imageItemsData, pdfItemsData } from '@/libs/data';
import type { FileManager } from '@/types/models';
import { IonCardContent } from '@ionic/vue';
import { ref } from 'vue';

const { isDark } = useTheme();
const imageItems = ref<FileManager[]>(imageItemsData);
const pdfItems = ref<FileManager[]>(pdfItemsData);

const mixItems = ref<FileManager[]>(imageItems.value.concat(pdfItems.value));
</script>
<template>
  <BasePage page-title="Image/Pdf View" fullscreen show-back-link>
    <BaseCard title="Image">
      <BaseTextHeader title="Grid" subtitle="Tab image to view" />
      <BaseFileItems :items="imageItems" show-view-dialog :limit="6" />

      <BaseTextHeader title="List" subtitle="Tab image to view" />
      <BaseFileItems
        :items="imageItems"
        layout="list"
        show-view-dialog
        :limit="4"
      />

      <BaseTextHeader
        title="Image Slide"
        subtitle="Swip left right image to view"
      />
      <IonCardContent>
        <BaseImageView :files="imageItems" :dark="isDark" height="250px" />
      </IonCardContent>
    </BaseCard>
    <BaseCard title="Pdf">
      <IonCardContent>
        <BaseFileItems :items="pdfItems" layout="list" show-view-dialog />
      </IonCardContent>
    </BaseCard>
    <BaseCard title="Mix item View">
      <IonCardContent>
        <BaseFileItems :items="mixItems" layout="list" show-view-dialog />
      </IonCardContent>
    </BaseCard>
  </BasePage>
</template>
