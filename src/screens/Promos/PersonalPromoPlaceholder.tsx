import React from 'react';

import {dp} from '../../utils/dp';

import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function PersonalPromoPlaceholder() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View>
        <SkeletonPlaceholder.Item
          marginTop={dp(10)}
          width={'100%'}
          height={dp(160)}
          borderRadius={dp(25)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
      </View>
    </SkeletonPlaceholder>
  );
}

export {PersonalPromoPlaceholder};
