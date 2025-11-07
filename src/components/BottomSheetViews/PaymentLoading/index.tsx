import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, Image} from 'react-native';
import LottieView from 'lottie-react-native';
import {Button} from '@styled/buttons';
import {dp} from '@utils/dp.ts';
import {OrderProcessingStatus} from '@app-types/api/order/status/OrderProcessingStatus';
import {
  GeneralBottomSheetRouteProp,
  GeneralBottomSheetNavigationProp,
} from '@app-types/navigation/BottomSheetNavigation.ts';
import {useRoute, useNavigation} from '@react-navigation/native';
import {usePaymentProcess} from '@hooks/usePaymentProcess.ts';
import {IUser} from '@app-types/models/User';
import {OrderDetailsType} from '@state/order/OrderSlice';
import {DiscountValueType} from '@hooks/usePromoCode';
import {PaymentMethodType} from '@styled/buttons/PaymentMethodButton/index';

// Helper function to get translated order status text
const getOrderStatusText = (status: OrderProcessingStatus, t: any): string => {
  switch (status) {
    case OrderProcessingStatus.START:
      return t('app.paymentLoading.preparingEquipment');
    case OrderProcessingStatus.PROCESSING:
      return t('app.paymentLoading.creditingMoney');
    case OrderProcessingStatus.END:
      return t('app.paymentLoading.paymentSuccessful');
    case OrderProcessingStatus.WAITING_PAYMENT:
      return t('app.paymentLoading.waitingPayment');
    case OrderProcessingStatus.POLLING:
      return t('app.paymentLoading.almostDone');
    case OrderProcessingStatus.PROCESSING_FREE:
      return t('app.paymentLoading.activatingEquipment');
    case OrderProcessingStatus.END_FREE:
      return t('app.paymentLoading.activationSuccessful');
    default:
      return '';
  }
};

type PaymentLoadingParams = {
  user: IUser;
  order: OrderDetailsType;
  discount: DiscountValueType | null;
  usedPoints: number;
  promoCodeId?: number;
  loadUser?: () => Promise<void>;
  freeOn: boolean;
  paymentMethod: PaymentMethodType;
};

const PaymentLoading = () => {
  const {t} = useTranslation();
  const route = useRoute<GeneralBottomSheetRouteProp<'PaymentLoading'>>();
  const navigation = useNavigation<GeneralBottomSheetNavigationProp<'Post'>>();

  const {
    user,
    order,
    discount,
    usedPoints,
    promoCodeId,
    loadUser,
    freeOn,
    paymentMethod,
  } = route.params as PaymentLoadingParams;

  const {loading, error, orderStatus, processPayment, processFreePayment} =
    usePaymentProcess(
      user!, // TODO: FIX THIS
      order!, // TODO: FIX THIS
      discount,
      usedPoints,
      promoCodeId,
      loadUser,
      paymentMethod,
    );

  useEffect(() => {
    if (freeOn) {
      processFreePayment();
    } else {
      processPayment();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {loading && (
          <LottieView
            source={require('./9gN0nDjDkx.json')}
            autoPlay={true}
            loop={true}
            style={styles.animation}
          />
        )}
        {(orderStatus === OrderProcessingStatus.END ||
          orderStatus === OrderProcessingStatus.END_FREE) && (
          <Image
            source={require('./icons8-check-mark-240.png')}
            style={styles.image}
          />
        )}
        {error && (
          <Image
            source={require('./icons8-cancel-240.png')}
            style={styles.image}
          />
        )}
        <Text style={styles.text}>
          {!error && orderStatus ? getOrderStatusText(orderStatus, t) : error}
        </Text>
        {error && (
          <Button
            onClick={navigation.goBack}
            label={t('common.buttons.retry')}
            color="blue"
            width={129}
            height={42}
            fontSize={18}
            fontWeight="600"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: dp(20),
    marginBottom: dp(50),
  },
  animation: {
    width: dp(150),
    height: dp(150),
  },
  image: {
    width: dp(120),
    height: dp(120),
    resizeMode: 'cover',
    margin: dp(15),
  },
  text: {
    marginBottom: dp(20),
    textAlign: 'center',
  },
});

export {PaymentLoading};
