import React from 'react';

import {dp} from '../../utils/dp';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function GlobalPromosPlaceholder() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item
        width={'100%'}
        height={'90%'}
        borderRadius={dp(25)}
        alignSelf="center"
      />
    </SkeletonPlaceholder>
  );
}

export {GlobalPromosPlaceholder};
