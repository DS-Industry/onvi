import { IApplyPromotionRequest } from '../../../types/api/promotion/req/IApplyPromotionRequest.ts';
import { IApplyPromotionResponse } from '../../../types/api/promotion/res/IApplyPromotionResponse.ts';
import { IUserApiResponse } from '../../../types/api/common/IUserApiResponse.ts';
import { newUserApiInstance, userApiInstance } from '@services/api/axiosConfig.ts';
import { IGlobalPromotion } from '../../../types/models/GlobalPromotion.ts';
import { AvailablePromocodeResponse, IGetPromotionsParams, IPromotionsResponse } from '@app-types/models/Promotion.ts';

enum PROMOTION {
  APPLY_URL = '/promotion/apply',
  GET_GLOBAL_PROMOTIONS = '/promotion',
  GET_PROMOTIONS = '/client/order/promocodes',
}
export async function apply(
  body: IApplyPromotionRequest,
): Promise<IApplyPromotionResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<IApplyPromotionResponse>
  >(PROMOTION.APPLY_URL, body);

  return response.data.data;
}
export async function getPromotions(params?: IGetPromotionsParams): Promise<AvailablePromocodeResponse[]> {
  try {
    const response = await newUserApiInstance.get<IPromotionsResponse>(
      PROMOTION.GET_PROMOTIONS + `?filter=${params?.filters}`
    );

    console.log("getPromotions", response.data);

    return response.data; 
  } catch (error) {
    console.error("getPromotions failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
      ulr: error.response
    });
    throw error;
  }
}
