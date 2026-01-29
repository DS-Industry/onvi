export enum BenefitType {
  CASHBACK = 'CASHBACK',
}

export interface ITierBenefit {
  bonus: number;
  benefitType: BenefitType;
}

export interface ITier {
  id: number;
  name: string;
  description: string;
  limitBenefit: number | null;
  benefits: ITierBenefit[];
}

export interface ITariffResponse {
  cardId: number;
  balance: number;
  devNumber: string;
  number: string;
  monthlyLimit: number | null;
  tier?: ITier; 
}