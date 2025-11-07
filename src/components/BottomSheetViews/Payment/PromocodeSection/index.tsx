import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {dp} from '@utils/dp.ts';
import PromotionsSlider from '@components/BottomSheetViews/Payment/PromotionsSlider';
import {IPersonalPromotion} from '../../../../types/models/PersonalPromotion.ts';
import {useTranslation} from 'react-i18next';

interface PromocodeSectionProps {
  promocode: string | undefined;
  onPress: () => void;
  quickPromoSelect: (promo: IPersonalPromotion) => void;
  quickPromoDeselect: () => void;
}

const PromocodeSection: React.FC<PromocodeSectionProps> = ({
  promocode,
  onPress,
  quickPromoDeselect,
  quickPromoSelect,
}) => {
  const {t} = useTranslation();

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: dp(25),
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            width: dp(219),
            height: dp(31),
            paddingLeft: dp(12),
            paddingRight: dp(5.38),
            borderRadius: dp(30),
          }}
          onPress={onPress}>
          <Text style={{fontSize: dp(10), fontWeight: '500'}}>
            {t('app.promos.promocode').toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      <PromotionsSlider
        value={promocode}
        onSelect={quickPromoSelect}
        onDeselect={quickPromoDeselect}
      />
    </>
  );
};

export default PromocodeSection;
