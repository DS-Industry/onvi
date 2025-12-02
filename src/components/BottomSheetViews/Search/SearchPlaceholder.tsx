import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { dp } from '../../../utils/dp';

export default function SearchPlaceholder() {
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const itemWidth = containerWidth > 0 ? containerWidth : 0;

  const layout = containerWidth > 0 ? [
    {
      key: 'search-item-1',
      width: itemWidth,
      height: dp(50),
      borderRadius: dp(10),
      marginTop: dp(10),
      marginBottom: dp(10),
    },
    {
      key: 'search-item-2',
      width: itemWidth,
      height: dp(50),
      borderRadius: dp(10),
      marginBottom: dp(10),
    },
    {
      key: 'search-item-3',
      width: itemWidth,
      height: dp(50),
      borderRadius: dp(10),
      marginBottom: dp(10),
    },
  ] : [];

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
    >
      {containerWidth > 0 && (
        <Skeleton
          isLoading={true}
          layout={layout}
          boneColor="#f0f0f0"
          highlightColor="#e0e0e0"
          animationType="shiver"
          animationDuration={1200}
        >
          <View />
          <View />
          <View />
        </Skeleton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: dp(100),
    alignItems: 'flex-start',
  },
});
