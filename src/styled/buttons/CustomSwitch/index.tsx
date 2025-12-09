import React, { JSX, ReactElement, useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  I18nManager,
  Image,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SwitchProps {
  disabled?: boolean;
  value: boolean;
  onValueChange?: (value: boolean) => void;
  width?: number;
  activeText?: string;
  inActiveText?: string;
  circleSize?: number;
  switchBorderRadius?: number;
  backgroundActive?: string;
  backgroundInActive?: string;
  circleActiveColor?: string;
  circleInActiveColor?: string;
  textStyle?: TextStyle;
  switchStyle?: ViewStyle;
  switchPaddingRight?: number;
  switchPaddingLeft?: number;
  circleImageActive?: ReactElement;
  circleImageInactive?: ReactElement;
}

const spring = (
  _value: any,
  config: any = { damping: 12, stiffness: 80, mass: 0.7 }
) => withSpring(_value, config);

const PADDINGHORIZONTAL = 2;

const isNumber = (value: any, defaultValue = 0) => {
  value = Number(value);
  if (typeof value === 'number' && !isNaN(value) && value !== null) {
    return value;
  }
  return defaultValue;
};

const Switch = (IProps: SwitchProps): JSX.Element => {
  const {
    value,
    activeText,
    inActiveText,
    backgroundActive = '#A3A3A6', 
    backgroundInActive = '#000000',   
    circleActiveColor = '#FFFFFF', 
    circleInActiveColor = '#FFFFFF', 
    circleSize,
    width,
    onValueChange,
    switchBorderRadius,
    textStyle,
    disabled,
    switchPaddingRight,
    switchPaddingLeft,
    switchStyle,
    circleImageActive,
    circleImageInactive,
  } = IProps;

  const { isRTL } = I18nManager;
  const circleTranslateX = useSharedValue<any>(0);
  const textTranslateXInActive = useSharedValue<any>(0);
  const textTranslateXActive = useSharedValue<any>(0);
  const circleColor = useSharedValue<string | undefined>(circleInActiveColor);

  const [defaultWidth, setDefaultWidth] = useState<number>(
    isNumber(width, 100)
  );
  const [defaultCircleSize, setDefaultCircleSize] = useState<number>(
    isNumber(circleSize, 30)
  );
  const [defaultPadding, setDefaultPadding] = useState<{
    paddingLeft: number;
    paddingRight: number;
  }>({
    paddingLeft: isNumber(switchPaddingLeft, PADDINGHORIZONTAL),
    paddingRight: isNumber(switchPaddingRight, PADDINGHORIZONTAL),
  });

  const circleStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: circleColor.value,
      transform: [
        {
          translateX: circleTranslateX.value,
        },
      ],
    };
  });

  const textStyleViewInActive = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: textTranslateXInActive.value,
        },
      ],
    };
  });

  const textStyleViewActive = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: textTranslateXActive.value,
        },
      ],
    };
  });

  useEffect(() => {
    setDefaultWidth(isNumber(width, 100));
  }, [width]);

  useEffect(() => {
    setDefaultPadding({
      paddingLeft: isNumber(switchPaddingLeft, PADDINGHORIZONTAL),
      paddingRight: isNumber(switchPaddingRight, PADDINGHORIZONTAL),
    });
  }, [switchPaddingLeft, switchPaddingRight]);

  useEffect(() => {
    setDefaultCircleSize(isNumber(circleSize, 30));
  }, [circleSize]);

  useEffect(() => {
    const factory = isRTL ? -1 : 1;
    const size =
      factory *
      (defaultWidth -
        (defaultCircleSize +
          (defaultPadding.paddingLeft + defaultPadding.paddingRight)));

    const springConfig = { damping: 12, stiffness: 80, mass: 0.7 };

    if (value) {
      circleTranslateX.value = spring(size, springConfig);
      textTranslateXActive.value = spring(0, springConfig);
      textTranslateXInActive.value = spring(factory * defaultWidth, springConfig);
      if (circleActiveColor) {
        circleColor.value = spring(circleActiveColor, springConfig);
      }
    } else {
      circleTranslateX.value = spring(0, springConfig);
      textTranslateXActive.value = spring(-(defaultWidth * factory), springConfig);
      textTranslateXInActive.value = spring(0, springConfig);
      if (circleInActiveColor) {
        circleColor.value = spring(circleInActiveColor, springConfig);
      }
    }
  }, [value, defaultWidth, defaultCircleSize, defaultPadding, isRTL]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!disabled && onValueChange) {
          onValueChange(!value);
        }
      }}
      hitSlop={{ top: 25, bottom: 25, left: 20, right: 20 }}>
      <Animated.View
        style={[
          styles.switch,
          {
            borderRadius: isNumber(switchBorderRadius, 30),
            width: defaultWidth,
          },
          switchStyle,
          defaultPadding,
        ]}>
        <Animated.View
          style={[
            styles.switchTextView,
            styles.center,
            {
              width:
                defaultWidth +
                (defaultPadding.paddingLeft + defaultPadding.paddingRight) /
                  2,
              backgroundColor: backgroundActive,
            },
            textStyleViewActive,
          ]}>
          <Animated.Text
            style={[
              styles.textStyle,
              textStyle,
                  {left: -(defaultCircleSize / 2)},
            ]}>
            {activeText}
          </Animated.Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.switchTextView,
            styles.center,
            {
              width: defaultWidth,
              backgroundColor: backgroundInActive,
            },
            textStyleViewInActive,
          ]}>
          <Animated.Text
            style={[
              styles.textStyle,
              textStyle,
                  {left: defaultCircleSize / 2},
            ]}>
            {inActiveText}
          </Animated.Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.circleStyle,
            {
              width: defaultCircleSize,
              height: defaultCircleSize,
              borderRadius: isNumber(switchBorderRadius, 30),
            },
            circleStyle,
          ]}>
          {value ? (
            <Image
              source={circleImageActive as any}
              style={styles.circleImage}
            />
          ) : (
            <Image
              source={circleImageInactive as any}
              style={styles.circleImage}
            />
          )}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

Switch.defaultProps = {
  disabled: false,
  value: false,
  onValueChange: undefined,
  activeText: 'ON',
  inActiveText: 'OFF',
  backgroundActive: '#249c00',
  backgroundInActive: '#333',
  circleInActiveColor: '#fff',
  circleSize: 30,
  switchBorderRadius: 30,
  width: 100,
  switchPaddingRight: PADDINGHORIZONTAL,
  switchPaddingLeft: PADDINGHORIZONTAL,
};

const styles = StyleSheet.create({
  switch: {
    display: 'flex',
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  switchTextView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  textStyle: {
    fontSize: 14,
    color: '#fff',
    marginHorizontal: 2,
  },
  circleStyle: {
    position: 'relative',
    zIndex: 99,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleChildren: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Switch;
