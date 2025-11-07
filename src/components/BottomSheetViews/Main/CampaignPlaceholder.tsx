import {View} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {dp} from '../../../utils/dp';

export default function CampaignPlaceholder() {
  return (
    <View>
      <SkeletonPlaceholder borderRadius={4}>
        <View>
          <SkeletonPlaceholder.Item
            marginTop={dp(16)}
            width={'100%'}
            height={dp(180)}
            borderRadius={dp(25)}
            alignSelf="center"
          />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
}
