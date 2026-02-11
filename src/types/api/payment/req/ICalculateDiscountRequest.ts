import { BayTypeEnum } from "@app-types/BayTypeEnum";

export interface ICalculateDiscountRequest {
  sum: number;
  sumBonus?: number;
  rewardPointsUsed?: number;
  promoCodeId?: number;
  carWashId: number;
  carWashDeviceId: number;
  bayType?: BayTypeEnum;
}