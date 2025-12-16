import React, {useState} from 'react';
import {dp} from '@utils/dp';
import {
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import useStore from '@state/store';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { CarWashWithLocation } from '@components/Map';

const HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface CarWashCardProps {
  carWash: CarWashWithLocation;
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
    resetFilters, 
    resetPosList,
    originalPosList
  } = useStore.getState();

  const [menuVisible, setMenuVisible] = useState(false);

  if (!carWash?.distance) {
    showDistance = false;
  }

  const id = carWash.id;
  const numericId = Number(id);
  const isFavorite = !id || isNaN(numericId) ? false : isFavoriteCarwash(numericId);
  const isPinned = !id || isNaN(numericId) ? false : isPinnedCarwash(numericId);

  const handleHeartPress = () => {
    try {
      if (isFavorite) {
        removeFromFavoritesCarwashes(Number(carWash.id));
      } else {
        addToFavoritesCarwashes(Number(carWash.id));
      }
    } catch (error) {}
    setMenuVisible(false);
  };

  const handleClip = () => {
    try {
      if (isPinned) {
        removeFromPinnedCarwashes(Number(carWash.id));
      } else {
        addToPinnedCarwashes(Number(carWash.id));
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
      resetFilters();
      resetPosList();
      
      navigateBottomSheet('Business', {});

      const result = originalPosList.find(carwashLocation =>
        carwashLocation.carwashes.some(carwash => carwash.id === carWash.id)
      );
      if (result) {
        setBusiness(result);
      }

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
      <TouchableOpacity
        style={[
          localStyles.card,
          {
            height: showDistance ? dp(63) : dp(46),
            borderWidth: showBorder ? 1 : 0,
          },
        ]}
        onPress={handleCardPress}
        onLongPress={handleLongPress}
        activeOpacity={0.8}>
        <View style={localStyles.cardContent}>
          {enablePinIcon ? (
            <Image
              source={
                isPinned
                  ? require('../../assets/icons/map-pin-active.png')
                  : require('../../assets/icons/map-pin.png')
              }
              style={{width: 29, height: 29}}
            />
          ) : (
            <Image
              source={require('../../assets/icons/small-icon.png')}
              style={{width: 18, height: 18}}
            />
          )}
          <View style={localStyles.textContainer}>
            <Text style={localStyles.title} ellipsizeMode="tail" numberOfLines={1}>
              {carWash.name}
            </Text>
            <Text
              style={localStyles.subtitle}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {carWash.address}
            </Text>
            {showDistance && (
              <Text
                style={localStyles.subtitle}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {`${carWash.distance?.toFixed(2)} km away`}
              </Text>
            )}
          </View>
        </View>
        <Text>{carWash.id}</Text>
        {showIsFavorite && isFavorite && (
          <TouchableOpacity
            style={localStyles.heartButton}
            onPress={() => {
              if (heartIsClickable) {
                setMenuVisible(true);
              }
            }}>
            <Image
              source={require('../../assets/icons/heart-active.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={localStyles.modalOverlay}>
            <View style={localStyles.overlayBackground} />
          </View>
        </TouchableWithoutFeedback>
        <View style={localStyles.modalContent}>
          <TouchableWithoutFeedback>
            <View style={localStyles.contextMenu}>
              {longPressPinAction ? (
                <TouchableOpacity
                  onPress={handleClip}
                  style={localStyles.menuButton}>
                  <View
                    style={[
                      localStyles.menuItem,
                      {flexDirection: 'row', gap: dp(6)},
                    ]}>
                    <Text style={localStyles.menuText}>
                      {isPinned ? 'Открепить' : 'Закрепить'}
                    </Text>
                    <Image
                      source={require('../../assets/icons/clip.png')}
                      style={{width: 20, height: 20}}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleHeartPress}
                  style={localStyles.menuButton}>
                  <View
                    style={[
                      localStyles.menuItem,
                      {flexDirection: 'row', gap: dp(6)},
                    ]}>
                    <Text style={localStyles.menuText}>
                      {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                    </Text>
                    <Image
                      source={
                        isFavorite
                          ? require('../../assets/icons/heart-active.png')
                          : require('../../assets/icons/heart.png')
                      }
                      style={{width: 20, height: 20}}
                    />
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={closeModal} style={localStyles.closeButton}>
                <View style={localStyles.menuItem}>
                  <Text style={[localStyles.menuText, {color: '#FF3B30'}]}>
                    Отмена
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </>
  );
};

const localStyles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 12,
    borderColor: '#E2E2E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dp(8),
    flex: 1,
  },
  textContainer: {
    paddingRight: dp(15),
    flex: 1,
  },
  title: {
    fontSize: 13,
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    color: '#6F6F6F',
  },
  heartButton: {
    padding: 5,
  },
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
  menuItem: {
    padding: dp(15),
    backgroundColor: 'white',
    borderRadius: dp(12),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  menuText: {
    fontSize: dp(13),
    fontWeight: '500',
    color: '#333',
  },
  closeButton: {
    width: '100%',
    marginTop: dp(5),
  },
});

export {CarWashCard};
