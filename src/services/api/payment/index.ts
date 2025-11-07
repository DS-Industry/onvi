import {ICreatePaymentRequest} from '../../../types/api/payment/req/ICreatePaymentRequest.ts';
import {IUserApiResponse} from '../../../types/api/common/IUserApiResponse.ts';
import {userApiInstance} from '@services/api/axiosConfig.ts';

enum PAYMENT {
  CREATE_PAYMENT_URL = '/payment',
  GET_CREDENTIAL = '/payment/credentials',
}

export async function createPayment(body: ICreatePaymentRequest): Promise<any> {
  const response = await userApiInstance.post<IUserApiResponse<any>>(
    PAYMENT.CREATE_PAYMENT_URL,
    body,
  );

  return response.data.data;
}

export async function getCredentials(): Promise<{
  apiKey: string;
  storeId: string;
}> {
  const response = await userApiInstance.get(PAYMENT.GET_CREDENTIAL);

  return response.data.data;
}
