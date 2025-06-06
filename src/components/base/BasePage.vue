<script lang="ts" setup>
import { useDevice } from '@/composables/useDevice';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { defineAsyncComponent, ref } from 'vue';

const {
  pageTitleBold = true,
  pageDefaultBackLink = '/tabs/home',
  backText = '',
  avatarSize = 35,
  contentPadding = false,
  translucent = false,
  scrollY = true,
  fullscreen = true,
  hideHeaderOnScroll = false,
  showBackLink = true,
  headerNoBorder = false,
  dark = false,
  scrollEvents = false,
  noPadding = false,
} = defineProps<{
  pageTitle?: string | null
  pageTitleBold?: boolean
  backText?: string
  toolbarColor?: string
  pageDefaultBackLink?: string
  avatar?: string
  avatarSize?: number
  collapse?: string // condense
  contentPadding?: boolean
    noPadding?: boolean
  translucent?: boolean
  scrollY?: boolean
  fullscreen?: boolean
  hideHeaderOnScroll?: boolean
  showBackLink?: boolean
  headerNoBorder?: boolean
  dark?: boolean
  titleSize?: 'large' | 'small' | undefined,
  scrollEvents?: boolean
}>();
const emit = defineEmits<{
  'on-scroll-up': []
  'on-scroll-down': []
  'on-scroll': [event: any]
}>()
const BaseToolbar = defineAsyncComponent(() => import('@/components/base/BaseToolbar.vue'));
const BaseBackButton = defineAsyncComponent(() => import('@/components/base/BaseBackButton.vue'));
const BaseAvatar = defineAsyncComponent(() => import('@/components/base/BaseAvatar.vue'));

const { isAppPlatfrom } = useDevice();
const headerHidden = ref(false);
const logScrolling = (event: any) => {
    emit('on-scroll', event)
  if (event.detail.deltaY > 1) {
    if (hideHeaderOnScroll) {
      headerHidden.value = true;
    }
    emit('on-scroll-down');
  } else if (event.detail.deltaY < -1) {
    if (hideHeaderOnScroll) {
      headerHidden.value = false;
    }
    emit('on-scroll-up');
  }
};
</script>
<template>
  <ion-page v-bind="$attrs">
    <slot name="header">
      <ion-header :translucent="translucent" :class="{ 'ion-no-border': headerNoBorder || dark }">
        <slot name="toolbar">
          <base-toolbar v-show="!headerHidden" :color="toolbarColor" :class="{ dark }">
            <slot name="start">
              <div slot="start">
                <ion-row>
                  <slot name="avatar">
                    <base-avatar v-if="avatar" :class="isAppPlatfrom('android') ? 'ion-margin-start' : ''
                      " :src="avatar" :size="avatarSize" />
                  </slot>
                  <slot name="actions-start">
                    <base-back-button v-if="showBackLink" :text="backText"
                      :default-href="pageDefaultBackLink" />
                  </slot>
                </ion-row>
              </div>
            </slot>
            <slot name="title">
              <ion-title v-if="pageTitle" :size="titleSize" :style="{ fontWeight: pageTitleBold ? 'bold' : 'normal' }">
                {{ pageTitle }}
              </ion-title>
            </slot>

            <div slot="end">
              <slot name="end">
                <ion-buttons>
                  <slot name="actions-end" />
                </ion-buttons>
              </slot>
            </div>
          </base-toolbar>
        </slot>
        <slot name="headerBottom" />
      </ion-header>
    </slot>

    <slot name="content">
      <ion-content :scroll-events="scrollEvents" :fullscreen="fullscreen" :scroll-y="scrollY"
        :class="{ 'ion-padding': contentPadding, 'dark': dark, 'ion-no-padding': noPadding}" @ion-scroll="logScrolling($event)">
        <template v-if="collapse == 'condense'">
          <ion-header mode="ios" collapse="condense">
            <ion-toolbar :color="toolbarColor">
              <ion-title size="large">{{ pageTitle }}</ion-title>
            </ion-toolbar>
          </ion-header>
        </template>
        <slot />
      </ion-content>
    </slot>
  </ion-page>
</template>
<style scoped>
ion-content.dark {
  --background: var(--app-bg-color-theme-dark);
  --color: var(--v-main-text-body-theme-dark);
}

ion-toolbar.dark {
  --background: var(--second-bg-color-theme-dark);
  --color: var(--v-main-text-body-theme-dark);
}
</style>
