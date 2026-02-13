import {
  NewCampaign,
  StrapiCampaign
} from '../../../types/api/app/types.ts';
import { newUserApiInstance } from '@services/api/axiosConfig.ts';

enum CAMPAIGN {
  GET_NEW_CAMPAIGN_LIST = 'client/order/marketing-campaigns',
}

export async function getCampaignList(
): Promise<StrapiCampaign[] | NewCampaign[]> {
  const response = await newUserApiInstance.get<NewCampaign[]>(
    CAMPAIGN.GET_NEW_CAMPAIGN_LIST
  );

  return response.data;
}