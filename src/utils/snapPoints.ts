import {Platform, Dimensions} from 'react-native';
import {dp} from './dp';
import {useMemo} from 'react';

/**
 * Hook that calculates consistent snap points across the app
 * Ensures the bottom sheet behaves consistently in all screens
 * and respects the FindMe button visibility
 */
export const useSnapPoints = () => {
  // Calculate dynamic snap points based on screen size
  return useMemo(() => {
    const screenHeight = Dimensions.get('window').height;

    // Calculate safe area for keeping buttons visible
    const safeAreaTop = Platform.OS === 'ios' ? dp(44) : dp(24);
    const buttonHeight = dp(40);
    const extraSafetyMargin = dp(0); // Add extra margin for safety
    const minVisibleTop = safeAreaTop + buttonHeight + extraSafetyMargin;

    // Calculate the maximum height as percentage of screen
    // This ensures the bottom sheet can't cover the FindMe button
    const maxHeightPercent = Math.floor(
      ((screenHeight - minVisibleTop) / screenHeight) * 100,
    );

    // First snap point is lower, second one is higher but limited to not cover the button
    return ['35%', '55%', `${maxHeightPercent}%`];
  }, []);
};

/**
 * Default maximum index for snap points
 * Use this to make sure we never go beyond available snap points
 */
export const MAX_SNAP_INDEX = 1;
