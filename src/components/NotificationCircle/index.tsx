import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

import {dp} from '../../utils/dp';

interface NotificationCircleProps {
  number: number;
}

const NotificationCircle = ({number}: NotificationCircleProps) => {
  return (
    <View style={styles.circle}>
      <Text style={styles.text}>{number}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#BFFA00',
    width: dp(18),
    height: dp(18),
    borderRadius: 45,
    right: -dp(2),
    top: -dp(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  text: {
    fontSize: dp(13),
    fontWeight: '600',
  },
});

export {NotificationCircle};
