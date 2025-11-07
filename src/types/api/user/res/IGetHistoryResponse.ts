export interface IGetHistoryResponse {
  unqCardNumber: string;
  name: string;
  phone: string;
  operDate: Date;
  operSum: number;
  operSumReal: number;
  operSumPoint: number;
  cashBackAmount?: number;
  carWash: string;
  bay: number;
  address: string;
  city: string;
}
