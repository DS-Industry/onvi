import React from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';

import {dp} from '../../../utils/dp';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/metrics';

interface IBox {
  label: string;
  labelStyles?: StyleProp<TextStyle>;
  onClick?: any;
  disabled?: boolean;
  active: boolean;
  width?: number;
  height?: number;
  borderRadius?: number;
}

const Box: React.FC<IBox> = ({
  label = '',
  onClick = () => null,
  disabled = false,
  active = false,
  width = horizontalScale(92),
  height = verticalScale(92),
  borderRadius = moderateScale(21),
  labelStyles = {
    fontSize: moderateScale(48),
    fontWeight: '600',
    color: '#000',
  },
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={{
        ...styles.box,
        ...styles[active ? 'active' : 'notActive'],
        width,
        height,
        borderRadius,
      }}>
      <Text style={labelStyles}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    margin: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grey: {
    backgroundColor: '#A3A3A6',
  },
  blue: {
    backgroundColor: '#0B68E1',
  },
  boxText: {
    fontSize: dp(48),
    fontWeight: '600',
    color: '#000',
  },
  active: {
    backgroundColor: 'rgba(191, 250, 0, 1)',
  },
  notActive: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
  },
});

export {Box};
