<template>
  <ion-page>
    <slot name="header">
      <ion-header
        :translucent="translucent"
        :class="{ 'ion-no-border': headerNoBorder || dark }"
      >
        <slot name="toolbar">
          <base-toolbar
            v-show="!headerHidden"
            :color="toolbarColor"
            :class="{ dark: dark }"
          >
            <slot name="start">
              <div slot="start">
                <slot name="avatar">
                  <ion-avatar
                    v-if="avatar"
                    :class="isAppPlatfrom('android') ? 'ion-margin-start' : ''"
                    :style="{
                      height: avatarWidth + 'px',
                      width: avatarWidth + 'px',
                    }"
                  >
                    <ion-img :src="avatar" />
                  </ion-avatar>
                </slot>
                <slot name="actions-start">
                  <base-back-button
                    v-if="showBackLink"
                    :text="backText"
                    :default-href="pageDefaultBackLink"
                  ></base-back-button>
                </slot>
              </div>
            </slot>
            <slot name="title">
              <ion-title
                v-if="pageTitle"
                :size="titleSize"
                :style="{ fontWeight: pageTitleBold ? 'bold' : 'normal' }"
                >{{ pageTitle }}</ion-title
              >
            </slot>

            <div slot="end">
              <slot name="end">
                <ion-buttons>
                  <slot name="actions-end"></slot>
                </ion-buttons>
              </slot>
            </div>
          </base-toolbar>
        </slot>
      </ion-header>
    </slot>

    <slot name="content">
      <ion-content
        :scroll-events="true"
        @ionScroll="logScrolling($event)"
        :fullscreen="fullscreen"
        :scroll-y="scrollY"
        :class="{ 'ion-padding': contentPadding, dark: dark }"
      >
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

<script lang="ts" setup>
import { PropType, ref, defineAsyncComponent } from 'vue';
import { useDevice } from '@/composables/UseDevice';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonButtons,
  IonImg,
} from '@ionic/vue';
const BaseToolbar = defineAsyncComponent(
  () => import('@/components/base/Toolbar.vue'),
);
const BaseBackButton = defineAsyncComponent(
  () => import('@/components/base/BackButton.vue'),
);
const props = defineProps({
  pageTitle: {
    type: String as PropType<string | null | undefined>,
    default: '',
  },
  pageTitleBold: {
    type: Boolean,
    default: true,
  },
  backText: {
    type: String,
    default: '',
  },
  toolbarColor: {
    type: String,
    default: undefined,
  },
  pageDefaultBackLink: {
    type: String,
    default: '/tabs/home',
  },
  avatar: {
    type: String,
    default: '',
  },
  avatarWidth: {
    type: String,
    default: '35',
  },
  collapse: {
    type: String,
    default: undefined, //condense
  },
  contentPadding: {
    type: Boolean,
    default: true,
  },
  translucent: {
    type: Boolean,
    default: false,
  },
  scrollY: {
    type: Boolean,
    default: true,
  },
  fullscreen: {
    type: Boolean,
    default: true,
  },
  hideHeaderOnScroll: {
    type: Boolean,
    default: false,
  },
  showBackLink: {
    type: Boolean,
    default: true,
  },
  headerNoBorder: {
    type: Boolean,
    default: false,
  },
  titleSize: {
    type: String as PropType<'large' | 'small' | undefined>,
    default: undefined, //"large" | "small" | undefined
  },
  dark: {
    type: Boolean,
    default: false,
  },
});
const { isAppPlatfrom } = useDevice();
const headerHidden = ref(false);
const emit = defineEmits(['on-scroll-up', 'on-scroll-down']);
const logScrolling = (event: any) => {
  if (event.detail.deltaY > 1) {
    if (props.hideHeaderOnScroll) {
      headerHidden.value = true;
    }
    emit('on-scroll-down');
  } else if (event.detail.deltaY < -1) {
    if (props.hideHeaderOnScroll) {
      headerHidden.value = false;
    }
    emit('on-scroll-up');
  }
};
</script>
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
