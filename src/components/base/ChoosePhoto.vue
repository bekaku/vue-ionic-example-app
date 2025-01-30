<template>
  <base-modal
    v-if="show"
    v-model="show"
    :title="t('base.chooseFromFile')"
    :initial-breakpoint="0.25"
    :breakpoints="[0, 0.25]"
    @on-close="show = false"
  >
    <ion-list lines="none">
      <ion-item button :detail="false" @click="pickPhoto">
        <ion-icon :icon="imageOutline" slot="start"></ion-icon>
        <ion-label>
          <h2>{{ t('base.chooseFromGallery') }}</h2>
        </ion-label>
      </ion-item>
      <ion-item button :detail="false" @click="takePicture">
        <ion-icon :icon="cameraOutline" slot="start"></ion-icon>
        <ion-label>
          <h2>{{ t('base.chooseFromCamera') }}</h2>
        </ion-label>
      </ion-item>
    </ion-list>
  </base-modal>
</template>
<script setup lang="ts">
import { cameraOutline, imageOutline } from 'ionicons/icons';
import { computed, defineAsyncComponent, onMounted } from 'vue';
import { useLang } from '@/composables/UseLang';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import { useFileSystem } from '@/composables/UseFileSystem';

const props = defineProps({
  modelValue: {
    type: Boolean,
    require: true
  },
  forWeb: {
    type: Boolean,
    require: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 6
  }
});
const emit = defineEmits([
  'update:modelValue',
  'on-take-picture',
  'on-pick-picture'
]);
const BaseModal = defineAsyncComponent(
  () => import('@/components/base/Modal.vue')
);
const { requestCameraPermissions, onTakePicture, onPickPhoto } = useFileSystem();
onMounted(() => {
  requestCameraPermissions();
});

const { t } = useLang();
const show = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
});

const takePicture = async () => {
  const file = await onTakePicture();
  if (file) {
    emit('on-take-picture', file);
  }
};
const pickPhoto = async () => {
  if (props.multiple) {
    const files = await onPickPhoto(true);
    if (files) {
      emit('on-pick-picture', files);
    }
  } else {
    const file = await onPickPhoto(false);
    if (file) {
      emit('on-take-picture', file);
    }
  }
};
</script>
