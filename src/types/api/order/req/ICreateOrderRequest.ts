export interface ICreateOrderRequest {
  sum: number;
  rewardPointsUsed: number;
  sumBonus?: number;
  promoCodeId?: number;
  carWashId: number;
  carWashDeviceId: number;
  bayType?: string | null;
  err?: number;
}
