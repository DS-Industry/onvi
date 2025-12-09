import {dp} from '../../../utils/dp';
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {WHITE} from '../../../utils/colors';

interface IButton {
  label: string;
  onClick?: any;
  disabled?: boolean;
  showLoading?: boolean;
  color: 'blue' | 'grey' | 'lightGrey';
  width?: number | string;
  height?: number;
  fontSize?: number;
  fontWeight?: '600';
  outlined?: boolean;
  price?: string;
  priceFontSize?: number;
  priceFontWeight?: '600';
}

const Button: React.FC<IButton> = ({
  label = '',
  onClick = () => null,
  disabled = false,
  color = 'blue',
  width,
  height,
  fontSize,
  fontWeight,
  showLoading = false,
  outlined = false,
  price,
  priceFontSize,
  priceFontWeight,
}) => {
  const textColor = outlined ? styles[color]?.backgroundColor : WHITE;

  const renderContent = () => {
    if (showLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={outlined ? styles[color]?.backgroundColor : 'white'}
        />
      );
    }

    if (price) {
      return (
        <View style={styles.withPriceContainer}>
          <View style={styles.centerTextContainer}>
            <Text
              style={[
                styles.buttonText,
                {
                  color: textColor,
                  fontSize: fontSize ? dp(fontSize) : dp(18),
                  fontWeight: fontWeight || '500',
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </View>
          
          <Text
            style={[
              styles.priceText,
              {
                color: textColor,
                fontSize: priceFontSize ? dp(priceFontSize) : (fontSize ? dp(fontSize) : dp(18)),
                fontWeight: priceFontWeight || ( fontWeight || '500' ),
              },
            ]}
            numberOfLines={1}
          >
            {price}
          </Text>
        </View>
      );
    }

    return (
      <Text
        style={{
          ...styles.buttonText,
          fontSize: fontSize ? dp(fontSize) : dp(18),
          fontWeight: fontWeight ? fontWeight : '500',
          color: textColor,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={{
        ...styles.button,
        ...(outlined ? styles.outlined : styles[color]),
        width: width ? (typeof width === 'string' ? width : dp(width)) : dp(285),
        height: height ? dp(height) : dp(48),
        borderColor: outlined ? styles[color]?.backgroundColor : 'transparent',
        borderWidth: outlined ? dp(2) : 0,
      }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grey: {
    backgroundColor: '#A3A3A6',
  },
  blue: {
    backgroundColor: '#0B68E1',
  },
  lightGrey: {
    backgroundColor: 'rgba(216, 217, 221, 1)',
  },
  buttonText: {
    color: WHITE,
  },
  outlined: {
    backgroundColor: 'transparent',
  },
  withPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: dp(18), 
  },
  centerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  priceText: {
    color: WHITE,
    marginLeft: 'auto', 
  },
});

export {Button};