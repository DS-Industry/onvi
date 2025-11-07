import {useState, useCallback} from 'react';
import {IUser} from '../types/models/User.ts';
import {OrderDetailsType} from '../state/order/OrderSlice.ts';
import {
  calculateActualDiscount,
  getMaximumApplicablePoints,
} from '@utils/paymentHelpers.ts';
import {DiscountValueType} from '@hooks/usePromoCode.ts';

export const useBonusPoints = (
  user: IUser | null,
  order: OrderDetailsType,
  discount: DiscountValueType | null,
) => {
  const [usedPoints, setUsedPoints] = useState(0);
  const [toggled, setToggled] = useState(false);

  /**
   * Apply maximum available points to the payment
   */
  const applyPoints = useCallback(() => {
    if (!user || !order.sum) {
      return;
    }

    const actualDiscount = calculateActualDiscount(discount, order.sum);

    const maxPoints = getMaximumApplicablePoints(
      user,
      order.sum,
      actualDiscount,
    );
    setUsedPoints(maxPoints);
  }, [user, order.sum, discount]);

  /**
   * Toggle points usage on/off
   */
  const togglePoints = useCallback(() => {
    if (!toggled) {
      setToggled(true);
      applyPoints();
    } else {
      setToggled(false);
      setUsedPoints(0);
    }
  }, [toggled, applyPoints]);

  /**
   * Reset points state
   */
  const resetPoints = useCallback(() => {
    setUsedPoints(0);
    setToggled(false);
  }, []);

  /**
   * Get maximum points that can be applied
   */
  const getMaxPoints = useCallback(() => {
    if (!user || !order.sum) {
      return 0;
    }
    const actualDiscount = calculateActualDiscount(discount, order.sum);

    return getMaximumApplicablePoints(user, order.sum, actualDiscount);
  }, [user, order.sum, discount]);

  return {
    usedPoints,
    toggled,
    applyPoints,
    togglePoints,
    resetPoints,
    getMaxPoints,
    setUsedPoints,
  };
};
