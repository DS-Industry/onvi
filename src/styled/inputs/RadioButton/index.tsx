// TODO
import React, {useState} from 'react';

import {StyleSheet, TouchableOpacity, View} from 'react-native';

const RadioInput = () => {
  const [select, setSelect] = useState<boolean>(false);

  return (
    <TouchableOpacity
      style={styles.outterCircle}
      onPress={() => setSelect(true)}>
      {select && <View style={styles.innerCircle} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outterCircle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderColor: '#4820e8',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#4820e8',
  },
});

export {RadioInput};
