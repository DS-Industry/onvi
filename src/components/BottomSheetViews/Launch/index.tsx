import {useNavigation, useRoute} from '@react-navigation/native';

import useStore from '../../../state/store';

import PortalLaunch from './Portal';
import DefaultLaunch from './Default';

import {
  GeneralBottomSheetNavigationProp,
  GeneralBottomSheetRouteProp,
} from '../../../types/navigation/BottomSheetNavigation.ts';
import VacuumLaunch from '@components/BottomSheetViews/Launch/Vacuum';
import {BayTypeEnum} from '@app-types/BayTypeEnum.ts';

const Launch = () => {
  const navigation =
    useNavigation<GeneralBottomSheetNavigationProp<'Launch'>>();

  const route = useRoute<GeneralBottomSheetRouteProp<'Launch'>>();

  const {isBottomSheetOpen, setOrderDetails, orderDetails} =
    useStore.getState();

  const isOpened = isBottomSheetOpen;

  const type: string = route.params.bayType;

  const onSelect = (name: string, price: number) => {
    setOrderDetails({
      ...orderDetails,
      sum: price,
      name: name,
    });

    navigation.navigate('Payment', {});
  };

  switch (type) {
    case BayTypeEnum.BAY: {
      return <DefaultLaunch />;
    }
    case BayTypeEnum.VACUUME: {
      return <VacuumLaunch />;
    }
    case BayTypeEnum.PORTAL: {
      return <PortalLaunch isOpened={isOpened} onSelect={onSelect} />;
    }
    default: {
      return <DefaultLaunch />;
    }
  }
};

export {Launch};
