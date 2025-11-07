import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {dp} from '../../../utils/dp';
import {useNavigation} from '@react-navigation/native';
import {Button} from '@styled/buttons';
import {cloneDeep} from 'lodash';
import useStore from '../../../state/store';
import {getPOSList} from '@services/api/pos';
import useSWRMutation from 'swr/mutation';

import {GeneralBottomSheetNavigationProp} from '../../../types/navigation/BottomSheetNavigation.ts';

// Define types
type Filter = {
  code: string;
  name: string;
};

type Section = {
  id: number;
  name: string;
  code: string;
};

type FilterItem = {
  sectionCode: string;
  filter: Filter;
};

export type SelectedFilters = {
  [sectionCode: string]: string[];
};

const Filters = () => {
  const {t} = useTranslation();
  const navigation =
    useNavigation<GeneralBottomSheetNavigationProp<'Filters'>>();

  const {filters, setFilters, setPosList} = useStore.getState();

  const generateQuery = (selectedFilters: SelectedFilters): string => {
    const queryFilters: string[] = [];
    Object.entries(selectedFilters).forEach(([sectionCode, filters]) => {
      filters.forEach(filter => {
        if (filter === t('app.filters.selfService')) {
          queryFilters.push(`${sectionCode}:SelfService`);
        } else if (filter === t('app.filters.robot')) {
          queryFilters.push(`${sectionCode}:Portal`);
        } else {
          queryFilters.push(`${sectionCode}:${filter}`);
        }
      });
    });
    return queryFilters.join(',');
  };

  // Define translated data inside component
  const data: {title: Section; data: Filter[]}[] = [
    {
      title: {id: 1, name: t('app.filters.services'), code: 'tags'},
      data: [
        {code: 'vac', name: t('app.filters.vacuum')},
        {code: 'air', name: t('app.filters.air')},
        {code: 'handwash', name: t('app.filters.handWash')},
        {code: 'dryer', name: t('app.filters.dryer')},
        {code: 'toilet', name: t('app.filters.toilet')},
        {code: 'dryingarea', name: t('app.filters.dryingArea')},
      ],
    },
    {
      title: {id: 2, name: t('app.filters.network'), code: 'brand'},
      data: [{code: 'DS', name: t('app.filters.moykaDS')}],
    },
    {
      title: {id: 3, name: t('app.filters.type'), code: 'type'},
      data: [
        {code: 'SelfService', name: t('app.filters.selfService')},
        {code: 'Portal', name: t('app.filters.robot')},
      ],
    },
  ];

  //Local filters
  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(filters);

  // Function to handle filter selection
  const toggleFilter = (sectionCode: string, filterCode: string) => {
    setSelectedFilters(prevSelectedFilters => {
      const updatedFilters = cloneDeep(prevSelectedFilters);
      if (!updatedFilters[sectionCode]) {
        updatedFilters[sectionCode] = [];
      }
      const index = updatedFilters[sectionCode].indexOf(filterCode);
      if (index === -1) {
        updatedFilters[sectionCode].push(filterCode); // Select filter
      } else {
        updatedFilters[sectionCode].splice(index, 1); // Deselect filter
      }

      return updatedFilters;
    });
  };

  //Query
  const {trigger, isMutating} = useSWRMutation(
    'getPosList', // Key for caching
    (key, {arg}: {arg: string}) => getPOSList({filter: arg}), // Fetcher function with arguments
  );

  // Function to handle submit button press
  const handleSubmit = async () => {
    try {
      const submitData = await trigger(generateQuery(selectedFilters)); // Pass the query as an argument
      if (submitData) {
        setFilters(selectedFilters);
        setPosList(submitData.businessesLocations);

        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      }
    } catch (err) {}
  };

  const reset = async () => {
    const filtersQuery = generateQuery({});
    setSelectedFilters({});
    getPOSList({filter: filtersQuery}).then((dataRes: any) => {
      setFilters({});
      setPosList(dataRes.businessesLocations);
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    });
  };

  const renderFilterItem = ({item}: {item: FilterItem}) => {
    const {sectionCode, filter} = item;

    const isSelected = selectedFilters[sectionCode]?.includes(filter.name);

    return (
      <TouchableOpacity
        onPress={() => toggleFilter(sectionCode, filter.name)}
        style={{marginRight: dp(10)}}>
        <View
          style={[
            styles.chip,
            {
              backgroundColor: isSelected ? '#BFFA00' : '#F5F5F5',
            },
          ]}>
          <Text style={styles.chipText}>{filter.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = ({item}: {item: {title: Section; data: Filter[]}}) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>{item.title.name}</Text>
        <FlatList
          data={item.data.map((filter: Filter) => ({
            sectionCode: item.title.code,
            filter,
          }))}
          renderItem={renderFilterItem}
          numColumns={3}
          keyExtractor={filterItem => filterItem.filter.code}
          columnWrapperStyle={{
            paddingTop: dp(10),
            justifyContent: 'flex-start',
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderSection}
        keyExtractor={section => section.title.code}
        contentContainerStyle={{
          flex: 1,
          marginBottom: dp(60),
        }}
        ListFooterComponentStyle={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: dp(35),
        }}
        ListFooterComponent={
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
            <Button
              label={t('common.buttons.reset')}
              color={'lightGrey'}
              width={dp(120)}
              height={dp(43)}
              fontSize={dp(15)}
              fontWeight={'600'}
              onClick={reset}
            />
            <View style={{width: dp(10)}} />
            <Button
              label={t('common.buttons.apply')}
              color={'blue'}
              width={dp(120)}
              height={dp(43)}
              fontSize={dp(15)}
              fontWeight={'600'}
              onClick={handleSubmit}
              showLoading={isMutating}
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: dp(10),
    paddingLeft: dp(22),
    paddingRight: dp(22),
    borderRadius: dp(38),
  },
  header: {
    alignItems: 'center',
  },
  list: {
    paddingLeft: dp(22),
  },
  headerTxt: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    color: '#000',
    fontSize: dp(24),
    fontWeight: '600',
  },
  footer: {
    flex: 1,
    marginVertical: dp(100),
    alignItems: 'center',
  },
  chip: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingRight: dp(10),
    paddingLeft: dp(10),
    height: dp(24),
    minWidth: dp(94),
    borderRadius: dp(69),
  },
  chipText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: dp(12),
    fontWeight: '600',
  },
  section: {
    marginTop: dp(25),
  },
});

export {Filters};
