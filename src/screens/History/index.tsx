import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {dp} from '@utils/dp';
import React from 'react';
import ScreenHeader from '@components/ScreenHeader';
import {useTranslation} from 'react-i18next';
import {WHITE} from '@utils/colors';
import {Settings} from 'react-native-feather';
import {avatarSwitch} from '@screens/Settings';
import EmptyPlaceholder from '@components/EmptyPlaceholder';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import useSWR from 'swr';
import {getOrderHistory} from '@services/api/user';
import {useNavStore} from '@state/useNavStore/index.ts';
import {BalanceCard} from '@styled/cards/BalanceCard';
import useStore from '@state/store';

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

  const renderItem = ({item}: {item: any}) => <BalanceCard option={item} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader screenTitle={t('app.history.title')} />

        <View style={styles.listContainer}>
          {isLoading ? (
            <EmptyPlaceholder text={t('app.history.loading')} />
          ) : (
            <FlatList
              data={orderData}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              onRefresh={mutate}
              refreshing={isLoading}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              ListEmptyComponent={() => (
                <EmptyPlaceholder text={t('app.history.noOrders')} />
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: dp(16),
  },
  listContainer: {
    flex: 1,
    marginTop: dp(20),
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: dp(20),
  },
});

export {History};
