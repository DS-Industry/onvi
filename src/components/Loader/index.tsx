import {useTheme} from '@context/ThemeProvider';
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const Loader = () => {
  const {theme} = useTheme();

  return (
    <View style={{...styles.containter, ...{mainColor: theme.mainColor}}}>
      <Image source={require('../../assets/icons/long-icon.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
