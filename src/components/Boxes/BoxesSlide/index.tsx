import React, {useCallback} from 'react';
import {StyleSheet, Dimensions, FlatList} from 'react-native';
import {horizontalScale} from '../../../utils/metrics';
import {dp} from '../../../utils/dp';
import {Box} from '@components/Boxes/Box';
import useStore from '../../../state/store';

const width = Dimensions.get('window').width;

interface BoxItem {
  number: number;
}

interface BoxesSlideProps {
  boxes: BoxItem[];
  navigation: any;
  params: any;
}

const BoxesSlide = ({boxes = [], navigation, params}: BoxesSlideProps) => {
  const {orderDetails, setOrderDetails, bottomSheetRef, bottomSheetSnapPoints} =
    useStore.getState();

  const contentPadding = (width - horizontalScale(92) * boxes.length) / 2;

  const handleBoxPress = useCallback(
    (boxNumber: number) => {
      setOrderDetails({
        ...orderDetails,
        bayNumber: boxNumber,
      });

      bottomSheetRef?.current?.snapToPosition(
        bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
      );

      navigation.navigate('Launch', {bayType: params.bayType});
    },
    [
      orderDetails,
      setOrderDetails,
      bottomSheetRef,
      bottomSheetSnapPoints,
      navigation,
      params,
    ],
  );

  const renderItem = useCallback(
    ({item}: {item: BoxItem}) => (
      <Box
        label={item?.number?.toString()}
        onClick={() => handleBoxPress(item.number)}
        active={orderDetails.bayNumber === item.number}
      />
    ),
    [handleBoxPress, orderDetails.bayNumber],
  );

  return (
    <FlatList
      data={boxes}
      renderItem={renderItem}
      keyExtractor={(item, index) => `box-${item.number}-${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        {
          paddingLeft: contentPadding,
          paddingRight: contentPadding,
        },
      ]}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={3}
      getItemLayout={(data, index) => ({
        length: dp(94.4),
        offset: dp(94.4) * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: dp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {BoxesSlide};
