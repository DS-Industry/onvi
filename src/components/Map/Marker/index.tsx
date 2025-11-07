import React, {useCallback} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {View} from 'react-native';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import calculateDistance from '../../../utils/calculateDistance';
import Svg, {Path} from 'react-native-svg';
import useStore from '../../../state/store.ts';

interface MarkerProps {
  coordinate: number[];
  business: any;
  locationRef: any;
  isSelected: boolean;
}

const Marker = React.memo(
  ({coordinate, business, locationRef, isSelected}: MarkerProps) => {
    const {
      setSelectedPos,
      setSum,
      setOrderDetails,
      setBusiness,
      bottomSheetRef,
      cameraRef,
    } = useStore.getState();

    const handleSelected = useCallback(() => {
      const distance = calculateDistance(
        business.location.lat,
        business.location.lon,
        locationRef.current?.lat as number,
        locationRef.current?.lon as number,
      );
      const businessObj = {...business, close: distance <= 10};
      setBusiness(businessObj);
      navigateBottomSheet('Business', {});
      setSelectedPos(business);
      setSum(150);
      setOrderDetails({
        posId: 0,
        sum: 150,
        bayNumber: null,
        promoCodeId: null,
        rewardPointsUsed: null,
        type: null,
        name: null,
        prices: [],
        order: null,
        orderDate: null,
      });
      bottomSheetRef?.current?.snapToPosition('60%');
      cameraRef?.current?.setCameraPosition({
        longitude: business.location.lon,
        latitude: business.location.lat,
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }, [
      business,
      bottomSheetRef,
      locationRef,
      setBusiness,
      setOrderDetails,
      setSelectedPos,
      setSum,
    ]);

    const getMapbox = (): JSX.Element => {
      return (
        <MapboxGL.PointAnnotation
          id={`${isSelected ? 'selected' : 'normal'}-${
            business.carwashes[0].id
          }`}
          coordinate={coordinate}
          onSelected={handleSelected}>
          {/* Прозрачный контейнер с увеличенной зоной касания */}
          <View
            style={{
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            <Svg
              width={35}
              height={35}
              style={{borderWidth: 0}}
              preserveAspectRatio="none"
              viewBox={`0 0 ${50} ${50}`}>
              <Path
                d="M14.7773 28.9438C22.5093 28.9438 28.7773 22.6758 28.7773 14.9438C28.7773 7.21186 22.5093 0.943848 14.7773 0.943848C7.04536 0.943848 0.777344 7.21186 0.777344 14.9438C0.777344 22.6758 7.04536 28.9438 14.7773 28.9438Z"
                fill={isSelected ? 'black' : '#BFFA00'}
              />
              <Path
                d="M7.1926 20.235L16.9063 4.96049C16.9084 4.95565 16.9113 4.95125 16.9151 4.94756C16.9188 4.94387 16.9233 4.94095 16.9282 4.93897C16.933 4.93699 16.9383 4.936 16.9435 4.93604C16.9488 4.93608 16.954 4.93715 16.9588 4.9392C16.9637 4.94125 16.9681 4.94424 16.9718 4.94799C16.9754 4.95173 16.9784 4.95617 16.9803 4.96105C16.9823 4.96593 16.9833 4.97114 16.9833 4.97641C16.9832 4.98167 16.9822 4.98687 16.9801 4.99172L14.0791 14.8105C13.7694 15.859 13.2172 16.8199 12.4671 17.6154C11.717 18.4108 10.7901 19.0185 9.76154 19.3891L7.2437 20.2946C7.23564 20.2996 7.22607 20.3015 7.21671 20.3001C7.20736 20.2986 7.19883 20.2939 7.19267 20.2867C7.18651 20.2795 7.18312 20.2703 7.18311 20.2609C7.18309 20.2514 7.18646 20.2422 7.1926 20.235Z"
                fill={isSelected ? '#BFFA00' : 'black'}
              />
              <Path
                d="M22.3562 9.65283L12.6453 24.9274C12.6433 24.9322 12.6403 24.9366 12.6365 24.9403C12.6328 24.944 12.6284 24.9469 12.6235 24.9489C12.6186 24.9509 12.6134 24.9519 12.6081 24.9518C12.6029 24.9518 12.5977 24.9507 12.5928 24.9486C12.588 24.9466 12.5836 24.9436 12.5799 24.9399C12.5762 24.9361 12.5733 24.9317 12.5713 24.9268C12.5693 24.9219 12.5683 24.9167 12.5684 24.9114C12.5684 24.9062 12.5695 24.901 12.5715 24.8961L15.4726 15.0802C15.7819 14.0312 16.3339 13.0697 17.084 12.2737C17.8341 11.4777 18.7612 10.8696 19.7901 10.4987L22.3079 9.59322C22.3159 9.5897 22.3248 9.58891 22.3333 9.59096C22.3418 9.59301 22.3494 9.5978 22.3549 9.60458C22.3603 9.61136 22.3634 9.61976 22.3637 9.62848C22.3639 9.6372 22.3613 9.64575 22.3562 9.65283Z"
                fill={isSelected ? '#BFFA00' : 'black'}
              />
            </Svg>
          </View>
        </MapboxGL.PointAnnotation>
      );
    };

    if (coordinate && coordinate[0] && coordinate[1]) {
      return (
        <>
          {isSelected && getMapbox()}
          {!isSelected && getMapbox()}
        </>
      );
    }

    return null;
  },
  (prevProps, nextProps) => {
    return prevProps.isSelected === nextProps.isSelected;
  },
);

export default Marker;
