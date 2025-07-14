<script setup lang="ts">
import AppLoginForm from '@/components/app/AppLoginForm.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useLang } from '@/composables/useLang';
import { useTheme } from '@/composables/useTheme';
import { IonCol, IonRow } from '@ionic/vue';

const { t } = useLang();
const { isDark } = useTheme();
</script>
<template>
  <BasePage
    :page-title="t('authen.addProfile')"
    fullscreen
    light
    :content-padding="false"
  >
    <IonRow class="ion-align-items-center q-full-height">
      <IonCol>
        <AppLoginForm verify-duplicate auto-redirect>
          <template #top>
            <ion-row>
              <ion-col class="ion-text-center q-mt-xl">
                <img
                  :src="!isDark ? '/logo/logo-black.png' : '/logo/logo-white.png'"
                  style="width: 150px; height: auto"
                />
              </ion-col>
            </ion-row>
          </template>
        </AppLoginForm>
      </IonCol>
    </IonRow>
  </BasePage>
</template>
<style scoped lang="scss">
.login-holder {
  height: 100vh;
  overflow: auto;
}
</style>
