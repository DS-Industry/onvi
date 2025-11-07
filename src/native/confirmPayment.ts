import {NativeModules, Platform} from 'react-native';
import {ConfirmationPaymentParams} from '../types/ConfirmationPaymentParams';
import {ErrorResult} from '../types/ErrorResult';
import {ConfirmationPaymentResult} from '../types/ConfirmationPaymentResult';

const RnYookassa =
  Platform.OS === 'android'
    ? NativeModules.YooKassaPaymentGateway
    : NativeModules.PaymentGatewayModule;

const confirmPayment = (
  params: ConfirmationPaymentParams,
): Promise<ConfirmationPaymentResult> => {
  return new Promise((resolve, reject) => {
    RnYookassa.confirmPayment(
      params,
      (result?: ConfirmationPaymentResult, error?: ErrorResult) => {
        if (result) {
          resolve(result);
        } else {
          if (error) {
            reject({code: error.code, message: `[NATIVE] ${error.message}`});
          } else {
            reject(
              new Error(
                '[NATIVE] Unknown error occurred during payment confirmation.',
              ),
            );
          }
        }
      },
    );
  });
};

export {confirmPayment};
