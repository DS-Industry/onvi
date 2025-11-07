import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

import {BLACK, BLUE, GREY, WHITE, YELLOW} from '../../../utils/colors';

import {dp} from '../../../utils/dp';

interface NewsCardProps {
  label: string;
  color: 'blue' | 'yellow' | 'grey';
  text: string;
}

const NewsCard = ({label, color, text}: NewsCardProps) => {
  const getColor = () => {
    switch (color) {
      case 'blue':
        return BLUE;
      case 'grey':
        return GREY;
      case 'yellow':
        return YELLOW;
      default:
        return BLUE;
    }
  };

  return (
    <View style={{...styles.container, backgroundColor: getColor()}}>
      <View style={styles.header}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingLeft: dp(10),
          }}>
          <Text
            style={{
              fontSize: dp(10),
              fontWeight: '600',
              paddingTop: dp(10),
              color: color === 'blue' ? WHITE : BLACK,
            }}>
            {label}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flex: 1,
          }}>
          <Image
            source={require('../../../assets/icons/arrow-up.png')}
            style={{width: dp(32), height: dp(32)}}
          />
        </View>
      </View>
      <View style={{paddingBottom: dp(20), padding: dp(5), overflow: 'hidden'}}>
        <Text
          style={{
            color: color === 'blue' ? WHITE : BLACK,
            fontSize: dp(20),
            fontWeight: '600',
          }}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 25,
    marginTop: dp(16),
    padding: dp(8),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
  },
});

export {NewsCard};
