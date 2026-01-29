import React from 'react';
import {useTranslation} from 'react-i18next';

import {dp} from '../../utils/dp';

import {View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import EmptyPlaceholder from '@components/EmptyPlaceholder';

import {GlobalPromosPlaceholder} from './PromosPlaceholder';

import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import {PersonalPromoBanner} from '@styled/banners/PersonalPromoBanner';
import Carousel from 'react-native-reanimated-carousel';
import useSWR from 'swr';
import {getPromotions} from '@services/api/promotion';
import {PersonalPromoPlaceholder} from '@screens/Promos/PersonalPromoPlaceholder.tsx';
import ScreenHeader from '@components/ScreenHeader';
import { EPromorionsFilter } from '@app-types/models/Promotion.ts';

const Promos = () => {
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Промокоды'>>();
  const {t} = useTranslation();

  const {
    isLoading: isGlobalPromoLoading,
    data: globalPromoData,
    error: globalError,
  } = useSWR(['getGlobalPromos'], () => getPromotions({filters: EPromorionsFilter.MARKETING_CAMPAIGNS}));

  const {
    isLoading: isPersonalPromoLoading,
    data: personalPromoData,
    error: personalError,
  } = useSWR(['getPersonalPromos'], () => getPromotions({filters: EPromorionsFilter.PERSONAL}));

  const globalPromo = globalPromoData || [];  
  const personalPromo = personalPromoData || [];

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
              <PersonalPromoPlaceholder />
            ) : personalPromo && personalPromo.length > 0 ? (
              <View>
                <Carousel
                  data={personalPromo}
                  vertical={false}
                  width={dp(366)}
                  height={dp(200)}
                  pagingEnabled
                  renderItem={({item}) => (
                    <PersonalPromoBanner
                      title={`${t('app.promos.promocodeFor')} ${
                        item.discountValue
                      } ${
                        item.discountType === 'percentage' ? '%' : t('common.labels.ballov')
                      }`}
                      date={item.validUntil ? new Date(item.validUntil) : new Date()}
                      onPress={() =>
                        navigation.navigate('Ввод Промокода', {
                          promocode: item,
                          type: 'personal',
                        })
                      }
                      disable={!item.isActive}
                    />
                  )}
                />
              </View>
            ) : (
              <View style={{alignSelf: 'center', flex: 1, justifyContent: 'center'}}>
                <EmptyPlaceholder text={t('app.promos.noPromocodes')} />
              </View>
            )}
          </View>

          <View style={styles.cuponContainer}>
            <Text style={styles.sectionTitle}>
              {t('app.promos.generalPromocodes')}
            </Text>
            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
                    width={dp(366)}
                    height={dp(350)}
                    renderItem={({item}) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Ввод Промокода', {
                              promocode: item,
                              type: 'global',
                            })
                          }
                          style={styles.promoContainer}>
                          <Image
                            source={{uri: item.mobileDisplay?.imageLink}}
                            style={styles.promoImage}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              ) : (
                <View style={{alignSelf: 'center', flex: 1, justifyContent: 'center'}}>
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
  promoContainer: {
    borderRadius: dp(12),
    overflow: 'hidden',
      },
  promoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export {Promos};
