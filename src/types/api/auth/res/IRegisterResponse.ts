import {IUser} from '../../../models/User';
import {IAuthTokens} from '../../../models/AuthTokens';

export interface IRegisterResponse {
  client: IUser;
  tokens: IAuthTokens;
  type: string;
}
