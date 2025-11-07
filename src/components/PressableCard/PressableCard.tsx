import React, {useRef} from 'react';
import {Animated, DimensionValue, TouchableWithoutFeedback} from 'react-native';
import {Card, CardProps} from 'tamagui';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface PressableCardProps extends CardProps {
  onPress?: () => void;
  children: React.ReactNode;
  hapticType?: 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy';
  enableHaptic?: boolean;
  enableAnimation?: boolean;
}

const PressableCard = ({
  onPress,
  children,
  hapticType = 'impactLight',
  enableHaptic = true,
  enableAnimation = true,
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
        style={{
          width: props.width as DimensionValue,
          transform: [{scale: scaleValue}],
        }}>
        <Card
          style={{
            width: '100%',
          }}
          {...props}>
          {children}
        </Card>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default PressableCard;
