import {View, Text, StyleSheet} from 'react-native';

import {dp} from '../../../utils/dp';

import {Box} from '@components/Boxes/Box';

import useStore from '../../../state/store';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/metrics';

interface BusinessHeader {
  type?: 'navigate' | 'empty' | 'box';
  box?: number;
}

const BusinessHeader = ({type, box}: BusinessHeader) => {
  const {business, orderDetails} = useStore.getState();

  const rightItem = () => {
    if (type === 'empty') {
      return <></>;
    } else if (type === 'box') {
      return (
        <View style={{}}>
          <Box
            label={box ? String(box) : ''}
            onClick={() => {}}
            disabled={false}
            active={true}
            width={horizontalScale(72)}
            height={verticalScale(72)}
            borderRadius={moderateScale(21)}
            labelStyles={{
              fontSize: moderateScale(34),
              fontWeight: '600',
              color: '#000000',
            }}
          />
        </View>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={{flex: 5}}>
          <Text style={styles.title}>
            {business &&
            orderDetails &&
            typeof orderDetails.carwashIndex !== 'undefined'
              ? business.carwashes[orderDetails.carwashIndex].name
              : ''}
          </Text>
          <Text style={styles.text}>
            {business &&
            orderDetails &&
            typeof orderDetails.carwashIndex !== 'undefined'
              ? business.carwashes[orderDetails.carwashIndex].address
              : ''}
          </Text>
        </View>
        <View style={{flex: type === 'box' ? 2 : 1}}>{rightItem()}</View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: verticalScale(25),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    paddingBottom: verticalScale(5),
    color: '#000',
  },
  text: {
    fontSize: moderateScale(14),
    fontWeight: '300',
    color: '#000',
  },
  circleImage: {
    width: dp(45),
    height: dp(45),
    resizeMode: 'contain',
  },

  /**/
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 38,
    width: dp(341),
    height: dp(222),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: dp(20),
    paddingBottom: dp(3),
  },
  modalText: {
    fontWeight: '400',
    fontSize: dp(16),
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: dp(10),
  },
  carImage: {
    width: dp(25),
    height: dp(25),
  },
});

export {BusinessHeader};
