import {userApiInstance} from '../axiosConfig';

/**
 * A mock function that simulates an API call with an expired token
 * This function will trigger the token expiry flow in the interceptors
 */
export const mockTokenExpiry = async () => {
  try {
    // This is a fake endpoint that will trigger a 401 response
    await userApiInstance.get('/mock-expired-token');
  } catch (error) {
    // The error will be handled by the axios interceptor

    // Re-throw the error to ensure it propagates to the interceptors
    throw error;
  }
};

/**
 * Mock response interceptor to simulate token expiration
 * This function should be called during development to set up the mock
 */
export const setupMockTokenExpiryInterceptor = () => {
  // Add a response interceptor specifically for the mock endpoint
  const interceptorId = userApiInstance.interceptors.request.use(
    async config => {
      // Check if this is our mock expired token endpoint
      if (config.url?.includes('/mock-expired-token')) {
        // Create an error that mimics an axios error with 401 response
        const error: any = new Error('Token has expired');
        error.response = {
          status: 401,
          data: {
            message: 'jwt expired',
            error: 'Unauthorized',
          },
        };

        // Log and reject
        return Promise.reject(error);
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // Return a function to remove the interceptor if needed
  return () => {
    userApiInstance.interceptors.request.eject(interceptorId);
  };
};
