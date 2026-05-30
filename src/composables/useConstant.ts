import { useAuthenStore } from '@/stores/authenStore';
import type {
  IMenuItem
} from '@/types/models';
import {
  personOutline,
  searchOutline
} from 'ionicons/icons';

export const useConstant = () => {
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
