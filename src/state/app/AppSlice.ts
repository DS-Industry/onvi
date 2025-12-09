import {StoreSlice} from '../store.ts';
import {SelectedFilters} from '@components/BottomSheetViews/Filters/index.tsx';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {CameraReference} from '@components/Map';
import {RefObject} from 'react';

export interface IUserLocation {
  latitude: number;
  longitude: number;
}

export interface AppSlice {
  filters: SelectedFilters;
  setFilters: (values: SelectedFilters) => void;
  news: any[];
  setNews: (values: any[]) => void;
  partners: any[];
  setPartners: (values: any[]) => void;
  showBurgerButton: boolean;
  setShowBurgerButton: (value: boolean) => void;
  bottomSheetPosition: any;
  setBottomSheetPosition: (value: any) => void;
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (value: boolean) => void;
  location?: IUserLocation;
  setLocation: (value: IUserLocation) => void;
  bottomSheetRef: React.RefObject<BottomSheetMethods> | null;
  setBottomSheetRef: (
    value: React.RefObject<BottomSheetMethods> | null,
  ) => void;
  // Global snap points configuration
  bottomSheetSnapPoints: string[];
  setBottomSheetSnapPoints: (snapPoints: string[]) => void;
  isDraggable: boolean;
  setDraggable: (value: boolean) => void;

  cameraRef: RefObject<CameraReference> | null;
  setCameraRef: (value: RefObject<CameraReference>) => void;
  
  isPaymentModalOpen: boolean;
  setPaymentModalOpen: (open: boolean) => void;
  paymentModalRef: React.RefObject<BottomSheetModal> | null;
  setPaymentModalRef: (ref: React.RefObject<BottomSheetModal>) => void;
}

const createAppSlice: StoreSlice<AppSlice> = (set, get) => ({
  bottomSheetRef: null,
  setBottomSheetRef: value => set({bottomSheetRef: value}),
  filters: {},
  setFilters: (values: SelectedFilters) =>
    set(state => ({...state, filters: values})),
  news: [],
  setNews: (values: any[]) => set(state => ({...state, news: values})),
  partners: [],
  setPartners: (values: any[]) => set(state => ({...state, partners: values})),

  bottomSheetPosition: null,
  setBottomSheetPosition: (value: any) =>
    set(state => ({...state, bottomSheetPosition: value})),
  isBottomSheetOpen: false,
  setIsBottomSheetOpen: (value: boolean) =>
    set(state => ({...state, isBottomSheetOpen: value})),
  location: undefined,
  setLocation: (value: IUserLocation) =>
    set(state => ({...state, location: value})),
  showBurgerButton: true,
  setShowBurgerButton: (value: boolean) =>
    set(state => ({...state, showBurgerButton: value})),
  // Default snap points (will be updated by Home screen)
  bottomSheetSnapPoints: ['35%', '50%'],
  setBottomSheetSnapPoints: (snapPoints: string[]) =>
    set(state => ({...state, bottomSheetSnapPoints: snapPoints})),
  isDraggable: true,
  setDraggable: isDraggable => set({isDraggable}),

  cameraRef: null,
  setCameraRef: value =>
    set({
      cameraRef: value,
    }),
    
  isPaymentModalOpen: false,
  setPaymentModalOpen: (open: boolean) => {
    if (open) {
      get().paymentModalRef?.current?.present();
    } else {
      get().paymentModalRef?.current?.dismiss();
    }
    set({ isPaymentModalOpen: open });
  },
  
  paymentModalRef: null,
  setPaymentModalRef: (ref) => set({ paymentModalRef: ref }),
});

export default createAppSlice;
