import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {dp} from '../../../utils/dp';
import CustomSwitch from '@styled/buttons/CustomSwitch';
import {ITransaction} from '../../../types/api/user/res/IGetHistoryResponse.ts';
import {useTranslation} from 'react-i18next';

export interface IBalanceCardProps {
  option: ITransaction;
}

const BalanceCard = ({option}: IBalanceCardProps) => {
  const {i18n} = useTranslation();
  const date = new Date(option.orderData);

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
        <Text style={styles.title}>{option.posName}</Text>
        <Text style={styles.text}>{option.posAddress}</Text>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.rubles}>{option.sumReal} ₽ </Text>

        <View style={styles.balance}>
          {option.sumCashback && option.sumCashback > 0 ? (
            <CustomSwitch
              value={false}
              inActiveText={`+${option.sumCashback}`}
              disabled={false}
              backgroundInActive="#BFFA00FF"
              circleImageInactive={require('../../../assets/icons/small_icon_black.png')}
              circleSize={dp(17)}
              switchBorderRadius={20}
              width={dp(55)}
              textStyle={{fontSize: dp(12), color: '#000', fontWeight: '600'}}
            />
          ) : (
            <CustomSwitch
              value={false}
              inActiveText={
                Number(option.sumBonus) === 0
                  ? `${option.sumBonus}`
                  : `-${option.sumBonus}`
              }
              disabled={false}
              backgroundInActive="#000"
              circleImageInactive={require('../../../assets/icons/small-icon.png')}
              circleSize={dp(17)}
              switchBorderRadius={20}
              width={dp(55)}
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
});

export {BalanceCard};
