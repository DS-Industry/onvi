import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {dp} from '@utils/dp';
import useStore from '@state/store';
import SearchPlaceholder from './SearchPlaceholder';
import calculateDistance from '@utils/calculateDistance.ts';
import {CarWashWithLocation} from '@components/Map';
import {CarWashCard} from '@components/CarWashCard/CarWashCard';

const Search = () => {
  const {t} = useTranslation();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    location,
    favoritesCarwashes,
    carwashesList,
    setCarwashesList,
    setPosList
  } = useStore.getState();

  const processedCarwashes = useMemo(() => {
    let filtered = [...carwashesList];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        carwash =>
          carwash.name.toLowerCase().includes(searchLower) ||
          carwash.address.toLowerCase().includes(searchLower)
      );
    }

    // Добавляем расстояние и информацию об избранном
    return filtered
      .map((carwash: CarWashWithLocation) => {
        const distance = location
          ? calculateDistance(
              location.latitude,
              location.longitude,
              carwash.location.lat,
              carwash.location.lon
            )
          : undefined;

        const isFavorite = favoritesCarwashes.includes(Number(carwash.id));

        return {
          ...carwash,
          distance,
          isFavorite,
        };
      })
      .sort((a, b) => {
        // Сначала избранные
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        
        // Затем по расстоянию
        const distA = a.distance ?? Infinity;
        const distB = b.distance ?? Infinity;
        return distA - distB;
      });
  }, [carwashesList, search, location, favoritesCarwashes]);

  const renderBusiness = ({item}: {item: CarWashWithLocation & {distance?: number, isFavorite: boolean}}) => {
    return <CarWashCard carWash={item} showIsFavorite={true} />;
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t('app.search.placeholder')}
        maxLength={19}
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      <View style={styles.flexContainer}>
        {isLoading ? (
          <SearchPlaceholder />
        ) : (
          <>
            {carwashesList.length === 0 ? (
              <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>
                  {t('app.search.loadingData')}
                </Text>
              </View>
            ) : processedCarwashes.length === 0 ? (
              <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>
                  {t('app.search.washesNotFound')}
                </Text>
              </View>
            ) : (
              <BottomSheetFlatList
                data={processedCarwashes}
                renderItem={renderBusiness}
                keyExtractor={(item: CarWashWithLocation) => item.id}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={styles.listContentContainer}
                ItemSeparatorComponent={() => <View style={{height: 8}} />}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: dp(15),
    paddingLeft: dp(15),
    paddingRight: dp(15),
    borderRadius: dp(38),
  },
  input: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderRadius: dp(30),
    width: '100%',
    height: dp(40),
    paddingLeft: dp(18),
    textAlign: 'left',
    fontSize: dp(16),
    color: '#000000',
  },
  flexContainer: {
    flex: 1,
  },
  notFoundContainer: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  notFoundText: {
    marginTop: dp(20),
    fontSize: dp(15),
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  listContentContainer: {
    paddingTop: dp(8),
    paddingBottom: dp(40),
  },
});

export {Search};
