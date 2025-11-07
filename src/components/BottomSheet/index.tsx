import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {ScrollView as GHScrollView} from 'react-native-gesture-handler';

import {WHITE} from '../../utils/colors';
import {dp} from '../../utils/dp';

const height = dp(Dimensions.get('screen').height);

const MAX_TRANSLATE_Y = -height + dp(50);
const MIN_TRANSLATE_Y = -dp(height) / dp(4);

type BottomSheetProps = {
  children?: React.ReactNode;
  background?: 'white';
  visible?: boolean;
  setVisible?: any;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({children, background}, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const activeRef = useRef(false);

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
          activeRef.current = false;
        } else if (translateY.value < -height / 2) {
          scrollTo(MAX_TRANSLATE_Y);
          activeRef.current = true;
        }
      });

    useEffect(() => {
      scrollTo(-height / 3);
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
          <View style={styles.line} />
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              // Clone the child element with additional props
              return (
                <>
                  <GHScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    nestedScrollEnabled={true}>
                    {React.cloneElement(child)}
                  </GHScrollView>
                </>
              );
            }
            return child;
          })}
        </Animated.View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    display: 'flex',
    height: Dimensions.get('screen').height,
    width: '100%',
    position: 'absolute',
    top: height,
    borderRadius: 25,
    zIndex: 2,
  },
  line: {
    width: dp(75),
    height: dp(4),
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginBottom: dp(8),
    borderRadius: 2,
  },
  white: {
    backgroundColor: WHITE,
  },
});

export {BottomSheet};
