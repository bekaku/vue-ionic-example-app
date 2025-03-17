<script setup lang="ts">
import BaseActionSheet from '@/components/base/BaseActionSheet.vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseLongPressItem from '@/components/base/BaseLongPressItem.vue';
import { useBase } from '@/composables/useBase';
import type { AppActionSheet } from '@/types/common';
import {
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonRow
} from '@ionic/vue';
import { eyeOutline, personOutline, pinOutline, starOutline, trashOutline, volumeMuteOutline } from 'ionicons/icons';
import { ref } from 'vue';
const { appToast } = useBase();
const showActionSheet = ref<boolean>(false);
const items = ref<string[]>([
  'https://cdn.quasar.dev/img/avatar1.jpg',
  'https://cdn.quasar.dev/img/avatar2.jpg',
  'https://cdn.quasar.dev/img/avatar3.jpg',
  'https://cdn.quasar.dev/img/avatar4.jpg',
  'https://cdn.quasar.dev/img/avatar5.jpg',
  'https://cdn.quasar.dev/img/avatar6.jpg',
])
const actionSheetButtons: AppActionSheet[] = [
  {
    text: 'Mute',
    icon: volumeMuteOutline,
    data: {
      action: 'mute'
    }
  },
  {
    text: 'Pin',
    icon: pinOutline,
    role: 'selected',
    data: {
      action: 'pin'
    }
  },
  {
    text: 'Favorite',
    icon: starOutline,
    data: {
      action: 'favorite'
    }
  },
  {
    text: 'Mark as read',
    icon: eyeOutline,
    data: {
      action: 'read'
    }
  },
  {
    text: 'Delete',
    icon: trashOutline,
    role: 'destructive',
    data: {
      action: 'delete'
    }
  },
  {
    text: 'Cancel',
    role: 'cancel'
  }
];
const onLongPress = () => {
  console.log('onLongPress');
  appToast({
    text: 'On long press',
    icon: personOutline,
    toastPosition: 'top'
  })
}
const onItemLongPress = (index: number) => {
  console.log('onItemLongPress', index);
  showActionSheet.value = true;
  // appToast({
  //   text: 'On item long press : ' + index,
  //   icon: personOutline,
  //   color: 'warning',
  //   toastPosition: 'top'
  // })
}

const actionSheetSelected = async (ev: any) => {
  console.log('actionSheetSelected', ev);
};
</script>
<template>
  <BasePage page-title="Long press" fullscreen show-back-link>
    <BaseCard flat title="Long press">
      <ion-card-content class="q-gutter-md">
        <ion-row class="q-gutter-md">
          <BaseLongPressItem style="width: 100%;" @on-long-press="onLongPress">
            <BaseButton label="Press me!" full avatar="https://cdn.quasar.dev/img/avatar2.jpg" />
          </BaseLongPressItem>
        </ion-row>
        <IonList>
          <BaseLongPressItem v-for="(item, index) in items" :key="`${index}-${item}`"
            @on-long-press="onItemLongPress(index)">
            <IonItem detail button>
              <BaseAvatar slot="start" :src="item" />
              <IonLabel>
                {{ `User ${index}` }}
              </IonLabel>
            </IonItem>
          </BaseLongPressItem>
        </IonList>
      </ion-card-content>
    </BaseCard>

    <BaseActionSheet v-model="showActionSheet" mode="md" header="Menu" sub-header="Sub header"
      :buttons="actionSheetButtons" @update="actionSheetSelected" />
  </BasePage>
</template>
