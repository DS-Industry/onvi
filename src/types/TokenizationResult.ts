import {PaymentMethodTypesEnum} from './PaymentType';

export interface TokenizationResult {
  token: string;
  paymentMethodType: PaymentMethodTypesEnum;
}
