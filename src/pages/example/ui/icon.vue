<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BasePage from '@/components/base/BasePage.vue';
import { IonCardContent, IonIcon, IonRow } from '@ionic/vue';
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
  logoIonic,
  umbrellaOutline,
  videocam,
  wineOutline,
} from 'ionicons/icons';
</script>
<template>
  <BasePage page-title="Icon" fullscreen show-back-link>
    <BaseCard flat title="Ionic icon">
      <ion-card-content>
        <BaseButton
          :icon="{ name: logoIonic, iconSet: 'ion' }"
          full
          label="Ioninc icon link"
          href="https://ionic.io/ionicons"
          target="_blank"
        />
        <ion-row class="q-gutter-md">
          <IonIcon :icon="wineOutline" size="large" />
          <IonIcon :icon="umbrellaOutline" color="primary" size="small" />
          <IonIcon :icon="videocam" color="danger" />
          <BaseIcon :name="callOutline" color="primary" />
        </ion-row>
      </ion-card-content>
    </BaseCard>
    <BaseCard flat title="Bootstrap icon">
      <ion-card-content>
        <BaseButton
          full
          :icon="{ name: biBootstrap, iconSet: 'bootstrap-icons' }"
          label="Bootstrap icon link"
          href="https://icons.getbootstrap.com/"
          target="_blank"
        />
        <ion-row class="q-gutter-md q-pt-md">
          <BaseIcon :name="biBackpack" icon-set="bootstrap-icons" :size="40" />
          <BaseIcon :name="biBagDash" icon-set="bootstrap-icons" />
          <BaseIcon :name="biBatteryHalf" icon-set="bootstrap-icons" />
          <BaseIcon :name="biBell" icon-set="bootstrap-icons" color="muted" />
          <BaseIcon :name="biBicycle" icon-set="bootstrap-icons" color="pink" />
          <BaseIcon :name="biBox2" icon-set="bootstrap-icons" color="red" />
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
        <BaseButton
          full
          :icon="{ name: laFontAwesome, iconSet: 'line-awesome' }"
          label="Line-awesome icon link"
          href="https://icons8.com/line-awesome"
          target="_blank"
        />
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
        <BaseButton
          label="Mdi icon link"
          full
          href="https://pictogrammers.com/library/mdi/"
          target="_blank"
        />
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
