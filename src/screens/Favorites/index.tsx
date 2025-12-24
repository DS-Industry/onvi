import {FlatList, SafeAreaView, View, Text} from 'react-native';
import {dp} from '@utils/dp';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/core';
import ScreenHeader from '@components/ScreenHeader';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import calculateDistance from '@utils/calculateDistance.ts';
import {CarWashCard} from '@components/CarWashCard/CarWashCard.tsx';
import useStore from '@state/store.ts';
import CarwashesPlaceholder from '@components/BottomSheetViews/CarwashesPlaceholder/index.tsx';
import { CarWashWithLocation } from '@app-types/api/app/types.ts';

const Favorites = () => {
  const {t} = useTranslation();
  const [sortedData, setSortedData] = useState<CarWashWithLocation[]>([]);
  const {location, originalPosList} = useStore.getState();
  const {favoritesCarwashesIsLoading, favoritesCarwashes} = useStore();

  useEffect(() => {
    if (
      location?.latitude &&
      location?.longitude &&
      favoritesCarwashes.length > 0
    ) {
      
      const carwashes = originalPosList.flatMap(pose =>
        pose.carwashes.map(carwash => ({
          ...carwash,
          location: pose.location,
          distance: pose.distance,
        }))
      );

      const favoriteCarWashes = carwashes.filter(carwash =>
        favoritesCarwashes.includes(Number(carwash.id)),
      );



      const favoriteCarWashesDistance = favoriteCarWashes.map(carwash => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          carwash.location.lat,
          carwash.location.lon,
        );
        const carWashWithDistance = {
          ...carwash,
          distance,
        };
        return carWashWithDistance;
      });
      setSortedData(favoriteCarWashesDistance);
    } else {
      setSortedData([]);
    }
  }, [location, favoritesCarwashes]);

  const renderBusiness = ({item}: {item: CarWashWithLocation}) => {
    return (
      <CarWashCard
        carWash={item}
        showIsFavorite={true}
        heartIsClickable={true}
        cardIsClickable={false}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1, padding: dp(16), flexDirection: 'column'}}>
        <ScreenHeader screenTitle={t('navigation.favorites')} />
        {favoritesCarwashesIsLoading ? (
          <>
            <View style={{marginTop: dp(25)}} />
            <CarwashesPlaceholder heightItems={63} />
          </>
        ) : (
          <View style={{marginTop: dp(25), flex: 1}}>
            {sortedData.length > 0 ? (
              <FlatList
                data={sortedData}
                renderItem={renderBusiness}
                keyExtractor={(_, index: number) => index.toString()}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={{paddingBottom: dp(40)}}
                ItemSeparatorComponent={() => (
                  <View style={{height: dp(8)}} />
                )}
              />
            ) : (
              <Text style={{width: '100%', textAlign: 'center'}}>
                Список избранных пуст.
              </Text>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export {Favorites};
