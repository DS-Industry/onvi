export interface IGlobalPromotion {
  type: number; // Type of the promotion
  image: string; // URL to the promotion image
  code: string; // Promo code
  point: number; // Points associated with the promotion
  cashbackType: number; // Type of cashback
  cashbackSum: number; // Cashback amount
  expiryDate: string; // Expiry date of the promotion in ISO format
  isActive: number; // 1 if active, 0 if inactive
  periodUse: number; // Period of use in days
  createdAt: string; // ISO date when the promotion was created
  createdBy: number; // ID of the user who created the promotion
  promotionId: number; // Unique identifier for the promotion
  updatedAt: string; // ISO date when the promotion was last updated
  title: string; // Title of the promotion
  description: string; // Description of the promotion
}
