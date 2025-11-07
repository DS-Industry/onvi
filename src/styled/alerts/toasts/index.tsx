import React from 'react';

import {ToastConfig, ToastConfigParams} from 'react-native-toast-message';
import {Text, View} from 'react-native';
import i18n from '../../../locales';

export const toastConfig: ToastConfig = {
  customBaseToast: ({text1}: ToastConfigParams<any>) => (
    <View
      style={{
        display: 'flex',
        height: 65,
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 38,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          paddingLeft: 5,
          fontSize: 15,
          fontWeight: '500',
          color: '#000000',
        }}>
        {text1}
      </Text>
    </View>
  ),
  customSuccessToast: ({text1}: ToastConfigParams<any>) => (
    <View
      style={{
        display: 'flex',
        height: 50,
        width: '90%',
        backgroundColor: '#BFFA00',
        borderRadius: 38,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          paddingLeft: 5,
          fontSize: 15,
          fontWeight: '500',
          color: '#000000',
        }}>
        👍 {text1}
      </Text>
    </View>
  ),
  customErrorToast: ({text1, props}: ToastConfigParams<any>) => (
    <View
      style={{
        display: 'flex',
        minHeight: 60,
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
        borderLeftWidth: 10,
        borderLeftColor: '#E53935',
      }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#262626',
          marginBottom: props.errorCode ? 4 : 0,
        }}>
        {text1}
      </Text>
      {props.errorCode && (
        <Text
          style={{
            fontSize: 12,
            fontWeight: '500',
            color: '#666666',
          }}>
          {i18n.t('app.errors.errorCode')}: {props.errorCode}
        </Text>
      )}
    </View>
  ),
  customInfoToast: ({text1}: ToastConfigParams<any>) => (
    <View
      style={{
        display: 'flex',
        minHeight: 50,
        width: '90%',
        backgroundColor: '#0B68E1',
        borderRadius: 38,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          paddingLeft: 5,
          fontSize: 15,
          fontWeight: '500',
          color: '#FFF',
        }}>
        🙂{text1}
      </Text>
    </View>
  ),
};
