export interface IUserApiResponse<T> {
  data: T;
  path: string;
  duration: string;
  method: string;
}
