<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BasePage from '@/components/base/BasePage.vue';
import {
  Camera,
  Heart,
  House,
  Search,
  Settings,
  ArrowRight,
  Download,
} from '@lucide/vue';
import { IonCardContent, IonRow } from '@ionic/vue';
import {
  biBackpack,
  biBagDash,
  biBatteryHalf,
  biBell,
  biBicycle,
  biBootstrap,
  biBox2,
  biCameraReels,
} from '@quasar/extras/bootstrap-icons';
import {
  laAws,
  laBeerSolid,
  laCatSolid,
  laFontAwesome,
  laPhoneVolumeSolid,
  laTruckLoadingSolid,
  laTruckPickupSolid,
} from '@quasar/extras/line-awesome';
import {
  mdiAccountCardOutline,
  mdiAccountCowboyHat,
  mdiAccountSchoolOutline,
  mdiAirplane,
  mdiAlienOutline,
} from '@quasar/extras/mdi-v7';
import {
  callOutline,
  umbrellaOutline,
  videocam,
  wineOutline,
} from 'ionicons/icons';
// Import icon components individually; BaseIcon also works inside BaseButton.
const lucideUsage = `import { House, Download } from '@lucide/vue';

<BaseIcon :name="House" icon-set="lucide" :size="24" color="primary" />
<BaseIcon :name="House" icon-set="lucide" :size="32" :stroke-width="1.5" />
<BaseButton :icon="{ name: Download, iconSet: 'lucide' }" label="Download" />`;
</script>
<template>
  <BasePage page-title="Icon" fullscreen show-back-link>
    <BaseCard
      flat
      title="Lucide Vue"
      subtitle="Components, size, color and stroke width"
    >
      <ion-card-content>
        <ion-row class="q-gutter-md q-mb-md">
          <BaseIcon
            :name="House"
            icon-set="lucide"
            :size="32"
            color="primary"
          />
          <BaseIcon :name="Search" icon-set="lucide" :size="24" />
          <BaseIcon
            :name="Camera"
            icon-set="lucide"
            :size="28"
            color="success"
          />
          <BaseIcon
            :name="Heart"
            icon-set="lucide"
            :size="32"
            color="pink-500"
          />
          <BaseIcon
            :name="Settings"
            icon-set="lucide"
            :size="32"
            :stroke-width="1"
          />
          <BaseIcon
            :name="Settings"
            icon-set="lucide"
            :size="32"
            :stroke-width="3"
          />
        </ion-row>
        <ion-row class="q-gutter-sm q-mb-md">
          <BaseButton
            :icon="{ name: Download, iconSet: 'lucide' }"
            label="Download"
          />
          <BaseButton
            :icon-right="{ name: ArrowRight, iconSet: 'lucide' }"
            label="Next"
            outline
          />
          <BaseButton
            :icon="{ name: Heart, iconSet: 'lucide' }"
            icon-only
            clear
            aria-label="Favorite"
          />
        </ion-row>
        <p>
          <a
            href="https://lucide.dev/guide/vue"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
            >Lucide documentation</a
          >
        </p>
        <pre
          class="q-mt-md"
          style="overflow-x: auto"
        ><code>{{ lucideUsage }}</code></pre>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="Ionic icon">
      <ion-card-content>
        <p>
          <a
            href="https://ionic.io/ionicons"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
            >Ionic icon link</a
          >
        </p>
        <ion-row class="q-gutter-md">
          <BaseIcon :name="wineOutline" :size="32" />
          <BaseIcon :name="umbrellaOutline" color="primary" :size="18" />
          <BaseIcon :name="videocam" color="danger" />
          <BaseIcon :name="callOutline" color="primary" />
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="Bootstrap icon">
      <ion-card-content>
        <p>
          <a
            href="https://icons.getbootstrap.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
            >Bootstrap icon link</a
          >
        </p>
        <ion-row class="q-gutter-md q-pt-md">
          <BaseIcon :name="biBackpack" icon-set="bootstrap-icons" :size="40" />
          <BaseIcon :name="biBagDash" icon-set="bootstrap-icons" />
          <BaseIcon :name="biBatteryHalf" icon-set="bootstrap-icons" />
          <BaseIcon :name="biBell" icon-set="bootstrap-icons" color="muted" />
          <BaseIcon
            :name="biBicycle"
            icon-set="bootstrap-icons"
            color="pink-500"
          />
          <BaseIcon :name="biBox2" icon-set="bootstrap-icons" color="red-500" />
          <BaseIcon
            :name="biCameraReels"
            icon-set="bootstrap-icons"
            color="primary"
          />
          <BaseIcon
            :name="biBootstrap"
            icon-set="bootstrap-icons"
            color="primary"
          />
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="Line-awesome icon">
      <ion-card-content>
        <p>
          <a
            href="https://icons8.com/line-awesome"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
            >Line-awesome icon link</a
          >
        </p>
        <ion-row class="q-gutter-md q-pt-md">
          <BaseIcon :name="laCatSolid" icon-set="line-awesome" :size="35" />
          <BaseIcon :name="laPhoneVolumeSolid" icon-set="line-awesome" />
          <BaseIcon :name="laTruckLoadingSolid" icon-set="line-awesome" />
          <BaseIcon :name="laTruckPickupSolid" icon-set="line-awesome" />
          <BaseIcon :name="laBeerSolid" icon-set="line-awesome" />
          <BaseIcon :name="laAws" icon-set="line-awesome" />
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="mdi icon">
      <ion-card-content>
        <p>
          <a
            href="https://pictogrammers.com/library/mdi/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
            >Mdi icon link</a
          >
        </p>
        <ion-row class="q-gutter-md q-pt-md">
          <BaseIcon :name="mdiAccountCardOutline" icon-set="mdi" />
          <BaseIcon :name="mdiAccountCowboyHat" icon-set="mdi" />
          <BaseIcon :name="mdiAccountSchoolOutline" icon-set="mdi" />
          <BaseIcon :name="mdiAirplane" icon-set="mdi" />
          <BaseIcon :name="mdiAlienOutline" icon-set="mdi" />
        </ion-row>
      </ion-card-content>
    </BaseCard>
  </BasePage>
</template>
