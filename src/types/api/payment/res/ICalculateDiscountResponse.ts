export interface IUsedTransactionalCampaign {
  campaignId: number;
  campaignName: string;
  actionId: number;
  discountAmount: number;
}

export interface ICalculateDiscountResponse {
  sumFull: number;
  sumBonus: number;
  sumDiscount: number;
  sumReal: number;
  sumCashback: number;
  transactionalCampaignDiscount: number;
  promoCodeDiscount: number;
  usedTransactionalCampaign: IUsedTransactionalCampaign | null;
  usedPromoCode: boolean;
}