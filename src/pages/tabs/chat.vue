<template>
  <base-layout
    :page-title="t('nav.chats')"
    fullscreen
    :content-padding="false"
    :show-back-link="false"
  >
    <template #actions-end>
      <ion-button router-link="#">
        <ion-icon slot="icon-only" :icon="addOutline"></ion-icon>
      </ion-button>
    </template>
    <ion-searchbar
      mode="ios"
      animated
      :placeholder="t('base.search') + ' ' + t('nav.chats')"
      :debounce="250"
      @ion-input="onSearchChange($event.target.value)"
    ></ion-searchbar>

    <ion-list v-if="filterMessages.length > 0">
      <ion-list-header> Online </ion-list-header>

      <ion-item
        @click="WeeGoTo('/chat')"
        v-for="(item, index) in filterOnlines"
        :key="`chat-item-${index}`"
        lines="none"
        button
        :detail="false"
      >
        <ion-avatar slot="start" class="wee-avatar-50 wee-image-border-success">
          <ion-img
            src="https://images.pexels.com/photos/1105191/pexels-photo-1105191.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          />
        </ion-avatar>
        <ion-label>
          <h2>{{ item.name }}</h2>
          <!-- <h3>I'm a big deal</h3> -->
          <p>
            {{ item.text }}
          </p>
        </ion-label>
        <div slot="end">
          <ion-label
            :color="item.new > 0 ? 'primary' : ''"
            style="margin-bottom: 5px"
          >
            <p style="font-size: x-small">23min</p>
          </ion-label>
          <ion-badge v-if="item.new > 0" class="bg-danger text-white">
            {{ item.new >= 100 ? '99+' : item.new }}
          </ion-badge>
        </div>
      </ion-item>

      <ion-list-header> Offline </ion-list-header>
      <ion-item
        @click="WeeGoTo('/chat')"
        v-for="(item, index) in filterOfflines"
        :key="`chat-item-offline-${index}`"
        lines="none"
        button
        :detail="false"
      >
        <ion-avatar slot="start" class="wee-avatar-50 wee-image-border-light">
          <ion-img
            src="https://images.pexels.com/photos/1105191/pexels-photo-1105191.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          />
        </ion-avatar>
        <ion-label>
          <h2>{{ item.name }}</h2>
          <!-- <h3>I'm a big deal</h3> -->
          <p>
            {{ item.text }}
          </p>
        </ion-label>
        <div slot="end">
          <ion-label
            :color="item.new > 0 ? 'primary' : ''"
            style="margin-bottom: 5px"
          >
            <p style="font-size: x-small">23min</p>
          </ion-label>
          <ion-badge v-if="item.new > 0" class="bg-danger text-white">
            {{ item.new >= 100 ? '99+' : item.new }}
          </ion-badge>
        </div>
      </ion-item>
    </ion-list>
    <template v-else>
      <base-error />
    </template>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="addOutline" class="text-white"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </base-layout>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { addOutline } from 'ionicons/icons';
import { useLang } from '@/composables/UseLang';
import { useBase } from '@/composables/UseBase';
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonListHeader,
  IonIcon,
  IonAvatar,
  IonImg,
  IonBadge,
  IonSearchbar,
  IonFab,
  IonFabButton,
} from '@ionic/vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseError from '@/components/base/Error.vue';
const { WeeGoTo } = useBase();
const { t } = useLang();
const count = ref(0);
const filterText = ref<string | null | undefined>('');
const items = ref([
  {
    name: 'Fin',
    text: 'Listen, I\'ve had a pretty messed up day',
    new: 5,
    online: true,
  },
  {
    name: 'Han',
    text: 'I\'ve got enough on my plate as it is, and I',
    new: 15,
    online: false,
  },
  {
    name: 'Rey',
    text: 'You will remove these restraints and leave You will remove these restraints and leave You will remove these restraints and leave You will remove these restraints and leave',
    new: 0,
    online: true,
  },
  {
    name: 'Luke',
    text: 'I feel the good in you, the conflict',
    new: 150,
    online: false,
  },
]);
const onSearchChange = (s: string | null | undefined) => {
  filterText.value = s;
};
const filterMessages = computed(() => {
  const search = filterText.value
    ? filterText.value.toLowerCase().trim()
    : undefined;
  if (!search) {
    return items.value;
  }

  return items.value.filter(c => c.name.toLowerCase().includes(search));
});

const filterOnlines = computed(() =>
  filterMessages.value.filter(t => t.online === true),
);
const filterOfflines = computed(() =>
  filterMessages.value.filter(t => t.online === false),
);
</script>
