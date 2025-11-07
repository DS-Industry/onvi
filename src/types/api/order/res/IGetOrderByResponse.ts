export interface IGetOrderResponse {
  id: number;
  status: string;
  carWashId: number;
  bayNumber: number;
  sum: number;
  cashback: number;
  card: {
    id: number;
    number: string;
  };
  promoCodeId?: number;
  discountAmount?: number;
  rewardPointsUsed: number;
  createdAt: string;
  transactionId?: string;
  error?: string;
}
