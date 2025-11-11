import {FlatList, SafeAreaView, View, Text} from 'react-native';
import {dp} from '@utils/dp';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/core';
import ScreenHeader from '@components/ScreenHeader';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import calculateDistance from '@utils/calculateDistance.ts';
import {CarWashLocation} from '@app-types/api/app/types.ts';
import {CarWashCard} from '@components/CarWashCard/CarWashCard.tsx';
import useStore from '@state/store.ts';
import CarwashesPlaceholder from '@components/BottomSheetViews/CarwashesPlaceholder/index.tsx';

const Favorites = () => {
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Избранное'>>();
  const {t} = useTranslation();
  const [sortedData, setSortedData] = useState<CarWashLocation[]>([]);
  const {location, posList} = useStore.getState();
  const {favoritesCarwashesIsLoading, favoritesCarwashes} = useStore();

  useEffect(() => {
    if (
      location?.latitude &&
      location?.longitude &&
      posList.length > 0 &&
      favoritesCarwashes.length > 0
    ) {
      const favoriteCarWashes = posList.filter(carwash =>
        favoritesCarwashes.includes(Number(carwash.carwashes[0].id)),
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
  }, [location, posList, favoritesCarwashes]);

  const renderBusiness = ({item}: {item: CarWashLocation}) => {
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
        <ScreenHeader
          screenTitle={t('navigation.favorites')}
          btnType="back"
          btnCallback={() => navigation.navigate('Главная')}
        />
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
