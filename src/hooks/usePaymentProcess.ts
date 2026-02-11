import {IUser} from '@app-types/models/User.ts';
import {OrderDetailsType} from '../state/order/OrderSlice.ts';
import {useCallback, useRef, useState} from 'react';
import {getCredentials} from '@services/api/payment';
import {confirmPayment, tokenize} from '../native';
import {
  createPaymentConfig,
} from '@utils/paymentHelpers.ts';
import {
  orderCreate,
  pingPos,
  orderRegister,
  updateOrderStatus,
} from '@services/api/order';
import {PaymentMethodTypesEnum} from '@app-types/PaymentType.ts';
import {ICreateOrderRequest} from '@app-types/api/order/req/ICreateOrderRequest.ts';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {ICreateOrderResponse, SendStatus} from '@app-types/api/order/res/ICreateOrderResponse.ts';
import {DiscountValueType} from '@hooks/usePromoCode.ts';
import {PaymentMethodType} from '@styled/buttons/PaymentMethodButton';
import {getOrderByOrderId} from '@services/api/order';
import {
  ORDER_ERROR_CODES,
  PAYMENT_ERROR_CODES,
  OTHER_ERROR_CODES,
} from '@app-types/api/constants/index.ts';
import {OrderProcessingStatus} from '@app-types/api/order/status/OrderProcessingStatus.ts';
import {DdLogs} from '@datadog/mobile-react-native';

import AppMetrica from '@appmetrica/react-native-analytics';
import i18n from '../locales';
import {OrderStatusCode} from '@app-types/api/order/status/OrderStatusCode.ts';
import {BayTypeEnum} from '@app-types/BayTypeEnum.ts';
import useStore from '@state/store.ts';
import { REGISTER_STATUS } from '@app-types/api/order/res/IRegisterOrderResponse.ts';
import { DeviceStatus } from '@app-types/api/order/res/IPingPosResponse.ts';

