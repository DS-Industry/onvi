import React from 'react';

import {TouchableOpacity, StyleSheet, View, Platform} from 'react-native';

// Navigation
import {useNavigation} from '@react-navigation/native';
import {dp} from '@utils/dp';
import {Menu} from 'react-native-feather';
import {ArrowLeft} from 'react-native-feather';

import {navigationRef} from '@navigators/BottomSheetStack';

import useStore from '@state/store';
import {SNAP_POINTS, SCREEN_SNAP_POINTS} from '@shared/constants';

interface BurgerProps {
  isDrawerStack?: boolean;
  handleSheetChanges?: (index: number) => void;
}

import {GeneralDrawerNavigationProp} from '@app-types/navigation/DrawerNavigation.ts';
import {DRAGGABLE_SCREENS} from '@shared/constants';
import {RootStackParamList} from '@app-types/navigation/BottomSheetNavigation';
import {useNavStore} from '@state/useNavStore';

const BurgerButton = ({
  isDrawerStack = false,
  handleSheetChanges,
}: BurgerProps) => {
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Промокоды'>>();

  const {showBurgerButton, bottomSheetRef} = useStore();

  const {isMainScreen} = useNavStore();

  if (!showBurgerButton) {
    return <></>;
  }

  if (isDrawerStack) {
    return (
      <View
        style={[
          styles.headerContainer,
          Platform.OS === 'android' && styles.androidShadow,
          Platform.OS === 'ios' && styles.iosShadow,
        ]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          {/* Your custom burger icon here */}
          <Menu stroke={'#000'} />
        </TouchableOpacity>
      </View>
    );
  }

  if (isMainScreen || isMainScreen === undefined) {
    return (
      <TouchableOpacity
        style={[
          {...styles.button},
          Platform.OS === 'android' && styles.androidShadow,
          Platform.OS === 'ios' && styles.iosShadow,
        ]}
        onPress={() => navigation.toggleDrawer()}>
        <Menu stroke={'#000'} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        {...styles.button},
        Platform.OS === 'android' && styles.androidShadow,
        Platform.OS === 'ios' && styles.iosShadow,
      ]}
      onPress={() => {
        navigationRef.current?.goBack();
        // Get the current route after navigation
        const currentRouteName = navigationRef.current?.getCurrentRoute()
          ?.name as keyof RootStackParamList;

        if (!currentRouteName || !bottomSheetRef?.current) {
          return;
        }

        // If a specific handler is provided for BusinessInfo (legacy support)
        if (currentRouteName === 'BusinessInfo' && handleSheetChanges) {
          handleSheetChanges(SNAP_POINTS.EXPANDED);
          return;
        }

        // Use the screen-specific snap point if defined, otherwise use DRAGGABLE_SCREENS logic
        if (SCREEN_SNAP_POINTS[currentRouteName] !== undefined) {
          // Use screen-specific snap point from our constants
          bottomSheetRef.current.snapToIndex(
            SCREEN_SNAP_POINTS[currentRouteName] ?? 1,
          );
        } else {
          // Fall back to previous DRAGGABLE_SCREENS logic for backward compatibility
          const index = DRAGGABLE_SCREENS[
            currentRouteName as keyof typeof DRAGGABLE_SCREENS
          ]
            ? SNAP_POINTS.HALF_EXPANDED
            : SNAP_POINTS.EXPANDED;
          bottomSheetRef.current.snapToIndex(index);
        }
      }}>
      <ArrowLeft stroke={'#000'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: dp(40),
    width: dp(40),
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: dp(16),
    left: dp(16),
    borderRadius: 25,
    padding: 5,
    shadowColor: '#494949',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'FFFFFF',
  },
  line: {
    width: dp(17),
    height: dp(2),
    backgroundColor: 'black',
    margin: 2.5,
    color: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: dp(40),
    width: dp(40),
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 5,
    shadowColor: '#494949',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    justifyContent: 'center',
  },
  androidShadow: {
    elevation: 4, // Add elevation for Android shadow
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export {BurgerButton};
