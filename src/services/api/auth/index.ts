import {ISendOtpRequest} from '../../../types/api/auth/req/ISendOtpRequest.ts';
import {ISendOtpResponse} from '../../../types/api/auth/res/ISendOtpResponse.ts';
import {IUserApiResponse} from '../../../types/api/common/IUserApiResponse.ts';
import {ILoginRequest} from '../../../types/api/auth/req/ILoginRequest.ts';
import {ILoginResponse} from '../../../types/api/auth/res/ILoginResponse.ts';
import {IRegisterRequest} from '../../../types/api/auth/req/IRegisterRequest.ts';
import {IRegisterResponse} from '../../../types/api/auth/res/IRegisterResponse.ts';
import {IRefreshRequest} from '../../../types/api/auth/req/IRefreshRequest.ts';
import {IRefreshResponse} from '../../../types/api/auth/res/IRefreshResponse.ts';
import {userApiInstance} from '@services/api/axiosConfig.ts';

enum AUTH {
  SEND_OTP_URL = 'auth/send/otp',
  LOGIN_URL = 'auth/login',
  REGISTER_URL = 'auth/register',
  REFRESH_URL = 'auth/refresh',
}

export async function sendOtp(
  body: ISendOtpRequest,
): Promise<ISendOtpResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<ISendOtpResponse>
  >(AUTH.SEND_OTP_URL, body);
  return response.data.data;
}

export async function login(body: ILoginRequest): Promise<ILoginResponse> {
  const response = await userApiInstance.post<IUserApiResponse<ILoginResponse>>(
    AUTH.LOGIN_URL,
    body,
  );
  return response.data.data;
}
export async function register(
  body: IRegisterRequest,
): Promise<IRegisterResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<IRegisterResponse>
  >(AUTH.REGISTER_URL, body);

  return response.data.data;
}
export async function refresh(
  body: IRefreshRequest,
): Promise<IRefreshResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<IRefreshResponse>
  >(AUTH.REFRESH_URL, body);

  return response.data.data;
}
