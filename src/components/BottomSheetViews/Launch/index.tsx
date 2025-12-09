import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import useStore from '../../../state/store';
import PortalLaunch from './Portal';
import DefaultLaunch from './Default';
import VacuumLaunch from '@components/BottomSheetViews/Launch/Vacuum';
import {BusinessHeader} from '@components/Business/Header';
import {
  GeneralBottomSheetNavigationProp,
  GeneralBottomSheetRouteProp,
} from '../../../types/navigation/BottomSheetNavigation.ts';
import {BayTypeEnum} from '@app-types/BayTypeEnum.ts';

const Launch = () => {
  const navigation =
    useNavigation<GeneralBottomSheetNavigationProp<'Launch'>>();
  const route = useRoute<GeneralBottomSheetRouteProp<'Launch'>>();

  const {isBottomSheetOpen, setOrderDetails, orderDetails, setPaymentModalOpen} = useStore.getState();
  const {freeVacuum} = useStore();

  const isOpened = isBottomSheetOpen;
  const type: string = route.params.bayType;

  const isFreeVacuum = freeVacuum?.remains > 0;

  const onSelect = (name: string, price: number) => {
    setOrderDetails({
      ...orderDetails,
      sum: price,
      name: name,
      free: false,
    });

    setPaymentModalOpen(true);
  };

  const handlePay = (cost: number) => {
    setOrderDetails({
      ...orderDetails,
      sum: cost,
      free: isFreeVacuum && cost === 0,
    });

    setPaymentModalOpen(true);
  };

  return (
    <View style={styles.container}>
      <BusinessHeader type="box" box={orderDetails?.bayNumber ?? 0} />

      {(() => {
        switch (type) {
          case BayTypeEnum.BAY: {
            return <DefaultLaunch onPay={handlePay} />;
          }
          case BayTypeEnum.VACUUME: {
            return <VacuumLaunch onPay={handlePay} />;
          }
          case BayTypeEnum.PORTAL: {
            return <PortalLaunch isOpened={isOpened} onSelect={onSelect} />;
          }
          default: {
            return <DefaultLaunch onPay={handlePay} />;
          }
        }
      })()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 15,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});

export {Launch};
