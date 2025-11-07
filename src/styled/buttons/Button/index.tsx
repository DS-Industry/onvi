import {dp} from '../../../utils/dp';
import React from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {WHITE} from '../../../utils/colors';

interface IButton {
  label: string;
  onClick?: any;
  disabled?: boolean;
  showLoading?: boolean;
  color: 'blue' | 'grey' | 'lightGrey';
  width?: number;
  height?: number;
  fontSize?: number;
  fontWeight?: '600';
  outlined?: boolean; // New prop to enable outlined styling
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
  outlined = false, // Default value for outlined
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={{
        ...styles.button,
        ...(outlined ? styles.outlined : styles[color]),
        width: width ? dp(width) : dp(285),
        height: height ? dp(height) : dp(48),
        borderColor: outlined ? styles[color]?.backgroundColor : 'transparent',
        borderWidth: outlined ? dp(2) : 0,
      }}>
      {showLoading ? (
        <ActivityIndicator
          size="large"
          color={outlined ? styles[color]?.backgroundColor : 'white'}
        />
      ) : (
        <Text
          style={{
            ...styles.buttonText,
            fontSize: fontSize ? dp(fontSize) : dp(18),
            fontWeight: fontWeight ? fontWeight : '500',
            color: outlined ? styles[color]?.backgroundColor : WHITE,
          }}>
          {label}
        </Text>
      )}
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
});

export {Button};
