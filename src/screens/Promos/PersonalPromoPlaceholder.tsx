import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import {dp} from '../../utils/dp';

function PersonalPromoPlaceholder() {
  const {width: windowWidth} = useWindowDimensions();
  const containerWidth = windowWidth - dp(32);

  const layout = [
    {
      key: 'personal-promo-card',
      width: containerWidth,
      height: dp(160),
      borderRadius: dp(25),
      marginTop: dp(10),
      marginBottom: dp(10),
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
    paddingHorizontal: dp(16),
  },
});

export {PersonalPromoPlaceholder};
