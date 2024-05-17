<template>
  <ion-row class="wee-messenger-lower-content">
    <ion-col class="ion-no-padding ion-no-margin">
      <ion-row>
        <ion-col :size="isTextFocus ? '2' : '5'">
          <ion-grid>
            <ion-row
              class="ion-justify-content-center"
              style="padding-top: 5px"
            >
              <template v-if="!isTextFocus">
                <ion-col size="3">
                  <div>
                    <ion-button fill="clear" size="small">
                      <ion-icon slot="icon-only" :icon="addOutline"></ion-icon>
                    </ion-button>
                  </div>
                </ion-col>
                <ion-col size="3">
                  <div>
                    <ion-button fill="clear" size="small">
                      <ion-icon
                        slot="icon-only"
                        :icon="happyOutline"
                      ></ion-icon>
                    </ion-button>
                  </div>
                </ion-col>
                <ion-col size="3">
                  <div>
                    <ion-button fill="clear" size="small">
                      <ion-icon
                        slot="icon-only"
                        :icon="cameraOutline"
                      ></ion-icon>
                    </ion-button>
                  </div>
                </ion-col>
                <ion-col size="3">
                  <div>
                    <ion-button fill="clear" size="small">
                      <ion-icon
                        slot="icon-only"
                        :icon="imageOutline"
                      ></ion-icon>
                    </ion-button>
                  </div>
                </ion-col>
              </template>
              <template v-else>
                <ion-col>
                  <div>
                    <ion-button
                      fill="clear"
                      size="small"
                      @click="isTextFocus = false"
                    >
                      <ion-icon
                        slot="icon-only"
                        :icon="chevronForwardOutline"
                      ></ion-icon>
                    </ion-button>
                  </div>
                </ion-col>
              </template>
            </ion-row>
          </ion-grid>
        </ion-col>
        <ion-col :size="isTextFocus ? '10' : '7'">
          <ion-row>
            <ion-col :size="isTextFocus ? '10' : '12'">
              <ion-textarea
                @click="isTextFocus = true"
                :rows="1"
                class="wee-messenger-inputarea"
                v-model="text"
                placeholder="Write a reply..."
                label="Write a reply..."
              ></ion-textarea>
            </ion-col>
            <ion-col v-if="isTextFocus" size="2" style="padding-top: 15px">
              <ion-button fill="clear" size="small" @click="onSend">
                <ion-icon slot="icon-only" :icon="send"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-col>
  </ion-row>
</template>
<script setup lang="ts">
import {
  chevronForwardOutline,
  happyOutline,
  imageOutline,
  addOutline,
  send,
  cameraOutline,
} from 'ionicons/icons';
import { IonRow, IonCol, IonButton, IonTextarea, IonIcon } from '@ionic/vue';
import { onMounted, ref } from 'vue';
defineProps({
  name: {
    type: String,
    default: '',
  },
});
const divRef = ref(null);
const emit = defineEmits(['onSend']);
const isTextFocus = ref(false);
const text = ref('');
onMounted(() => {
  // the DOM element will be assigned to the ref after initial render
});

const onSend = () => {
  emit('onSend', text.value);
  text.value = '';
};
</script>
