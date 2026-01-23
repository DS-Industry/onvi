import axios, {AxiosError} from 'axios';
import {API_URL, NEW_API_URL, STRAPI_URL} from '@env';
import {setupAuthInterceptors} from './interceptors';
import {DdLogs} from '@datadog/mobile-react-native';

const PREFIX = '/api/v2/';
const NEW_URL = 'https://791bccf893dd.ngrok-free.app';

function logAxiosErrorToDatadog(error: AxiosError, instanceName: string) {
  const logData = {
    message: error?.message || 'Axios error',
    url: error?.config?.url,
    method: error?.config?.method,
    status: error?.response?.status,
    instance: instanceName,
  };

  DdLogs.error(`Axios Request Failed: ${error?.message}`, {logData});
  return Promise.reject(error);
}

const userApiInstance = axios.create({
  baseURL: API_URL + PREFIX,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

const newUserApiInstance = axios.create({
  baseURL: NEW_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'X-API-Version': 'new-auth-v1',
  },
});

const contentApiInstance = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupAuthInterceptors(userApiInstance);
setupAuthInterceptors(newUserApiInstance);

contentApiInstance.interceptors.response.use(
  response => response,
  error => logAxiosErrorToDatadog(error, 'contentApiInstance'),
);

export {userApiInstance, contentApiInstance, newUserApiInstance};