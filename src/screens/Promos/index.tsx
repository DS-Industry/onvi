import React from 'react';
import {useTranslation} from 'react-i18next';

import {dp} from '../../utils/dp';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import EmptyPlaceholder from '@components/EmptyPlaceholder';

import {GlobalPromosPlaceholder} from './PromosPlaceholder';

import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import {PersonalPromoBanner} from '@styled/banners/PersonalPromoBanner';
import Carousel from 'react-native-reanimated-carousel';
import useSWR from 'swr';
import {getActiveClientPromotions} from '@services/api/user';
import {getGlobalPromotions} from '@services/api/promotion';
import {PersonalPromoPlaceholder} from '@screens/Promos/PersonalPromoPlaceholder.tsx';
import ScreenHeader from '@components/ScreenHeader';
import useStore from '../../state/store.ts';

const Promos = () => {
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Промокоды'>>();
  const {t} = useTranslation();

  const {location} = useStore.getState();

  const locationParams = {
    latitude: Number(location?.latitude),
    longitude: Number(location?.longitude),
  };

  const {
    isLoading: isGlobalPromoLoading,
    data: globalPromo,
    error: globalError,
  } = useSWR(['getGlobalPromos'], () => getGlobalPromotions());

  const {
    isLoading: isPersonalPromoLoading,
    data: personalPromo,
    error: personalError,
  } = useSWR(['getPersonalPromos'], () =>
    getActiveClientPromotions(locationParams),
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <ScrollView style={styles.container}>
        <ScreenHeader screenTitle={t('app.promos.title')} />
        <View style={styles.content}>
          <View style={{flex: 1, marginBottom: dp(20), height: '30%'}}>
            <Text style={styles.sectionTitle}>
              {t('app.promos.personalPromos')}
            </Text>
            {isPersonalPromoLoading || personalError ? (
              // Show the placeholder when loading
              <PersonalPromoPlaceholder />
            ) : personalPromo && personalPromo.length > 0 ? (
              // Show the carousel if promo data is available
              <View>
                <Carousel
                  data={personalPromo}
                  vertical={false}
                  width={dp(350)}
                  height={dp(200)}
                  pagingEnabled
                  renderItem={({item}: any) => (
                    <PersonalPromoBanner
                      title={`${t('app.promos.promocodeFor')} ${
                        item.discount
                      } ${
                        item.discountType == 2 ? '%' : t('common.labels.ballov')
                      }`}
                      date={new Date(item.expiryDate)}
                      onPress={() =>
                        navigation.navigate('Ввод Промокода', {
                          promocode: item,
                          type: 'personal',
                        })
                      }
                      disable={false}
                    />
                  )}
                />
              </View>
            ) : (
              // Show a fallback message if no promo codes are available
              <View
                style={{
                  alignSelf: 'center',
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <EmptyPlaceholder text={t('app.promos.noPromocodes')} />
              </View>
            )}
          </View>

          <View style={styles.cuponContainer}>
            <Text style={styles.sectionTitle}>
              {t('app.promos.generalPromocodes')}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              {isGlobalPromoLoading || globalError ? (
                <GlobalPromosPlaceholder />
              ) : globalPromo && globalPromo.length > 0 ? (
                <View>
                  <Carousel
                    vertical={false}
                    loop
                    autoPlay={true}
                    autoPlayInterval={5000}
                    enabled
                    data={globalPromo}
                    pagingEnabled
                    width={dp(350)}
                    height={dp(350)}
                    renderItem={({item}: any) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Ввод Промокода', {
                              promocode: item,
                              type: 'global',
                            })
                          }>
                          <Image
                            source={{uri: item.image}}
                            style={{
                              width: '100%',
                              height: '100%',
                              resizeMode: 'contain',
                            }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    alignSelf: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <EmptyPlaceholder text={t('app.promos.noPromocodes')} />
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginTop: dp(30),
  },
  sectionTitle: {
    fontSize: dp(20),
    color: '#000',
    fontWeight: '600',
    marginBottom: dp(8),
  },
  cuponContainer: {
    flex: 2,
    marginTop: dp(25),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: dp(20),
    borderRadius: 38,
    width: dp(341),
    height: dp(309),
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
  circleImage: {
    width: dp(45),
    height: dp(45),
  },
  copyImage: {
    width: dp(24),
    height: dp(24),
  },
});

export {Promos};
