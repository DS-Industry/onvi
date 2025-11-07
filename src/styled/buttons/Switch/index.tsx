import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import {dp} from '../../../utils/dp';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface IOnviSwitch {
  size?: 'medium' | 'small' | 'large';
  switchLeftText?: string | null;
  switchRightText?: string | null;
  shadowProps?: {
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
  };
  onToggle?: (active: boolean) => void;
  backgroundColor?: string;
  position?: string;
  disabled?: boolean;
  overlay?: boolean;
}

const OnviSwitch: React.FC<IOnviSwitch> = ({
  size = 'small',
  switchRightText = null,
  shadowProps = {},
  backgroundColor = '#000000',
  onToggle = () => {},
  position = 'absolute',
}) => {
  const [active, setActive] = useState(false);
  const thumbTranslate = useSharedValue(0);

  // Base styles of the switch
  const calculateBaseStyles = () => {
    let width;
    let height;
    switch (size) {
      case 'small':
        width = dp(45);
        height = dp(20);
        break;
      case 'medium':
        width = dp(53);
        height = dp(24);
        break;
      case 'large':
        width = dp(53);
        height = dp(24);
        break;
      default:
        width = dp(45);
        height = dp(20);
        break;
    }
    // @ts-ignore
    const baseSize = Math.min(width, height);
    return {
      width,
      height,
      borderRadius: baseSize / 2,
    };
  };

  const switchBaseStyles = useMemo(calculateBaseStyles, [size]);

  // Base styles for the thumb
  const calculateThumbBaseStyle = () => {
    const switchBaseStyle = calculateBaseStyles();
    const thumbSize = switchBaseStyle.width / 3;
    return {
      width: dp(thumbSize),
      height: dp(thumbSize),
    };
  };

  const thumbBaseStyle = useMemo(calculateThumbBaseStyle, [size]);

  const {shadowColor, shadowOffset, shadowOpacity, shadowRadius} =
    shadowProps || ({} as any);

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

  const maxThumbTranslate =
    switchBaseStyles.width - switchBaseStyles.width / 2.3;

  useEffect(() => {
    if (active) {
      thumbTranslate.value = maxThumbTranslate;
    } else {
      thumbTranslate.value = 1;
    }
  }, [active, thumbTranslate, maxThumbTranslate]);

  const thumbStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(thumbTranslate.value, {
            mass: 1,
            damping: 15,
            stiffness: 120,
            overshootClamping: false,
            restSpeedThreshold: 0.001,
            restDisplacementThreshold: 0.001,
          }),
        },
      ],
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setActive(!active);
        onToggle(!active);
      }}>
      {/* Switch */}
      <Animated.View>
        {/*overlay && !active && ( // Show grey overlay only when overlay prop is true and the switch is not active
                        <View
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                backgroundColor: 'grey',
                                opacity: 0.7,
                                borderRadius: switchBaseStyles.borderRadius,
                                zIndex: 1,
                            }}
                        />
                    ) */}

        <Animated.View
          style={[
            switchBaseStyles,
            shadowStyles,
            styles.switch,
            {
              backgroundColor,
              position: position as any,
              zIndex: 2,
            },
          ]}>
          <Animated.Image
            source={require('../../../assets/icons/small-icon.png')}
            style={[thumbBaseStyle, thumbStyles]}
          />

          {switchRightText && (
            <Text style={[styles.text]}>{switchRightText}</Text>
          )}
        </Animated.View>

        {/* Right Text */}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  switch: {
    position: 'absolute',
    padding: dp(2),
  },
  text: {},
});

export {OnviSwitch};
