import {useTranslation} from 'react-i18next';
import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {dp} from '@utils/dp';

import {WHITE} from '@utils/colors';

import {BalanceCard} from '@styled/cards/BalanceCard';
import useStore from '@state/store';

import {Settings} from 'react-native-feather';

import {avatarSwitch} from '@screens/Settings';
import EmptyPlaceholder from '@components/EmptyPlaceholder';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import HistoryPlaceholder from './HistoryPlaceholder.tsx';
import useSWR from 'swr';
import {getOrderHistory} from '@services/api/user';

import {useNavStore} from '@state/useNavStore/index.ts';

const History = () => {
  const {t} = useTranslation();
  const {user} = useStore.getState();

  const {data, isLoading, mutate} = useSWR(['getOrderHistory'], () =>
    getOrderHistory({size: 20, page: 1}),
  );

  const orderData = Array.isArray(data) ? data : [];

  const initialAvatar = user?.avatar || 'both.jpg';

  const avatarValue = avatarSwitch(initialAvatar);

  const {drawerNavigation} = useNavStore.getState();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.userInfoContainer}>
          <Image source={avatarValue} style={styles.avatar} />
          {user && user.name && (
            <Text
              style={styles.userName}
              numberOfLines={3}
              ellipsizeMode="tail">
              {user.name}
            </Text>
          )}
        </View>
        <View style={styles.settingsIconContainer}>
          <TouchableOpacity
            onPress={() => {
              navigateBottomSheet('Main', {});
              drawerNavigation?.navigate('Настройки');
            }}>
            <Settings stroke={'white'} width={dp(18)} height={dp(18)} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actions}>
        <Text style={styles.title}>{t('app.history.title')}</Text>
      </View>
      {isLoading ? (
        <HistoryPlaceholder />
      ) : (
        <View style={styles.listContainer}>
          <BottomSheetFlatList
            data={orderData}
            renderItem={order => <BalanceCard option={order.item} />}
            keyExtractor={(_, index) => index.toString()}
            onRefresh={mutate}
            refreshing={isLoading}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            bounces={true}
            contentContainerStyle={styles.flatListContent}
            ListEmptyComponent={() => (
              <EmptyPlaceholder text={t('app.history.noOrders')} />
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: dp(16),
  },
  headerContainer: {
    paddingBottom: dp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: dp(60),
    height: dp(60),
  },
  userName: {
    fontWeight: '600',
    fontSize: dp(24),
    paddingLeft: dp(5),
    flexShrink: 1,
  },
  settingsIconContainer: {
    width: dp(34),
    height: dp(34),
    borderRadius: dp(50),
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    fontSize: dp(19),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  listContainer: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: dp(20),
  },
});

export {History};
