import useStore from '../state/store';
import { ImageSourcePropType } from 'react-native';

const PaymentSuccess = require('@assets/images/payment-success.png');
const PaymentError = require('@assets/images/payment-error.png');
const TransferWarning = require('@assets/images/transfer-warning.png');

export interface NotificationOptions {
  image?: ImageSourcePropType | string;
  onClose?: () => void;
}

export const showNotification = (
  title: string,
  description: string,
  buttonText: string,
  onButtonPress: () => void,
  options?: NotificationOptions
) => {
  const { openNotificationModal } = useStore.getState();
  
  openNotificationModal({
    title,
    description,
    buttonText,
    onButtonPress,
    image: options?.image,
    onClose: options?.onClose,
  });
};

export const showPaymentSuccessNotification = (
  title?: string,
  description?: string,
  buttonText?: string,
  onButtonPress?: () => void,
  image?: ImageSourcePropType | string
) => {
  showNotification(
    title || 'Оплата успешна!',
    description || 'Теперь вы можете приступить к мойке!',
    buttonText || 'Продолжить',
    onButtonPress || (() => {}),
    { image: image || PaymentSuccess}
  );
};

export const showPaymentErrorNotification = (
  title?: string,
  description?: string,
  buttonText?: string,
  onButtonPress?: () => void,
  image?: ImageSourcePropType | string
) => {
  showNotification(
    title || 'Оплата не прошла!',
    description || 'Повторите попытку или вернитесь позже.',
    buttonText || 'Повторить',
    onButtonPress || (() => {}),
    { image: image || PaymentError}
  );
};

export const showTranserWarning = (
  onButtonPress?: () => void,
) => {
  showNotification(
    'Внимание!',
    'После переноса баланса доступ к старому мобильному приложению будет закрыт.',
    'Продолжить',
    onButtonPress || (() => {}),
    { image: TransferWarning}
  );
};

export const closeNotification = () => {
  const { closeNotificationModal } = useStore.getState();
  closeNotificationModal();
};