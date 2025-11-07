import {IApplyPromotionRequest} from '../../../types/api/promotion/req/IApplyPromotionRequest.ts';
import {IApplyPromotionResponse} from '../../../types/api/promotion/res/IApplyPromotionResponse.ts';
import {IUserApiResponse} from '../../../types/api/common/IUserApiResponse.ts';
import {userApiInstance} from '@services/api/axiosConfig.ts';
import {IGlobalPromotion} from '../../../types/models/GlobalPromotion.ts';

enum PROMOTION {
  APPLY_URL = '/promotion/apply',
  GET_GLOBAL_PROMOTIONS = '/promotion',
}
export async function apply(
  body: IApplyPromotionRequest,
): Promise<IApplyPromotionResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<IApplyPromotionResponse>
  >(PROMOTION.APPLY_URL, body);

  return response.data.data;
}

export async function getGlobalPromotions(): Promise<IGlobalPromotion[]> {
  const response = await userApiInstance.get<
    IUserApiResponse<IGlobalPromotion[]>
  >(PROMOTION.GET_GLOBAL_PROMOTIONS);

  return response.data.data;
}
