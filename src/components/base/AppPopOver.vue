<template>
  <ion-popover
    :trigger="triggerClass"
    trigger-action="click"
    ref="baseAppPopup"
  >
    <ion-content>
      <ion-card>
        <ion-card-content>
          <slot>
            {{ title }}
          </slot>
        </ion-card-content>
        <ion-row>
          <ion-col v-if="showConfirm">
            <ion-button expand="block" :color="confirmColor" @click="onChange(true)">
              {{ labelConfirm ? labelConfirm : t('base.okay') }}
            </ion-button>
          </ion-col>
          <ion-col v-if="showCancel">
            <ion-button expand="block" :color="cancelColor" @click="onChange(false)">
              {{ labelCancel ? labelCancel : t('base.cancel') }}
            </ion-button>
          </ion-col>
        </ion-row>

      </ion-card>
    </ion-content>
  </ion-popover>
</template>
<script setup lang="ts">
/*
  <ion-button expand="block" color="primary" id="action-plan-action-view-popover">
          <span slot="start" class="q-mr-xs">
            <ss-icon icon="order" />
          </span>
          {{ t('closeOrReject') }}
        </ion-button>
        <app-pop-over trigger-class="action-plan-action-view-popover"
                      :label-confirm="t('actionPlanClose')"
                      :label-cancel="t('reject')"
                      :title="t('assigneeCloseConfirm',{name:item?.assigneeDto?.fullName})"
                      @onChange="onActionClose"
        >
        </app-pop-over>
 */
import { useLang } from '@/composables/UseLang';
import { IonButton, IonCard, IonContent, IonIcon, IonPopover, IonCardContent, IonRow, IonCol } from '@ionic/vue';
import { checkmarkOutline } from 'ionicons/icons';
import { ref } from 'vue';

const { t } = useLang();

interface Props {
  title?: string;
  width?: number;
  showConfirm?: boolean;
  confirmColor?: string;
  labelConfirm?: string;
  showCancel?: boolean;
  labelCancel?: string;
  cancelColor?: string;
  triggerClass: string;
}

withDefaults(defineProps<Props>(), {
  showConfirm: true,
  showCancel: true,
  confirmColor: 'primary',
  cancelColor: 'danger',
  width: 250
});
const emit = defineEmits<{
  onChange: [boolean];
}>();
const baseAppPopup = ref();
const onClosePopup = () => {
  if (baseAppPopup.value) {
    baseAppPopup.value.$el.dismiss();
  }
};
const onChange = (status: boolean) => {
  onClosePopup();
  emit('onChange', status);
};
</script>
