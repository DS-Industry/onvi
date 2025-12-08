import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BurgerButton} from '@navigators/BurgerButton';
import {Balance} from '@components/Balance';
import BottomSheet, {
  useBottomSheetTimingConfigs,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {dp} from '../../utils/dp';
import {BottomSheetStack} from '@navigators/BottomSheetStack';
import useStore from '../../state/store';
import {useSharedValue, Easing} from 'react-native-reanimated';

import {CameraReference, Map} from '@components/Map';
import FindMeButton from '@screens/Home/FindMeButton.tsx';
import {useSnapPoints} from '../../utils/snapPoints';
import PaymentContent from '@components/BottomSheetViews/Launch/PaymentContent';

const Home = React.memo(({navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [bottomSheetIndex, _] = useState(1);

  const {setCameraRef, freeVacuum, setPaymentModalRef} = useStore.getState();
  const isFreeVacuum = freeVacuum?.remains > 0;

  // Calculate dynamic snap points based on screen size
  const snapPoints = useSnapPoints();

  const {setBottomSheetSnapPoints} = useStore.getState();

  useEffect(() => {
    setBottomSheetSnapPoints(snapPoints);
  }, [snapPoints]);

  const userLocationRef = useRef<any>(null);
  const {setIsBottomSheetOpen, setBottomSheetRef, business} = useStore.getState();
  const {isDraggable} = useStore();

  const bsRef = useRef(null);
  const camRef = useRef<CameraReference>(null);
  
  const paymentModalRef = useRef<BottomSheetModal>(null);

  const currentPosition = useSharedValue(0);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);

  useEffect(() => {
    setPaymentModalRef(paymentModalRef);
  }, [setPaymentModalRef]);

  useEffect(() => {
    if (bsRef.current) {
      setBottomSheetRef(bsRef);
    }
  }, [setBottomSheetRef]);

  // set up camerate reference to the store
  useEffect(() => {
    if (camRef.current) {
      setCameraRef(camRef);
    }
  }, [setCameraRef]);

  useEffect(() => {
    if (!business) {
      const timer = setTimeout(() => {
        setIsButtonVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsButtonVisible(false);
    }
  }, [business]);

  const handleSheetChanges = useCallback((index: number) => {
    setVisible(index ? true : false);
    setIsBottomSheetOpen(index >= 2);
  }, []);

  const memoizedBottomSheetStack = useMemo(
    () => <BottomSheetStack active={true} />,
    [visible, navigation, camRef],
  );

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 300,
    easing: Easing.linear,
  });

  const paymentModalSnapPoints = useMemo(() => ['75%', '90%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
        pressBehavior="close"
      />
    ),
    []
  );

  const handlePaymentModalClose = useCallback(() => {
    paymentModalRef.current?.dismiss();
  }, []);

  return (
    <GestureHandlerRootView style={styles.master}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Map ref={camRef} userLocationRef={userLocationRef} />

        {/* FindMe button with built-in position tracking and opacity fade */}
          {isButtonVisible && !business && (
            <FindMeButton
              animatedPosition={currentPosition}
              animatedIndex={currentPosition}
            />
          )}

          <BottomSheet
            animationConfigs={animationConfigs}
            enableContentPanningGesture={isDraggable}
            enableHandlePanningGesture={isDraggable}
            ref={bsRef}
            handleIndicatorStyle={styles.handleIndicator}
            keyboardBlurBehavior="restore"
            animatedPosition={currentPosition}
            enableOverDrag={true}
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            snapPoints={snapPoints}
            index={bottomSheetIndex}
            onChange={handleSheetChanges}
            backgroundComponent={() => (
              <View style={[styles.transparentBackground, styles.shadow]} />
            )}
            style={styles.shadow}
            topInset={0}
          >
            <View style={styles.contentContainer}>
              {memoizedBottomSheetStack}
            </View>
          </BottomSheet>

          <BottomSheetModal
            ref={paymentModalRef}
            index={0}
            snapPoints={paymentModalSnapPoints}
            backdropComponent={renderBackdrop}
            handleComponent={null}
            backgroundStyle={styles.paymentModalBackground}
            enablePanDownToClose={true}
            enableDynamicSizing={false}
            animateOnMount={true}
            animationConfigs={{
              duration: 300,
              easing: Easing.out(Easing.exp),
            }}
          >
            <BottomSheetView style={styles.paymentModalContent}>
              <PaymentContent
                onClose={handlePaymentModalClose}
                isFreeVacuum={isFreeVacuum}
              />
            </BottomSheetView>
          </BottomSheetModal>

          <View style={[styles.burger]}>
            <BurgerButton />
          </View>
          <View style={[styles.balance]}>
            <Balance bottomSheetIndex={bottomSheetIndex} />
          </View>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  master: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    position: 'absolute',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burger: {
    position: 'absolute',
    top: dp(16),
    left: dp(6),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        top: dp(40),
      },
    }),
  },
  balance: {
    position: 'absolute',
    top: dp(20),
    right: dp(6),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        top: dp(40),
      },
    }),
  },
  handleIndicator: {
    display: 'none',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 9.11,
    elevation: 14,
  },
  contentContainer: {
    flex: 1,
  },
  paymentModalBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  paymentModalContent: {
    flex: 1,
    paddingHorizontal: dp(16),
    paddingTop: dp(20),
  },
});

export {Home};
