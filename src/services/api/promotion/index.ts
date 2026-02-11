import { IApplyPromotionRequest } from '../../../types/api/promotion/req/IApplyPromotionRequest.ts';
import { IApplyPromotionResponse } from '../../../types/api/promotion/res/IApplyPromotionResponse.ts';
import { IUserApiResponse } from '../../../types/api/common/IUserApiResponse.ts';
import { newUserApiInstance, userApiInstance } from '@services/api/axiosConfig.ts';
import { AvailablePromocodeResponse, IGetPromotionsParams, IPromotionsResponse } from '@app-types/models/Promotion.ts';

enum PROMOTION {
  APPLY_URL = '/promotion/apply',
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
  const response = await newUserApiInstance.get<IPromotionsResponse>(
    PROMOTION.GET_PROMOTIONS + `?filter=${params?.filters}`
  );
  return response.data; 
}
