import React from 'react';

import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {dp} from '@utils/dp';
import {CSSProperties} from 'react';

interface IAvatar {
  source: any;
  height?: number;
  width?: number;
  style?: CSSProperties;
  onClick?: any;
}

const Avatar: React.FC<IAvatar> = ({
  source = null,
  height = dp(48),
  width = dp(48),
  style = null,
  onClick = () => null,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        {
          width,
          height,
        },
        styles.container,
        style,
      ]}>
      <Image source={source} style={[styles.image]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    resizeMode: 'contain',
  },
});

export {Avatar};
