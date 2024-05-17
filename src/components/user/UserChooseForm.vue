<template>
  <base-modal
    v-if="dialog"
    :model-value="dialog"
    :title="title"
    :initial-breakpoint="1"
    :breakpoints="[1]"
    @update:modelValue="(newVal: boolean) => (dialog = newVal)"
    @on-close="dialog = false"
  >
    <ion-searchbar
      mode="ios"
      :placeholder="t('base.search')"
      :debounce="150"
      @ionInput="onSearchChange($event.target.value)"
    ></ion-searchbar>
    <template v-if="loading">
      <skeleton-item show :items="8" />
    </template>
    <template v-else-if="filterItems.length > 0">
      <ion-button
        v-if="multiple"
        expand="block"
        class="text-white"
        @click="dialog = false"
        >{{ t('base.done') }}
      </ion-button>
      <ion-list>
        <ion-list-header>
          <ion-label>{{ t('tabToSelect') }}</ion-label>
        </ion-list-header>

        <ion-item v-if="multiple" lines="full">
          <ion-checkbox
            slot="start"
            mode="ios"
            v-model="selectedAll"
            @ionChange="onCheckedAll"
            aria-label="Label"
            labelPlacement="end"
          >
            {{ !selectedAll ? t('base.selectAll') : t('base.deselectAll') }}
          </ion-checkbox>
        </ion-item>

        <user-profile-item
          v-for="(item, index) in filterItems"
          :key="`user-choose-${index}-${item.id}`"
          :item="item"
          @on-select="onAddUser(item)"
          lines="full"
        >
          <template #end>
            <ion-icon
              v-if="userExist(item.id)"
              :icon="checkmarkCircle"
              color="primary"
            ></ion-icon>
            <ion-icon v-else :icon="ellipseOutline" color="primary"></ion-icon>
          </template>
        </user-profile-item>
      </ion-list>
    </template>
    <template v-else>
      <app-result status="empty" />
    </template>
  </base-modal>
</template>
<script lang="ts" setup>
import UserService from '@/api/UserService';
import { computed, onMounted, ref } from 'vue';
import { UserDto } from '@/types/Models';
import { useLang } from '@/composables/UseLang';
import UserProfileItem from '@/components/user/Item.vue';
import BaseModal from '@/components/base/Modal.vue';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSearchbar,
} from '@ionic/vue';
import { checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import AppResult from '@/components/base/Result.vue';
import SkeletonItem from '@/components/skeleton/ListItem.vue';

const { findAllUserActiveByUserAuth } = UserService();
const props = withDefaults(
  defineProps<{
    exceptItems: number[];
    height?: number;
    multiple?: boolean;
    title?: string;
  }>(),
  {
    height: 450,
    multiple: true,
  },
);
const { t } = useLang();
const filterText = ref<string | null | undefined>('');
const loading = ref(false);
const users = ref<UserDto[]>([]);
const modelValue = defineModel<UserDto[]>();
const dialog = defineModel('dialog', { type: Boolean, default: false });
const selectedAll = ref(false);
onMounted(async () => {
  await fetchData();
});
const fetchData = async () => {
  loading.value = true;
  const res = await findAllUserActiveByUserAuth();
  if (res) {
    users.value = res;
  }
  loading.value = false;
  return new Promise((resolve) => resolve(true));
};
const filterExceptUsers = computed(() => {
  return users.value.filter((t) => {
    if (modelValue.value == undefined) {
      return t;
    }
    const f = props.exceptItems.find((id) => id == t.id);
    if (!f) {
      return t;
    }
    // const e = modelValue.value.find(id => id == t.id);
    // const f = props.exceptItems.find(id => id == t.id);
    // if (!e && !f) {
    //   return t;
    // }
  });
});
const onSearchChange = (s: string | null | undefined) => {
  if (s && s.trim().length >= 2) {
    filterText.value = s;
  } else {
    filterText.value = '';
  }
};
const filterItems = computed(() => {
  if (!filterExceptUsers.value) {
    return [];
  }
  const search = filterText.value
    ? filterText.value.toLowerCase().trim()
    : undefined;
  if (!search) {
    return filterExceptUsers.value;
  }
  return filterExceptUsers.value.filter(
    (c) => c && c.username && c.username.toLowerCase().includes(search),
  );
});
const onCheckedAll = () => {
  updateSelectedAll(selectedAll.value);
};
const updateSelectedAll = (val: boolean) => {
  if (val) {
    for (const u of filterItems.value) {
      onAddUser(u, false);
    }
  } else {
    onClear();
  }
};
const onAddUser = (user: UserDto, reMoveIfExist = true) => {
  if (modelValue.value == undefined) {
    return;
  }
  if (props.multiple) {
    const existIndex = findSelectIndex(user.id);
    if (existIndex != undefined && existIndex >= 0) {
      if (reMoveIfExist) {
        onRemoveUser(existIndex);
      }
    } else {
      modelValue.value.push(user);
    }
  } else {
    modelValue.value[0] = user;
    dialog.value = false;
  }
};
const onRemoveUser = (index: number) => {
  if (modelValue.value == undefined) {
    return;
  }
  modelValue.value?.splice(index, 1);
};
const onClear = () => {
  if (modelValue.value == undefined) {
    return;
  }
  modelValue.value = [];
};
const findItemByUserId = (uid: number) => {
  if (modelValue.value == undefined) {
    return;
  }
  return filterExceptUsers.value.find((t) => t.id == uid);
};
const userExist = (uid: number | null) => {
  if (modelValue.value == undefined || !uid) {
    return;
  }
  return modelValue.value.find((u) => u.id == uid);
};
const findSelectIndex = (uid: number | null) => {
  if (modelValue.value == undefined || !uid) {
    return;
  }
  return modelValue.value.findIndex((u) => u.id == uid);
};
</script>
