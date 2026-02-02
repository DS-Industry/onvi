import {useState, useCallback, useEffect} from 'react';
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
  totalDiscount: number = 0
) => {
  const [usedPoints, setUsedPoints] = useState(0);
  const [toggled, setToggled] = useState(false);
  const [maxPoints, setMaxPoints] = useState(0);

  // Рассчитываем максимальные бонусы при изменении заказа или общей скидки
  useEffect(() => {
    if (!user || !order?.sum) {
      setMaxPoints(0);
      return;
    }

    const maximumApplicablePoints = getMaximumApplicablePoints(
      user,
      order.sum,
      totalDiscount,
    );
    
    setMaxPoints(maximumApplicablePoints);
    
    if (toggled) {
      setUsedPoints(maximumApplicablePoints);
    }
  }, [user, order?.sum, totalDiscount, toggled]);

  /**
   * Apply maximum available points to the payment
   */
  const applyPoints = useCallback(() => {
    if (!user || !order?.sum) {
      return;
    }

    const maxPoints = getMaximumApplicablePoints(
      user,
      order.sum,
      totalDiscount,
    );
    setUsedPoints(maxPoints);
  }, [user, order?.sum, totalDiscount]);

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
    if (!user || !order?.sum) {
      return 0;
    }
    return getMaximumApplicablePoints(user, order.sum, totalDiscount);
  }, [user, order?.sum, totalDiscount]);

  return {
    usedPoints,
    maxPoints,
    toggled,
    applyPoints,
    togglePoints,
    resetPoints,
    getMaxPoints,
    setUsedPoints,
  };
};