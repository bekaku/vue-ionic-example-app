import { useAuthenStore } from '@/stores/AuthenStore';
import type {
  IMenuItem
} from '@/types/Models';
import {
  personOutline,
  searchOutline
} from 'ionicons/icons';
import { useLang } from './UseLang';

export const useConstant = () => {
  const { t } = useLang();
  const ssIconSize = 42;
  const iconSize = 24;
  const primaryColor = '#3880ff';
  const primaryColorText = 'text-primary';
  const authenStore = useAuthenStore();
  const myMenuItems: IMenuItem[] = [
    {
      title: 'base.yourProfile',
      i18n: true,
      iconType: 'ion',
      icon: personOutline,
      link: `/user/view/${authenStore.auth?.id}`,
      itemDetail: true,
      iconSize: undefined
    },
    {
      title: 'base.search',
      i18n: true,
      icon: searchOutline,
      iconType: 'ion',
      link: '/search',
      itemDetail: true,
      iconSize: undefined
    },
  ];

  return {
    myMenuItems,
  };
};
