import React from 'react';

import {View, StyleSheet, Text} from 'react-native';

import {dp} from '../../../utils/dp';
import CustomSwitch from '@styled/buttons/CustomSwitch';
import {IGetHistoryResponse} from '../../../types/api/user/res/IGetHistoryResponse.ts';
import {useTranslation} from 'react-i18next';

export interface IBalanceCardProps {
  option: IGetHistoryResponse;
}

const BalanceCard = (option: IBalanceCardProps) => {
  const {i18n} = useTranslation();
  const date = new Date(option.option.operDate);

  return (
    <View style={styles.box}>
      <View style={styles.leftSide}>
        <Text style={styles.date}>
          {date.toLocaleDateString(i18n.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <Text style={styles.title}>{option.option.carWash}</Text>
        <Text style={styles.text}>{option.option.address}</Text>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.rubles}>{option.option.operSumReal} ₽ </Text>

        <View style={styles.balance}>
          {option.option.cashBackAmount && option.option.cashBackAmount > 0 ? (
            <CustomSwitch
              value={false}
              inActiveText={`+${option.option.cashBackAmount}`}
              disabled={false}
              backgroundInActive="#BFFA00FF"
              circleImageInactive={require('../../../assets/icons/small_icon_black.png')}
              circleSize={dp(17)} // Adjust the circle size as needed
              switchBorderRadius={20}
              width={dp(55)} // Adjust the switch width as needed
              textStyle={{fontSize: dp(12), color: '#000', fontWeight: '600'}}
            />
          ) : (
            <CustomSwitch
              value={false}
              inActiveText={
                Number(option.option.operSumPoint) === 0
                  ? `${option.option.operSumPoint}`
                  : `-${option.option.operSumPoint}`
              }
              disabled={false}
              backgroundInActive="#000"
              circleImageInactive={require('../../../assets/icons/small-icon.png')}
              circleSize={dp(17)} // Adjust the circle size as needed
              switchBorderRadius={20}
              width={dp(55)} // Adjust the switch width as needed
              textStyle={{fontSize: dp(12), color: 'white', fontWeight: '600'}}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginVertical: 10,
    width: dp(342),
    minHeight: dp(85),
    backgroundColor: '#F5F5F5',
    borderRadius: dp(25),
    display: 'flex',
    flexDirection: 'row',
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
    fontWeight: '500',
    fontSize: dp(15),
    marginTop: dp(5),
  },
  text: {
    color: '#000000',
    fontWeight: '400',
    fontSize: dp(10),
    marginTop: dp(5),
  },
  leftSide: {
    flex: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  rightSide: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  rubles: {
    fontWeight: '600',
    fontSize: dp(24),
  },
  balance: {
    marginTop: dp(5),
  },
  balanceText: {
    fontSize: dp(12),
  },
});

export {BalanceCard};
