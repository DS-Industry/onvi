import { ISendOtpRequest } from '../../../types/api/auth/req/ISendOtpRequest.ts';
import { ISendOtpResponse } from '../../../types/api/auth/res/ISendOtpResponse.ts';
import { IUserApiResponse } from '../../../types/api/common/IUserApiResponse.ts';
import { ILoginRequest } from '../../../types/api/auth/req/ILoginRequest.ts';
import { ILoginResponse } from '../../../types/api/auth/res/ILoginResponse.ts';
import { IRegisterRequest } from '../../../types/api/auth/req/IRegisterRequest.ts';
import { IRegisterResponse } from '../../../types/api/auth/res/IRegisterResponse.ts';
import { IRefreshRequest } from '../../../types/api/auth/req/IRefreshRequest.ts';
import { IRefreshResponse } from '../../../types/api/auth/res/IRefreshResponse.ts';
import { newUserApiInstance } from '@services/api/axiosConfig.ts';

enum AUTH_ENDPOINTS {
  SEND_OTP_URL = '/client/auth/send/otp',
  LOGIN_URL = '/client/auth/login',
  REGISTER_URL = '/client/auth/register',
  REFRESH_URL = '/client/auth/refresh',
}

export async function sendOtp(
  body: ISendOtpRequest,
): Promise<ISendOtpResponse> {
  try {    
    const response = await newUserApiInstance.post<
      IUserApiResponse<ISendOtpResponse>
    >(AUTH_ENDPOINTS.SEND_OTP_URL, body);

    return response.data.data;
  } catch (error) {
    console.error("Refresh failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
      ulr: error.response
    });
    throw error;
  }
}

export async function login(body: ILoginRequest): Promise<ILoginResponse> {
  const response = await newUserApiInstance.post<ILoginResponse>(
    AUTH_ENDPOINTS.LOGIN_URL,
    body,
  );
  console.log("login:", response);

  return response.data;
}

export async function register(
  body: IRegisterRequest,
): Promise<IRegisterResponse> {

  console.log("register body:", body);

  const response = await newUserApiInstance.post<IRegisterResponse>(
    AUTH_ENDPOINTS.REGISTER_URL,
    body
  );

  console.log("register", response);

  return response.data;
}

export async function refresh(
  body: IRefreshRequest,
): Promise<IRefreshResponse> {
  console.log("refresh body:", body);
  const response = await newUserApiInstance.post<
    IUserApiResponse<IRefreshResponse>
  >(AUTH_ENDPOINTS.REFRESH_URL, body);
  console.log("refresh:", response);
  return response.data.data;
}
