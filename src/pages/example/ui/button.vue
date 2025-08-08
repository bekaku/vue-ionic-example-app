<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseTextHeader from '@/components/base/BaseTextHeader.vue';
import { IonCardContent, IonRow } from '@ionic/vue';
import { ellipsisHorizontal, heart, videocam, wallet } from 'ionicons/icons';
</script>
<template>
  <BasePage page-title="Button" fullscreen show-back-link>
    <BaseCard title="Button" subtitle="Button components">
      <ion-card-content>
        <BaseButton icon-only :icon="{ name: heart }" shape="round" />
        <ion-row class="q-gutter-md">
          <BaseButton label="Default" />
          <BaseButton disabled label="Disabled" />
          <BaseButton label="Icon" :icon="{ name: videocam, color: 'amber' }" />
          <BaseButton
            label="Image"
            :avatar="{ src: 'https://cdn.quasar.dev/img/avatar2.jpg' }"
          />
          <BaseButton
            label="Icon right"
            :icon-right="{ name: wallet, color: 'white' }"
          />
          <BaseButton
            label="Round"
            round
            :icon="{ name: videocam }"
            color="warning"
          />
          <BaseButton
            color="light"
            label="External link"
            href="https://www.google.com"
            target="_blank"
          />
        </ion-row>
      </ion-card-content>
      <ion-card-content>
        <BaseTextHeader title="Colors" />
        <ion-row class="q-gutter-md">
          <BaseButton color="primary" label="Primary" />
          <BaseButton color="secondary" label="Secondary" />
          <BaseButton color="tertiary" label="Tertiary" />
          <BaseButton color="success" label="Success" />
          <BaseButton color="warning" label="Warning" />
          <BaseButton color="danger" label="Danger" />
          <BaseButton color="light" label="Light" />
          <BaseButton color="medium" label="Medium" />
          <BaseButton color="dark" label="Dark" />
        </ion-row>
      </ion-card-content>
      <ion-card-content>
        <BaseTextHeader title="Fill" />
        <ion-row class="q-gutter-md">
          <BaseButton label="Default" />
          <BaseButton clear label="Clear" />
          <BaseButton clear icon-only :icon="{ name: ellipsisHorizontal }" />
          <BaseButton outline label="Outline" />
        </ion-row>
      </ion-card-content>
      <ion-card-content>
        <BaseButton full label="Full" />
      </ion-card-content>
    </BaseCard>
    <BaseCard
      title="RBAC"
      subtitle="Role based access control"
    >
      <ion-card-content>
        <ion-row class="q-gutter-md">
          <BaseButton
            v-rbac="{
              permissions: ['user_manage'],
            }"
            label="Single permission"
          />
          <BaseButton
            v-rbac="{
              permissions: ['user_manage_not_exist', 'file_manager_list'],
              condition: 'any',
            }"
            label="Any of multiple permissions"
          />
          <BaseButton
            v-rbac="{
              permissions: ['user_list', 'user_view', 'user_delete'],
              condition: 'all',
            }"
            label="All permissions required"
          />
          <BaseButton
            v-rbac="{
              permissions: ['user_manage'],
              condition: 'not',
            }"
            label="Negation (not)"
          />
          <BaseButton
            v-rbac="{
              permissions: ['user_manage_not_exist'],
            }"
            label="Not eligible for this"
          />
        </ion-row>
      </ion-card-content>
    </BaseCard>
  </BasePage>
</template>
