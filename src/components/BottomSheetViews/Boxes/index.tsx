import {Text, View, StyleSheet, Image} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

import {ScrollView as GHScrollView} from 'react-native-gesture-handler';

import {BoxesSlide} from '@components/Boxes/BoxesSlide';
import {BusinessHeader} from '@components/Business/Header';

import {dp} from '@utils/dp';

import {
  GeneralBottomSheetNavigationProp,
  GeneralBottomSheetRouteProp,
} from '@app-types/navigation/BottomSheetNavigation.ts';

import {useTranslation} from 'react-i18next';
import useStore from '@state/store.ts';
import {BayTypeEnum} from '@app-types/BayTypeEnum';

const Boxes = () => {
  const navigation = useNavigation<GeneralBottomSheetNavigationProp<'Boxes'>>();
  const route = useRoute<GeneralBottomSheetRouteProp<'Boxes'>>();
  const {t} = useTranslation();
  const type = route.params.bayType;

  const {business, orderDetails} = useStore.getState();

  return (
    <GHScrollView
      contentContainerStyle={{flexGrow: 1}}
      nestedScrollEnabled={true}>
      <View style={styles.container}>
        <View style={styles.containerView}>
          <BusinessHeader type="empty" />

          <View style={styles.middle}>
            <Text style={styles.middleText}>{t('app.business.select')}</Text>

            {type === BayTypeEnum.BAY || type === BayTypeEnum.PORTAL ? (
              <Text style={styles.middleText}>
                {t('app.business.bay').toLowerCase()}{' '}
                <Text style={[styles.emoji]}>🚙</Text>
              </Text>
            ) : (
              <Text style={styles.middleText}>
                {t('app.business.vacuume').toLowerCase()}{' '}
                <Text style={[styles.emoji]}>💨</Text>
              </Text>
            )}

            <View style={styles.boxes}>
              <BoxesSlide
                boxes={
                  business &&
                  orderDetails &&
                  typeof orderDetails.carwashIndex !== 'undefined' &&
                  business.carwashes &&
                  business.carwashes.length
                    ? type === BayTypeEnum.BAY || type === BayTypeEnum.PORTAL
                      ? business.carwashes[orderDetails.carwashIndex].boxes
                      : business.carwashes[orderDetails.carwashIndex].vacuums
                    : []
                }
                navigation={navigation}
                params={route.params}
              />
            </View>
          </View>
          <View style={styles.button}>
            <Image
              source={require('../../../assets/icons/small-icon.png')}
              style={styles.buttonImage}
            />
          </View>
        </View>
      </View>
    </GHScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: dp(22),
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: dp(24),
    fontWeight: '600',
  },
  text: {
    fontSize: dp(16),
    fontWeight: '400',
  },
  middle: {
    flex: 1,
    paddingLeft: dp(22),
    paddingRight: dp(22),
  },
  middleText: {
    fontSize: dp(36),
    fontWeight: '600',
    color: '#000',
  },
  boxes: {
    paddingTop: dp(81),
  },
  carImage: {
    width: dp(32),
    height: dp(32),
  },
  button: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: dp(22),
  },
  services: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: dp(40),
  },
  emoji: {
    fontSize: 36, // Adjust the font size of the emoji to match the text// Align on the baseline
    lineHeight: 50,
  },
  containerView: {
    paddingTop: dp(15),
    paddingLeft: dp(22),
    paddingRight: dp(22),
  },
  buttonImage: {
    width: dp(50),
    height: dp(50),
  },
});

export {Boxes};
