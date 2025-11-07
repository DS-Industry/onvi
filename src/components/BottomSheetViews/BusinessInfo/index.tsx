import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View, Image, StyleSheet, Pressable} from 'react-native';

import Modal from '@styled/Modal';

import {Button} from '@styled/buttons';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {dp} from '@utils/dp.ts';
import {WHITE} from '@utils/colors.ts';

import {BusinessHeader} from '@components/Business/Header';
import {CheckBox} from '@styled/buttons/CheckBox';

import {Tag} from '../../../types/api/app/types.ts';
import useStore from '../../../state/store.ts';
import {getFreeVacuum} from '@services/api/user/index.ts';
import {BayTypeEnum} from '@app-types/BayTypeEnum.ts';

const BusinessInfo = () => {
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    business,
    orderDetails,
    setOrderDetails,
    bottomSheetRef,
    bottomSheetSnapPoints,
    setFreeVacuum,
    isFavoriteCarwash,
  } = useStore.getState();

  const {addToFavoritesCarwashes} = useStore();

  const modalCallback = async (bayType: string) => {
    setOrderDetails({...orderDetails, bayType: bayType});
    if (bayType === BayTypeEnum.VACUUME) {
      const data = await getFreeVacuum();
      setFreeVacuum(data);
    }
    navigateBottomSheet('Boxes', {bayType: bayType});
    bottomSheetRef?.current?.snapToPosition(
      bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
    );
  };

  const forceForward = () => {
    setModalVisible(false);
    navigateBottomSheet('Boxes', {});
    bottomSheetRef?.current?.snapToPosition(
      bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../../assets/emojies/thinking.png')}
              style={{width: dp(40), height: dp(40), resizeMode: 'contain'}}
            />
            <Text style={styles.modalTitle}>
              {t('app.business.farFromWash')}
            </Text>
            <Text style={styles.modalText}>
              {t('app.business.somethingWrong')}
            </Text>

            <View style={styles.actionButtons}>
              <View style={styles.buttonPadding}>
                <Button
                  onClick={() => setModalVisible(false)}
                  label={t('navigation.back')}
                  color="blue"
                  width={129}
                  height={42}
                  fontSize={18}
                  fontWeight="600"
                />
              </View>
              <Button
                onClick={forceForward}
                label={t('common.buttons.allOk')}
                color="blue"
                width={129}
                height={42}
                fontSize={18}
                fontWeight="600"
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.paddingTop} />
      <BusinessHeader type="navigate" />
      <Pressable
        style={styles.heartButton}
        onPress={() => {
          if (!isFavoriteCarwash(Number(business?.carwashes[0].id))) {
            addToFavoritesCarwashes(Number(business?.carwashes[0].id));
          }
        }}>
        <Image
          style={styles.heartButtonImage}
          source={
            isFavoriteCarwash(Number(business?.carwashes[0].id))
              ? require('../../../assets/icons/heart-active.png')
              : require('../../../assets/icons/heart.png')
          }
        />
      </Pressable>
      <View style={styles.tagsContainer}>
        {business &&
          business.carwashes.length &&
          orderDetails &&
          typeof orderDetails.carwashIndex !== 'undefined' &&
          business.carwashes[orderDetails.carwashIndex].tags &&
          business.carwashes[orderDetails.carwashIndex].tags.length > 0 &&
          business.carwashes[orderDetails.carwashIndex].tags.map(
            (tag: Tag, index: number) => (
              <View style={styles.tagPadding} key={`tag-${index}`}>
                <CheckBox
                  disable={true}
                  borderRadius={dp(69)}
                  text={'🚀 ' + tag.name}
                  backgroundColor={'#BFFA00'}
                  textColor={'#000000'}
                  fontSize={dp(12)}
                  fontWeight={'600'}
                  height={dp(24)}
                  onClick={() => null}
                />
              </View>
            ),
          )}
      </View>
      <View
        style={[
          styles.buttonContainer,
          {
            justifyContent:
              orderDetails &&
              Number(orderDetails.carwashIndex) >= 0 &&
              business?.carwashes[Number(orderDetails.carwashIndex)].vacuums
                ?.length
                ? 'space-between'
                : 'center',
          },
        ]}>
        {orderDetails &&
        Number(orderDetails.carwashIndex) >= 0 &&
        business?.carwashes[Number(orderDetails.carwashIndex)].vacuums
          ?.length ? (
          <Button
            color={'blue'}
            label={t('app.business.letsVacuum')}
            width={147}
            height={47}
            fontSize={16}
            fontWeight={'600'}
            onClick={() => modalCallback(BayTypeEnum.VACUUME)}
          />
        ) : (
          <></>
        )}

        <Button
          color={'blue'}
          label={t('app.business.letsWash')}
          width={147}
          height={47}
          fontSize={16}
          fontWeight={'600'}
          onClick={() => {
            if (orderDetails.type === 'Portal') {
              modalCallback(BayTypeEnum.PORTAL);
            } else {
              modalCallback(BayTypeEnum.BAY);
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: dp(22),
    paddingLeft: dp(22),
    paddingRight: dp(22),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: dp(21.75),
  },
  title: {
    fontSize: dp(24),
    fontWeight: '600',
    paddingBottom: dp(7),
  },
  text: {
    fontSize: dp(16),
    fontWeight: '400',
  },
  heartButton: {
    position: 'absolute',
    height: dp(27),
    width: dp(27),
    right: dp(25),
    top: dp(25),
  },
  heartButtonImage: {
    height: '100%',
    width: '100%',
  },
  circleImage: {
    width: dp(45),
    height: dp(45),
  },
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
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: dp(24),
    paddingBottom: dp(3),
  },
  modalText: {
    fontWeight: '400',
    fontSize: dp(16),
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: dp(27),
  },
  thinkingImage: {
    width: dp(40),
    height: dp(40),
    resizeMode: 'contain',
  },
  buttonPadding: {
    paddingRight: dp(14),
  },
  paddingTop: {
    paddingTop: dp(15),
  },
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: dp(10),
  },
  tagPadding: {
    padding: dp(2),
  },
  buttonContainer: {
    alignSelf: 'center',
    paddingTop: dp(26),
    flexDirection: 'row',
    width: '100%',
  },
});

export {BusinessInfo};
