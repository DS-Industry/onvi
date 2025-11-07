import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {useTheme} from '@context/ThemeProvider';
import {dp} from '../../../utils/dp';

import {Button} from '@styled/buttons';
import {useTranslation} from 'react-i18next';

const AddCard = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const [expiration, setExpiration] = useState('');

  const handleExpirationChange = (input: string) => {
    // Remove any non-digit characters from the input
    const formattedInput = input.replace(/[^0-9]/g, '');

    // Format the input as "MM/YY"
    let formattedExpiration = '';
    for (let i = 0; i < formattedInput.length; i++) {
      if (i === 2) {
        formattedExpiration += '/';
      }
      formattedExpiration += formattedInput[i];
    }

    setExpiration(formattedExpiration);
  };

  const [cvv, setCVV] = useState('');

  const handleCVVChange = (input: string) => {
    // Remove any non-digit characters from the input
    const formattedInput = input.replace(/[^0-9]/g, '');

    setCVV(formattedInput);
  };

  const [cardNumber, setCardNumber] = useState('');

  const handleCardNumberChange = (input: string) => {
    // Remove any non-digit characters from the input
    const formattedInput = input.replace(/[^0-9]/g, '');

    // Format the input in groups of 4 digits
    let formattedCardNumber = '';
    for (let i = 0; i < formattedInput.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedCardNumber += ' ';
      }
      formattedCardNumber += formattedInput[i];
    }

    setCardNumber(formattedCardNumber);
  };

  const disabled = () => {
    if (!cardNumber || !cvv || !expiration) {
      return true;
    }
    return false;
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.mainColor}}>
      <View
        style={{flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
        <Text style={{fontWeight: '600', fontSize: dp(24)}}>
          {t('app.payment.addCard')}
        </Text>
        <TextInput
          placeholder={t('app.payment.cardNumber')}
          keyboardType="numeric"
          maxLength={19}
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          style={{
            backgroundColor: 'rgba(245, 245, 245, 1)',
            borderRadius: 25,
            width: '100%',
            height: 50,
            paddingLeft: dp(18),
            textAlign: 'left',
            alignItems: 'center',
            fontSize: 24,
            color: '#000000',
            marginTop: dp(24),
          }}
        />
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <TextInput
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
            value={expiration}
            onChangeText={handleExpirationChange}
            style={{
              backgroundColor: 'rgba(245, 245, 245, 1)',
              borderRadius: 25,
              flex: 1,
              marginRight: dp(6),
              height: 50,
              paddingLeft: dp(18),
              textAlign: 'left',
              alignItems: 'center',
              fontSize: 24,
              color: '#000000',
              marginTop: dp(24),
            }}
          />
          <TextInput
            placeholder="CVV/CVC"
            keyboardType="numeric"
            maxLength={4}
            value={cvv}
            onChangeText={handleCVVChange}
            style={{
              backgroundColor: 'rgba(245, 245, 245, 1)',
              borderRadius: 25,
              flex: 1,
              marginLeft: dp(6),
              height: 50,
              paddingLeft: dp(18),
              textAlign: 'left',
              alignItems: 'center',
              fontSize: 24,
              color: '#000000',
              marginTop: dp(24),
            }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          label={t('common.buttons.bind')}
          onClick={() => {}}
          color="blue"
          disabled={disabled()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 100,
    borderRadius: 38,
    paddingLeft: dp(22),
    paddingRight: dp(22),
    justifyContent: 'center',
  },
  sumSelector: {
    flex: 1,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sum: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: dp(36),
    fontWeight: '600',
  },
});

export {AddCard};
