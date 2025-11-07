import {API} from '../shared/constants';

type ApiType = 'appApi' | 'userApi';

export function fetcher(
  path: string,
  init: RequestInit,
  apiType: ApiType = 'appApi',
) {
  const baseUrl =
    apiType === 'appApi' ? API.appDataApiBaseUrl : API.clientApiBaseUrl;
  const url = baseUrl + path;

  return fetch(url, init).then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  });
}
