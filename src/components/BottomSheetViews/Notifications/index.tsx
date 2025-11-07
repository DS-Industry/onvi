import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';

import {Button} from '@styled/buttons';
import {useTranslation} from 'react-i18next';

const Notifications = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Button
        label={t('app.history.notifications')}
        onClick={() => {}}
        color="blue"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('screen').height,
  },
});

export {Notifications};
