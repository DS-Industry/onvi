import React, { memo } from 'react';
import { IUser } from '../../../../types/models/User.ts';
import { OrderDetailsType } from '../../../../state/order/OrderSlice.ts';
import { CarWash } from '../../../../types/api/app/types.ts';
import { StyleSheet, Text, View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton'; 
import { Info } from 'react-native-feather';
import { dp } from '@utils/dp.ts';
import { useTranslation } from 'react-i18next';

interface PaymentSummaryProps {
  order: OrderDetailsType;
  user: IUser | null;
  selectedPos: CarWash | null;
  finalOrderCost: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = memo(
  ({ order, user, selectedPos, finalOrderCost }) => {
    const { t } = useTranslation();

    return (
      <View style={styles.container}>
        {/* <View style={styles.row}>
          {order.name ? (
            <Text style={styles.itemName}>{order.name}</Text>
          ) : (
            <Text />
          )}
          <Text style={styles.itemPrice}>{order.sum ? order.sum : 0} ₽</Text>
        </View> */}

        <View style={styles.row}>
          {selectedPos?.IsLoyaltyMember ? (
            <>
              <Text style={styles.itemName}>
                {t('app.payment.yourCashback')}
              </Text>
              {!user || !user.tariff || user.tariff === 0 ? (
                <View style={{ alignSelf: 'flex-end' }}>
                  <Skeleton
                    isLoading={true}
                    layout={[
                      {
                        key: 'cashback-placeholder',
                        width: 40,
                        height: 15,
                        borderRadius: 10,
                      },
                    ]}
                    boneColor="#f0f0f0"
                    highlightColor="#e0e0e0"
                    animationType="shiver"
                    animationDuration={1200}
                  >
                    <View />
                  </Skeleton>
                </View>
              ) : (
                <Text style={styles.itemPrice}>
                  {(finalOrderCost * user.tariff) / 100 < 1
                    ? 0
                    : Math.ceil((finalOrderCost * user.tariff) / 100)}{' '}
                  ₽
                </Text>
              )}
            </>
          ) : (
            <View style={styles.infoRow}>
              <Info width={20} height={20} stroke={'#0B68E1'} />
              <Text style={styles.infoText}>
                {t('app.payment.noCashbackMessage')}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dp(10),
  },
  itemName: {
    fontWeight: '400',
    fontSize: dp(14),
    color: 'black',
    flexShrink: 1,
    flex: 1,
    flexWrap: 'wrap',
  },
  itemPrice: {
    color: 'black',
    fontWeight: '700',
    fontSize: dp(16),
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(10),
  },
  infoText: {
    fontWeight: '400',
    fontSize: dp(10),
    color: 'rgba(0, 0, 0, 1)',
    marginLeft: dp(4),
  },
});

export default memo(PaymentSummary);
