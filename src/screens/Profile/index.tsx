import React from 'react';

import {View, Text} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';

import useStore from '../../state/store';

const Profile = () => {
  const {setOrderDetails, orderDetails} = useStore.getState();

  return (
    <>
      <View>
        <Text>Profile</Text>
        <TouchableOpacity
          style={{width: 100, height: 100, backgroundColor: 'red'}}
          onPress={() => {
            setOrderDetails({
              ...orderDetails,
              sum: 100,
              orderDate: new Date().toISOString(),
            });
          }}
        />
      </View>
    </>
  );
};

export {Profile};