export const usePaymentProcess = (
  user: IUser,
  order: OrderDetailsType,
  discount: DiscountValueType | null,
  usedPoints: number,
  promoCodeId?: number,
  loadUser?: () => Promise<void>,
  finalAmount?: number, 
  initialPaymentMethod: PaymentMethodType = 'BANK_CARD',
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderProcessingStatus | null>(
    null,
  );
  const {loadLatestCarwashes} = useStore.getState();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>(initialPaymentMethod);

  const currentOrderRef = useRef<number | null>(null);
  /**
   * Process payment and create order
   */
  const errorHandler = async (error: any) => {
    setLoading(false);
    if (
      error.code === 'ERROR_PAYMENT_CANCELLED' ||
      error.code === 'E_PAYMENT_CANCELLED'
    ) {
      setError('Заказ отменён. Платёж не был завершён');

      try {
        const orderIdToUpdate = currentOrderRef.current;
        if (orderIdToUpdate) {
          await updateOrderStatus(orderIdToUpdate, OrderStatusCode.CANCELED);
        }
      } catch (error: any) {
        DdLogs.error(`Update order status error: ${error.message}`, {error});
      }
      AppMetrica.reportEvent('Payment Canceled', error);
    } else {
      const errorCode = error.response?.data?.code || 'Unknown error code';
      const errorMessage =
        error.response?.data?.message || 'No additional message';
      DdLogs.error(`Payment process error: ${errorMessage}`, {errorCode});
      switch (error.response.data.code) {
        case ORDER_ERROR_CODES.PROCESSING_ERROR:
          setError(i18n.t('app.paymentErrors.orderCreationError'));
          break;
        case ORDER_ERROR_CODES.ORDER_NOT_FOUND:
          setError(i18n.t('app.paymentErrors.orderNotFound'));
          break;
        case ORDER_ERROR_CODES.INVALID_ORDER_STATE:
          setError(i18n.t('app.paymentErrors.invalidOrderState'));
          break;
        case ORDER_ERROR_CODES.PAYMENT_CANCELED:
          setError(i18n.t('app.paymentErrors.paymentCanceled'));
          break;
        case ORDER_ERROR_CODES.PAYMENT_TIMEOUT:
          setError(i18n.t('app.paymentErrors.paymentTimeout'));
          break;
        case ORDER_ERROR_CODES.ORDER_CREATION_FAILED:
          setError(i18n.t('app.paymentErrors.orderCreationFailed'));
          break;
        case ORDER_ERROR_CODES.INSUFFICIENT_REWARD_POINTS:
          setError(i18n.t('app.paymentErrors.insufficientRewardPoints'));
          break;
        case ORDER_ERROR_CODES.REWARD_POINTS_WITHDRAWAL_FAILED:
          setError(i18n.t('app.paymentErrors.rewardPointsWithdrawalFailed'));
          break;
        case ORDER_ERROR_CODES.CARD_FOR_ORDER_NOT_FOUND:
          setError(i18n.t('app.paymentErrors.cardForOrderNotFound'));
          break;
        case ORDER_ERROR_CODES.INSUFFICIENT_FREE_VACUUM:
          setError(i18n.t('app.paymentErrors.insufficientFreeVacuum'));
          break;
        case PAYMENT_ERROR_CODES.PROCESSING_ERROR:
          setError(i18n.t('app.paymentErrors.paymentProcessingError'));
          break;
        case PAYMENT_ERROR_CODES.PAYMENT_REGISTRATION_FAILED:
          setError(i18n.t('app.paymentErrors.paymentRegistrationFailed'));
          break;
        case PAYMENT_ERROR_CODES.INVALID_WEBHOOK_SIGNATURE:
          setError(i18n.t('app.paymentErrors.invalidWebhookSignature'));
          break;
        case PAYMENT_ERROR_CODES.MISSING_ORDER_ID:
          setError(i18n.t('app.paymentErrors.missingOrderId'));
          break;
        case PAYMENT_ERROR_CODES.MISSING_PAYMENT_ID:
          setError(i18n.t('app.paymentErrors.missingPaymentId'));
          break;
        case PAYMENT_ERROR_CODES.REFUND_FAILED:
          setError(i18n.t('app.paymentErrors.refundFailed'));
          break;
        case OTHER_ERROR_CODES.BAY_IS_BUSY_ERROR_CODE:
          setError(i18n.t('app.paymentErrors.bayIsBusy'));
          break;
        case OTHER_ERROR_CODES.CARWASH_UNAVALIBLE_ERROR_CODE:
          setError(i18n.t('app.paymentErrors.carwashUnavailable'));
          break;
        case OTHER_ERROR_CODES.CARWASH_START_FAILED:
          setError(i18n.t('app.paymentErrors.carwashStartFailed'));
          break;
        case OTHER_ERROR_CODES.PROMO_CODE_NOT_FOUND_ERROR_CODE:
          setError(i18n.t('app.paymentErrors.promoCodeNotFound'));
          break;
        case OTHER_ERROR_CODES.INVALID_PROMO_CODE_ERROR_CODE:
          setError(i18n.t('app.paymentErrors.invalidPromoCode'));
          break;
        case OTHER_ERROR_CODES.SERVER_ERROR:
          setError(i18n.t('app.paymentErrors.serverError'));
          break;
        default:
          setError(i18n.t('app.paymentErrors.unknownError'));
          break;
      }
    }
  };

  const sideEffects = () => {
    loadLatestCarwashes();
  };

  const processPayment = useCallback(async () => {
    
    //Validation process
    if (!user) {
      setError(i18n.t('app.paymentErrors.somethingWentWrong'));
      return;
    }

    if (!order?.posId || !order?.carWashDeviceId || order?.sum === undefined) {
      setError(i18n.t('app.paymentErrors.somethingWentWrong'));
      return;
    }

    if (paymentMethod === undefined || paymentMethod === null) {
      setError(i18n.t('app.paymentErrors.choosePaymentMethod'));
      return;
    }

    // Используем finalAmount из API, если передан, иначе order.sum (fallback)
    const paymentAmount = finalAmount !== undefined ? finalAmount : order.sum;

    //Order creation process

    try {
      setLoading(true);
      setOrderStatus(OrderProcessingStatus.PROCESSING);
      // Get payment credentials
      const paymentConfig = await getCredentials();

      const apiKey: string = paymentConfig.clientApplicationKey.toString();
      const storeId: string = paymentConfig.shopId.toString();

      // Check bay status
      const bayStatus = await pingPos({
        carWashId: order.posId,
        carWashDeviceId: Number(order.carWashDeviceId),
      });
      
      if (bayStatus.status !== DeviceStatus.FREE) {
        setError(i18n.t('app.paymentErrors.carwashBusyOrUnavailable'));
        setLoading(false);
        return;
      }

      //Adding payment method

      let paymentMethodTypes = [];

      switch (paymentMethod) {
        case PaymentMethodTypesEnum.BANK_CARD:
          paymentMethodTypes.push(PaymentMethodTypesEnum.BANK_CARD);
          break;
        case PaymentMethodTypesEnum.SBERBANK:
          paymentMethodTypes.push(PaymentMethodTypesEnum.SBERBANK);
          break;
        case PaymentMethodTypesEnum.SBP:
          paymentMethodTypes.push(PaymentMethodTypesEnum.SBP);
          break;
        default:
          break;
      }
      
      // Create payment config
      const paymentConfigParams = createPaymentConfig(
        apiKey,
        storeId,
        order,
        paymentAmount,
        user,
        paymentMethodTypes,
      );

      // Create order request
      const createOrderRequest: ICreateOrderRequest = {
        sumBonus: paymentAmount, // финальная сумма из API
        sum: order.sum, // оригинальная сумма
        rewardPointsUsed: usedPoints || 0, // использованные баллы
        carWashId: Number(order.posId),
        bayType: order.bayType,
        carWashDeviceId: Number(order.carWashDeviceId),
      };

      // Add promo code if available
      if (promoCodeId) {
        createOrderRequest.promoCodeId = promoCodeId;
      }

      // Create order
      const orderResult = await orderCreate(createOrderRequest);
      currentOrderRef.current = orderResult.orderId;
      AppMetrica.reportEvent('Create Order Success', createOrderRequest);

      // обработать ошибку создания заказа
      if (orderResult.status !== SendStatus.CREATED) {
        setError(i18n.t('app.paymentErrors.orderCreationUnsuccessful'));
        setLoading(false);
        // setOrderStatus(null);
        return;
      }

      // Start tokenization
      const {token, paymentMethodType} = await tokenize(paymentConfigParams);

      if (!token) {
        setError(i18n.t('app.paymentErrors.paymentError'));
        setLoading(false);
        // setOrderStatus(null);
        return;
      }

      const {status, confirmation_url} = await orderRegister({
        orderId: orderResult.orderId,
        paymentToken: token,
        receiptReturnPhoneNumber: user.phone ?? '',
      });

      if (status !== REGISTER_STATUS.WAITING_PAYMENT || !confirmation_url.trim()) {
        setError(i18n.t('app.paymentErrors.paymentUnsuccessful'));
        setLoading(false);
        // setOrderStatus(null);
        return;
      }

      setOrderStatus(OrderProcessingStatus.WAITING_PAYMENT);
      
      await confirmPayment({
        confirmationUrl: confirmation_url,
        paymentMethodType,
        shopId: storeId,
        clientApplicationKey: apiKey,
      });

      AppMetrica.reportEvent('Payment Success', {
        confirmationUrl: confirmation_url,
        paymentMethodType,
      });

      AppMetrica.reportAdRevenue({
        price: paymentAmount ?? 0,
        currency: 'RUB',
      });

      setOrderStatus(OrderProcessingStatus.POLLING);

      // poll order status until COMPLETED
      let attempts = 0;
      const maxAttempts = 15;

      const pollOrderStatus = async () => {
        try {
          const response = await getOrderByOrderId(orderResult.orderId);
          if (response.status === OrderStatusCode.COMPLETED) {
            setOrderStatus(OrderProcessingStatus.END);
            setLoading(false);
            sideEffects();
            DdLogs.info('Successful order creation', {order});
            // При успешном окончании оплаты через 3 секунды закрываем BottomSheet и переходим на страницу PostPayment
            setTimeout(() => {
              if (order.bayType === BayTypeEnum.VACUUME) {
                navigateBottomSheet('PostPaymentVacuum', {});
              } else {
                navigateBottomSheet('PostPayment', {});
              }
              setOrderStatus(null);
            }, 3000);
          } else if (response.status === OrderStatusCode.FAILED) {
            setError(i18n.t('app.paymentErrors.equipmentError'));
            DdLogs.error('Equipment error', {order});
            setLoading(false);
          } else if (response.status === OrderStatusCode.CANCELED) {
            setError(
              i18n.t('app.paymentErrors.PaymentCancellationOrPaymentError'),
            );
            DdLogs.error('Payment canceled', {order});
            setLoading(false);
          } else {
            attempts++;
            if (attempts >= maxAttempts) {
              setError(i18n.t('app.paymentErrors.paymentTimeout'));
              DdLogs.error('Payment time expired', {order});
              setLoading(false);
              // setOrderStatus(null);
            } else {
              const delay = 2000 + attempts * 1000;
              setTimeout(pollOrderStatus, delay);
            }
          }
        } catch (error: any) {
          DdLogs.error(`Poll order status error: ${error.message}`, {error});
          if (error?.code === 'OrderNotFoundException') {
            setError(i18n.t('app.paymentErrors.orderNotFound'));
          } else {
            setError(i18n.t('app.paymentErrors.orderStatusCheckError'));
          }
          setLoading(false);
          // setOrderStatus(null);
        }
      };

      setTimeout(pollOrderStatus, 1000);
    } catch (error: any) {
      errorHandler(error);
    }
  }, [user, order, discount, usedPoints, promoCodeId, loadUser, paymentMethod, finalAmount]);

  const handlePaymentMethodType = useCallback((value: PaymentMethodType) => {
    setPaymentMethod(value);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const processFreePayment = async () => {
    if (!order?.posId || !order?.carWashDeviceId || order?.sum === undefined || !user) {
      setError(i18n.t('app.paymentErrors.somethingWentWrong'));
      return;
    }

    try {
      setLoading(true);
      setOrderStatus(OrderProcessingStatus.PROCESSING_FREE);

      const bayStatus = await pingPos({
        carWashId: order.posId,
        carWashDeviceId: Number(order.carWashDeviceId),
      });
      
      if (bayStatus.status !== DeviceStatus.FREE) {
        setError(i18n.t('app.paymentErrors.carwashBusyOrUnavailable'));
        setLoading(false);
        return;
      }

      const orderRequest: ICreateOrderRequest = {
        sum: order.sum,
        sumBonus: order.sum,
        rewardPointsUsed: 0,
        carWashId: Number(order.posId),
        bayType: order.bayType,
        carWashDeviceId: Number(order.carWashDeviceId),
      };

      const orderResult = await orderCreate(orderRequest);

      if (orderResult.status === SendStatus.POS_PROCESSED) {
        setError(i18n.t('app.paymentErrors.carwashBusyOrUnavailable'));
        setLoading(false);
        return;
      }

      AppMetrica.reportEvent('Create Order Success', {
        sum: order.sum,
        originalSum: order.sum,
        rewardPointsUsed: 0,
        carWashId: Number(order.posId),
        bayNumber: Number(order.bayNumber),
        bayType: order.bayType,
      });

      let attempts = 0;
      const maxAttempts = 15;

      const pollOrderStatus = async () => {
        const response = await getOrderByOrderId(orderResult.orderId);
        if (response.status === OrderStatusCode.COMPLETED) {
          setOrderStatus(OrderProcessingStatus.END_FREE);
          setLoading(false);
          sideEffects();
          DdLogs.info('Successful order creation (free vacuume)', {order});
          // При успешном окончании оплаты через 3 секунды закрываем BottomSheet и переходим на страницу PostPayment
          setTimeout(() => {
            navigateBottomSheet('PostPaymentVacuum', {});
            setOrderStatus(null);
          }, 3000);
        } else if (response.status === OrderStatusCode.FAILED) {
          setError(i18n.t('app.paymentErrors.equipmentError'));
          DdLogs.error('Equipment error', {order});
          setLoading(false);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            setError(i18n.t('app.paymentErrors.paymentTimeoutFreeVacuum'));
            DdLogs.error('Payment time expired (free vacuume)', {order});
            setLoading(false);
          } else {
            const delay = 2000 + attempts * 1000;
            setTimeout(pollOrderStatus, delay);
          }
        }
      };
      setTimeout(pollOrderStatus, 1000);
    } catch (error: any) {
      errorHandler(error);
    }
  };

  return {
    loading,
    error,
    setPaymentMethod: handlePaymentMethodType,
    paymentMethod,
    orderStatus,
    setOrderStatus,
    processPayment,
    processFreePayment,
    clearError,
  };
};
