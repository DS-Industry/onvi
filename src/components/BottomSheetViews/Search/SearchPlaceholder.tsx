import {View} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {dp} from '../../../utils/dp';

export default function SearchPlaceholder() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View>
        <SkeletonPlaceholder.Item
          marginTop={dp(10)}
          width={'95%'}
          height={dp(50)}
          borderRadius={dp(10)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
        <SkeletonPlaceholder.Item
          width={'95%'}
          height={dp(50)}
          borderRadius={dp(10)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
        <SkeletonPlaceholder.Item
          width={'95%'}
          height={dp(50)}
          borderRadius={dp(10)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
      </View>
    </SkeletonPlaceholder>
  );
}
