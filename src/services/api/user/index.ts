import { IUser, Meta } from '../../../types/models/User.ts';
import { IUserApiResponse, IUserGetMeResponse } from '../../../types/api/common/IUserApiResponse.ts';
import { IGetTariffResponse } from '../../../types/api/user/res/IGetTariffResponse.ts';
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

enum NEW_ACCOUNT_ENDPOINTS {
  GET_CLIENT_ME = '/client/client/me',
  CREATE_ACCOUNT_META = '/client/client/meta/create',
  GET_FREE_VACUUM = '/client/card/free-vacuum',
  GET_TARIFF_URL = '/client/card/tariff',
  UPDATE_ACCOUNT_URL = '/client/client/account/update',
  ACCOUNT_URL = '/client/client',
  UPDATE_ACCOUNT_META = '/client/client/meta/update',
}

enum ACCOUNT {
  GET_MET_URL = '/account/me',
  GET_ORDER_HISTORY_URL = '/account/orders',
  GET_PROMOTION_HISTORY_URL = '/account/promotion',
  GET_ACTIVE_PROMOTIONS = 'account/activePromotion',
  UPDATE_NOTIFICATION_URL = '/account/notifications',
  FAVORITES = '/account/favorites',
}

export async function getClientMe(): Promise<IUserGetMeResponse> {
  const response = await newUserApiInstance.get<IUserGetMeResponse>(
    NEW_ACCOUNT_ENDPOINTS.GET_CLIENT_ME
  );
  console.log("getClientMe:", response.data);

  return response.data;
}

export async function getTariff(): Promise<IGetTariffResponse> {
  try {
    const response = await newUserApiInstance.get<IGetTariffResponse>(NEW_ACCOUNT_ENDPOINTS.GET_TARIFF_URL);
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
): Promise<IGetHistoryResponse[]> {
  const response = await userApiInstance.get<
    IUserApiResponse<IGetHistoryResponse[]>
  >(ACCOUNT.GET_ORDER_HISTORY_URL, { params });

  return response.data.data;
}

export async function getCampaignHistory(): Promise<
  IGetPromoHistoryResponse[]
> {
  const response = await userApiInstance.get<
    IUserApiResponse<IGetPromoHistoryResponse[]>
  >(ACCOUNT.GET_PROMOTION_HISTORY_URL);
  return response.data.data;
}

export async function update(body: IUpdateAccountRequest): Promise<number> {
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

export async function updateAllowNotificationSending(
  notification: boolean,
): Promise<void> {
  await userApiInstance.patch(ACCOUNT.UPDATE_NOTIFICATION_URL, { notification });
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
    console.error("Refresh failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
      ulr: error.response
    });
    throw error;
  }
}

export async function getFavorites(): Promise<number[]> {
  const response = await userApiInstance.get<IUserApiResponse<number[]>>(
    ACCOUNT.FAVORITES,
  );
  return response.data.data;
}

export async function postFavorites(
  body: IPostAccountFavorites,
): Promise<number[]> {
  const response = await userApiInstance.post<IUserApiResponse<number[]>>(
    ACCOUNT.FAVORITES,
    body,
  );
  return response.data.data;
}

export async function removeFavorites(
  body: IPostAccountFavorites,
): Promise<number[]> {
  const response = await userApiInstance.delete<IUserApiResponse<number[]>>(
    ACCOUNT.FAVORITES,
    { data: body },
  );
  return response.data.data;
}
