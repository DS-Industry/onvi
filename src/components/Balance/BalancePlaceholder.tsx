import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {dp} from '../../utils/dp';

import {View} from 'react-native';

interface BalancePlaceholderProps {
  bottomSheetIndex: number;
}

export default function BalancePlaceholder({
  bottomSheetIndex,
}: BalancePlaceholderProps) {
  return (
    <SkeletonPlaceholder borderRadius={60} highlightColor={'#BFFA00'}>
      <View
        style={{
          width: dp(80),
          height: dp(40),
          marginTop: dp(15),
          marginRight: dp(10),
          display: bottomSheetIndex > 2 ? 'none' : 'flex',
        }}
      />
    </SkeletonPlaceholder>
  );
}
