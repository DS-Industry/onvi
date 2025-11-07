import {NavigationProp, RouteProp} from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  Verify: {
    phone: string;
    type: 'register' | 'login';
  };
};

export type GeneralAuthNavigationProp<T extends keyof AuthStackParamList> =
  NavigationProp<AuthStackParamList, T>;

export type GeneralAuthRouteProp<T extends keyof AuthStackParamList> =
  RouteProp<AuthStackParamList, T>;
