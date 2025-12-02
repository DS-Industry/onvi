import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import {dp} from '../../utils/dp';

function GlobalPromosPlaceholder() {
  const {width: windowWidth} = useWindowDimensions();
  const containerWidth = windowWidth - dp(32);
  const cardHeight = containerWidth * 0.9;

  const layout = [
    {
      key: 'global-promo-card',
      width: containerWidth,
      height: cardHeight,
      borderRadius: dp(25),
    },
  ];

  return (
    <View style={styles.container}>
      <Skeleton
        isLoading={true}
        layout={layout}
        boneColor="#f0f0f0"
        highlightColor="#e0e0e0"
        animationType="shiver"
      >
        <View />
      </Skeleton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    paddingHorizontal: dp(16),
  },
});

export {GlobalPromosPlaceholder};
