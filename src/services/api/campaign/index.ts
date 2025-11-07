import {
  Campaign,
  CampaignsSuccessRequestPayload,
  CampaignSuccessRequestPayload,
} from '../../../types/api/app/types.ts';
import {contentApiInstance} from '@services/api/axiosConfig.ts';

enum CAMPAIGN {
  GET_CAMPAIGN_LIST = 'api/sampaigns',
  GET_CAMPAIGN_BY_ID = 'api/sampaigns',
}

export async function getCampaignList(
  populate: Record<string, any> | '*' = {},
): Promise<Campaign[]> {
  const params: Record<string, any> = {};

  if (populate === '*') {
    // If user wants to populate everything
    params.populate = '*';
  } else {
    // Dynamically add specific populate fields
    for (const [key, value] of Object.entries(populate)) {
      params[`populate[${key}]`] = value;
    }
  }

  const response = await contentApiInstance.get<CampaignsSuccessRequestPayload>(
    CAMPAIGN.GET_CAMPAIGN_LIST,
    {params},
  );

  return response.data.data;
}

export async function getCampaignById(
  id: number,
  populate: Record<string, any> | '*' = {},
): Promise<Campaign> {
  const params: Record<string, any> = {};

  if (populate === '*') {
    // If user wants to populate everything
    params.populate = '*';
  } else {
    // Dynamically add specific populate fields
    for (const [key, value] of Object.entries(populate)) {
      params[`populate[${key}]`] = value;
    }
  }

  const response = await contentApiInstance.get<CampaignSuccessRequestPayload>(
    CAMPAIGN.GET_CAMPAIGN_BY_ID + `/${id}`,
    {params},
  );

  return response.data.data;
}
