import React from 'react';
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
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

const {width: screenWidth} = Dimensions.get('window');
const ITEM_WIDTH = scale(85) + dp(12); 

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const {t} = useTranslation();
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'BANK_CARD',
      label: t('app.payment.bankCard'),
      icon: require('../../assets/icons/bank_card.png'),
    },
    {
      id: 'SBP',
      label: t('app.payment.sbp'),
      icon: require('../../assets/icons/sbp_icon.png'),
    },
    {
      id: 'SBERBANK',
      label: t('app.payment.sberPay'),
      icon: require('../../assets/icons/sber_pay_icon.png'),
    },
  ];

  const visibleItemsCount = Math.ceil(screenWidth / ITEM_WIDTH);

  const renderItem = ({item}: {item: PaymentMethod}) => (
    <PaymentMethodButton
      key={item.id}
      icon={item.icon}
      label={item.label}
      selected={selectedMethod === item.id}
      onPress={() => onSelectMethod(item.id)}
      style={styles.methodButton}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <FlatList
          data={paymentMethods}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          initialNumToRender={visibleItemsCount}
          maxToRenderPerBatch={10}
          windowSize={5}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
        />
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
  },
  scrollContent: {
    paddingHorizontal: dp(2),
  },
  methodButton: {
    width: scale(85),
    marginRight: dp(12),
    marginBottom: dp(10),
  },
});

export default PaymentMethods;