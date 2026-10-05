<script setup lang="ts">
import AppLoginForm from '@/components/app/AppLoginForm.vue';
import AppModeDetect from '@/components/app/AppModeDetect.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseImage from '@/components/base/BaseImage.vue';
import BaseSpinner from '@/components/base/BaseSpinner.vue';
import { useAppStorage } from '@/composables/useAppStorage';
import { useAuthen } from '@/composables/useAuthen';
import { useConfig } from '@/composables/useConfig';
import { useLang } from '@/composables/useLang';
import { useNotification } from '@/composables/useNotification';
import { useTheme } from '@/composables/useTheme';
import { DefaultColor } from '@/libs/constant';
import { useDateFns } from '@/composables/useDateFns';
import { IonContent, IonPage } from '@ionic/vue';
import { contrastOutline, globeOutline } from 'ionicons/icons';
import { onBeforeUnmount, onMounted, ref } from 'vue';
const { getYearNow } = useDateFns();
const {
  setStatusBarColor,
  Style: StatusStyle,
  setDefaultStatusBar,
} = useTheme();
const { userSubscribeFcm } = useNotification();
const { getEnv } = useConfig();
const { destroyAuthDataAndRedirect } = useAuthen();
const { t, currenLocaleItem } = useLang();
const { getCurrentUserToken } = useAppStorage();
const userVersion = ref(getEnv<string>('VITE_APP_VERSION'));
const pageTimeout = ref<any>();
const initialized = ref(false);
onBeforeUnmount(() => {
  setDefaultStatusBar();
});
onMounted(async () => {
  await validateIsLogedIn();
  await userSubscribeFcm(false);
  // Match the aurora: the theme primary from variables.scss, constant as fallback
  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-color-primary')
    .trim();
  await setStatusBarColor(primary || DefaultColor, StatusStyle.Dark);
});
const validateIsLogedIn = async () => {
  const currentToken = await getCurrentUserToken();
  if (currentToken && currentToken.authenticationToken) {
    window.location.replace('/tabs/home');
  } else {
    await destroyAuthDataAndRedirect(false);
  }

  return new Promise((resolve) => {
    pageTimeout.value = setTimeout(() => {
      initialized.value = true;
      resolve(true);
    }, 100);
  });
};
onBeforeUnmount(() => {
  setDefaultStatusBar();
  if (pageTimeout.value) {
    clearTimeout(pageTimeout.value);
  }
});
</script>
<template>
  <ion-page class="login-page">
    <ion-content fullscreen scroll-y class="login-content">
      <!-- Decorative aurora: slow brand-colour orbs + film grain -->
      <div class="login-aurora" aria-hidden="true">
        <span class="login-orb login-orb-1" />
        <span class="login-orb login-orb-2" />
        <span class="login-orb login-orb-3" />
        <span class="login-grain" />
      </div>

      <div v-if="initialized" class="login-shell">
        <nav class="login-topbar app-enter">
          <BaseButton
            clear
            round
            icon-only
            class="login-glass-btn"
            to="/settings/appearance"
            :aria-label="t('base.appearance')"
            :icon="{ name: contrastOutline, iconSet: 'ion' }"
          />
          <BaseButton
            clear
            class="login-glass-btn login-lang"
            to="/settings/languge"
            :aria-label="t('base.language')"
          >
            <BaseIcon
              slot="start"
              :name="globeOutline"
              icon-set="ion"
              :size="16"
              style="top: 0"
            />
            {{ currenLocaleItem?.name }}
          </BaseButton>
        </nav>

        <header class="login-brand app-enter" style="--app-enter-index: 1">
          <span class="login-mark">
            <BaseImage
              class="login-logo"
              src="/logo/logo-white.png"
              :alt="t('app.name')"
              ratio="16/9"
              fit="contain"
            />
          </span>
          <p class="login-brand-name">{{ t('app.name') }}</p>
        </header>

        <main class="login-card app-enter" style="--app-enter-index: 2">
          <AppLoginForm :show-language="false">
            <template #top>
              <div class="login-heading">
                <h1>{{ t('authen.welcomeBack') }}</h1>
                <p>{{ t('authen.loginSubtitle') }}</p>
              </div>
            </template>
          </AppLoginForm>
        </main>

        <footer class="login-footer app-enter" style="--app-enter-index: 3">
          <p>{{ t('app.appVersion', [userVersion]) }}</p>
          <p>{{ `© ${getYearNow()} ${t('app.monogram')}` }}</p>
          <app-mode-detect class="q-mt-sm" />
        </footer>
      </div>
      <div v-else class="login-wait" role="status">
        <BaseSpinner color="light" />
        <p>{{ t('base.pleaseWait') }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>
<style scoped lang="scss">
/*
 * Signature screen: brand aurora in both themes, glass chrome on top and a
 * solid (readable) form card. Colours come from palette/theme tokens.
 */
.login-content {
  --background: color-mix(in srgb, var(--ion-color-primary) 20%, var(--color-black));
}
.login-aurora {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(120% 70% at 50% 0%, var(--ion-color-primary) 0%, transparent 70%),
    linear-gradient(180deg,
      color-mix(in srgb, var(--ion-color-primary) 55%, var(--color-black)) 0%,
      color-mix(in srgb, var(--ion-color-primary) 20%, var(--color-black)) 75%);
}
.login-orb {
  position: absolute;
  border-radius: 50%;
  opacity: 0.75;
  will-change: transform;
  animation: login-drift 22s ease-in-out infinite alternate;
}
.login-orb-1 {
  top: -18%;
  left: -25%;
  width: 90vmax;
  height: 90vmax;
  background: radial-gradient(circle, color-mix(in srgb, var(--ion-color-primary-tint) 60%, var(--color-white)) 0%, transparent 60%);
}
.login-orb-2 {
  top: -10%;
  right: -35%;
  width: 80vmax;
  height: 80vmax;
  background: radial-gradient(circle, color-mix(in srgb, var(--ion-color-primary) 75%, transparent) 0%, transparent 60%);
  animation-duration: 28s;
  animation-direction: alternate-reverse;
}
.login-orb-3 {
  top: 30%;
  left: 10%;
  width: 70vmax;
  height: 70vmax;
  background: radial-gradient(circle, color-mix(in srgb, var(--ion-color-primary-shade) 60%, transparent) 0%, transparent 60%);
  animation-duration: 34s;
}
/* Static SVG noise keeps the gradient from banding and adds texture */
.login-grain {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
@keyframes login-drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(8%, 6%, 0) scale(1.12);
  }
}

