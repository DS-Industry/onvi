import React from 'react';

import {View, StyleSheet, Text} from 'react-native';

import {dp} from '../../../utils/dp';

interface NotificationProps {
  option: any;
}

const Notification = ({option}: NotificationProps) => {
  const constructStyles = () => {
    if (option.read) {
      return styles.readNotification;
    } else {
      return styles.notReadNotification;
    }
  };

  return (
    <View style={constructStyles()}>
      <Text style={styles.date}>{option.date}</Text>
      <Text style={styles.title}>{option.title}</Text>
      <Text style={styles.text}>{option.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  readNotification: {
    marginVertical: 10,
    width: dp(342),
    height: dp(113),
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderRadius: dp(25),
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: dp(20),
    paddingRight: dp(20),
    paddingTop: dp(8),
    paddingBottom: dp(8),
  },
  notReadNotification: {
    marginVertical: 10,
    width: dp(342),
    height: dp(113),
    backgroundColor: 'rgba(191, 250, 0, 1)',
    borderRadius: dp(25),
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: dp(20),
    paddingRight: dp(20),
    paddingTop: dp(8),
    paddingBottom: dp(8),
  },
  date: {
    color: 'rgba(11, 104, 225, 1)',
    fontWeight: '700',
    fontSize: dp(10),
  },
  title: {
    color: '#000000',
    fontWeight: '600',
    fontSize: dp(16),
    marginTop: dp(5),
  },
  text: {
    color: '#000000',
    fontWeight: '400',
    fontSize: dp(10),
    marginTop: dp(5),
  },
});

export {Notification};
