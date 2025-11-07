import React, {useEffect, useState} from 'react';
import {IUser} from '../../../../types/models/User.ts';
import {OrderDetailsType} from '../../../../state/order/OrderSlice.ts';
import {Text, TouchableOpacity, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Switch from '@styled/buttons/CustomSwitch';
import {dp} from '@utils/dp.ts';
import {
  calculateActualDiscount,
  getMaximumApplicablePoints,
} from '@utils/paymentHelpers.ts';
import {DiscountValueType} from '@hooks/usePromoCode.ts';
import {useTranslation} from 'react-i18next';

interface PointsToggleProps {
  user: IUser | null;
  order: OrderDetailsType;
  discount: DiscountValueType | null;
  toggled: boolean;
  onToggle: () => void;
  applyPoints: () => void;
}

/**
 * Component for toggling loyalty points usage
 */
const PointsToggle: React.FC<PointsToggleProps> = ({
  user,
  order,
  discount,
  toggled,
  onToggle,
  applyPoints,
}) => {
  // If user data is not available, show skeleton loader
  const [maxPoints, setMaxPoints] = useState<number>(0);
  const {t} = useTranslation();

  useEffect(() => {
    if (order && order.sum) {
      //Calculate actual discount
      const actualDiscount = calculateActualDiscount(discount, order.sum);
      // Calculate maximum points that can be used
      const maximumApplicablePoints = getMaximumApplicablePoints(
        user,
        order.sum,
        actualDiscount,
      );
      setMaxPoints(maximumApplicablePoints);
    }
  }, [order, discount]);

  if (!user || !user.cards || user.cards.balance == null) {
    return (
      <View
        style={{
          marginTop: dp(35),
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View>
          <Text
            style={{
              fontWeight: '300',
              fontSize: dp(15),
              color: 'rgba(0, 0, 0, 1)',
            }}>
            {t('app.bonus.withdrawOnviBonuses')}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <SkeletonPlaceholder borderRadius={20}>
            <SkeletonPlaceholder.Item
              width={60}
              height={25}
              alignSelf={'flex-end'}
            />
          </SkeletonPlaceholder>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: dp(35),
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <View>
        <Text
          style={{
            fontWeight: '300',
            fontSize: dp(15),
            color: 'rgba(0, 0, 0, 1)',
          }}>
          {t('app.bonus.withdrawOnviBonuses')}
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={applyPoints}>
          <Switch
            value={toggled}
            onValueChange={onToggle}
            activeText={`${maxPoints}`}
            inActiveText={`${maxPoints}`}
            backgroundActive="#A3A3A6"
            backgroundInActive="#000"
            circleImageActive={require('../../../../assets/icons/onvi_ractangel.png')}
            circleImageInactive={require('../../../../assets/icons/onvi_ractangel.png')}
            circleSize={dp(22)}
            switchBorderRadius={7}
            width={dp(60)}
            textStyle={{fontSize: dp(13), color: 'white'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PointsToggle;
