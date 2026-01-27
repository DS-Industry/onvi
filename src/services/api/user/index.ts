import { IUser, Meta } from '../../../types/models/User.ts';
import { IUserApiResponse, IUserGetMeResponse } from '../../../types/api/common/IUserApiResponse.ts';
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
import { IFavoritesResponse } from '@app-types/api/user/res/IFavoritesResponse.ts';

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
  console.log("getClientMe:", response.data);

  return response.data;
}

export async function getTariff(): Promise<ITariffResponse> {
  try {
    const response = await newUserApiInstance.get<ITariffResponse>(NEW_ACCOUNT_ENDPOINTS.GET_TARIFF_URL);
    console.log("getTariff:", response);

    return response.data;
  } catch (error) {
    console.error("getTariff failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function getOrderHistory(
  params: IGetAccountHistoryRequestParams,
): Promise<IGetHistoryResponse> {
  try {
    console.log("getOrderHistory params", params);

    const response = await newUserApiInstance.get<IGetHistoryResponse>(
      NEW_ACCOUNT_ENDPOINTS.GET_ORDER_HISTORY_URL,
      { params }
    );
    console.log("getOrderHistory: ", response.data);

    return response.data;
  } catch (error) {
    console.error("getOrderHistory failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function getCampaignHistory(): Promise<
  IGetPromoHistoryResponse[]
> {
  const response = await userApiInstance.get<
    IUserApiResponse<IGetPromoHistoryResponse[]>
  >(ACCOUNT.GET_PROMOTION_HISTORY_URL);
  return response.data.data;
}

export async function accountUpdate(body: IUpdateAccountRequest): Promise<number> {
  try {
    const response = await newUserApiInstance.patch<
      IUserApiResponse<IUpdateAccountResponse>
    >(NEW_ACCOUNT_ENDPOINTS.UPDATE_ACCOUNT_URL, body);
    console.log("accountUpdate:", response);

    return response.status;
  } catch (error) {
    console.error("createUserMetad failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function getActiveClientPromotions(
  params?: IgetActiveClientPromotionsParams,
): Promise<IPersonalPromotion[]> {
  const response = await userApiInstance.get<
    IUserApiResponse<IPersonalPromotion[]>
  >(ACCOUNT.GET_ACTIVE_PROMOTIONS, { params });

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
  try {
    console.log("createUserMeta body:", body);

    const response = await newUserApiInstance.post(
      NEW_ACCOUNT_ENDPOINTS.CREATE_ACCOUNT_META,
      body,
    );

    console.log("createUserMeta:", response);

    return response;
  } catch (error) {
    console.error("createUserMetad failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function updateUserMeta(data: Meta): Promise<any> {
  const body: IUpdateUserMetaRequest = {
    ...data,
  };
  try {
    console.log("updateUserMeta body", body);

    const response = await newUserApiInstance.post(
      NEW_ACCOUNT_ENDPOINTS.UPDATE_ACCOUNT_META,
      body,
    );

    console.log("updateUserMeta", response);

    return response;
  } catch (error) {
    console.error("updateUserMeta failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
    });
    throw error;
  }
}

export async function deleteAccount(): Promise<number> {
  try {
    const response = await newUserApiInstance.delete(NEW_ACCOUNT_ENDPOINTS.ACCOUNT_URL);
    console.log("deleteAccount:", response);
    return response.status;

  } catch (error) {
    console.error("deleteAccount failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
      ulr: error.response
    });
    throw error;
  }
}

export async function getFreeVacuum(): Promise<IGetFreeVacuum> {
  try {
    const response = await newUserApiInstance.get<IUserApiResponse<IGetFreeVacuum>>(
      NEW_ACCOUNT_ENDPOINTS.GET_FREE_VACUUM,
    );
    console.log("getFreeVacuum", response);

    return response.data.data;
  } catch (error) {
    console.error("getFreeVacuum failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
      ulr: error.response
    });
    throw error;
  }
}

export async function getFavorites(): Promise<number[]> {
  try {
    const response = await newUserApiInstance.get<number[]>(
      NEW_ACCOUNT_ENDPOINTS.FAVORITES,
    );
    console.log("getFavorites:", response);

    return response.data;
  } catch (error) {
    console.error("getFavorites failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
      ulr: error.response
    });
    throw error;
  }
}

export async function postFavorites(
  body: IPostAccountFavorites,
): Promise<number[]> {
  const response = await newUserApiInstance.post<number[]>(
    NEW_ACCOUNT_ENDPOINTS.FAVORITES,
    body,
  );
  console.log("postFavorites:", response);

  return response.data;
}

export async function removeFavorites(
  body: IPostAccountFavorites,
): Promise<number[]> {
  const response = await newUserApiInstance.delete<number[]>(
    NEW_ACCOUNT_ENDPOINTS.FAVORITES,
    { data: body },
  );
  console.log("removeFavorites:", response);

  return response.data;
}
