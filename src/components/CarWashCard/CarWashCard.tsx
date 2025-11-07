import React, {useState} from 'react';
import {dp} from '@utils/dp';
import {Button, Image, Text, XStack, YStack} from 'tamagui';
import {CarWashLocation} from '@app-types/api/app/types';
import useStore from '@state/store';
import {StyleSheet, Modal, TouchableWithoutFeedback} from 'react-native';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface CarWashCardProps {
  carWash: CarWashLocation;
  showDistance?: boolean;
  showIsFavorite?: boolean;
  heartIsClickable?: boolean;
  showBorder?: boolean;
  longPressPinAction?: boolean;
  enablePinIcon?: boolean;
  cardIsClickable?: boolean;
}

const CarWashCard = ({
  carWash,
  showDistance = true,
  showIsFavorite = false,
  heartIsClickable = false,
  showBorder = true,
  longPressPinAction = false,
  enablePinIcon = false,
  cardIsClickable = true,
}: CarWashCardProps) => {
  const {
    addToFavoritesCarwashes,
    removeFromFavoritesCarwashes,
    isFavoriteCarwash,
    addToPinnedCarwashes,
    removeFromPinnedCarwashes,
    isPinnedCarwash,
    setBusiness,
    setOrderDetails,
    bottomSheetRef,
    cameraRef,
  } = useStore.getState();

  const [menuVisible, setMenuVisible] = useState(false);

  if (!carWash?.carwashes[0]) {
    return null;
  }

  if (!carWash?.distance) {
    showDistance = false;
  }

  const id = carWash.carwashes[0].id;
  const numericId = Number(id);

  const isFavorite =
    !id || isNaN(numericId) ? false : isFavoriteCarwash(numericId);
  const isPinned = !id || isNaN(numericId) ? false : isPinnedCarwash(numericId);

  const handleHeartPress = () => {
    try {
      if (isFavorite) {
        removeFromFavoritesCarwashes(Number(carWash.carwashes[0].id));
      } else {
        addToFavoritesCarwashes(Number(carWash.carwashes[0].id));
      }
    } catch (error) {}
    setMenuVisible(false);
  };

  const handleClip = () => {
    try {
      if (isPinned) {
        removeFromPinnedCarwashes(Number(carWash.carwashes[0].id));
      } else {
        addToPinnedCarwashes(Number(carWash.carwashes[0].id));
      }
    } catch (error) {}
    setMenuVisible(false);
  };

  const handleLongPress = () => {
    if (longPressPinAction) {
      setMenuVisible(true);
      ReactNativeHapticFeedback.trigger('impactLight', HapticOptions);
    }
  };

  const handleCardPress = () => {
    if (cardIsClickable) {
      navigateBottomSheet('Business', {});
      setBusiness(carWash);
      setOrderDetails({
        posId: 0,
        sum: 0,
        bayNumber: null,
        promoCodeId: null,
        rewardPointsUsed: null,
        type: null,
        name: null,
        prices: [],
        order: null,
        orderDate: null,
      });

      bottomSheetRef?.current?.snapToPosition('42%');

      cameraRef?.current?.setCameraPosition({
        longitude: carWash.location.lon,
        latitude: carWash.location.lat,
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  };

  const closeModal = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <Button
        height={showDistance ? dp(63) : dp(46)}
        padding={10}
        borderRadius={12}
        borderWidth={showBorder ? 1 : 0}
        borderColor="#E2E2E2"
        justifyContent="flex-start"
        onPress={handleCardPress}
        onLongPress={handleLongPress}>
        <XStack flex={1} alignItems="center" gap={dp(8)}>
          {enablePinIcon ? (
            <Image
              source={
                isPinned
                  ? require('../../assets/icons/map-pin-active.png')
                  : require('../../assets/icons/map-pin.png')
              }
              width={29}
              height={29}
            />
          ) : (
            <Image
              source={require('../../assets/icons/small-icon.png')}
              width={18}
              height={18}
            />
          )}

          <YStack paddingRight={dp(15)}>
            <Text fontSize={13} ellipsizeMode="tail" numberOfLines={1}>
              {carWash.carwashes[0].name}
            </Text>
            <Text
              fontSize={12}
              color={'#6F6F6F'}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {carWash.carwashes[0].address}
            </Text>
            {showDistance && (
              <Text
                fontSize={12}
                color={'#6F6F6F'}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {`${carWash.distance?.toFixed(2)} km away`}
              </Text>
            )}
          </YStack>
        </XStack>

        {showIsFavorite && isFavorite && (
          <Button
            unstyled
            onPress={() => {
              if (heartIsClickable) {
                setMenuVisible(true);
              }
            }}>
            <Image
              source={require('../../assets/icons/heart-active.png')}
              width={20}
              height={20}
            />
          </Button>
        )}
      </Button>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <XStack style={styles.modalOverlay}>
            <XStack style={styles.overlayBackground} />
          </XStack>
        </TouchableWithoutFeedback>

        <XStack style={styles.modalContent}>
          <TouchableWithoutFeedback>
            <YStack style={styles.contextMenu}>
              {longPressPinAction ? (
                <Button unstyled onPress={handleClip} style={styles.menuButton}>
                  <XStack
                    padding={dp(15)}
                    backgroundColor="white"
                    borderRadius={dp(12)}
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    gap={dp(6)}>
                    <Text fontSize={dp(13)} color="#333" fontWeight="500">
                      {isPinned ? 'Открепить' : 'Закрепить'}
                    </Text>
                    <Image
                      source={
                        isPinned
                          ? require('../../assets/icons/clip.png')
                          : require('../../assets/icons/clip.png')
                      }
                      width={20}
                      height={20}
                    />
                  </XStack>
                </Button>
              ) : (
                <Button
                  unstyled
                  onPress={handleHeartPress}
                  style={styles.menuButton}>
                  <XStack
                    padding={dp(15)}
                    backgroundColor="white"
                    borderRadius={dp(12)}
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    gap={dp(6)}>
                    <Text fontSize={dp(13)} color="#333" fontWeight="500">
                      {isFavorite
                        ? 'Удалить из избранного'
                        : 'Добавить в избранное'}
                    </Text>
                    <Image
                      source={
                        isFavorite
                          ? require('../../assets/icons/heart-active.png')
                          : require('../../assets/icons/heart.png')
                      }
                      width={20}
                      height={20}
                    />
                  </XStack>
                </Button>
              )}
              <Button unstyled onPress={closeModal} style={styles.closeButton}>
                <XStack
                  padding={dp(15)}
                  backgroundColor="white"
                  borderRadius={dp(12)}
                  alignItems="center"
                  justifyContent="center"
                  width="100%">
                  <Text fontSize={dp(13)} color="#FF3B30" fontWeight="500">
                    Отмена
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </TouchableWithoutFeedback>
        </XStack>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: dp(20),
    zIndex: 1000,
  },
  contextMenu: {
    width: '100%',
    gap: dp(10),
  },
  menuButton: {
    width: '100%',
  },
  closeButton: {
    width: '100%',
    marginTop: dp(5),
  },
});

export {CarWashCard};
