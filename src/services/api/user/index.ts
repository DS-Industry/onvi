import { IUserGetMeResponse } from '../../../types/api/common/IUserApiResponse.ts';
import { IGetAccountHistoryRequestParams } from '../../../types/api/user/req/IGetAccountHistoryRequestParams.ts';
import { IGetHistoryResponse } from '../../../types/api/user/res/IGetHistoryResponse.ts';
import { IGetPromoHistoryResponse } from '../../../types/api/user/res/IGetPromoHistoryResponse.ts';
import { IUpdateAccountRequest } from '../../../types/api/user/req/IUpdateAccountRequest.ts';
import { IUpdateAccountResponse } from '../../../types/api/user/res/IUpdateAccountResponse.ts';
import { newUserApiInstance, userApiInstance } from '@services/api/axiosConfig.ts';
import { ICreateUserMetaRequest } from '../../../types/api/user/req/ICreateUserMetaRequest.ts';
import { IUpdateUserMetaRequest } from '../../../types/api/user/req/IUpdateUserMetaRequest.ts';
import { IPersonalPromotion } from '../../../types/models/PersonalPromotion.ts';
import { IGetFreeVacuum } from 'src/types/api/user/res/IGetFreeVacuum.ts';
import { IgetActiveClientPromotionsParams } from 'src/types/api/promotion/req/IApplyPromotionRequest.ts';
import { IPostAccountFavorites } from '@app-types/api/user/req/IPostAccountFavorites.ts';
import { ITariffResponse } from '@app-types/api/user/res/IGetTariffResponse.ts';
import { Meta } from '../../../types/models/User.ts';
import { IUserApiResponse } from '../../../types/api/common/IUserApiResponse.ts';

enum NEW_ACCOUNT_ENDPOINTS {
  GET_CLIENT_ME = '/client/client/me',
  CREATE_ACCOUNT_META = '/client/client/meta/create',
  GET_FREE_VACUUM = '/client/card/free-vacuum',
  GET_TARIFF_URL = '/client/card/tariff',
  UPDATE_ACCOUNT_URL = '/client/client/account/update',
  ACCOUNT_URL = '/client/client',
  UPDATE_ACCOUNT_META = '/client/client/meta/update',
  GET_ORDER_HISTORY_URL = '/client/card/orders',
  FAVORITES = '/client/client/favorites',
}

enum ACCOUNT {
  GET_PROMOTION_HISTORY_URL = '/account/promotion',
  GET_ACTIVE_PROMOTIONS = 'account/activePromotion',
}

export async function getClientMe(): Promise<IUserGetMeResponse> {
  const response = await newUserApiInstance.get<IUserGetMeResponse>(
    NEW_ACCOUNT_ENDPOINTS.GET_CLIENT_ME
  );
  return response.data;
}

export async function getTariff(): Promise<ITariffResponse> {
  const response = await newUserApiInstance.get<ITariffResponse>(NEW_ACCOUNT_ENDPOINTS.GET_TARIFF_URL);
  return response.data;
}

export async function getOrderHistory(
  params: IGetAccountHistoryRequestParams,
): Promise<IGetHistoryResponse> {
  const response = await newUserApiInstance.get<IGetHistoryResponse>(
    NEW_ACCOUNT_ENDPOINTS.GET_ORDER_HISTORY_URL,
    { params }
  );
  return response.data;
}

export async function getCampaignHistory(): Promise<IGetPromoHistoryResponse[]> {
  const response = await userApiInstance.get<IUserApiResponse<IGetPromoHistoryResponse[]>>(
    ACCOUNT.GET_PROMOTION_HISTORY_URL
  );
  return response.data.data;
}

export async function accountUpdate(body: IUpdateAccountRequest): Promise<number> {
  try {
    const response = await newUserApiInstance.patch<IUserApiResponse<IUpdateAccountResponse>>(
      NEW_ACCOUNT_ENDPOINTS.UPDATE_ACCOUNT_URL,
      body
    );
    
    return response.status;
  } catch (error) {
    throw error;
  }
}

export async function getActiveClientPromotions(
  params?: IgetActiveClientPromotionsParams,
): Promise<IPersonalPromotion[]> {
  const response = await userApiInstance.get<IUserApiResponse<IPersonalPromotion[]>>(
    ACCOUNT.GET_ACTIVE_PROMOTIONS,
    { params }
  );
  return response.data.data;
}

export async function createUserMeta(data: Meta): Promise<any> {
  const body: ICreateUserMetaRequest = {
    clientId: data.clientId,
    deviceId: data.deviceId,
    model: data.model,
    name: data.name,
    platform: data.platform,
    platformVersion: data.platformVersion,
    manufacturer: data.manufacturer,
    appToken: data.appToken,
  };
  const response = await newUserApiInstance.post(
    NEW_ACCOUNT_ENDPOINTS.CREATE_ACCOUNT_META,
    body,
  );
  return response;
}

export async function updateUserMeta(data: Meta): Promise<any> {
  const body: IUpdateUserMetaRequest = {
    ...data,
  };
  const response = await newUserApiInstance.post(
    NEW_ACCOUNT_ENDPOINTS.UPDATE_ACCOUNT_META,
    body,
  );
  return response;
}

export async function deleteAccount(): Promise<number> {
  const response = await newUserApiInstance.delete(NEW_ACCOUNT_ENDPOINTS.ACCOUNT_URL);
  return response.status;
}

export async function getFreeVacuum(): Promise<IGetFreeVacuum> {
  const response = await newUserApiInstance.get<IGetFreeVacuum>(
    NEW_ACCOUNT_ENDPOINTS.GET_FREE_VACUUM,
  );
  return response.data;
}

export async function getFavorites(): Promise<number[]> {
  const response = await newUserApiInstance.get<number[]>(
    NEW_ACCOUNT_ENDPOINTS.FAVORITES,
  );
  return response.data;
}

export async function postFavorites(
  body: IPostAccountFavorites,
): Promise<number[]> {
  const response = await newUserApiInstance.post<number[]>(
    NEW_ACCOUNT_ENDPOINTS.FAVORITES,
    body,
  );
  return response.data;
}

export async function removeFavorites(
  body: IPostAccountFavorites,
): Promise<number[]> {
  const response = await newUserApiInstance.delete<number[]>(
    NEW_ACCOUNT_ENDPOINTS.FAVORITES,
    { data: body },
  );
  return response.data;
}
