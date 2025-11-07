import React, {useState, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {View, StyleSheet, TextInput, Text} from 'react-native';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';

//@ts-ignore
import {debounce} from 'lodash';

import {dp} from '@utils/dp';
import useStore from '@state/store';
import SearchPlaceholder from './SearchPlaceholder';

import useSWRMutation from 'swr/mutation';
import {getPOSList} from '@services/api/pos';
import calculateDistance from '@utils/calculateDistance.ts';
import {CarWashLocation} from '@app-types/api/app/types.ts';
import {CarWashCard} from '@components/CarWashCard/CarWashCard';

const Search = () => {
  const {t} = useTranslation();
  const [search, setSearch] = useState('');

  const {location, favoritesCarwashes} = useStore.getState();

  const [sortedData, setSortedData] = useState<CarWashLocation[]>([]);

  const {isMutating, trigger, data} = useSWRMutation(
    'getPOSList',
    (
      key,
      {
        arg,
      }: {
        arg: {
          [key: string]: string;
        };
      },
    ) => getPOSList(arg),
  );

  const processCarwashes = useCallback(
    (carwashes: CarWashLocation[]) => {
      return carwashes
        .map((carwash: CarWashLocation) => {
          const carwashLat = carwash.location.lat;
          const carwashLon = carwash.location.lon;
          const distance = calculateDistance(
            location?.latitude,
            location?.longitude,
            carwashLat,
            carwashLon,
          );

          const isFavorite = favoritesCarwashes.includes(
            Number(carwash.carwashes[0].id),
          );

          return {
            ...carwash,
            distance,
            isFavorite,
          };
        })
        .sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) {
            return -1;
          }
          if (!a.isFavorite && b.isFavorite) {
            return 1;
          }

          return a.distance - b.distance;
        });
    },
    [location, favoritesCarwashes],
  );

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      trigger({}).then(res => {
        if (res?.businessesLocations?.length > 0) {
          setSortedData(processCarwashes(res.businessesLocations));
        }
      });
    }
  }, [location, trigger, processCarwashes]);

  const renderBusiness = ({item}: {item: CarWashLocation}) => {
    return <CarWashCard carWash={item} showIsFavorite={true} />;
  };

  const doSearch = useCallback(
    debounce(async (val: string) => {
      const res = await trigger({search: val});
      if (res?.businessesLocations?.length > 0) {
        setSortedData(processCarwashes(res.businessesLocations));
      }
    }, 1300),
    [trigger, processCarwashes],
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t('app.search.placeholder')}
        maxLength={19}
        value={search}
        onChangeText={val => {
          setSearch(val);
          doSearch(val);
        }}
        style={styles.input}
      />
      <View style={styles.flexContainer}>
        {isMutating ? (
          <SearchPlaceholder />
        ) : (
          <>
            {!data ||
            !data.businessesLocations ||
            data.businessesLocations.length === 0 ? (
              <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>
                  {t('app.search.washesNotFound')}
                </Text>
              </View>
            ) : (
              <BottomSheetFlatList
                data={sortedData}
                renderItem={renderBusiness}
                keyExtractor={(item: CarWashLocation, index: number) =>
                  index.toString()
                }
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
