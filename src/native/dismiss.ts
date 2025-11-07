import {NativeModules, Platform} from 'react-native';

const RnYookassa =
  Platform.OS === 'android'
    ? NativeModules.YooKassaPaymentGateway
    : NativeModules.PaymentGatewayModule;

const dismiss = (): void => {
  RnYookassa.dismiss();
};

export {dismiss};
