import {AxiosInstance, AxiosError, AxiosResponse} from 'axios';
import useStore from '../../../state/store';
import {isValidStorageData} from '@services/validation/index.validator';
import {createNavigationContainerRef} from '@react-navigation/native';

import {DdLogs} from '@datadog/mobile-react-native';

// Create a navigation reference that can be used outside of components
export const navigationRef = createNavigationContainerRef();

// Helper function to navigate when not in a React component
export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    //@ts-ignore
    navigationRef.navigate(name, params);
  } else {
    // Save the navigation for when the ref is ready
  }
}

// Helper function to reset navigation stack
export function resetNavigation(routeName: string) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{name: routeName}],
    });
  }
}

export function setupAuthInterceptors(axiosInstance: AxiosInstance) {
  // Response interceptor for handling expired tokens
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config;
      // Cast to any to add/check the _retry property
      const requestWithRetry = originalRequest as any;

      const logData = {
        message: error?.message || 'Axios error',
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        instance: 'userApiInstance',
      };

      DdLogs.error(`Axios Request Failed: ${error?.message}`, {logData});

      // Check if error is due to an expired token
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) &&
        originalRequest
      ) {
        // Get error message from response
        const errorData = error.response.data as any;
        const errorMsg = errorData?.message || errorData?.error || '';

        // Check if token is expired based on error message
        const isTokenExpired =
          errorMsg.includes('expired') ||
          errorMsg.includes('invalid token') ||
          errorMsg.includes('jwt') ||
          error.response.status === 401 ||
          error.response.status === 403;

        // Get the store's handleTokenExpiry function to try refreshing the token
        const userStore = useStore.getState();

        // Check if this is a refresh token request that failed
        const isRefreshTokenRequest =
          originalRequest.url?.includes('/refresh-token') ||
          originalRequest.url?.includes('/refresh') ||
          requestWithRetry._isRefreshRequest;

        if (isRefreshTokenRequest) {
          await userStore.signOut();
          return Promise.reject(error);
        }

        if (
          isTokenExpired &&
          !requestWithRetry._retry &&
          userStore.handleTokenExpiry
        ) {
          // Mark that we're retrying this request
          requestWithRetry._retry = true;

          try {
            // Call the token expiry handler with the original request
            const updatedRequest = await userStore.handleTokenExpiry(
              requestWithRetry,
            );

            if (updatedRequest) {
              // Retry the original request with the new token
              return axiosInstance(updatedRequest);
            } else {
              // If token refresh failed, navigate to login
              resetNavigation('SignIn');
            }
          } catch (refreshError) {
            await userStore.signOut();
            resetNavigation('SignIn');
            return Promise.reject(error);
          }
        } else if (requestWithRetry._retry || !userStore.handleTokenExpiry) {
          // This is either a retry or we don't have a token refresh handler
          await userStore.signOut();
          resetNavigation('SignIn');
        }
      }

      return Promise.reject(error);
    },
  );

  // Request interceptor for adding auth token
  axiosInstance.interceptors.request.use(
    async config => {
      try {
        const state = useStore.getState();
        const {accessToken, expiredDate} = state;

        // Mark refresh token requests to identify them in the response interceptor
        if (
          config.url?.includes('/refresh-token') ||
          config.url?.includes('/refresh')
        ) {
          (config as any)._isRefreshRequest = true;
        }

        if (
          accessToken &&
          expiredDate &&
          isValidStorageData(accessToken, expiredDate)
        ) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
        }
      } catch (e) {}

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  return axiosInstance;
}
