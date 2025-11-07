export interface IUserApiErrorResponse {
  code: number | null;
  type: string;
  message: string;
  timestamp: string;
  path: string;
}
