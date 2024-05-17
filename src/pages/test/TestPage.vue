<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button
            text=""
            default-href="/tabs/home"
          ></base-back-button>
        </ion-buttons>
        <ion-title> Test Page</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-card>
        <ion-card-content>
          <p>
            storage : {{ storage }}
          </p>


          <input type="text" v-model="modelValue" />

          <br />
          <ion-button @click="onChange">
            String Change
          </ion-button>


          <p>List Array</p>
          <ion-list>
            <ion-item v-for="(item , i) in list" :key="i">
              <ion-label>
                <h3>{{ item.key }}</h3>
                <p>{{ item.date }}</p>
              </ion-label>
              <ion-buttons slot="end">
                <ion-button @click="onRemove(i)">
                  Delete
                </ion-button>
              </ion-buttons>
            </ion-item>
          </ion-list>

          <br />
          <ion-button @click="onChangeList">
            Test List
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { useLang } from '@/composables/UseLang';
import { useBase } from '@/composables/UseBase';
import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BackButton.vue';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonButton,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/vue';
import { useAppStorage } from '@/composables/UseAppStorage';
import { ref } from 'vue';
import { CacheDateAndKey } from '@/types/Common';
import { getDateNow } from '@/utils/DateUtil';

const key = 'TEST_STORAGE_KEY';
const key2 = 'TEST_STORAGE_KEY2';
const { storage } = useAppStorage<string>(key, 'test', false);

const { t } = useLang();
const { onBack } = useBase();

const modelValue = ref<string>('');
const onChange = () => {
  storage.value = modelValue.value;
};
//list
const { storage: list } = useAppStorage<CacheDateAndKey[]>(key2, []);
const onChangeList = () => {
  list.value.push({
    key: 'test',
    date: getDateNow().toLocaleDateString()
  });
};
const onRemove = (index: number) => {
  list.value.splice(index, 1);
};
</script>
