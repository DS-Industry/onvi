import {NativeModules, Platform} from 'react-native';
import {PaymentConfig} from '../types/PaymentConfig';
import {TokenizationResult} from '../types/TokenizationResult';
import {ErrorResult} from '../types/ErrorResult';

const RnYookassa =
  Platform.OS === 'android'
    ? NativeModules.YooKassaPaymentGateway
    : NativeModules.PaymentGatewayModule;

const tokenize = (params: PaymentConfig): Promise<TokenizationResult> => {
  return new Promise((resolve, reject) => {
    RnYookassa.startTokenize(
      params,
      (result?: TokenizationResult, error?: ErrorResult) => {
        if (result) {
          resolve(result);
        } else {
          if (error) {
            reject({code: error.code, message: `[NATIVE] ${error.message}`});
          } else {
            reject(
              new Error('[NATIVE] Unknown error occurred during tokenization.'),
            );
          }
        }
      },
    );
  });
};

export {tokenize};
