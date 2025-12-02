import React from 'react';
import {View, StyleSheet} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import {dp} from '../../../utils/dp';

const CampaignPlaceholder = () => {
  const layout = [
    { 
      key: 'campaign-main', 
      width: '100%', 
      height: dp(190), 
      marginTop: dp(16),
      borderRadius: dp(25),
    },
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
      </Skeleton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  skeletonContainer: {
    flex: 1,
  },
});

export default CampaignPlaceholder;