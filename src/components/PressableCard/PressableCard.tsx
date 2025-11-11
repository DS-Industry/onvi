import React, {useRef} from 'react';
import {
  Animated,
  DimensionValue,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface PressableCardProps {
  onPress?: () => void;
  children: React.ReactNode;
  hapticType?: 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy';
  enableHaptic?: boolean;
  enableAnimation?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  backgroundColor?: string;
  padding?: number;
  style?: object;
  unstyled?: boolean;
}

const PressableCard = ({
  onPress,
  children,
  hapticType = 'impactLight',
  enableHaptic = true,
  enableAnimation = true,
  width,
  height,
  borderRadius = 0,
  backgroundColor = '#fff',
  padding = 0,
  style = {},
  unstyled = false,
  ...props
}: PressableCardProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const triggerHaptic = () => {
    if (enableHaptic) {
      ReactNativeHapticFeedback.trigger(hapticType, HapticOptions);
    }
  };

  const pressInAnimation = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const pressOutAnimation = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePress = () => {
    onPress?.();
    triggerHaptic();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={enableAnimation ? pressInAnimation : undefined}
      onPressOut={enableAnimation ? pressOutAnimation : undefined}
      onPress={handlePress}
      delayPressIn={0}
      delayPressOut={0}>
      <Animated.View
        style={[
          {
            width,
            height,
            transform: [{scale: scaleValue}],
          },
          !unstyled && {
            backgroundColor,
            borderRadius,
            padding,
          },
          style,
        ]}>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
  },
});

export default PressableCard;
