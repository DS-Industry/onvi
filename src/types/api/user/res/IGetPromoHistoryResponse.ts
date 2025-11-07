export interface IGetPromoHistoryResponse {
  cardId: number;
  promotionId: number;
  title: string;
  description: string;
  code: string;
  type: number;
  point: number;
  cashbackType: number;
  cashbackSum: number;
  promotionUsageId: number;
  expiryPeriodDate: Date;
  usageDate: Date;
}
