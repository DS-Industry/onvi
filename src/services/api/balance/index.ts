import {userApiInstance} from '@services/api/axiosConfig.ts';
import {IUserApiResponse} from 'src/types/api/common/IUserApiResponse';

enum BALANCE {
  GET_BALANCE = '/account/transfer',
  TRANSFER_BALANCE = '/account/transfer',
}

interface GetBalanceResponse {
  cardId: string;
  realBalance: number;
  airBalance: number;
}

export async function getBalance(query: {
  [key: string]: string;
}): Promise<GetBalanceResponse> {
  const response = await userApiInstance.get(BALANCE.GET_BALANCE, {
    params: query,
  });

  return response.data.data;
}

interface TransferBalancePayload {
  devNomer: string;
  realBalance: number;
  airBalance: number;
}

export async function transferBalance(
  body: TransferBalancePayload,
): Promise<any> {
  const response = await userApiInstance.post<IUserApiResponse<any>>(
    BALANCE.TRANSFER_BALANCE,
    body,
  );

  return response.data.data;
}
