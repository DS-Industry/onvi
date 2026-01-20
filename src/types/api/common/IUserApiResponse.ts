import { IUser, Meta } from "@app-types/models/User";

export interface IUserApiResponse<T> {
  data: T;
  path: string;
  duration: string;
  method: string;
}

export interface IUserGetMeResponse {
  client: {
    props: IUser;
  };
  meta: {
    props: Meta;
  };
}