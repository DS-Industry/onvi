import React from 'react';

import {TouchableOpacity, StyleSheet} from 'react-native';

import {ChevronLeft} from 'react-native-feather';

import {useNavigation} from '@react-navigation/native';

import {dp} from '@utils/dp';

import useStore from '@state/store';
import {SCREEN_SNAP_POINTS} from '@shared/constants';

import {GeneralBottomSheetNavigationProp} from '@app-types/navigation/BottomSheetNavigation.ts';

interface BackButtonProps {
  callback?: () => void;
  position?: string;
  index?: number;
}

const BackButton = ({
  callback,
  position = '60%',
  index = undefined,
}: BackButtonProps) => {
  const navigation =
    useNavigation<
      GeneralBottomSheetNavigationProp<
        keyof import('@app-types/navigation/BottomSheetNavigation.ts').RootStackParamList
      >
    >();

  const {bottomSheetRef} = useStore.getState();

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => {
        if (callback) {
          return callback();
        }

        // Navigate back first
        navigation.goBack();

        // Then adjust bottom sheet position
        if (bottomSheetRef?.current) {
          if (index !== undefined) {
            // If explicit index is provided, use it
            bottomSheetRef.current.snapToIndex(index);
          } else {
            // Get the current route name after navigation back
            const previousScreen =
              navigation.getState().routes[navigation.getState().index]?.name;

            if (previousScreen) {
              // Check if we have a defined snap point for this screen
              if (SCREEN_SNAP_POINTS[previousScreen] !== undefined) {
                bottomSheetRef.current.snapToIndex(
                  SCREEN_SNAP_POINTS[previousScreen] ?? 1,
                );
              } else if (position) {
                // Fall back to position parameter if no specific index
                bottomSheetRef.current.snapToPosition(position);
              }
            }
          }
        }
      }}>
      <ChevronLeft height={dp(20)} width={dp(20)} stroke={'#000000'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#F5F5F5',
    width: dp(40),
    height: dp(40),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(25),
  },
});

export {BackButton};
