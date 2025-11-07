import {ErrorCodesEnum} from './ErrorCodes';

export interface ErrorResult {
  code: ErrorCodesEnum;
  message: string;
}
