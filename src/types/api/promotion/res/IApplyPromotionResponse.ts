export interface IApplyPromotionResponse {
  promotionId: number;
  type: number;
  code: string;
  point: number;
  cashbackType: number;
  expiryDate: number;
  isActive: number;
  periodUse: number;
  createdAt: number;
  updatedAt: number;
  createdBy: number;
  title: string;
  description: string;
  totalPoints?: number;
}
