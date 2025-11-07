import {BusinessSuccessRequestPayload} from 'src/types/api/app/types';
import {contentApiInstance} from '@services/api/axiosConfig.ts';

enum POS {
  GET_POS_LIST = '/api/carwash',
}

export async function getPOSList(query: {
  [key: string]: string;
}): Promise<BusinessSuccessRequestPayload> {
  const response = await contentApiInstance.get<BusinessSuccessRequestPayload>(
    POS.GET_POS_LIST,
    {
      params: query,
    },
  );

  return response.data;
}
