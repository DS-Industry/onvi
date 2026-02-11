export interface AvailablePromocodeCampaign {
  id: number;
  name: string;
  description: string | null;
}

export interface AvailablePromocodeMobileDisplay {
  id: number;
  marketingCampaignId: number;
  imageLink: string;
  description?: string;
  type: "PersonalPromocode" | "Promo";
  createdAt: string;
  updatedAt: string;
}

export interface AvailablePromocodeResponse {
  id: number;
  code: string;
  campaignId: number | null;
  promocodeType: string;
  discountType: string | null;
  discountValue: number | null;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  maxUsage: number | null;
  maxUsagePerUser: number;
  currentUsage: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  posId: number | null;
  campaign: AvailablePromocodeCampaign | null;
  mobileDisplay: AvailablePromocodeMobileDisplay | null;
}

export interface IPromotionsResponse {
  data: AvailablePromocodeResponse[];
}

export enum EPromorionsFilter {
  ALL = 'all',
  PERSONAL = 'personal',
  MARKETING_CAMPAIGNS = 'marketing-campaigns',
}

export interface IGetPromotionsParams {
  filters?: EPromorionsFilter;
  carWashId?: string;
}
