import React from 'react';
import { View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { dp } from '../../utils/dp';

interface BalancePlaceholderProps {
  bottomSheetIndex: number;
}

export default function BalancePlaceholder({
  bottomSheetIndex,
}: BalancePlaceholderProps) {
  if (bottomSheetIndex > 2) {
    return null;
  }

  const layout = [
    {
      key: 'balance-placeholder',
      width: dp(80),
      height: dp(40),
      borderRadius: dp(60), 
    },
  ];

  return (
    <Skeleton
      isLoading={true} 
      layout={layout}
      boneColor="#f0f0f0" 
      highlightColor="#BFFA00" 
      animationType="shiver"
    >
      <View />
    </Skeleton>
  );
}
