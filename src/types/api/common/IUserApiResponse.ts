export interface IUserApiResponse<T> {
  data: T;
  path: string;
  duration: string;
  method: string;
}

interface GetMeClient<T> {
  props: T
}

export interface IUserGetMeResponse<T> {
  client: GetMeClient<T>;
}