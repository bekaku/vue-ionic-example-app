<template>
  <ion-modal :is-open="show" @willDismiss="onClose" ref="modalSelectTheme">
    <ion-content>
      <ion-header>
        <base-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="onClose">
              <ion-icon :icon="close" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title class="ion-text-capitalize" v-if="title">
            {{ title }}
          </ion-title>
        </base-toolbar>
      </ion-header>

      <div class="ion-padding">
        <ion-searchbar
          v-if="showSearch"
          :placeholder="t('base.search')"
          :debounce="150"
          @ionInput="onSearchChange($event.target.value)"
        ></ion-searchbar>

        <ion-button
          v-if="multiple"
          mode="ios"
          expand="block"
          class="text-white"
          @click="onMultipleSelect"
          >{{ t('base.done') }}
        </ion-button>

        <ion-list>
          <ion-list-header v-if="selectable">
            <ion-label>{{ t('tabToSelect') }}</ion-label>
          </ion-list-header>

          <ion-item v-if="multiple && selectable" lines="full">
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
          <!-- <RecycleScroller
              class="scroller"
              :items="filterItems"
              :item-size="60"
              key-field="id"
            >
              <template #default="{ item, index }">
                <user-profile-item
                  :key="item.id"
                  :item="item"
                  @on-select="onSelectItemm(item)"
                >
                  <template #end>
                    <ion-icon
                      v-if="userExist(item.id) >= 0"
                      :icon="checkmarkCircle"
                      color="primary"
                    ></ion-icon>
                    <ion-icon
                      v-else
                      :icon="ellipseOutline"
                      color="primary"
                    ></ion-icon>
                  </template>
                </user-profile-item>
              </template>
            </RecycleScroller> -->
          <user-profile-item
            v-for="(item, index) in filterItems"
            :key="index"
            :item="item"
            @on-select="onSelectItemm(item)"
            lines="full"
          >
            <template #extra> </template>
            <template #end>
              <template v-if="selectable">
                <ion-icon
                  v-if="userExist(item.id) >= 0"
                  :icon="checkmarkCircle"
                  color="primary"
                ></ion-icon>
                <ion-icon
                  v-else
                  :icon="ellipseOutline"
                  color="primary"
                ></ion-icon>
              </template>
            </template>
          </user-profile-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-modal>
</template>
<script setup lang="ts">
import { UserProfileDto } from '@/types/Models';
import { checkmarkCircle, close, ellipseOutline } from 'ionicons/icons';
import { computed, defineAsyncComponent, PropType, ref } from 'vue';
// import { RecycleScroller } from 'vue-virtual-scroller';
import { useLang } from '@/composables/UseLang';
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonSearchbar,
  IonTitle,
} from '@ionic/vue';

const UserProfileItem = defineAsyncComponent(
  () => import('@/components/user/ProfileItem.vue'),
);
const BaseToolbar = defineAsyncComponent(
  () => import('@/components/base/Toolbar.vue'),
);

const props = defineProps({
  modelValue: {
    type: Boolean,
    require: true,
  },
  items: {
    type: Array as PropType<UserProfileDto[]>,
  },
  title: {
    type: String,
  },
  exceptUserId: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: true,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  showActionPlanCount: {
    type: Boolean,
    default: false,
  },
});
const { t } = useLang();
const canSearch = ref(false);
const filterText = ref<string | null | undefined>('');
const selectedUsers = ref<UserProfileDto[]>([]);
const selectedAll = ref(false);
const emit = defineEmits([
  'on-close',
  'update:modelValue',
  'on-select',
  'on-multiple-select',
]);
const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
const filterItems = computed(() => {
  if (!props.items) {
    return [];
  }
  const search = filterText.value
    ? filterText.value.toLowerCase().trim()
    : undefined;
  if (!search) {
    if (props.exceptUserId) {
      return props.items.filter((t) => t.id != props.exceptUserId);
    }
    return props.items;
  }
  if (props.exceptUserId) {
    return props.items.filter(
      (c) =>
        c &&
        c.fullName &&
        c.fullName.toLowerCase().includes(search) &&
        c.id != props.exceptUserId,
    );
  }
  return props.items.filter(
    (c) => c && c.fullName && c.fullName.toLowerCase().includes(search),
  );
});
const onClose = () => {
  filterText.value = '';
  emit('on-close');
  show.value = false;
};
const onSearchChange = (s: string | null | undefined) => {
  if (s && s.trim().length >= 2) {
    filterText.value = s;
    canSearch.value = true;
  } else {
    canSearch.value = false;
    filterText.value = '';
  }
};
const userExist = (uid: number) => {
  return selectedUsers.value.findIndex((t) => t.id == uid);
};
const onSelectItemm = (item: UserProfileDto) => {
  if (!props.multiple) {
    onSelectSingle(item);
  } else {
    const i = userExist(item.id);
    if (i >= 0) {
      selectedUsers.value.splice(i, 1);
    } else {
      selectedUsers.value.push(item);
    }
  }
};
const onSelectSingle = (item: UserProfileDto) => {
  emit('on-select', item);
};
const onMultipleSelect = () => {
  emit('on-multiple-select', selectedUsers.value);
  selectedUsers.value = [];
  selectedAll.value = false;
};

const onCheckedAll = () => {
  updateSelectedAll(selectedAll.value);
};
const updateSelectedAll = (val: boolean) => {
  selectedUsers.value = [];
  if (val) {
    const items = filterItems.value;
    for (const item of items) {
      selectedUsers.value.push(item);
    }
  }
};
</script>
<style scoped>
.ripple-parent {
  position: relative;
  overflow: hidden;
}

.scroller {
  height: 450px;
}
</style>
