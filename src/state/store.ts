import {create, StoreApi} from 'zustand';
import createAppSlice, {AppSlice} from './app/AppSlice.ts';
import createOrderSlice, {OrderSlice} from './order/OrderSlice.ts';
import createPoSSlice, {PosSlice} from './pos/PosSlice.ts';
import createUserSlice, {UserSlice} from './user/UserSlice.ts';

import {
  createJSONStorage,
  devtools,
  persist,
  StateStorage,
} from 'zustand/middleware';
import LocalStorage from '@services/local-storage';
import createCarwashSlice, {CarwashSlice} from './carwash/carwashSlice.ts';

export type StoreState = AppSlice &
  OrderSlice &
  PosSlice &
  UserSlice &
  CarwashSlice;
export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState'],
) => T;

export const ZustandMMKVStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    return LocalStorage.set(name, value);
  },
  getItem: (name: string) => {
    const value = LocalStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return LocalStorage.delete(name);
  },
};

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createAppSlice(set, get),
        ...createUserSlice(set, get),
        ...createPoSSlice(set, get),
        ...createOrderSlice(set, get),
        ...createCarwashSlice(set, get),
      }),
      {
        name: 'store',
        storage: createJSONStorage(() => ZustandMMKVStorage),
        partialize: state => ({
          accessToken: state.accessToken,
          expiredDate: state.expiredDate,
          user: state.user,
          fcmToken: state.fcmToken,
          refreshRetryCounter: state.refreshRetryCounter,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  ),
);

export default useStore;

export const getToken = () => {
  return {
    accessToken: useStore.getState().accessToken,
    expiredDate: useStore.getState().expiredDate,
    mutateRefreshToken: useStore.getState().mutateRefreshToken,
  };
};

export const handleTokenExpiry = async (originalRequest?: {
  headers: Record<string, string>;
  [key: string]: any;
}) => {
  // Call the handleTokenExpiry method from UserSlice which also shows a notification
  const state = useStore.getState();

  if (state.handleTokenExpiry) {
    // Pass the original request to UserSlice.handleTokenExpiry for possible retry
    return await state.handleTokenExpiry(originalRequest);
  } else {
    // Fallback if handleTokenExpiry isn't available
    await state.signOut();
    return false;
  }
};
