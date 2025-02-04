<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BasePopover from '@/components/base/BasePopover.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { IonCardContent, IonRow } from '@ionic/vue';
import { serverOutline, settingsOutline } from 'ionicons/icons';
import { defineAsyncComponent, ref, useTemplateRef } from 'vue';

const BaseDialog = defineAsyncComponent(
  () => import('@/components/base/BaseDialog.vue'),
);
const { t } = useLang();
const { appConfirm } = useBase();
const dialog = ref<boolean>(false);
const dialog2 = ref<boolean>(false);
const dialogConfirmToClose = ref<boolean>(false);

const showModal = ref<boolean>(false);
const modalConfirmToClose = ref<boolean>(false);

const baseLayoutRef = useTemplateRef<any>('baseLayoutRef');
const baseModalTestRef = useTemplateRef<any>('baseModalTestRef');

const popover = ref<boolean>(false);
const popoverEvent = ref<Event>();

const rolemText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.'
const onConfirmToClose = async () => {
  const conf = await appConfirm(
    t('app.monogram'),
    'Are you sure to close this dialog?',
  );
  if (conf) {
    dialogConfirmToClose.value = false;
  }
};
const onConfirmToCloseModal = async () => {
  const conf = await appConfirm(
    t('app.monogram'),
    'Are you sure to close this dialog?',
  );
  if (conf) {
    modalConfirmToClose.value = false;
    baseModalTestRef.value.dismiss();
  }
};

const onOpenPopover = (event: Event) => {
  popover.value = true;
  popoverEvent.value = event;
};
</script>
<template>
  <base-layout
    ref="baseLayoutRef"
    page-title="Dialog"
    fullscreen
    show-back-link
  >
    <BaseCard flat title="Dialog">
      <ion-card-content>
        <ion-row class="q-gutter-md">
          <BaseButton label="Dialog 1" @click="dialog = true" />
          <BaseButton label="Dialog 2" @click="dialog2 = true" />
          <BaseButton
            label="Confirm to close"
            @click="dialogConfirmToClose = true"
          />
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="Modal">
      <ion-card-content>
        <ion-row class="q-gutter-md">
          <BaseButton label="Simple dialog" @click="showModal = true" />
          <BaseButton
            label="Confirm to close"
            @click="modalConfirmToClose = true"
          />
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="Popover">
      <ion-card-content>
        <ion-row class="q-gutter-md">
          <BaseButton label="Popover" @click="onOpenPopover" />
        </ion-row>
      </ion-card-content>
    </BaseCard>

    <base-dialog
      v-if="dialog"
      v-model="dialog"
      title="Dialog title"
      :icon="settingsOutline"
    >
     {{ rolemText }}
    </base-dialog>
    <base-dialog
      v-if="dialog2"
      v-model="dialog2"
      title="Dialog title"
      :icon="settingsOutline"
      :presenting-element="baseLayoutRef?.$el"
    >
    {{ rolemText }}
    </base-dialog>
    <base-dialog
      v-if="dialogConfirmToClose"
      v-model="dialogConfirmToClose"
      title="Confirm to close title"
      :icon="serverOutline"
      :auto-close="false"
      @on-close="onConfirmToClose"
    >
    {{ rolemText }}
    </base-dialog>

    <BaseModal v-if="showModal" v-model="showModal" title="Modal">
        {{ rolemText }}
    </BaseModal>
    <BaseModal
      ref="baseModalTestRef"
      v-if="modalConfirmToClose"
      v-model="modalConfirmToClose"
      :auto-close="false"
      title="Confirm to close"
      :initial-breakpoint="1"
      :breakpoints="[1]"
      :presenting-element="baseLayoutRef?.$el"
      @on-close="onConfirmToCloseModal"
    >
    {{ rolemText }}
    </BaseModal>

    <BasePopover v-model="popover" :event="popoverEvent" width="80%" @on-close="popover = false">
        {{ rolemText }}
    </BasePopover>
  </base-layout>
</template>
