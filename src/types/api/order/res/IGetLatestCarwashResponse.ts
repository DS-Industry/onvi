export interface ICarWashTransaction {
  id: number;
  transactionId: null | string;
  sumFull: number;
  sumReal: number;
  sumBonus: number;
  sumDiscount: number;
  sumCashback: number;
  orderData: string; 
  orderStatus: string;
  platform: string;
  carWashDeviceId: number;
  carWashId: number;
  posName: string;
  posAddress: string;
}

export interface IGetLatestCarwashResponse {
  data: ICarWashTransaction[];
}

