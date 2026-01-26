import { ICreatePaymentRequest } from '../../../types/api/payment/req/ICreatePaymentRequest.ts';
import { IUserApiResponse } from '../../../types/api/common/IUserApiResponse.ts';
import { newUserApiInstance, userApiInstance } from '@services/api/axiosConfig.ts';
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
  try {
    const response = await newUserApiInstance.get(NEW_PAYMENT.CREDENTIALS);
    console.log("getCredentials: ", response);

    return response.data;
  } catch (error) {
    console.error("getCredentials failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function calculateDiscount(body: ICalculateDiscountRequest): Promise<ICalculateDiscountResponse> {
  try {
    const response = await newUserApiInstance.post<ICalculateDiscountResponse>(NEW_PAYMENT.CALCULATE_DISCOUNT, body);
    console.log("calculateDiscount: ", response.data);

    return response.data;
  } catch (error) {
    console.error("calculateDiscount failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}