import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
  PixelRatio,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-feather';
import {dp} from '../../utils/dp';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useStore from '@state/store';

interface FindMeButtonProps {
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
}

const BUTTON_SIZE = dp(40);
const BUTTON_MARGIN = dp(30);

const FindMeButton = ({animatedPosition}: FindMeButtonProps) => {
  const {height: SCREEN_HEIGHT} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const {cameraRef} = useStore.getState();

  // Get the device's pixel ratio
  const pixelRatio = PixelRatio.get();
  const exactDpi = pixelRatio * 160;
  // Create the animated style for the button
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const sheetTopPosition = animatedPosition.value;
    // Apply specific adjustments for problematic DPI range
    let dpiAdjustment = 1.0;
    if (exactDpi >= 400 && exactDpi < 430) {
      // Specifically target around 420dpi
      dpiAdjustment = 1.75; // Larger adjustment for the problematic range
    } else if (exactDpi >= 380 && exactDpi < 450) {
      // Slightly wider range
      dpiAdjustment = 1.5; // Moderate adjustment
    }

    const adjustedMargin = BUTTON_MARGIN * dpiAdjustment;
    const bottomPosition = SCREEN_HEIGHT - sheetTopPosition + adjustedMargin;

    // Make sure the button doesn't go below safe area
    const minBottom = Platform.OS === 'ios' ? insets.bottom + 10 : 20;
    const safeBottomPosition = Math.max(minBottom, bottomPosition);

    return {
      bottom: safeBottomPosition,
    };
  });

  const opacityAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedPosition.value,
      [200, 300], // When position is between 200-400, fade out
      [0, 1], // From fully visible to invisible - fixed direction
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.findMeContainer,
        containerAnimatedStyle,
        opacityAnimatedStyle,
      ]}>
      <TouchableOpacity
        style={styles.findMe}
        onPress={() => {
          cameraRef?.current?.setCameraPosition({
            animationDuration: 1000,
          });
        }}>
        <Navigation fill="white" color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  findMeContainer: {
    position: 'absolute',
    right: dp(20),
    zIndex: 999, // Ensure it's above the bottom sheet
    borderRadius: 50,
    // Add shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: '#fff',
      },
      android: {
        elevation: 5,
      },
    }),
  },
  findMe: {
    height: BUTTON_SIZE,
    width: BUTTON_SIZE,
    backgroundColor: '#000',
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // Add platform-specific styling
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
  },
});

export default FindMeButton;
