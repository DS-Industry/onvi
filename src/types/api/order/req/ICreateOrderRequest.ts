export interface ICreateOrderRequest {
  sum: number;
  originalSum?: number;
  rewardPointsUsed: number;
  promoCodeId?: number;
  carWashId: number;
  bayNumber: number;
  bayType?: string | null;
  err?: number;
}
