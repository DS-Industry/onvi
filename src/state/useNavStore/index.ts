import {create} from 'zustand';

import {ScreenName} from '@app-types/navigation/BottomSheetScreenName.ts';

import useStore from '@state/store.ts';

import {DRAGGABLE_SCREENS} from '@shared/constants/index.ts';

interface NavStore {
  drawerNavigation: any | null;
  setDrawerNavigation: (nav: any) => void;

  currentRouteName: ScreenName;
  setCurrentRouteName: (value: ScreenName) => void;

  isMainScreen: boolean;
  setIsMainScreen: (value: boolean) => void;
}

export const useNavStore = create<NavStore>(set => ({
  drawerNavigation: null,
  setDrawerNavigation: nav => set({drawerNavigation: nav}),

  currentRouteName: 'Main',
  setCurrentRouteName: routeName => {
    set({
      currentRouteName: routeName,
    });

    const draggable = DRAGGABLE_SCREENS[routeName] ?? false;
    useStore.setState({
      isDraggable: draggable,
    });
  },

  isMainScreen: true,
  setIsMainScreen: (value: boolean) =>
    set(state => ({...state, isMainScreen: value})),
}));
