export interface IRegisterRequest {
  phone: string;
  otp: string;
  isTermsAccepted?: boolean;
  isPromoTermsAccepted?: boolean;
}
