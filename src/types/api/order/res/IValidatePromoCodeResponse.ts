export interface IValidatePromoCodeResponse {
  isValid: boolean;
  promoCodeId: number | null;
  isPersonal: boolean;
  isMarketingCampaign: boolean;
  message: string;
}
