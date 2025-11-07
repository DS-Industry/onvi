import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import {dp} from '@utils/dp.ts';
import {scale, verticalScale} from 'react-native-size-matters';
// Assuming this is your dimension function

// Define the payment method type
export type PaymentMethodType = 'BANK_CARD' | 'SBP' | 'SBERBANK';

// Define interfaces for our components
interface PaymentMethodButtonProps {
  icon: ImageSourcePropType;
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

/**
 * Payment Method Button Component
 */
const PaymentMethodButton: React.FC<PaymentMethodButtonProps> = ({
  icon,
  label,
  selected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.paymentButton, selected && styles.selectedButton, style]}
      onPress={onPress}>
      <View style={styles.buttonContent}>
        <Image source={icon} style={styles.buttonIcon} />
        <Text style={styles.buttonLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  paymentButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: dp(15),
    padding: dp(15),
    height: verticalScale(75),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: '#0B68E1', // Blue color from your other buttons
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: scale(28),
    height: verticalScale(28),
    marginBottom: verticalScale(5),
    resizeMode: 'contain',
  },
  buttonLabel: {
    fontSize: dp(10),
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});

export default PaymentMethodButton;
