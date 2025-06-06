<script setup lang="ts">
import BaseAlert from '@/components/base/BaseAlert.vue';
import { useLang } from '@/composables/useLang';
import { useValidation } from '@/composables/useValidation';
import { IonItem, IonLabel, IonList } from '@ionic/vue';
import {
  checkmarkOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  shieldOutline,
} from 'ionicons/icons';
import { computed, ref } from 'vue';
import BaseButton from '../base/BaseButton.vue';
import BaseCard from '../base/BaseCard.vue';
import BaseInput from '../base/BaseInput.vue';

interface Props {
  submitLabel?: string;
  actionAlign?: 'center' | 'left' | 'right';
  showCurrentPassword?: boolean;
  showLogout?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  actionAlign: 'center',
  showCurrentPassword: false,
  showLogout: false,
  submitLabel: undefined,
});
const emit = defineEmits<{
  onSubmit: [void];
}>();
const { t } = useLang();
const { validatePasswordStrongV2 } = useValidation();
const showPassword = ref(false);

const currentPassword = defineModel<string>('currentPassword');
const newPassword = defineModel<string>('newPassword');
const logoutAllDevice = defineModel<boolean>('logoutAllDevice');
const loading = defineModel<boolean>('loading');

const confirmPassword = ref('');
const isStrong = computed(() =>
  newPassword.value ? validatePasswordStrongV2(newPassword.value) : false,
);
const isSamePwd = computed(
  () =>
    confirmPassword.value
    && newPassword.value
    && newPassword.value === confirmPassword.value,
);
const canSubmit = computed(
  () =>
    (props.showCurrentPassword ? currentPassword.value : true)
    && confirmPassword.value
    && newPassword.value
    && isSamePwd.value,
);
const onSubmit = () => {
  if (!newPassword.value) {
    return;
  }
  emit('onSubmit');
};
</script>

<template>
  <form>
    <BaseCard>
      <base-alert
        type="is-warning"
        :icon="shieldOutline"
        :message="t('authen.helper2')"
        :radius="false"
        class="q-mb-md"
      />
      <ion-list>
        <BaseInput
          v-if="showCurrentPassword"
          v-model="currentPassword"
          :icon="{ name: shieldOutline, iconSet: 'ion' }"
          :type="showPassword ? 'text' : 'password'"
          :label="t('authen.currentPassword')"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
        >
          <template #end>
            <BaseButton
              icon-only
              clear
              :icon="{ name: showPassword ? eyeOutline : eyeOffOutline }"
              @click="showPassword = !showPassword"
            />
          </template>
        </BaseInput>
        <BaseInput
          v-model="newPassword"
          :icon="{ name: lockClosedOutline, iconSet: 'ion' }"
          :type="showPassword ? 'text' : 'password'"
          :label="t('authen.newPassword')"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
        >
          <template #end>
            <BaseButton
              icon-only
              clear
              :icon="{ name: showPassword ? eyeOutline : eyeOffOutline }"
              @click="showPassword = !showPassword"
            />
          </template>
        </BaseInput>

        <ion-item v-if="!isStrong" lines="none">
          <ion-label class="ion-text-wrap">
            <p class="text-red">
              {{ t('authen.helper2') }}
            </p>
          </ion-label>
        </ion-item>

        <BaseInput
          v-model="confirmPassword"
          :icon="{ name: lockClosedOutline, iconSet: 'ion' }"
          :type="showPassword ? 'text' : 'password'"
          :label="t('authen.confirmPassword')"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
        >
          <template #end>
            <BaseButton
              icon-only
              clear
              :icon="{ name: showPassword ? eyeOutline : eyeOffOutline }"
              @click="showPassword = !showPassword"
            />
          </template>
        </BaseInput>

        <ion-item v-if="!isSamePwd" lines="none">
          <ion-label class="ion-text-wrap">
            <p class="text-red">
              {{ t('error.passwordNotMatchNew') }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- <ion-button :disabled="!canSubmit" expand="block" @click="onSubmit">
          <ion-icon slot="start" :icon="checkmarkOutline" />
          {{ t('base.submit') }}
        </ion-button> -->
      <BaseButton
        class="q-pa-md"
        :disabled="!canSubmit"
        :icon="{ name: checkmarkOutline }"
        full
        :label="t('base.submit')"
        @click="onSubmit"
      />
    </BaseCard>
  </form>
</template>
