import React from 'react';
import {Text, View, Image, Dimensions, StyleSheet} from 'react-native';

// styled components
import {Card} from '@styled/cards';
import {dp} from '../../../utils/dp';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useStore from '../../../state/store';
import {OrderDetailsType} from 'src/state/order/OrderSlice';

const Business = () => {
  const {
    setOrderDetails,
    business,
    bottomSheetRef,
    bottomSheetSnapPoints,
    setSelectedPos,
  } = useStore.getState();

  const selectCarwash = (carwash: any, index: number) => {
    setOrderDetails({
      posId: carwash.id,
      type: carwash.type,
      name: carwash.name,
      carwashIndex: index,
      prices: carwash.price,
    } as OrderDetailsType);
    setSelectedPos(carwash);

    navigateBottomSheet('BusinessInfo', {});
    bottomSheetRef?.current?.snapToPosition(
      bottomSheetSnapPoints[bottomSheetSnapPoints.length - 2],
    );
  };

  return (
    <View style={styles.container}>
      <Card>
        {business?.carwashes.map((carwash: any, index: number) => {
          return (
            <View style={styles.button} key={'carwash-' + index}>
              <View
                style={{
                  flex: 1,
                }}>
                <Image
                  source={require('../../../assets/icons/small-icon.png')}
                  style={styles.circleImage}
                />
              </View>
              <View style={{flex: 5}}>
                <TouchableOpacity onPress={() => selectCarwash(carwash, index)}>
                  <Text style={styles.title}>{carwash.name}</Text>
                  <Text style={styles.text}>{carwash.address}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('screen').height,
  },
  button: {
    backgroundColor: '#F5F5F5',
    minHeight: dp(70),
    display: 'flex',
    borderRadius: 22,
    padding: dp(14),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(5),
  },
  title: {
    fontSize: dp(16),
    fontWeight: '600',
    lineHeight: dp(20),
    color: '#000',
  },
  text: {
    fontSize: dp(16),
    fontWeight: '400',
    lineHeight: dp(20),
    color: '#000',
  },
  circleImage: {
    width: dp(39),
    height: dp(39),
  },
});

export {Business};
