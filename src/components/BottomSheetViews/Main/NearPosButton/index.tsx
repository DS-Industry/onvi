import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {BLUE, WHITE} from '../../../../utils/colors';
import {dp} from '../../../../utils/dp';
import useStore from '../../../../state/store';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {CarWashLocation} from 'src/types/api/app/types';
import calculateDistance from '@utils/calculateDistance.ts';
import Modal from '@styled/Modal';
import {Button} from '@styled/buttons';
import {useTranslation} from 'react-i18next';
import {XStack, YStack, Text as TamaguiText} from 'tamagui';
import PressableCard from '@components/PressableCard/PressableCard';

export default function NearPosButton() {
  const {
    bottomSheetRef,
    bottomSheetSnapPoints,
    setBusiness,
    setNearByPos,
    cameraRef,
  } = useStore.getState();
  const {t} = useTranslation();

  const posList = useStore(state => state.posList);
  const nearByPos = useStore(state => state.nearByPos);
  const location = useStore(state => state.location);

  const [nearByModal, setNearByModal] = useState(false);

  const isNearestCarWashSet = useRef(false);

  const handleLaunchCarWash = () => {
    if (nearByPos) {
      setBusiness(nearByPos);
      navigateBottomSheet('Business', nearByPos);
      bottomSheetRef?.current?.snapToPosition(
        bottomSheetSnapPoints[bottomSheetSnapPoints.length - 2],
      );

      cameraRef?.current?.setCameraPosition({
        longitude: nearByPos.location.lon,
        latitude: nearByPos.location.lat,
        zoomLevel: 16,
        animationDuration: 1000,
      });
    } else {
      setNearByModal(true);
    }
  };

  const findNearestCarWash = () => {
    if (!location || !posList?.length) {
      return;
    }

    let nearest: CarWashLocation | null = null;
    let minDistance = Infinity;

    for (const carWash of posList) {
      const {lat, lon} = carWash.location;
      const distance = calculateDistance(
        location.longitude,
        location.latitude,
        lon,
        lat,
      );

      if (distance < minDistance && distance <= 5) {
        minDistance = distance;
        nearest = carWash;
      }
    }

    if (nearest) {
      setNearByPos(nearest);
      isNearestCarWashSet.current = true;
    }
  };

  useEffect(() => {
    if (
      !isNearestCarWashSet.current &&
      location &&
      posList &&
      posList.length > 0
    ) {
      findNearestCarWash();
    }
  }, [location, posList]);

  return (
    <>
      <PressableCard
        backgroundColor={BLUE}
        borderRadius={dp(22)}
        height={dp(90)}
        width={'48%'}
        flex={1}
        padding={dp(16)}
        onPress={handleLaunchCarWash}>
        <YStack>
          <YStack paddingBottom={dp(8)}>
            <TamaguiText color={WHITE} fontSize={dp(16)} fontWeight="700">
              {t('app.business.letsWash')}
            </TamaguiText>
          </YStack>
          <XStack justifyContent="space-between" alignItems="center">
            <TamaguiText
              fontSize={dp(10)}
              fontWeight="700"
              color={WHITE}
              flex={1}
              ellipsizeMode="tail"
              marginRight={dp(8)}
              numberOfLines={3}>
              {nearByPos?.carwashes?.length ? nearByPos.carwashes[0].name : ''}
            </TamaguiText>
            <Image
              source={require('../../../../assets/icons/small-icon.png')}
              style={{width: 30, height: 30}}
            />
          </XStack>
        </YStack>
      </PressableCard>

      <Modal
        visible={nearByModal}
        onClose={() => setNearByModal(false)}
        animationType="none">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {t('app.mainExtras.geolocationMessage')}
            </Text>
            <View style={styles.actionButtons}>
              <View>
                <Button
                  onClick={() => setNearByModal(false)}
                  label={t('common.buttons.close')}
                  color="blue"
                  width={129}
                  height={42}
                  fontSize={18}
                  fontWeight="600"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 38,
    width: dp(341),
    height: dp(222),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: dp(16),
    paddingTop: dp(16),
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: dp(27),
  },
});
