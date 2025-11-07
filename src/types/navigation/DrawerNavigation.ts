import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Partner} from '../api/app/types';
import {IPersonalPromotion} from '../models/PersonalPromotion';
import {IGlobalPromotion} from '../models/GlobalPromotion';

export type DrawerParamList = {
  Главная: undefined; // No params needed for Home
  Промокоды: undefined; // No params needed for Promos
  Партнеры: undefined; // No params needed for Partners
  Настройки: undefined; // No params needed for Settings
  Избранное: undefined;
  'О приложении': undefined; // No params needed for About
  Партнер: {data: Partner}; // Example of params needed for Partner
  'Ввод Промокода': {
    promocode: IPersonalPromotion | IGlobalPromotion;
    type: 'personal' | 'global';
  }; // No params needed for PromosInput
  'Правовые документы': undefined; // No params needed for Legals
  'Перенести баланс': undefined;
};

export type GeneralDrawerNavigationProp<T extends keyof DrawerParamList> =
  DrawerNavigationProp<DrawerParamList, T>;

export type DrawerNavProp = DrawerNavigationProp<DrawerParamList>;
