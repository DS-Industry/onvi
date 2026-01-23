import { ICreateOrderRequest } from '../../../types/api/order/req/ICreateOrderRequest.ts';
import { ICreateOrderResponse } from '../../../types/api/order/res/ICreateOrderResponse.ts';
import { IUserApiResponse } from '../../../types/api/common/IUserApiResponse.ts';
import { IValidatePromoCodeRequest } from '../../../types/api/order/req/IValidatePromoCodeRequest.ts';
import { IValidatePromoCodeResponse } from '../../../types/api/order/res/IValidatePromoCodeResponse.ts';
import { IPingPosRequestParams } from '../../../types/api/order/req/IPingPosRequestParams.ts';
import { IPingPosResponse } from '../../../types/api/order/res/IPingPosResponse.ts';
import { newUserApiInstance, userApiInstance } from '@services/api/axiosConfig.ts';
import { IRegisterOrderRequest } from 'src/types/api/order/req/IRegisterOrderRequest.ts';
import { IRegisterOrderResponse } from 'src/types/api/order/res/IRegisterOrderResponse.ts';
import { IGetOrderResponse } from 'src/types/api/order/res/IGetOrderByResponse.ts';
import { OrderStatusCode } from '@app-types/api/order/status/OrderStatusCode.ts';
import { IGetLatestCarwashRequestParams } from '@app-types/api/order/req/IGetLatestCarwashRequestParams.ts';

enum NEW_ORDER {
  CREATE_ORDER = '/client/order/create',
  REGISTER_ORDER = '/client/order/register',
  PING_POS_URL = '/client/order/ping',
  GET_ORDER_BY_ORDER_ID = '/client/order',
  UPDATE_ORDER_STATUS = '/client/order/status',
}

enum ORDER {
  VALIDATE_PROMOCODE_URL = '/order/promo/validate',
  PING_POS_URL = '/order/ping',
  LATEST = '/order/latest',
}

export async function orderCreate(
  body: ICreateOrderRequest,
): Promise<ICreateOrderResponse> {
  try {
    console.log("orderCreate request");

    const response = await newUserApiInstance.post<ICreateOrderResponse>(NEW_ORDER.CREATE_ORDER, body);
    console.log("orderCreate:", response);

    return response.data;
  } catch (error) {
    console.error("orderCreate failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function orderRegister(
  body: IRegisterOrderRequest,
): Promise<IRegisterOrderResponse> {
  try {
    const response = await newUserApiInstance.post<IRegisterOrderResponse>(NEW_ORDER.REGISTER_ORDER, body);
    console.log("orderRegister:", response.data);

    return response.data;
  } catch (error) {
    console.error("orderRegister failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
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
  try {
    const response = await newUserApiInstance.get<IPingPosResponse>(
      NEW_ORDER.PING_POS_URL + `?carWashId=${params.carWashId}&carWashDeviceId=${params.carWashDeviceId}`
    );
    console.log("pingPos: ", response);
    
    return response.data;
  } catch (error) {
    console.error("pingPos failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function getOrderByOrderId(
  id: number,
): Promise<IGetOrderResponse> {
  try {
    const response = await newUserApiInstance.get<IGetOrderResponse>(
      NEW_ORDER.GET_ORDER_BY_ORDER_ID + `/${id}`,
    );
    console.log("getOrderByOrderId: ", response);

    return response.data;
  } catch (error) {
    console.error("getOrderByOrderId failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatusCode,
): Promise<void> {
  try {
    const response = await newUserApiInstance.post<void>(
      `${NEW_ORDER.UPDATE_ORDER_STATUS}/${id}`,
      { status },
    );
    console.log("updateOrderStatus: ", response);

    return response.data;
  } catch (error) {
    console.error("updateOrderStatus failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function getLatestCarwash(
  params: IGetLatestCarwashRequestParams,
): Promise<number[]> {
  const response = await userApiInstance.get<IUserApiResponse<number[]>>(
    ORDER.LATEST,
    { params },
  );
  return response.data.data;
}
