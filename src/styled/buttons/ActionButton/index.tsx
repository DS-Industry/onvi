import React from 'react';

import {dp} from '../../../utils/dp';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Minus, Plus} from 'react-native-feather';

interface ActionButtonProps {
  height?: number;
  width?: number;
  borderRadius?: number;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  icon?: 'plus' | 'minus' | '';
  text?: string;
  onClick?: () => void;
  style?: {};
}

const ActionButton = ({
  width = dp(48),
  height = dp(24),
  borderRadius = dp(69),
  fontSize = dp(12),
  textColor = '#000',
  backgroundColor = '#F5F5F5',
  fontWeight = '500',
  text = 'Привет',
  icon = '',
  onClick = () => {},
  style = {},
}: ActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <View
        style={[
          styles.buttonContainer,
          {
            width,
            height,
            borderRadius,
            backgroundColor,
          },
          style,
        ]}>
        {icon === 'plus' ? (
          <Plus color={'black'} />
        ) : icon === 'minus' ? (
          <Minus color={'black'} />
        ) : (
          <Text
            style={[
              styles.text,
              {fontSize, color: textColor, fontWeight: fontWeight},
            ]}>
            {text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    color: 'black',
  },
});

export {ActionButton};
