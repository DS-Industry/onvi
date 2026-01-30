import { ICreateOrderRequest } from '../../../types/api/order/req/ICreateOrderRequest.ts';
import { ICreateOrderResponse } from '../../../types/api/order/res/ICreateOrderResponse.ts';
import { IValidatePromoCodeRequest } from '../../../types/api/order/req/IValidatePromoCodeRequest.ts';
import { IValidatePromoCodeResponse } from '../../../types/api/order/res/IValidatePromoCodeResponse.ts';
import { IPingPosRequestParams } from '../../../types/api/order/req/IPingPosRequestParams.ts';
import { IPingPosResponse } from '../../../types/api/order/res/IPingPosResponse.ts';
import { newUserApiInstance } from '@services/api/axiosConfig.ts';
import { IRegisterOrderRequest } from 'src/types/api/order/req/IRegisterOrderRequest.ts';
import { IRegisterOrderResponse } from 'src/types/api/order/res/IRegisterOrderResponse.ts';
import { IGetOrderResponse } from 'src/types/api/order/res/IGetOrderByResponse.ts';
import { OrderStatusCode } from '@app-types/api/order/status/OrderStatusCode.ts';
import { IGetLatestCarwashRequestParams } from '@app-types/api/order/req/IGetLatestCarwashRequestParams.ts';
import { ICarWashTransaction, IGetLatestCarwashResponse } from '@app-types/api/order/res/IGetLatestCarwashResponse.ts';

enum NEW_ORDER {
  CREATE_ORDER = '/client/order/create',
  REGISTER_ORDER = '/client/order/register',
  PING_POS_URL = '/client/order/ping',
  GET_ORDER_BY_ORDER_ID = '/client/order',
  UPDATE_ORDER_STATUS = '/client/order/status',
  VALIDATE_PROMOCODE_URL = '/client/order/validate-promocode',
  LATEST = '/client/order/latest',
}

export async function orderCreate(
  body: ICreateOrderRequest,
): Promise<ICreateOrderResponse> {
  const response = await newUserApiInstance.post<ICreateOrderResponse>(NEW_ORDER.CREATE_ORDER, body);
  return response.data;
}

export async function orderRegister(
  body: IRegisterOrderRequest,
): Promise<IRegisterOrderResponse> {
  const response = await newUserApiInstance.post<IRegisterOrderResponse>(NEW_ORDER.REGISTER_ORDER, body);
  return response.data;
}

export async function validatePromoCode(
  body: IValidatePromoCodeRequest,
): Promise<IValidatePromoCodeResponse> {
  const response = await newUserApiInstance.post<IValidatePromoCodeResponse>(NEW_ORDER.VALIDATE_PROMOCODE_URL, body);
  return response.data;
}

export async function pingPos(
  params: IPingPosRequestParams,
): Promise<IPingPosResponse> {
  const response = await newUserApiInstance.get<IPingPosResponse>(
    NEW_ORDER.PING_POS_URL + `?carWashId=${params.carWashId}&carWashDeviceId=${params.carWashDeviceId}`
  );
  return response.data;
}

export async function getOrderByOrderId(
  id: number,
): Promise<IGetOrderResponse> {
  const response = await newUserApiInstance.get<IGetOrderResponse>(
    NEW_ORDER.GET_ORDER_BY_ORDER_ID + `/${id}`,
  );
  return response.data;
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatusCode,
): Promise<void> {
  const response = await newUserApiInstance.post<void>(
    `${NEW_ORDER.UPDATE_ORDER_STATUS}/${id}`,
    { status },
  );
  return response.data;
}

export async function getLatestCarwash(
  params: IGetLatestCarwashRequestParams,
): Promise<ICarWashTransaction[]> {
  const response = await newUserApiInstance.get<IGetLatestCarwashResponse>(
    NEW_ORDER.LATEST,
    { params },
  );
  return response.data.data;
}