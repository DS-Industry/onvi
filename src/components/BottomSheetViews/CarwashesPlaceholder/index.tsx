import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {dp} from '../../../utils/dp';
import {YStack} from 'tamagui';

interface ICarwashesPlaceholderProps {
  heightItems?: number;
  gapItems?: number;
}

export default function CarwashesPlaceholder(
  props: ICarwashesPlaceholderProps,
) {
  return (
    <SkeletonPlaceholder
      borderRadius={12}
      speed={1200}
      highlightColor="#e0e0e0"
      backgroundColor="#f2f2f2">
      <YStack>
        <SkeletonPlaceholder.Item
          width="100%"
          height={props.heightItems ? dp(props.heightItems) : dp(46)}
          borderRadius={12}
        />
        <SkeletonPlaceholder.Item
          width="100%"
          height={props.heightItems ? dp(props.heightItems) : dp(46)}
          borderRadius={12}
          marginTop={props.gapItems ? dp(props.gapItems) : dp(8)}
        />
        <SkeletonPlaceholder.Item
          width="100%"
          height={props.heightItems ? dp(props.heightItems) : dp(46)}
          borderRadius={12}
          marginTop={props.gapItems ? dp(props.gapItems) : dp(8)}
        />
      </YStack>
    </SkeletonPlaceholder>
  );
}
