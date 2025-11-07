export enum SendStatus {
  CREATED = 'created',
  FAIL = 'failed',
}

export interface ICreateOrderResponse {
  status: SendStatus;
  orderId: number;
}
