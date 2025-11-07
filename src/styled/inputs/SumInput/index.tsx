import React from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
  Animated as RNAnimated,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import LinearGradient from 'react-native-linear-gradient';

interface ISumInput {
  width?: number;
  height?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  borderRadius?: number;
  value?: number;
  onChange?: (value: number) => void;
  onComplete?: (value: number) => void;
  inputBackgroundColor?: string;
  shadowProps: {
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    backgroundColor: string;
  };
  disabled?: boolean;
}

const MIN_FILL_HEIGHT = 20; // Minimum fill height in pixels

const SumInput: React.FC<ISumInput> = ({
  width = 200,
  height = 200,
  minValue = 50,
  maxValue = 1000,
  step = 10,
  borderRadius = 1000,
  value: currentValue = minValue, // Set default to minValue
  onChange = () => {},
  onComplete = () => {},
  inputBackgroundColor = '#FFFFFF',
  shadowProps,
  disabled = false,
}) => {
  const calculateBaseStyles = () => ({
    width,
    height,
    borderRadius,
  });
  const circleBaseStyles = React.useMemo(calculateBaseStyles, [
    width,
    height,
    borderRadius,
  ]);

  const {shadowColor, shadowOffset, shadowOpacity, shadowRadius} =
    shadowProps || {};

  const calculateShadowStyles = () => ({
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
  });

  const shadowStyles = React.useMemo(calculateShadowStyles, [
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
  ]);

  const _clamp = (newValue: number, min: number, max: number) => {
    return Math.min(Math.max(newValue, min), max);
  };

  const updateNewValue = (newValue: number) => {
    let valueToUpdate = _clamp(newValue, minValue, maxValue);
    _value.value = valueToUpdate;
    value.setValue(valueToUpdate);
  };

  const _moveStartValue = useSharedValue<number>(0); // Tracking initial value on slider move
  const _value = useSharedValue<number>(currentValue); // Current value of slider
  const _gestureValue = useSharedValue<number>(currentValue); // Gesture-based value for animation
  const value = new RNAnimated.Value(currentValue); // Animated value for legacy RN Animated (if used elsewhere)

  React.useEffect(() => {
    updateNewValue(currentValue);
    _gestureValue.value = currentValue; // Sync gesture value
  }, [currentValue]);

  const _calculateValue = (gestureState: PanResponderGestureState) => {
    const ratio = -gestureState.dy / (height - 100);
    const diff = maxValue - minValue;
    let newValue;

    if (step) {
      newValue = Math.round((ratio * diff) / step) * step;
    } else {
      newValue = ratio * diff;
    }

    const unclampedValue = _moveStartValue.value + newValue;
    const clampedValue = _clamp(unclampedValue, minValue, maxValue);

    // Update the gesture value for animation
    _gestureValue.value = unclampedValue;

    // Return the clamped value for onChange
    return clampedValue;
  };

  // PanResponder handlers
  const onStartShouldSetPanResponder = () => !disabled;
  const onMoveShouldSetPanResponder = () => !disabled;
  const onPanResponderTerminationRequest = () => false;
  const onPanResponderGrant = () => {
    _moveStartValue.value = _value.value;
  };
  const onPanResponderMove = (
    _event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    const clampedValue = _calculateValue(gestureState);
    onChange(clampedValue);
  };
  const onPanResponderRelease = (
    _event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    const clampedValue = _calculateValue(gestureState);
    onChange(clampedValue);
  };
  const onPanResponderTerminate = (
    _event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    const clampedValue = _calculateValue(gestureState);
    onComplete(clampedValue);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder,
      onMoveShouldSetPanResponder,
      onPanResponderTerminationRequest,
      onPanResponderGrant,
      onPanResponderMove,
      onPanResponderRelease,
      onPanResponderTerminate,
    }),
  ).current;

  const sliderStyle = useAnimatedStyle(() => {
    // Calculate the ratio based on gesture value
    const effectiveValue = disabled ? maxValue : _gestureValue.value;

    // Calculate the ratio
    const ratio = (effectiveValue - minValue) / (maxValue - minValue);

    // Clamp the ratio to [0, 1]
    const clampedRatio = Math.min(Math.max(ratio, 0), 1);

    // Calculate raw height based on the ratio
    const rawHeight = clampedRatio * height;

    // Incorporate the minimal fill height
    const fillHeight =
      MIN_FILL_HEIGHT + (rawHeight / height) * (height - MIN_FILL_HEIGHT);

    // Define over-drag limit (e.g., 20% of the height)
    const overDragLimit = height * 0.2;

    // Clamp the fillHeight to allow over-drag up to the limit
    const animatedHeight = withSpring(
      Math.min(fillHeight, height + overDragLimit),
      {
        damping: 20,
        stiffness: 90,
        overshootClamping: false, // Allow overshooting for over-drag
        restSpeedThreshold: 0.1,
        restDisplacementThreshold: 0.1,
      },
    );

    return {
      height: animatedHeight,
      aspectRatio: 1,
    };
  });

  return (
    <View style={[circleBaseStyles, shadowStyles, {backgroundColor: '#FFF'}]}>
      <View
        style={[
          styles.container,
          circleBaseStyles,
          {backgroundColor: inputBackgroundColor},
        ]}
        {...(!disabled ? panResponder.panHandlers : {})}>
        <Animated.View
          style={[
            {
              width: width,
              height: height,
            },
            styles.circle,
            sliderStyle,
          ]}>
          <LinearGradient
            colors={['#0B68E1', '#FFFFFF']}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={[{width: '100%', height: '100%', opacity: 0.9}]}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 0,
  },
  anim: {},
});
export {SumInput};
/*
****Lottie animation option*******
<Lottie source={require('../../../assets/lottie/RbBhBl8Jeb.json')}
                                style={[
                                    circleBaseStyles,

                                ]}
                                autoPlay
                                loop
                    />
 */
/*
    ***Initial animation style to calculate the price******
       const sliderStyle = useAnimatedStyle(
     () => ({

         height: ((_value.value - minValue) * height) / (maxValue - minValue),
     }),
     [_value]
  */
