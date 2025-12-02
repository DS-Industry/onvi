import React from 'react';
import {View, StyleSheet} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import {dp} from '@utils/dp.ts';

const StoryViewPlaceholder = () => {
  const layout = [
    { key: 'story-1', width: dp(85), height: dp(85), marginRight: dp(16), borderRadius: dp(10) },
    { key: 'story-2', width: dp(85), height: dp(85), marginRight: dp(16), borderRadius: dp(10) },
    { key: 'story-3', width: dp(85), height: dp(85), borderRadius: dp(10) },
  ];

  return (
    <View style={styles.container}>
      <Skeleton
        isLoading={true}
        containerStyle={styles.skeletonContainer}
        layout={layout}
        boneColor="#f2f2f2"
        highlightColor="#e0e0e0"
        animationType="shiver"
        animationDuration={1200}
      >
        <View />
        <View />
        <View />
      </Skeleton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: dp(16),
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  skeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export {StoryViewPlaceholder};
