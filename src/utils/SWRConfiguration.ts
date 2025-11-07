import {fetcher} from '@utils/fetcher.ts';

export const SWRConfiguration = {
  fetcher,
  dedupingInterval: 2000,
};
