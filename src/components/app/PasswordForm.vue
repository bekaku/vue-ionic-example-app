<template>
  <form>
    <ion-card class="q-ma-sm">
      <ion-card-content>
        <base-alert
            type="is-warning"
            :icon="shieldOutline"
            :message="t('authen.helper2')"
            radius
            class="q-mb-md"
        >
        </base-alert>
        <ion-list>
          <ion-item v-if="showCurrentPassword">
            <ion-icon slot="start" :icon="shieldOutline"></ion-icon>
            <ion-input
                v-model="currentPassword"
                :type="showPassword ? 'text' : 'password'"
                label-placement="stacked"
                :label="t('authen.currentPassword')"
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
            ></ion-input>
            <ion-button
                slot="end"
                fill="clear"
                @click="showPassword = !showPassword"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="showPassword ? eyeOutline : eyeOffOutline"
              ></ion-icon>
            </ion-button>
          </ion-item>
          <ion-item lines="none">
            <ion-icon slot="start" :icon="lockClosedOutline"></ion-icon>
            <ion-input
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                label-placement="stacked"
                :label="t('authen.newPassword')"
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
            ></ion-input>
            <ion-button
                slot="end"
                fill="clear"
                @click="showPassword = !showPassword"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="showPassword ? eyeOutline : eyeOffOutline"
              ></ion-icon>
            </ion-button>
          </ion-item>
          <ion-item v-if="!isStrong">
            <ion-label class="ion-text-wrap">
              <p class="text-red">
                {{ t('authen.helper2') }}
              </p>
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-icon slot="start" :icon="lockClosedOutline"></ion-icon>
            <ion-input
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                label-placement="stacked"
                :label="t('authen.confirmPassword')"
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
            ></ion-input>
            <ion-button
                slot="end"
                fill="clear"
                @click="showPassword = !showPassword"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="showPassword ? eyeOutline : eyeOffOutline"
              ></ion-icon>
            </ion-button>
          </ion-item>
          <ion-item v-if="!isSamePwd">
            <ion-label class="ion-text-wrap">
              <p class="text-red">
                {{ t('error.passwordNotMatchNew') }}
              </p>
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-button :disabled="!canSubmit" expand="block" @click="onSubmit">
          <ion-icon slot="start" :icon="checkmarkOutline"></ion-icon>
          {{ t('base.submit') }}
        </ion-button>
      </ion-card-content>
    </ion-card>
  </form>
</template>
<script setup lang="ts">
import { useLang } from '@/composables/useLang';
import { useValidation } from '@/composables/useValidation';
import { computed, ref } from 'vue';
import { IonButton, IonCard, IonCardContent, IonIcon, IonInput, IonItem, IonLabel, IonList, } from '@ionic/vue';
import { eyeOffOutline, eyeOutline, lockClosedOutline, shieldOutline, checkmarkOutline } from 'ionicons/icons';
import BaseAlert from '@/components/base/BaseAlert.vue';

interface Props {
  submitLabel?: string
  actionAlign?: 'center' | 'left' | 'right'
  showCurrentPassword?: boolean
  showLogout?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  actionAlign: 'center',
  showCurrentPassword: false,
  showLogout: false,
  submitLabel: undefined
});
const emit = defineEmits<{
  onSubmit: [void]
}>();
const { t } = useLang();
const { validatePasswordStrongV2 } = useValidation();
const showPassword = ref(false);

const currentPassword = defineModel<string>('currentPassword');
const newPassword = defineModel<string>('newPassword');
const logoutAllDevice = defineModel<boolean>('logoutAllDevice');
const loading = defineModel<boolean>('loading');

const confirmPassword = ref('');
const isStrong = computed(() => newPassword.value ? validatePasswordStrongV2(newPassword.value) : false);
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

<style scoped></style>
