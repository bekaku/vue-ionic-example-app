import { useRoute, useRouter } from 'vue-router';
import {
  toastController,
  alertController,
  loadingController,
  useIonRouter
} from '@ionic/vue';
import {
  formatDateTime,
  formatDate,
  formatDistanceFromNow,
  FORMAT_DATE,
  FORMAT_DATE17
} from '@/utils/DateUtil';
import {
  AppToastOptions,
  AppAlertOptions,
  GenerateLinkType
} from '@/types/Common';
import { useLangugeAndThemeStore } from '@/stores/LangugeAndThemeStore';
import { Clipboard } from '@capacitor/clipboard';
import sanitizeHtml from 'sanitize-html';
import { useLang } from './UseLang';
import { useConfig } from './UseConfig';
import { computed } from 'vue';
import {UserProfileDto} from "@/types/Models";
export const useBase = () => {
  const langugeAndThemeStore = useLangugeAndThemeStore();
  const router = useIonRouter();
  const route = useRoute();
  const routerVue = useRouter();
  const { t, locale } = useLang();
  const { getConfigPublic } = useConfig();
  const isDark = computed(() => langugeAndThemeStore.isDark);
  const getCurrentPath = (fullPath = true) => {
    return fullPath ? route.fullPath : route.path;
  };
  const getPreviousPath = () => {
    return routerVue.options.history.state.back;
  };
  const onBack = () => {
    router.back();
  };
  const onReplaceUrl = (url: string = '') => {
    history.pushState({}, '', url);
  };
  const WeeGoTo = (link: string, replace?: boolean): void => {
    if (!link) {
      return;
    }
    if (!replace) {
      // router.push({ path: link });
      router.push(link);
    } else {
      // router.replace({ path: link });
      router.replace(link);
    }
  };
  const getParam = (field: string): any => {
    if (!field) {
      return;
    }
    return route.params ? route.params[field] : null;
  };
  const getQuery = (field: string): any => {
    if (!field) {
      return;
    }
    return route.query ? route.query[field] : null;
  };
  const getParamType = <T>(key: string): T => {
    const val = getParam(key);
    return val as unknown as T;
  };
  const getParamNumber = (att: string): number => {
    const val = getParam(att);
    return val != undefined ? +val : 0;
  };
  const getQueryNumber = (att: string): number => {
    const val = getQuery(att);
    return val != undefined ? +val : 0;
  };
  const getQueryType = <T>(key: string): T => {
    const val = getQuery(key);
    return val as unknown as T;
  };
  const getIonContent = () => {
    return document.querySelector('ion-content');
  };
  const WeeScrollToBottom = () => {
    const content = getIonContent();
    if (!content) {
      return;
    }
    content.scrollToBottom(500);
  };
  const WeeScrollToTop = () => {
    const content = getIonContent();
    if (!content) {
      return;
    }
    content.scrollToTop(500);
  };
  /*
   WeeToast({
    headerText: 'Title',
    text: 'Test app toast message! <br><strong>Beka</strong>',
    icon: colorPaletteOutline,
    color: 'danger',
    closeIcon: closeOutline,
    time:3000
  });
  */
  const WeeToast = async (options: AppToastOptions) => {
    const toast = await toastController.create({
      header: options.headerText || '',
      message: options.text,
      duration: options.time != undefined ? options.time : 5 * 1000,
      position: options.toastPosition || 'bottom',
      icon: options.icon || undefined,
      color: options.color || undefined,
      mode: 'ios',
      buttons: [
        {
          icon: options.closeIcon || undefined,
          side: 'end',
          text: !options.closeIcon ? t('base.close') : undefined
        }
      ]
    });
    return toast.present();
  };

  /**
   *
   * @param confirmHeader
   * @param text
   * @returns
   *   const confirm = await WeeConfirm(
        t("app.monogram"),
        t("base.deleteConfirm")
      );
   */
  const WeeConfirm = async (
    confirmHeader: string,
    text: string,
    cancelText: string | undefined = undefined,
    okayText: string | undefined = undefined
  ) => {
    return new Promise((resolve) => {
      alertController
        .create({
          header: confirmHeader,
          message: text, //Message <strong>text</strong>!!!
          buttons: [
            {
              text: cancelText ? cancelText : t('base.cancel'),
              cssClass: 'text-muted',
              handler: () => resolve(false)
            },
            {
              text: okayText ? okayText : t('base.submit'),
              handler: () => resolve(true)
            }
          ]
        })
        .then((alert) => {
          alert.present();
        });
    });
  };

  /*
   alertMessage: string | undefined,
    alertHeader: string | undefined,
    type: string | undefined = undefined //wee-alert-danger, wee-alert-warning
  */
  const WeeAlert = async (options: AppAlertOptions) => {
    const alert = await alertController.create({
      cssClass: options.type ? `wee-alert-${options.type}` : undefined,
      header: options.header || t('app.monogram'),
      subHeader: options.subHeader || undefined,
      message: options.text,
      buttons: [t('base.okay')]
    });
    return alert.present();
  };

  /**
   *
   * @param text
   * @param spinnerType
   * @returns
   *  const loading : any = await WeeLoading();
      loading.present();
      loading.dismiss();
   */
  const WeeLoading = async (text?: string, spinnerType?: any) => {
    const loading = await loadingController.create({
      cssClass: 'my-custom-class',
      message: text ? text : t('base.pleaseWait'),
      // duration: 3000,
      spinner: spinnerType ? spinnerType : 'lines' //bubbles" | "circles" | "circular" | "crescent" | "dots" | "lines" | "lines-small" | null | undefined
    });
    return new Promise((resolve) => {
      resolve(loading);
    });
  };
  const AppFormatDateTime = (d: string, fmt: string = FORMAT_DATE17) => {
    return d ? formatDateTime(d, fmt, locale.value) : '';
  };
  const AppFormatDate = (d: string, fmt: string = FORMAT_DATE) => {
    return formatDate(d, fmt, locale.value);
  };
  const AppFormatDateDistance = (d: string) => {
    return formatDistanceFromNow(d, locale.value);
  };

  /**
   * <div ref="bottomSection"></div>
   * scrollToTop(bottomSection.value);
   * @param el
   */
  const scrollToTop = (el: Element) => {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const readableNumber = (num: number, digits: number) => {
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'k' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item
      ? (num / item.value).toFixed(digits).replace(rx, '$1') +
      (item.symbol ? t('readableNum.' + item.symbol) : '')
      : '0';
  };
  /**
   * onOpenProfile($event, post.user.id)
   * @param event
   * @param userId
   */
  const onOpenProfile = (event: any, userId: number | null | undefined) => {
    if (userId) {
      WeeGoTo(`/user/view/${userId}`);
    }
    if (event) {
      event.stopImmediatePropagation();
    }
  };
  const writeToClipboard = async (text: string) => {
    await Clipboard.write({
      string: text
    });
    WeeToast({
      text: t('success.copy')
    });
  };
  const generateWebLink = (params: string, type: GenerateLinkType) => {
    let appUrl = getConfigPublic('webAppUrl');
    if (type == 'post') {
      appUrl += `/post/view/${params}`;
    }
    return appUrl;
  };
  const inputSanitizeHtml = (str: string) => {
    return sanitizeHtml(str);
  };
  return {
    WeeGoTo,
    getParam,
    getQuery,
    getParamNumber,
    getQueryNumber,
    getIonContent,
    WeeScrollToBottom,
    WeeScrollToTop,
    WeeToast,
    WeeConfirm,
    WeeAlert,
    WeeLoading,
    onBack,
    scrollToTop,
    AppFormatDateTime,
    AppFormatDate,
    AppFormatDateDistance,
    getCurrentPath,
    onReplaceUrl,
    readableNumber,
    isDark,
    onOpenProfile,
    writeToClipboard,
    generateWebLink,
    inputSanitizeHtml,
    getParamType,
    getQueryType,
    getPreviousPath,
  };
};
