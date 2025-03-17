<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BasePage from '@/components/base/BasePage.vue';
import {
  IonCardContent,
  IonIcon,
  IonRow
} from '@ionic/vue';
import { biBackpack, biBagDash, biBatteryHalf, biBell, biBicycle, biBootstrap, biBox2, biCameraReels } from '@quasar/extras/bootstrap-icons';
import { laAws, laBeerSolid, laCatSolid, laFontAwesome, laPhoneVolumeSolid, laTruckLoadingSolid, laTruckPickupSolid } from '@quasar/extras/line-awesome';
import { mdiAccountCardOutline, mdiAccountCowboyHat, mdiAccountSchoolOutline, mdiAirplane, mdiAlienOutline } from '@quasar/extras/mdi-v7';
import { callOutline, logoIonic, umbrellaOutline, videocam, wineOutline } from 'ionicons/icons';
</script>
<template>
  <BasePage page-title="Icon" fullscreen show-back-link>
    <BaseCard flat title="Ionic icon">
      <ion-card-content>
        <BaseButton :icon="logoIonic" full label="Ioninc icon link" href="https://ionic.io/ionicons" target="_blank" />
        <ion-row class="q-gutter-md">
          <IonIcon :icon="wineOutline" size="large" />
          <IonIcon :icon="umbrellaOutline" color="primary" size="small" />
          <IonIcon :icon="videocam" color="danger" />
          <BaseIcon :icon="callOutline" color="primary" />
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="Bootstrap icon">
      <ion-card-content>
        <BaseButton :icon="biBootstrap" full icon-set="bootstrap-icons" label="Bootstrap icon link"
          href="https://icons.getbootstrap.com/" target="_blank" />
        <ion-row class="q-gutter-md q-pt-md">
          <BaseIcon :icon="biBackpack" icon-set="bootstrap-icons" :size="40" />
          <BaseIcon :icon="biBagDash" icon-set="bootstrap-icons" />
          <BaseIcon :icon="biBatteryHalf" icon-set="bootstrap-icons" />
          <BaseIcon :icon="biBell" icon-set="bootstrap-icons" color="muted" />
          <BaseIcon :icon="biBicycle" icon-set="bootstrap-icons" color="pink" />
          <BaseIcon :icon="biBox2" icon-set="bootstrap-icons" color="red" />
          <BaseIcon :icon="biCameraReels" icon-set="bootstrap-icons" color="primary" />
          <BaseIcon :icon="biBootstrap" icon-set="bootstrap-icons" color="primary" />
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="Line-awesome icon">
      <ion-card-content>
        <BaseButton :icon="laFontAwesome" full icon-set="line-awesome" label="Line-awesome icon link"
          href="https://icons8.com/line-awesome" target="_blank" />
        <ion-row class="q-gutter-md q-pt-md">
          <BaseIcon :icon="laCatSolid" icon-set="line-awesome" :size="35" />
          <BaseIcon :icon="laPhoneVolumeSolid" icon-set="line-awesome" />
          <BaseIcon :icon="laTruckLoadingSolid" icon-set="line-awesome" />
          <BaseIcon :icon="laTruckPickupSolid" icon-set="line-awesome" />
          <BaseIcon :icon="laBeerSolid" icon-set="line-awesome" />
          <BaseIcon :icon="laAws" icon-set="line-awesome" />
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="mdi icon">
      <ion-card-content>
        <BaseButton label="Mdi icon link" full href="https://pictogrammers.com/library/mdi/" target="_blank" />
        <ion-row class="q-gutter-md q-pt-md">
          <BaseIcon :icon="mdiAccountCardOutline" icon-set="mdi" />
          <BaseIcon :icon="mdiAccountCowboyHat" icon-set="mdi" />
          <BaseIcon :icon="mdiAccountSchoolOutline" icon-set="mdi" />
          <BaseIcon :icon="mdiAirplane" icon-set="mdi" />
          <BaseIcon :icon="mdiAlienOutline" icon-set="mdi" />
        </ion-row>
      </ion-card-content>
    </BaseCard>
  </BasePage>
</template>
