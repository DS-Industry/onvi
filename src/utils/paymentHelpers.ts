import {IUser} from '../types/models/User.ts';
import {OrderDetailsType} from '../state/order/OrderSlice.ts';
import {PaymentConfig} from '../types/PaymentConfig.ts';
import {DiscountValueType} from '@hooks/usePromoCode.ts';
import {DiscountType} from '../types/models/PersonalPromotion.ts';

/**
 * Calculates final payment amount after discount and points
 */
export const calculateFinalAmount = (
  originalSum: number,
  discount: number,
  usedPoints: number,
): number => {
  // First apply discount, ensuring it doesn't exceed the original sum
  const afterDiscount = Math.max(originalSum - discount, 0);

  // Then apply points, ensuring final amount is at least 1 ruble
  return Math.max(afterDiscount - usedPoints, 1);
};

/**
 * Determines maximum points that can be used for payment
 */
export const getMaximumApplicablePoints = (
  user: IUser | null,
  orderSum: number | undefined,
  discount: number,
): number => {
  if (!user?.cards?.balance || !orderSum) {
    return 0;
  }

  // First calculate amount after discount
  const afterDiscount = Math.max(orderSum - discount, 0);

  // Maximum points = amount after discount - minimum payment (1 ruble)
  const maxAllowedPoints = Math.max(afterDiscount - 1, 0);

  return Math.min(user.cards.balance, maxAllowedPoints);
};

/**
 * Calculates actual points used when payment reaches minimum amount
 */
export const calculateActualPointsUsed = (
  originalSum: number,
  discount: number,
  requestedPoints: number,
): number => {
  // First calculate amount after discount
  const afterDiscount = Math.max(originalSum - discount, 0);

  // If there's only 1 ruble or less left after discount, no points can be used
  if (afterDiscount <= 1) {
    return 0;
  }

  // Calculate maximum points that can be applied (leaving 1 ruble)
  const maxUsablePoints = afterDiscount - 1;

  // Return the smaller of requested points or max usable points
  return Math.min(requestedPoints, maxUsablePoints);
};

/**
 * Calculates the actual discount amount based on type
 */
export const calculateActualDiscount = (
  discount: DiscountValueType | null,
  orderSum: number,
): number => {
  if (!discount) {
    return 0;
  }

  if (discount.type === DiscountType.DISCOUNT) {
    // Percentage discount
    return Number((discount.discount / 100) * orderSum);
  }

  // Fixed discount - shouldn't exceed order sum
  return Math.min(discount.discount, orderSum);
};

export const createPaymentConfig = (
  apiKey: string,
  storeId: string,
  order: OrderDetailsType,
  finalAmount: number,
  user: IUser,
  paymentMethodTypes: any[],
): PaymentConfig => {
  return {
    clientApplicationKey: apiKey,
    shopId: storeId,
    title: `${order.name || 'Car Wash Service'}`,
    subtitle: 'АМС',
    price: finalAmount,
    paymentMethodTypes: paymentMethodTypes,
    customerId: String(user.id),
    authCenterClientId: null,
    userPhoneNumber: null,
    gatewayId: null,
    returnUrl: null,
    googlePaymentMethodTypes: null,
    applePayMerchantId: null,
    isDebug: false,
  };
};
