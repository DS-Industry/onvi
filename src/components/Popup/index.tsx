import React, {useCallback, useEffect, useImperativeHandle} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {WHITE} from '../../utils/colors';

const height = Dimensions.get('screen').height;

const MAX_TRANSLATE_Y = -height + 150;
const MIN_TRANSLATE_Y = -height;

type PopupProps = {
  children?: React.ReactNode;
  background?: 'white';
};

export type PopupRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const Popup = React.forwardRef<PopupRefProps, PopupProps>(
  ({children, background}, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      'worklet';

      if (destination === 0) {
        active.value = false;
      } else {
        active.value = true;
      }

      translateY.value = withSpring(destination, {damping: 50});
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({scrollTo, isActive}), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({
      y: 0,
    });

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = {y: translateY.value};
      })
      .onUpdate(event => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        if (translateY.value > -height / 3) {
          scrollTo(MIN_TRANSLATE_Y);
        } else if (translateY.value < -height / 2) {
          scrollTo(MAX_TRANSLATE_Y);
        }
      });

    useEffect(() => {
      scrollTo(height);
    }, []);

    const rBottomSheetStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateY: translateY.value}],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            rBottomSheetStyle,
            background && styles.white,
          ]}>
          <View style={styles.line}></View>
          {children}
        </Animated.View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    display: 'flex',
    height: height,
    width: '100%',
    position: 'absolute',
    top: height,
    borderRadius: 25,
    padding: 25,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    // shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // for Android only
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  white: {
    backgroundColor: WHITE,
  },
});

export {Popup};
