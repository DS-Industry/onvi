import React, {useState} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {horizontalScale} from '@utils/metrics.ts';
import {dp} from '@utils/dp.ts';

const width = Dimensions.get('window').width;

interface SlideProps {
  items: any[]; // List of items to render
  renderItem: (
    item: any,
    index: number,
    isActive: boolean,
    onClick: () => void,
  ) => React.ReactNode;
  initialActiveIndex?: number; // Default active item
  onItemClick?: (item: any, index: number) => void; // Callback on item click
  leftSpacing?: number; // Left padding for the first item
  rightSpacing?: number; // Right padding for the last item
  containerStyle?: any; // Custom styles for the container
}

const Slide: React.FC<SlideProps> = ({
  items = [],
  renderItem,
  initialActiveIndex = null,
  onItemClick = () => {},
  leftSpacing = (width - horizontalScale(92) * 3) / 2 - dp(22),
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const handleItemClick = (item: any, index: number) => {
    setActiveIndex(index);
    onItemClick(item, index);
  };

  return (
    <ScrollView
      horizontal
      style={[styles.container]}
      contentContainerStyle={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      {items.map((item, index) => {
        const isFirstItem = index === 0;
        return (
          <View
            key={index}
            style={[{paddingLeft: isFirstItem ? 0 : leftSpacing / 4}]}>
            {renderItem(item, index, activeIndex === index, () =>
              handleItemClick(item, index),
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export {Slide};
