<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import UserCard from '@/components/user/UserCard.vue';
import UserItem from '@/components/user/UserItem.vue';
</script>
<template>
  <BasePage page-title="Users" fullscreen show-back-link>
    <BaseCard title="User list">
      <UserItem
        :avatar="{
          src: 'https://cdn.quasar.dev/img/avatar1.jpg',
          size: 42,
        }"
        show-arrow
        avatar-top
        to="/user/1"
        name="John Doe"
        description="Software engineer"
      />
      <UserItem
        name="John Doe"
        description="Clickable"
        clickable
        :avatar="{
          src: 'https://cdn.quasar.dev/img/avatar2.jpg',
          size: 42,
          badge: {
            color: 'danger',
            cssClass: 'q-relative-position',
            cssStyle: { top: '-52px', left: '30px' },
          },
        }"
      >
        <template #end>
          <BaseButton label="End" color="light" />
        </template>
      </UserItem>
      <UserItem
        :avatar="{
          src: 'https://cdn.quasar.dev/img/avatar3.jpg',
          size: 42,
          badge: {
            color: 'success',
            cssClass: 'q-relative-position',
            cssStyle: { top: '-16px', left: '30px' },
            transparent: true,
          },
        }"
        name="John Doe"
        description="Software engineer"
      />
      <UserItem
        :avatar="{
          src: 'https://cdn.quasar.dev/img/avatar4.jpg',
          size: 42,

          badge: {
            color: 'success',
            text: 'new',
            cssClass: 'q-relative-position',
            cssStyle: { top: '-52px', left: '10px' },
          },
        }"
        name="John Doe"
        description="Software engineer"
      />
    </BaseCard>

      <UserCard
        cover-image="https://images.unsplash.com/photo-1741568032886-18d3f2a694c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        :avatar="{
          src: 'https://i.pravatar.cc/450',
          size: 75,
        }"
        name="Chanavee Bekaku"
        description="Software Engineer"
        height="125px"
        avatar-top="75px"
        :description-style="{ marginTop: '5px' }"
      />
  </BasePage>
</template>
