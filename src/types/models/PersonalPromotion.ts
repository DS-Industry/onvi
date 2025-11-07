export enum DiscountType {
  CASH = 1,
  DISCOUNT,
}

export interface IPersonalPromotion {
  code: string; // Promo code
  discountType: DiscountType; // Type of discount (e.g., percentage, fixed amount)
  expiryDate: Date; // Expiry date of the promotion in ISO format (YYYY-MM-DD)
  isActive: number; // 1 if active, 0 if inactive
  createdAt: Date; // ISO date when the promotion was created
  createdBy: Date; // ID of the user who created the promotion
  id: number; // Unique identifier for the personal promo
  discount: number; // Discount amount (e.g., percentage or fixed amount)
  updatedAt: string; // ISO date when the promotion was last updated
  image: string | null; // URL for the promo image (nullable)
  usageAmount: number; // Number of times the promo can be used
}