.login-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: calc(12px + var(--ion-safe-area-top, 0px)) 16px
    calc(20px + var(--ion-safe-area-bottom, 0px));
}

.login-topbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.login-glass-btn {
  height: 40px;
  margin: 0;
  --color: var(--color-white);
  --background: color-mix(in srgb, var(--color-white) 14%, transparent);
  --background-hover: color-mix(in srgb, var(--color-white) 22%, transparent);
  --background-activated: color-mix(in srgb, var(--color-white) 26%, transparent);
  --border-radius: var(--app-radius-full);
  border: 0.5px solid color-mix(in srgb, var(--color-white) 28%, transparent);
  border-radius: var(--app-radius-full);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
}
.login-glass-btn:not(.login-lang) {
  width: 40px;
}
.login-lang {
  --padding-start: 14px;
  --padding-end: 16px;
  font-size: 0.875rem;
}

.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 40px 0 32px;
  color: var(--color-white);
}
/* Logo in a glass squircle with a specular top edge */
.login-mark {
  display: grid;
  place-items: center;
  width: 88px;
  height: 88px;
  border-radius: 28px;
  border: 0.5px solid color-mix(in srgb, var(--color-white) 40%, transparent);
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--color-white) 30%, transparent) 0%,
    color-mix(in srgb, var(--color-white) 8%, transparent) 100%
  );
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--color-white) 60%, transparent),
    0 20px 40px -12px color-mix(in srgb, var(--color-black) 45%, transparent);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}
.login-logo {
  width: 56px;
}
.login-brand-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  opacity: 0.9;
}

.login-card {
  padding: 28px 22px 22px;
  border-radius: 32px;
  border: 0.5px solid var(--app-glass-border);
  background: color-mix(in srgb, var(--app-bg-surface) 94%, transparent);
  box-shadow:
    var(--app-glass-highlight),
    0 30px 60px -20px color-mix(in srgb, var(--color-black) 50%, transparent);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
}
.login-heading {
  margin-bottom: 4px;

  h1 {
    margin: 0;
    color: var(--app-text-strong);
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }
  p {
    margin: 6px 0 0;
    color: var(--app-text-muted);
    font-size: 0.9375rem;
  }
}

.login-footer {
  display: grid;
  gap: 2px;
  justify-items: center;
  margin-top: auto;
  padding-top: 28px;
  color: color-mix(in srgb, var(--color-white) 70%, transparent);
  font-size: 0.75rem;

  p {
    margin: 0;
  }
}

.login-wait {
  position: relative;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  min-height: 100%;
  color: var(--color-white);
}

@media (min-height: 760px) {
  .login-brand {
    padding-top: 56px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .login-orb {
    animation: none;
  }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .login-glass-btn,
  .login-mark,
  .login-card {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  .login-card {
    background: var(--app-bg-surface);
  }
}
</style>
