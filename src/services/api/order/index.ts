import {ICreateOrderRequest} from '../../../types/api/order/req/ICreateOrderRequest.ts';
import {ICreateOrderResponse} from '../../../types/api/order/res/ICreateOrderResponse.ts';
import {IUserApiResponse} from '../../../types/api/common/IUserApiResponse.ts';
import {IValidatePromoCodeRequest} from '../../../types/api/order/req/IValidatePromoCodeRequest.ts';
import {IValidatePromoCodeResponse} from '../../../types/api/order/res/IValidatePromoCodeResponse.ts';
import {IPingPosRequestParams} from '../../../types/api/order/req/IPingPosRequestParams.ts';
import {IPingPosResponse} from '../../../types/api/order/res/IPingPosResponse.ts';
import {userApiInstance} from '@services/api/axiosConfig.ts';
import {IRegisterOrderRequest} from 'src/types/api/order/req/IRegisterOrderRequest.ts';
import {IRegisterOrderResponse} from 'src/types/api/order/res/IRegisterOrderResponse.ts';
import {IGetOrderResponse} from 'src/types/api/order/res/IGetOrderByResponse.ts';
import {OrderStatusCode} from '@app-types/api/order/status/OrderStatusCode.ts';
import {IGetLatestCarwashRequestParams} from '@app-types/api/order/req/IGetLatestCarwashRequestParams.ts';

enum ORDER {
  CREATE_ORDER_URL = '/order/create',
  VALIDATE_PROMOCODE_URL = '/order/promo/validate',
  PING_POS_URL = '/order/ping',
  REGISTER_ORDER = '/order/register',
  GET_ORDER_BY_ORDER_ID = '/order',
  UPDATE_ORDER_STATUS = '/order/status',
  LATEST = '/order/latest',
}

export async function create(
  body: ICreateOrderRequest,
): Promise<ICreateOrderResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<ICreateOrderResponse>
  >(ORDER.CREATE_ORDER_URL, body);
  return response.data.data;
}

export async function validatePromoCode(
  body: IValidatePromoCodeRequest,
): Promise<IValidatePromoCodeResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<IValidatePromoCodeResponse>
  >(ORDER.VALIDATE_PROMOCODE_URL, body);
  return response.data.data;
}

export async function pingPos(
  params: IPingPosRequestParams,
): Promise<IPingPosResponse> {
  const response = await userApiInstance.get<
    IUserApiResponse<IPingPosResponse>
  >(ORDER.PING_POS_URL, {params});
  return response.data.data;
}

export async function register(
  body: IRegisterOrderRequest,
): Promise<IRegisterOrderResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<IRegisterOrderResponse>
  >(ORDER.REGISTER_ORDER, body);
  return response.data.data;
}

export async function getOrderByOrderId(
  id: number,
): Promise<IGetOrderResponse> {
  const response = await userApiInstance.get(
    ORDER.GET_ORDER_BY_ORDER_ID + `/${id}`,
  );
  return response.data.data;
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatusCode,
): Promise<void> {
  const response = await userApiInstance.post<IUserApiResponse<void>>(
    `${ORDER.UPDATE_ORDER_STATUS}/${id}`,
    {status},
  );
  return response.data.data;
}

export async function getLatestCarwash(
  params: IGetLatestCarwashRequestParams,
): Promise<number[]> {
  const response = await userApiInstance.get<IUserApiResponse<number[]>>(
    ORDER.LATEST,
    {params},
  );
  return response.data.data;
}
