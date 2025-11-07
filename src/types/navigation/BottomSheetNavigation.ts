import {NavigationProp, RouteProp} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

import {Campaign, NewsPost, Price, Tag} from '../api/app/types.ts';
import {IUser} from '../models/User.ts';
import {OrderDetailsType} from 'src/state/order/OrderSlice.ts';
import {DiscountValueType} from '@hooks/usePromoCode.ts';
import {DrawerParamList} from './DrawerNavigation.ts';
import {PaymentMethodType} from '@styled/buttons/PaymentMethodButton/index.js';

export type RootStackParamList = {
  Main: {
    drawerNavigation?: DrawerNavigationProp<DrawerParamList>;
    active?: boolean;
  };
  Search: {};
  Filters: {};
  Business: {};
  BusinessInfo: {
    tags?: Tag[];
  };
  Boxes: {
    active?: boolean;
    boxes?: {
      number: number;
    }[];
    price?: Price[];
    bayType?: string;
  };
  Launch: {
    bayType: string;
    active?: boolean;
  };
  Notifications: {};
  History: {
    drawerNavigation?: DrawerNavigationProp<DrawerParamList>;
    type?: string;
  };
  Payment: {};
  AddCard: {};
  Settings: {};
  Post: {
    data?: NewsPost | null;
  };
  Campaign: {
    data?: Campaign | null;
    token?: string;
  };
  About: {};
  PaymentLoading: {
    user: IUser | null;
    order: OrderDetailsType | null;
    discount: DiscountValueType | null;
    usedPoints: number;
    promoCodeId?: number;
    loadUser?: () => Promise<void>;
    freeOn?: boolean;
    paymentMethod: PaymentMethodType;
  };
  PostPayment: {};
  PostPaymentVacuum: {};
};

export type GeneralBottomSheetNavigationProp<
  T extends keyof RootStackParamList,
> = NavigationProp<RootStackParamList, T>;

export type GeneralBottomSheetRouteProp<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;
