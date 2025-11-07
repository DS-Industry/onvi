import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {dp} from '../../../utils/dp';

import {View} from 'react-native';

export default function HistoryPlaceholder() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View>
        <SkeletonPlaceholder.Item
          marginTop={dp(30)}
          width={'100%'}
          height={dp(80)}
          borderRadius={dp(10)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
        <SkeletonPlaceholder.Item
          width={'100%'}
          height={dp(80)}
          borderRadius={dp(10)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
        <SkeletonPlaceholder.Item
          width={'100%'}
          height={dp(80)}
          borderRadius={dp(10)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
      </View>
    </SkeletonPlaceholder>
  );
}
