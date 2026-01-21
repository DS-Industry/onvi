import { IUser, Meta } from "@app-types/models/User";

export interface IUserApiResponse<T> {
  data: T;
  path: string;
  duration: string;
  method: string;
}

export interface IUserExtended extends IUser {
  cardId: number;
  cardNumber: string; 
  cardUnqNumber: string; 
  cardBalance: number;
}

export interface IUserGetMeResponse {
  client: {
    props: IUserExtended;
  };
  meta: {
    props: Meta;
  };
}