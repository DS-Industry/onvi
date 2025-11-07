import {IUser} from '../../../models/User';
import {IAuthTokens} from '../../../models/AuthTokens';

export interface ILoginResponse {
  client: IUser | null;
  tokens: IAuthTokens | null;
  type: 'register-required' | 'login-success' | 'wrong-otp';
}
