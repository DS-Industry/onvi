export interface ITransaction {
  id: number;
  transactionId: string | null;
  sumFull: number;
  sumReal: number;
  sumBonus: number;
  sumDiscount: number;
  sumCashback: number;
  orderData: string;
  orderStatus: string;
  platform: string;
  carWashDeviceId: number;
  posName: string;
  posAddress: string;
}

export interface IMeta {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface IGetHistoryResponse {
  data: ITransaction[];
  meta: IMeta;
}
