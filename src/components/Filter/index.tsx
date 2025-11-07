import React, {useState} from 'react';
import {SectionList, StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {CheckBox} from '@styled/buttons/CheckBox';

interface IFilterProp {
  data: IData[];
}

interface IData {
  title: any;
  data: any[];
}

interface ISelectedFilter {
  id: number;
  values: string[];
}

const Filter = (props: IFilterProp) => {
  const [selectedFilters, setSelectedFilters] = useState<any[]>([]);

  const onFilterSelected = (id: number, value: string) => {
    const selectedItem: ISelectedFilter = {
      id: id,
      values: [value],
    };
    let currentState = [...selectedFilters];
    if (
      selectedFilters.some(filter => {
        return filter.id === id && filter.values.includes(value);
      })
    ) {
      currentState.filter(item => {
        if (item.id === id) {
          item.values.splice(item.values.indexOf(value), 1);
        }
      });
    } else if (
      !selectedFilters.some(filter => {
        return filter.id === id;
      })
    ) {
      currentState = [...currentState, selectedItem];
    } else {
      currentState.filter(item => {
        if (item.id === id) {
          item.values.push(value);
        }
      });
    }

    setSelectedFilters(currentState);
  };

  // @ts-ignore
  const renderList = ({item, section}) => {
    const {title} = section;
    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <CheckBox
          key={item.code}
          checked={selectedFilters.some(filter => {
            return filter.id === title.id && filter.values.includes(item.code);
          })}
          onClick={() => onFilterSelected(title.id, item.code)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={props.data}
        keyExtractor={item => item.code}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header} key={title.id}>
            {title.name}
          </Text>
        )}
        renderItem={renderList}
        /* eslint-disable-next-line react/no-unstable-nested-components */
        ItemSeparatorComponent={() => <View style={styles.itemDevider}></View>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '300',
  },
  itemDevider: {
    height: 1,
    backgroundColor: '#dedede',
    marginBottom: 10,
  },
});

export {Filter};
