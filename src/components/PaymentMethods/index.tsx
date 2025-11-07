import React from 'react';
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {dp} from '@utils/dp.ts';
import {scale} from 'react-native-size-matters';
import PaymentMethodButton, {
  PaymentMethodType,
} from '@styled/buttons/PaymentMethodButton';
import {useTranslation} from 'react-i18next';

interface PaymentMethod {
  id: PaymentMethodType;
  label: string;
  icon: ImageSourcePropType;
}

interface PaymentMethodsProps {
  selectedMethod: PaymentMethodType;
  onSelectMethod: (method: PaymentMethodType) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const {t} = useTranslation();
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'BANK_CARD',
      label: t('app.payment.bankCard'),
      icon: require('../../assets/icons/bank_card.png'), // Update path as needed
    },
    {
      id: 'SBP',
      label: t('app.payment.sbp'),
      icon: require('../../assets/icons/sbp_icon.png'), // Update path as needed
    },
    {
      id: 'SBERBANK',
      label: t('app.payment.sberPay'),
      icon: require('../../assets/icons/sber_pay_icon.png'), // Update path as needed
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('app.payment.paymentMethod')}</Text>
      <View style={styles.buttonsContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {paymentMethods.map(method => (
            <PaymentMethodButton
              key={method.id}
              icon={method.icon}
              label={method.label}
              selected={selectedMethod === method.id}
              onPress={() => onSelectMethod(method.id)}
              style={styles.methodButton}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: dp(15),
  },
  sectionTitle: {
    fontSize: dp(16),
    fontWeight: '600',
    marginBottom: dp(12),
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodButton: {
    width: scale(85),
    marginRight: dp(12),
    marginBottom: dp(10),
  },
});

export default PaymentMethods;
