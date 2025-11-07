export interface IRegisterOrderRequest {
  orderId: number;
  transactionId: string;
  paymentToken: string;
  amount: string;
  description: string;
  receiptReturnPhoneNumber: string;
  err?: number;
}
