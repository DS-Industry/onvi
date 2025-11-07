import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';

// utils
import {BLACK, BLUE, GREY, WHITE, YELLOW} from '@utils/colors.ts';
import {horizontalScale, moderateScale, verticalScale} from '@utils/metrics.ts';
import {useTranslation} from 'react-i18next';

interface PriceCardProps {
  name: string;
  description: string;
  cost: number;
  color?: 'blue' | 'grey' | 'yellow';
  onSelect: (name: string, price: number) => void;
}

const PriceCard = ({
  name,
  description,
  cost,
  color = 'blue',
  onSelect,
}: PriceCardProps) => {
  const getColor = () => {
    switch (color) {
      case 'blue':
        return BLUE;
      case 'grey':
        return GREY;
      case 'yellow':
        return YELLOW;
      default:
        return BLUE;
    }
  };

  const {t} = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => onSelect(name, cost)}
      style={{...styles.container, backgroundColor: getColor()}}>
      <View style={styles.header}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingLeft: horizontalScale(10),
          }}>
          <Text
            style={{
              fontSize: moderateScale(10),
              fontWeight: '600',
              paddingTop: verticalScale(10),
              color: color === 'blue' ? WHITE : BLACK,
            }}>
            {name}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flex: 1,
          }}>
          <Image
            source={require('../../../assets/icons/arrow-up.png')}
            style={{
              width: horizontalScale(32),
              height: verticalScale(32),
              resizeMode: 'contain',
            }}
          />
        </View>
      </View>
      <View style={{...styles.header}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingLeft: horizontalScale(10),
          }}>
          <Text
            style={{
              color: color === 'blue' ? WHITE : BLACK,
              fontSize: moderateScale(20),
              fontWeight: '600',
            }}>
            {description}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flex: 1,
          }}>
          <Text
            style={{
              color: color === 'blue' ? WHITE : BLACK,
              fontSize: moderateScale(15),
              fontWeight: '600',
            }}>
            7 {t('time.minutes')}.
          </Text>
        </View>
      </View>
      <View style={{...styles.footer, justifyContent: 'space-between'}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingLeft: horizontalScale(10),
          }}>
          <View
            style={{
              backgroundColor: 'rgba(245, 245, 245, 1)',
              borderRadius: moderateScale(69),
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: horizontalScale(5),
              paddingRight: horizontalScale(5),
              height: verticalScale(30),
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: moderateScale(12),
                paddingLeft: horizontalScale(5),
              }}>
              {t('common.buttons.moreDetails')}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: color === 'blue' ? WHITE : BLACK,
            fontSize: moderateScale(36),
            fontWeight: '600',
          }}>
          {cost} ₽
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: moderateScale(16),
    marginTop: verticalScale(16),
    padding: moderateScale(8),
    height: verticalScale(120),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  copyImage: {
    width: horizontalScale(24),
    height: verticalScale(24),
    resizeMode: 'contain',
  },
});

export {PriceCard};
