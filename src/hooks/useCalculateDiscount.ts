// hooks/useCalculateDiscount.ts
import { useState, useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import { ICalculateDiscountRequest, ICalculateDiscountResponse } from '../types/api/order/req/ICalculateDiscountRequest';
import { calculateDiscount } from '@services/api/payment';

/**
 * Custom hook for calculating discounts
 */
export const useCalculateDiscount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [discountData, setDiscountData] = useState<ICalculateDiscountResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // SWR mutation hook for discount calculation
  const { trigger, isMutating } = useSWRMutation<
    ICalculateDiscountResponse,
    Error,
    string,
    ICalculateDiscountRequest
  >('calculateDiscount', (key, { arg }: { arg: ICalculateDiscountRequest }) =>
    calculateDiscount(arg)
  );

  /**
   * Calculate discount with provided parameters
   */
  const calculate = useCallback(async (requestData: ICalculateDiscountRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await trigger(requestData);
      setDiscountData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to calculate discount';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [trigger]);

  /**
   * Reset discount data
   */
  const reset = useCallback(() => {
    setDiscountData(null);
    setError(null);
  }, []);

  return {
    calculate,
    discountData,
    isLoading: isLoading || isMutating,
    error,
    reset,
  };
};