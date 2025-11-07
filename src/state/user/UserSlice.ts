import {IUser} from '../../types/models/User';
import {StoreSlice} from '../store.ts';

import {ILoginResponse} from '../../types/api/auth/res/ILoginResponse';
import {IRegisterResponse} from '../../types/api/auth/res/IRegisterResponse';

import LocalStorage from '@services/local-storage';
import Toast from 'react-native-toast-message';

import {
  isValidStorageData,
  hasAccessTokenCredentials,
} from '@services/validation/index.validator.ts';
import EncryptedStorage from 'react-native-encrypted-storage';
import i18n from '../../locales';
import {deleteAccount, getMe, getTariff} from '@services/api/user';
import {login, refresh, register, sendOtp} from '@services/api/auth';
import {DdLogs} from '@datadog/mobile-react-native';

const MAX_REFRESH_RETRIES = 3;

export interface UserSlice {
  isAuthenticated: boolean;
  user: IUser | null;
  accessToken: string | null;
  expiredDate: string | null;
  fcmToken: string | null;
  loading: boolean;
  freeVacuum: {limit: number; remains: number};
  setUser: (user: IUser | null) => void;
  setUserBalance: (balance: number) => void;
  setAccessToken: (accessToken: string | null) => void;
  setExpiredDate: (expiredDate: string | null) => void;
  setFcmToken: (fcmToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  setFreeVacuum: (freeVacuum: {limit: number; remains: number}) => void;
  mutateRefreshToken: () => Promise<string | null>;
  login: (phone: string, otp: string) => Promise<ILoginResponse | null>;
  register: (
    otp: string,
    phone: string,
    isTermsAccepted?: boolean,
    isPromoTermsAccepted?: boolean,
  ) => Promise<IRegisterResponse | null>;
  // getTokenFromReference: (referenceToken: string) => void;
  sendOtp: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  deleteUser: () => Promise<void>;
  refreshRetryCounter: number;
  handleTokenExpiry: (originalRequest?: {
    headers: Record<string, string>;
    [key: string]: any;
  }) => Promise<any>;
}

const createUserSlice: StoreSlice<UserSlice> = (set, get) => ({
  isAuthenticated: false,
  user: null,
  fcmToken: null,
  accessToken: null,
  expiredDate: null,
  loading: true,
  refreshRetryCounter: MAX_REFRESH_RETRIES,
  freeVacuum: {limit: 0, remains: 0},
  setUser: user => set({user}),
  setUserBalance: (balance: number) => {
    set(state => {
      if (state.user && state.user.cards) {
        return {
          user: {
            ...state.user,
            cards: {
              ...state.user.cards,
              balance,
            },
          },
        };
      }
      return state;
    });
  },
  setAccessToken: accessToken => set({accessToken}),
  setExpiredDate: expiredDate => set({expiredDate}),
  setLoading: loading => set({loading}),
  setFreeVacuum: freeVacuum => set({freeVacuum}),
  setFcmToken: fcmToken => set({fcmToken}),
  mutateRefreshToken: async () => {
    try {
      const refreshRetriesLeft = get().refreshRetryCounter;

      if (refreshRetriesLeft <= 0) {
        DdLogs.error('Maximum refresh token attempts reached', {
          refreshRetriesLeft,
        });
        await get().signOut();
        Toast.show({
          type: 'customErrorToast',
          text1: i18n.t('app.authErrors.sessionExpired'),
          text2: i18n.t('app.authErrors.pleaseLoginAgain'),
          props: {errorCode: 401},
        });
        return null;
      }

      const existingSession = await EncryptedStorage.getItem('user_session');
      let existingData: Record<string, any> = {};
      if (existingSession) {
        existingData = JSON.parse(existingSession);
      }

      if (!existingData.refreshToken) {
        DdLogs.error('No refresh token found', {existingData});
        await get().signOut();
        return null;
      }

      DdLogs.info(
        `Refresh token attempt ${
          MAX_REFRESH_RETRIES - refreshRetriesLeft + 1
        } of ${MAX_REFRESH_RETRIES}`,
      );

      const response = await refresh({
        refreshToken: existingData.refreshToken,
      });

      if (response) {
        await LocalStorage.set(
          'user_session',
          JSON.stringify({
            accessToken: response.accessToken,
            expiredDate: new Date(response.accessTokenExp).toISOString(),
          }),
        );

        set({
          accessToken: response.accessToken,
          expiredDate: new Date(response.accessTokenExp).toISOString(),
          loading: false,
          refreshRetryCounter: MAX_REFRESH_RETRIES,
        });

        await get().loadUser();
        DdLogs.info('Token refreshed successfully', {response});
        return existingData.refreshToken;
      } else {
        throw new Error('Failed to refresh token: Empty response');
      }
    } catch (error: any) {
      DdLogs.error('Error refreshing token', {error: error.message});

      const isRefreshTokenError =
        error?.response?.status === 401 ||
        error?.response?.status === 403 ||
        (error?.response?.data?.message &&
          (error.response.data.message.includes('refresh token expired') ||
            error.response.data.message.includes('invalid refresh token')));

      const refreshRetriesLeft = get().refreshRetryCounter;
      set({loading: false, refreshRetryCounter: refreshRetriesLeft - 1});

      if (isRefreshTokenError || refreshRetriesLeft <= 1) {
        DdLogs.error('Refresh token expired or invalid, signing out user');
        await get().signOut();
        Toast.show({
          type: 'customErrorToast',
          text1: i18n.t('app.authErrors.sessionExpired'),
          text2: i18n.t('app.authErrors.pleaseLoginAgain'),
          props: {errorCode: 401},
        });
      }

      return null;
    }
  },
  login: async (phone, otp) => {
    try {
      const formattedPhone = phone.replace(/[ \(\)-]+/g, '');
      const response = await login({phone: formattedPhone, otp});
      if (response.type === 'register-required') {
        return response;
      }
      if (response.type === 'login-success') {
        DdLogs.info('Login success', {phone});
        const {tokens} = response;
        if (!tokens) {
          return null;
        }

        const refreshToken = tokens.refreshToken;
        await EncryptedStorage.setItem(
          'user_session',
          JSON.stringify({
            refreshToken: refreshToken,
          }),
        );

        LocalStorage.set(
          'user_session',
          JSON.stringify({
            accessToken: tokens.accessToken,
            expiredDate: new Date(tokens.accessTokenExp).toISOString(),
          }),
        );

        set({
          accessToken: tokens.accessToken,
          expiredDate: new Date(tokens.accessTokenExp).toISOString(),
          isAuthenticated: true,
          loading: false,
          refreshRetryCounter: MAX_REFRESH_RETRIES,
        });
        await get().loadUser();

        return response;
      }

      Toast.show({
        type: 'customErrorToast',
        text1: i18n.t('app.authErrors.loginFailed'),
        props: {errorCode: 400},
      });
      return response;
    } catch (error) {
      DdLogs.error('Login error', {phone});
      Toast.show({
        type: 'customErrorToast',
        text1: i18n.t('app.authErrors.loginFailed'),
        props: {errorCode: 400},
      });
      return null;
    }
  },

  register: async (
    otp,
    phone,
    isTermsAccepted = true,
    isPromoTermsAccepted = true,
  ) => {
    try {
      const formattedPhone = phone.replace(/[ \(\)-]+/g, '');
      const response = await register({
        phone: formattedPhone,
        otp,
        isTermsAccepted,
        isPromoTermsAccepted,
      });

      if (response.type === 'register-success') {
        DdLogs.info('Register success ', {phone});

        const {tokens} = response;

        const refreshToken = tokens.refreshToken;

        await EncryptedStorage.setItem(
          'user_session',
          JSON.stringify({
            refreshToken: refreshToken,
          }),
        );

        await LocalStorage.set(
          'user_session',
          JSON.stringify({
            accessToken: tokens.accessToken,
            expiredDate: new Date(tokens.accessTokenExp).toISOString(),
          }),
        );
        set({
          accessToken: tokens.accessToken,
          expiredDate: new Date(tokens.accessTokenExp).toISOString(),
          isAuthenticated: true,
          loading: false,
          refreshRetryCounter: MAX_REFRESH_RETRIES,
        });
        await get().loadUser();

        return response;
      }

      Toast.show({
        type: 'customErrorToast',
        text1: i18n.t('app.authErrors.registrationFailed'),
        props: {errorCode: 400},
      });
      return response;
    } catch (error) {
      DdLogs.error('Registration error');
      Toast.show({
        type: 'customErrorToast',
        text1: i18n.t('app.authErrors.registrationFailed'),
        props: {errorCode: 400},
      });
      return null;
    }
  },

  sendOtp: async phone => {
    try {
      const formattedPhone = phone.replace(/[ \(\)-]+/g, '');
      await sendOtp({phone: formattedPhone})
        .then(data => {
          Toast.show({
            type: 'customSuccessToast',
            text1: i18n.t('app.authErrors.messageSent'),
          });
          DdLogs.info('Send OTP message', {phone});
          return data;
        })
        .catch(() => {
          Toast.show({
            type: 'customErrorToast',
            text1: i18n.t('app.authErrors.smsFailure'),
          });
        });
    } catch (error) {
      DdLogs.error('Send OTP error:', {phone});
    }
  },

  signOut: async () => {
    try {
      await LocalStorage.delete('user_session');

      await EncryptedStorage.setItem(
        'user_session',
        JSON.stringify({
          refreshToken: null,
        }),
      );

      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        expiredDate: null,
        refreshRetryCounter: 0,
      });
    } catch (error) {}
  },
  loadUser: async () => {
    try {
      const userSession = await LocalStorage.getString('user_session');
      const existingSession = await EncryptedStorage.getItem('user_session');

      let existingData: Record<string, any> = {};
      if (existingSession) {
        existingData = JSON.parse(existingSession);
      }

      if (userSession) {
        const formatted: Record<string, any> = JSON.parse(userSession);
        if (
          formatted &&
          isValidStorageData(formatted.accessToken, formatted.expiredDate)
        ) {
          set({
            accessToken: formatted.accessToken,
            expiredDate: formatted.expiredDate,
            isAuthenticated: true,
            loading: false,
          });

          const data = await getMe();
          const tariff = await getTariff();

          set({
            user: {
              ...data,
              tariff: tariff.cashBack,
            },
            refreshRetryCounter: MAX_REFRESH_RETRIES,
          });
        } else if (
          formatted &&
          hasAccessTokenCredentials(existingData.refreshToken)
        ) {
          await get().mutateRefreshToken();
        } else {
          set({loading: false});
        }
      } else {
        set({loading: false});
      }
    } catch (error) {}
  },

