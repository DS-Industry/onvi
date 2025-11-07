import {StoreSlice} from '../store.ts';
import {CarWashLocation, Price} from '../../types/api/app/types.ts';

export enum OrderStatus {
  Created = 'created', // New status for when an order is created
  Pending = 'pending', // Order is waiting for some action
  InProgress = 'in_progress', // Order is currently being handled
  InPayment = 'in_payment',
  Completed = 'completed', // Order is finalized
  Cancelled = 'cancelled', // Order has been cancelled
}

export type OrderDetailsType = {
  posId?: null | number;
  sum: number;
  bayNumber?: number | null;
  promoCodeId?: number | null;
  rewardPointsUsed?: null | number;
  type?: null | string;
  name?: null | string;
  prices?: Price[];
  order?: number | null;
  orderDate?: string | null;
  carwashIndex?: number;
  status?: OrderStatus; // New field for order status
  free?: boolean;
  bayType?: string | null;
};

export interface OrderSlice {
  name: string;
  setName: (name: string) => void;
  sum: number;
  setSum: (sum: number) => void;
  orderDetails: OrderDetailsType;
  setOrderDetails: (orderDetails: OrderDetailsType) => void;
  business: (CarWashLocation & {close?: boolean}) | null;
  setBusiness: (value: (CarWashLocation & {close?: boolean}) | null) => void;
  resetOrder: () => void;
}

const createOrderSlice: StoreSlice<OrderSlice> = set => ({
  name: '',
  setName: (name: string) => set(state => ({...state, name})),

  sum: 0,
  setSum: (sum: number) => set(state => ({...state, sum})),

  orderDetails: {
    posId: 0,
    sum: 0,
    bayNumber: null,
    promoCodeId: null,
    rewardPointsUsed: null,
    type: null,
    name: null,
    prices: [],
    order: null,
    orderDate: null,
    status: OrderStatus.Created,
    free: false,
    bayType: '',
  },
  setOrderDetails: (orderDetails: OrderDetailsType) =>
    set(state => ({
      ...state,
      orderDetails,
    })),
  business: null,
  setBusiness: (value: (CarWashLocation & {close?: boolean}) | null) =>
    set(state => ({...state, business: value})),
  resetOrder: () =>
    set(state => ({
      ...state,
      orderDetails: {
        posId: 0,
        sum: 0,
        bayNumber: null,
        promoCodeId: null,
        rewardPointsUsed: null,
        type: null,
        name: null,
        prices: [],
        order: null,
        orderDate: null,
        status: OrderStatus.Created,
        free: false,
        bayType: '',
      },
    })),
});

export default createOrderSlice;
