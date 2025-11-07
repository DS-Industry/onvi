import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@context/ThemeProvider';

import {dp} from '../../../utils/dp';

interface ICard {
  children: React.ReactNode;
}

const Card: React.FC<ICard> = ({children}: ICard) => {
  const {theme} = useTheme();

  return (
    <View style={{...styles.container, backgroundColor: theme.mainColor}}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: dp(16),
    flex: 1,
    borderRadius: 38,
    marginTop: dp(5),
  },
});

export {Card};