  deleteUser: async () => {
    try {
      const status = await deleteAccount();
      if (status == 200) {
        await LocalStorage.delete('user_session');

        await EncryptedStorage.setItem(
          'user_session',
          JSON.stringify({
            refreshToken: null,
          }),
        );

        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          expiredDate: null,
          refreshRetryCounter: 0,
        });
      }
    } catch (error: any) {}
  },
  handleTokenExpiry: async (originalRequest?: {
    headers: Record<string, string>;
    [key: string]: any;
  }) => {
    try {
      // Try to refresh the token
      const refreshResult = await get().mutateRefreshToken();

      if (refreshResult) {
        // If we have an original request to retry, return it
        if (originalRequest) {
          // Update the Authorization header with the new token
          originalRequest.headers.Authorization = `Bearer ${get().accessToken}`;
          return originalRequest;
        }
        return true; // Token refresh was successful
      } else {
        // If refresh failed, log out the user
        await get().signOut();

        // Show toast notification to the user
        Toast.show({
          type: 'customErrorToast',
          text1: i18n.t('app.authErrors.sessionExpired'),
          text2: i18n.t('app.authErrors.pleaseLoginAgain'),
          props: {errorCode: 401},
        });
        return false; // Token refresh failed
      }
    } catch (error) {
      await get().signOut();

      // Show toast notification to the user
      Toast.show({
        type: 'customErrorToast',
        text1: i18n.t('app.authErrors.authorizationError'),
        text2: i18n.t('app.authErrors.pleaseLoginAgain'),
        props: {errorCode: 401},
      });
      return false; // Token refresh failed with error
    }
  },
});

export default createUserSlice;
