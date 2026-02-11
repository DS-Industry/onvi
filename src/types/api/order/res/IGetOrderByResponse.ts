import { OrderStatusCode } from "../status/OrderStatusCode"

export interface IGetOrderResponse {
  id: number,
  status: OrderStatusCode,
  transactionId: string,
  carWashDeviceId: number,
  sum: number,
  cashback: number,
  createdAt: Date
}