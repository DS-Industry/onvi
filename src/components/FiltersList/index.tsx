import {View, Text, StyleSheet} from 'react-native';
import {dp} from '../../utils/dp';

interface FilterListProps {
  data: string[];
  width?: number;
  height?: number;
  backgroundColor?: string;
  fontSize?: number;
}

const FilterList = ({
  data = [],
  width = dp(96),
  height = dp(24),
  backgroundColor = 'rgba(245, 245, 245, 1)',
  fontSize = dp(12),
}: FilterListProps) => {
  return (
    <View style={styles.container}>
      {data.map((filter: string, index: number) => {
        const isLastItem = index === data.length - 1;
        return (
          <View
            style={{
              ...styles.filter,
              width: width,
              height: height,
              backgroundColor: backgroundColor,
              marginRight: isLastItem ? 0 : dp(7.7),
            }}
            key={index}>
            <Text style={{...styles.filterText, fontSize: fontSize}}>
              {filter}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  filter: {
    borderRadius: dp(69),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: dp(5),
    paddingRight: dp(5),
  },
  filterText: {
    fontWeight: '500',
    color: '#000000',
  },
});

export {FilterList};
