import {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

// components
import {BusinessHeader} from '@components/Business/Header';
import {SumInput} from '@styled/inputs/SumInput';
import {ActionButton} from '@styled/buttons/ActionButton';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {FilterList} from '@components/FiltersList';

// utils
import {
  horizontalScale,
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from '../../../../utils/metrics';
import {dp} from '../../../../utils/dp';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@context/ThemeProvider';

// state
import useStore from '../../../../state/store';

// types
import {Button} from '@styled/buttons';

import {useTranslation} from 'react-i18next';
import {GeneralBottomSheetNavigationProp} from '../../../../types/navigation/BottomSheetNavigation.ts';

export default function DefaultLaunch() {
  const {theme} = useTheme();
  const [value, setValue] = useState(50);
  const {t} = useTranslation();
  const measureTypeData = [t('common.labels.rubles')];

  const navigation =
    useNavigation<GeneralBottomSheetNavigationProp<'Launch'>>();

  const {isBottomSheetOpen, setOrderDetails, orderDetails, selectedPos} =
    useStore.getState();

  const order = orderDetails;
  const isOpened = isBottomSheetOpen;

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        ...styles.container,
        backgroundColor: theme.mainColor,
      }}
      nestedScrollEnabled={true}
      scrollEnabled={isOpened}>
      <View style={{paddingTop: dp(15)}} />
      <BusinessHeader type="box" box={order?.bayNumber ?? 0} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: moderateScale(10),
              fontWeight: '400',
              lineHeight: verticalScale(20),
              paddingBottom: verticalScale(4),
            }}>
            {t('common.labels.measurementMethod')}
          </Text>
          <FilterList
            data={measureTypeData}
            width={horizontalScale(53)}
            backgroundColor={'#BFFA00'}
          />
        </View>

        <ActionButton
          width={horizontalScale(30)}
          height={verticalScale(30)}
          icon={'plus'}
          fontSize={moderateScale(22)}
          fontWeight={'400'}
          onClick={() => {
            const step =
              selectedPos && selectedPos.stepCost > 0
                ? selectedPos.stepCost
                : 10;
            const maxVal =
              selectedPos && selectedPos.limitMaxCost > 0
                ? selectedPos.limitMaxCost
                : 50;
            if (value <= maxVal - 10) {
              setValue(value + step);
            }
          }}
        />
      </View>
      <View style={{...styles.sumSelector}}>
        <SumInput
          maxValue={
            selectedPos && selectedPos.limitMaxCost > 0
              ? selectedPos.limitMaxCost
              : 500
          }
          minValue={
            selectedPos && selectedPos.limitMinCost > 0
              ? selectedPos.limitMinCost
              : 50
          }
          step={
            selectedPos && selectedPos.stepCost > 0 ? selectedPos.stepCost : 10
          }
          height={moderateVerticalScale(235)}
          width={moderateVerticalScale(235)}
          borderRadius={moderateScale(1000)}
          value={value}
          onChange={val => {
            setValue(val);
          }}
          inputBackgroundColor={'#F5F5F5'}
          shadowProps={{
            backgroundColor: '#FFF',
            shadowColor: '#E7E7E7',
            shadowRadius: 50,
            shadowOffset: {
              height: 4,
              width: 0,
            },
            shadowOpacity: 0.25,
          }}
        />
        <Text style={{...styles.sum}}>{value} ₽</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            display: 'flex',
            marginTop: verticalScale(35),
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <ActionButton
            style={{
              marginRight: horizontalScale(10),
              paddingTop: verticalScale(4),
              paddingBottom: verticalScale(4),
              paddingLeft: horizontalScale(10),
              paddingRight: horizontalScale(10),
            }}
            fontWeight={'600'}
            width={horizontalScale(60)}
            text={'50 р'}
            onClick={() => setValue(50)}
          />
          <ActionButton
            style={{
              marginRight: horizontalScale(10),
              paddingTop: verticalScale(4),
              paddingBottom: verticalScale(4),
              paddingLeft: horizontalScale(10),
              paddingRight: horizontalScale(10),
            }}
            fontWeight={'600'}
            width={horizontalScale(60)}
            text={'150 р'}
            onClick={() => setValue(150)}
          />
          <ActionButton
            style={{
              marginRight: horizontalScale(10),
              paddingTop: verticalScale(4),
              paddingBottom: verticalScale(4),
              paddingLeft: horizontalScale(10),
              paddingRight: horizontalScale(10),
            }}
            fontWeight={'600'}
            width={horizontalScale(60)}
            text={'200 р'}
            onClick={() => setValue(200)}
          />
          <ActionButton
            style={{
              paddingTop: verticalScale(4),
              paddingBottom: verticalScale(4),
              paddingLeft: horizontalScale(10),
              paddingRight: horizontalScale(10),
            }}
            fontWeight={'600'}
            width={horizontalScale(60)}
            text={'250 р'}
            onClick={() => setValue(250)}
          />
        </View>
        <ActionButton
          style={{marginTop: verticalScale(30)}}
          width={horizontalScale(30)}
          height={verticalScale(30)}
          icon={'minus'}
          fontSize={moderateScale(22)}
          fontWeight={'400'}
          onClick={() => {
            const step =
              selectedPos && selectedPos.stepCost > 0
                ? selectedPos.stepCost
                : 10;
            const minVal =
              selectedPos && selectedPos.limitMinCost > 0
                ? selectedPos.limitMinCost
                : 50;
            if (value >= minVal + 10) {
              setValue(value - step);
            }
          }}
        />
      </View>
      <View
        style={{
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: dp(20),
          paddingBottom: dp(90),
        }}>
        <Button
          label={t('common.buttons.pay')}
          onClick={() => {
            let cost = value ? value : 150;
            setOrderDetails({
              ...orderDetails,
              sum: cost,
            });
            navigation.navigate('Payment', {});
          }}
          color="blue"
        />
      </View>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    borderRadius: moderateScale(38),
    paddingLeft: horizontalScale(22),
    paddingRight: horizontalScale(22),
  },
  sumSelector: {
    borderRadius: moderateScale(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sum: {
    position: 'absolute',
    overflow: 'hidden',
    color: '#0B68E1',
    fontSize: moderateScale(30),
    fontWeight: '600',
    backgroundColor: '#F5F5F5',
    paddingRight: dp(15),
    paddingLeft: dp(15),
    paddingTop: dp(3),
    paddingBottom: dp(3),
    borderRadius: dp(20),
  },
});
