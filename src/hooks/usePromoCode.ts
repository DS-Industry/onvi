import {useCallback, useRef, useState} from 'react';
import useSWRMutation from 'swr/mutation';
import {IValidatePromoCodeResponse} from '../types/api/order/res/IValidatePromoCodeResponse.ts';
import {IValidatePromoCodeRequest} from '../types/api/order/req/IValidatePromoCodeRequest.ts';
import {validatePromoCode} from '@services/api/order';
import {handlePromoCodeError} from '@utils/errorHandlers.ts';
import {DiscountType} from '../types/models/PersonalPromotion.ts';
import Toast from 'react-native-toast-message';

export interface DiscountValueType {
  type: DiscountType;
  discount: number;
}

/**
 * Custom hook for promo code validation and management
 * @returns {Object} Promo code state and functions
 */
export const usePromoCode = (carWashId: number) => {
  const [inputCodeValue, setInputCodeValue] = useState<string | undefined>();
  const [discount, setDiscount] = useState<DiscountValueType | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoCodeId, setPromoCodeId] = useState<number | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // SWR mutation hook for promo code validation
  const {data, trigger, isMutating} = useSWRMutation<
    IValidatePromoCodeResponse,
    Error,
    string,
    IValidatePromoCodeRequest
  >('validatePromoCode', (key, {arg}: {arg: IValidatePromoCodeRequest}) =>
    validatePromoCode(arg),
  );

  /**
   * Apply promo code and validate it
   * @param {string | undefined} code - Promo code to apply
   */
  const applyPromoCode = useCallback(
    async (code?: string) => {
      const promoToApply = code !== undefined ? code : inputCodeValue;

      if (!promoToApply) {
        setDiscount(null);
        setPromoCodeId(null);
        setPromoError(null);
        return;
      }

      const body: IValidatePromoCodeRequest = {
        promoCode: promoToApply,
        carWashId: Number(carWashId),
      };

      try {
        const validPromoCode: IValidatePromoCodeResponse = await trigger(body);

        // НОВАЯ ЛОГИКА: если пришел promoCodeId, значит промокод применен
        if (validPromoCode.isValid && validPromoCode.promoCodeId) {
          // Здесь нужно определить тип скидки
          // В новом API нет прямого указания типа скидки, нужно адаптировать под вашу логику
          // Временное решение: предполагаем фиксированную скидку
          const updatedValue: DiscountValueType = {
            type: DiscountType.CASH, // или другой тип, в зависимости от вашей логики
            discount: 0, // нужно получить скидку из другого источника или API
          };
          setDiscount(updatedValue);
          setPromoCodeId(validPromoCode.promoCodeId);
          setPromoError(null);
        } else {
          // Промокод не валидный
          setDiscount(null);
          setPromoCodeId(null);
          setPromoError(validPromoCode.message || 'Promo code is not valid');
        }
      } catch (error) {
        setInputCodeValue(undefined);
        setDiscount(null);
        setPromoCodeId(null);
        const errorMessage = handlePromoCodeError(error);
        setPromoError(errorMessage);
        Toast.show({
          type: 'customErrorToast',
          text1: errorMessage,
        });
      }
    },
    [inputCodeValue, carWashId, trigger],
  );

  /**
   * Debounced version of applyPromoCode
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   */
  const debounce = useCallback((func: () => void, delay: number) => {
    return function () {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        func();
      }, delay);
    };
  }, []);

  // Create a debounced version of the search function with a delay of 500ms
  const debouncedApplyPromoCode = useCallback(
    () => debounce(() => applyPromoCode(), 500)(),
    [debounce, applyPromoCode],
  );

  /**
   * Handle promo code input change
   * @param {string} value - New promo code value
   */
  const handlePromoCodeChange = useCallback((value: string | undefined) => {
    if (!value) {
      setDiscount(null);
      setPromoCodeId(null);
      setPromoError(null);
    }
    setInputCodeValue(value);
  }, []);

  /**
   * Reset promo code state
   */
  const resetPromoCode = useCallback(() => {
    setInputCodeValue(undefined);
    setDiscount(null);
    setPromoError(null);
    setPromoCodeId(null);
    applyPromoCode(undefined);
  }, [applyPromoCode]);

  return {
    inputCodeValue,
    discount,
    promoError,
    isMutating,
    promoCodeId,
    setPromocode: handlePromoCodeChange,
    applyPromoCode,
    debouncedApplyPromoCode,
    resetPromoCode,
  };
};