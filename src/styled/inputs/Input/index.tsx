import React, {CSSProperties, useEffect, useState} from 'react';

import {
  Text,
  TextInput,
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import styles from './styles';

interface IInput {
  label: string;
  type?: 'text' | 'email' | 'password' | 'phone';
  value: string;
  setValue: any;
  placeholder?: string;
  variant?: 'border_bottom' | 'border_all';
  size?: 'medium' | 'small' | 'flexible' | 'large';
  style?: CSSProperties;
  validate?: string[];
}

const Input: React.FC<IInput> = ({
  label,
  value = '',
  setValue,
  placeholder = '',
  variant = 'border_bottom',
  size = 'flexible',
  style,
}) => {
  const [inputStyles, setInputStyles] = useState<any>({});

  useEffect(() => {
    let stls = {};

    if (styles.input) {
      stls = {...stls, ...styles.input};
    }
    if (variant && styles[variant]) {
      stls = {...stls, ...styles[variant]};
    }
    if (size && styles[size]) {
      stls = {...stls, ...styles[size]};
    }

    if (style) {
      stls = {...stls, ...style};
    }

    setInputStyles(stls);
  }, []);

  const onChange = (val: string) => {
    setValue({
      value: val,
    });
  };

  return (
    <View style={{height: 60}}>
      <View>
        <Text style={{fontSize: 10}}>{label}</Text>
      </View>
      <View>
        <TextInput
          value={value}
          style={
            value
              ? StyleSheet.create(Object.assign(inputStyles, {...styles.error}))
              : (StyleSheet.create({...inputStyles}) as StyleProp<ViewStyle>)
          }
          placeholder={placeholder}
          onChangeText={onChange}
        />
      </View>
    </View>
  );
};

export {Input};
