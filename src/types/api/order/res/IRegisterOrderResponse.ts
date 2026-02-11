export enum REGISTER_STATUS {
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  FAIL = 'FAILED',
}

export interface IRegisterOrderResponse {
  status: REGISTER_STATUS;
  paymentId: string;
  confirmation_url: string;
}
