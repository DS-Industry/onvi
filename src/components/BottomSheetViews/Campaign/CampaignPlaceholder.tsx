import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import {dp} from '../../../utils/dp';

export default function CampaignPlaceholder() {
  const {width: windowWidth} = useWindowDimensions();
  const containerWidth = windowWidth - dp(32);

  const layout = [
    {
      key: 'campaign-banner',
      width: containerWidth,
      height: dp(150),
      borderRadius: dp(25),
      marginTop: dp(30),
      marginBottom: dp(10),
      alignSelf: 'center',
    },
    {
      key: 'campaign-description',
      width: containerWidth,
      height: dp(80),
      borderRadius: dp(10),
      marginBottom: dp(10),
      alignSelf: 'center',
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
        animationDuration={1200}
      >
        <View />
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
