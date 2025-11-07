import React from 'react';

import {View, TextInput} from 'react-native';

import {BLACK} from '../../../utils/colors';

import {dp} from '../../../utils/dp';

interface IInput {
  phoneNumber: string;
  setPhoneNumber: any;
}

const PhoneInp: React.FC<IInput> = ({phoneNumber = '', setPhoneNumber}) => {
  const handleChangeText = (val: string) => {
    const slice = val.slice(3);

    // Remove all non-numeric characters from the value
    const numericValue = slice.replace(/[^0-9]/g, '');

    // Format the numeric value as a phone number
    let formattedPhoneNumber = '';

    if (numericValue.length > 0) {
      formattedPhoneNumber = '+7 (' + numericValue.substring(0, 3);

      if (numericValue.length > 3) {
        formattedPhoneNumber += ') ' + numericValue.substring(3, 6);
      }

      if (numericValue.length > 6) {
        formattedPhoneNumber += ' ' + numericValue.substring(6, 8);
      }

      if (numericValue.length > 8) {
        formattedPhoneNumber += '-' + numericValue.substring(8, 10);
      }
    }

    setPhoneNumber(formattedPhoneNumber);
  };

  return (
    <View style={{height: dp(60), justifyContent: 'center'}}>
      <View style={{alignSelf: 'center', paddingTop: 30}}>
        <TextInput
          placeholder="+7 (900) 000-00-00"
          placeholderTextColor="rgba(255, 255, 255, 1)"
          value={
            phoneNumber.startsWith('+7')
              ? '+7' + phoneNumber.substring(2)
              : '+7 ' + phoneNumber
          }
          onChangeText={handleChangeText}
          keyboardType="phone-pad"
          style={{
            backgroundColor: 'rgba(216, 217, 221, 1)',
            width: dp(320),
            borderRadius: 25,
            height: dp(60),
            textAlign: 'center',
            alignItems: 'center',
            fontSize: dp(24),
            color: BLACK,
          }}
        />
      </View>
    </View>
  );
};

export {PhoneInp};
