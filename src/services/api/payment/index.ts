import { newUserApiInstance } from '@services/api/axiosConfig.ts';
import { ICalculateDiscountRequest } from '@app-types/api/payment/req/ICalculateDiscountRequest.ts';
import { ICalculateDiscountResponse } from '@app-types/api/payment/res/ICalculateDiscountResponse.ts';

enum NEW_PAYMENT {
  CREDENTIALS = '/client/order/credentials',
  CALCULATE_DISCOUNT = '/client/order/calculate-discount',
}

export async function getCredentials(): Promise<{
  clientApplicationKey: string;
  shopId: string;
}> {
  const response = await newUserApiInstance.get(NEW_PAYMENT.CREDENTIALS);
  return response.data;
}

export async function calculateDiscount(body: ICalculateDiscountRequest): Promise<ICalculateDiscountResponse> {
  const response = await newUserApiInstance.post<ICalculateDiscountResponse>(NEW_PAYMENT.CALCULATE_DISCOUNT, body);
  return response.data;
}