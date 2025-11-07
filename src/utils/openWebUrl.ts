import {Linking} from 'react-native';
import Toast from 'react-native-toast-message';

import i18n from '../locales';

export const openWebURL = async (url: string) => {
  try {
    // Check if the link can be opened
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Open the link with the default browser or app
      await Linking.openURL(url);
    } else {
      Toast.show({
        type: 'customErrorToast',
        text1: i18n.t('app.errors.failedToOpenFile'),
      });
    }
  } catch (error) {
    Toast.show({
      type: 'customErrorToast',
      text1: i18n.t('app.errors.genericError'),
    });
  }
};
