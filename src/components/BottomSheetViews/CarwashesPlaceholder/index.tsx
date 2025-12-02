import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { dp } from '../../../utils/dp';

interface ICarwashesPlaceholderProps {
  heightItems?: number;
  gapItems?: number;
}

export default function CarwashesPlaceholder(props: ICarwashesPlaceholderProps) {
  const itemHeight = props.heightItems ? dp(props.heightItems) : dp(46);
  const itemGap = props.gapItems ? dp(props.gapItems) : dp(8);

  const layout = [
    {
      key: 'carwash-1',
      width: '100%',
      height: itemHeight,
      borderRadius: dp(12),
    },
    {
      key: 'carwash-2',
      width: '100%',
      height: itemHeight,
      marginTop: itemGap,
      borderRadius: dp(12),
    },
    {
      key: 'carwash-3',
      width: '100%',
      height: itemHeight,
      marginTop: itemGap,
      borderRadius: dp(12),
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
        <View />
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

