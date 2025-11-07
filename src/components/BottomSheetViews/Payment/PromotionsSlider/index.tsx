import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';

// constants
import {BLACK, GREY, YELLOW} from '@utils/colors.ts';

// utils
import useSWR from 'swr';
import {getActiveClientPromotions} from '@services/api/user/index.ts';
import {dp} from '@utils/dp.ts';

// types
import {
  DiscountType,
  IPersonalPromotion,
} from '@app-types/models/PersonalPromotion.ts';

interface PromotionsSliderProps {
  value?: string;
  onSelect: (val: IPersonalPromotion) => void;
  onDeselect: () => void;
}

export default function PromotionsSlider({
  value,
  onSelect,
  onDeselect,
}: PromotionsSliderProps) {
  const {
    isLoading: isPersonalPromoLoading,
    data: personalPromo,
    error: personalError,
  } = useSWR(['getPersonalPromos'], () => getActiveClientPromotions());

  if (personalError) {
    return null;
  }

  if (isPersonalPromoLoading) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.skeleton} />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {personalPromo
        ?.filter(pp => pp.isActive)
        .map((promo, index) => {
          const isSelected = value === promo.code;
          const uniqueKey = `${promo.code}-${index}`;
          return (
            <View key={uniqueKey} style={styles.promoWrapper}>
              <TouchableOpacity
                style={[styles.pill, isSelected && styles.selectedPill]}
                onPress={() => {
                  if (isSelected) {
                    onDeselect();
                  } else {
                    onSelect(promo);
                  }
                }}>
                <Text
                  style={[styles.pillText, isSelected && styles.selectedText]}>
                  {promo.code} -{' '}
                  {promo.discountType === DiscountType.DISCOUNT
                    ? `${promo.discount}%`
                    : `${promo.discount}₽`}
                </Text>
                {isSelected && (
                  <TouchableOpacity
                    style={styles.deselectButton}
                    onPress={() => onDeselect()}>
                    <Text style={styles.deselectText}>X</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(10),
  },
  promoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: dp(10),
  },
  pill: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
  },
  selectedPill: {
    backgroundColor: YELLOW,
  },
  pillText: {
    color: '#333',
    fontWeight: '500',
    fontSize: dp(10),
  },
  selectedText: {
    color: BLACK,
  },
  deselectButton: {
    position: 'absolute',
    top: '50%',
    right: 3,
    transform: [{translateY: 1}],
    backgroundColor: 'transparent',
    padding: 2,
  },
  deselectText: {
    color: GREY,
    fontWeight: 'bold',
    fontSize: dp(8),
  },
  skeleton: {
    backgroundColor: GREY,
    height: dp(40),
    width: dp(100),
    marginRight: dp(10),
    borderRadius: dp(10),
  },
});
