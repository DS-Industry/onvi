import React from 'react';

import {TextInput, Image, View, StyleSheet} from 'react-native';

import {GREY, BLACK} from '../../../utils/colors';

import {dp} from '../../../utils/dp';
import {useTranslation} from 'react-i18next';

interface IInput {
  value: string;
  setValue: any;
}

const SearchInput: React.FC<IInput> = ({value, setValue}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.SectionStyle}>
      <Image
        source={require('../../../assets/icons/Search.png')} //Change your icon image here
        style={styles.ImageStyle}
      />
      <TextInput
        value={value}
        onChangeText={(text: any) => {
          setValue(text);
        }}
        placeholder={t('app.search.placeholder')}
        placeholderTextColor="#B8B9BC"
        style={{
          flex: 1,
          textAlign: 'left',
          alignItems: 'center',
          fontSize: 16,
          color: BLACK,
          backgroundColor: GREY,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GREY,
    height: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  ImageStyle: {
    padding: dp(10),
    margin: dp(5),
    height: dp(25),
    width: dp(25),
    resizeMode: 'stretch',
    alignItems: 'center',
  },
});

export {SearchInput};
