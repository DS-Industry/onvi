import { dp } from '@utils/dp';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

export default function HistoryPlaceholder() {
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const layout = containerWidth > 0 ? [
    {
      key: 'history-item-1',
      width: containerWidth, 
      height: dp(80),
      borderRadius: dp(10),
      marginTop: dp(30),
      marginBottom: dp(10),
    },
    {
      key: 'history-item-2',
      width: containerWidth,
      height: dp(80),
      borderRadius: dp(10),
      marginBottom: dp(10),
    },
    {
      key: 'history-item-3',
      width: containerWidth,
      height: dp(80),
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
    overflow: 'hidden',
    paddingVertical: dp(150),
  },
});