export enum REGISTER_STATUS {
  CREATED = 'waiting_payment',
  FAIL = 'failed',
}

export interface IRegisterOrderResponse {
  status: REGISTER_STATUS;
  paymentId: string;
  confirmation_url: string;
}
