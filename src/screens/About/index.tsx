import {
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {dp} from '../../utils/dp';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/core';

import ScreenHeader from '@components/ScreenHeader';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import { APP_VERSION } from '@env';

const About = () => {
  const navigation =
    useNavigation<GeneralDrawerNavigationProp<'О приложении'>>();
  const {t} = useTranslation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <ScreenHeader
          screenTitle={t('app.about.about')}
          btnType="back"
          btnCallback={() => navigation.navigate('Настройки')}
        />
        <View style={styles.content}>
          <Image
            source={require('../../assets/icons/onvi_log_black_green.png')}
            style={styles.logo}
          />
          <Text style={{...styles.title}}>Onvi</Text>
          <View style={styles.section}>
            <Text style={{...styles.sectionTitle}}>
              {t('app.about.appVersion')}
            </Text>
            <Text style={{...styles.text}}>{APP_VERSION}</Text>
          </View>
          <View style={styles.section}>
            <Text style={{...styles.sectionTitle}}>
              {t('app.about.osVersion')}
            </Text>
            <Text
              style={{
                ...styles.text,
              }}>{`${Platform.OS} ${Platform.Version}`}</Text>
          </View>
          <View style={styles.section}>
            <Text style={{...styles.sectionTitle}}>
              {t('common.labels.region')}
            </Text>
            <Text style={{...styles.text}}>{t('common.labels.russia')}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            borderRadius: dp(12),
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
            padding: dp(10),
          }}
          onPress={() => Linking.openURL('https://t.me/OnviSupportBot')}>
          <Text
            style={{
              fontSize: dp(14),
              color: '#000000',
              fontWeight: '600',
              letterSpacing: 0.22,
            }}>
            {t('app.about.writeSupport')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
  },
  content: {
    marginTop: dp(30),
    height: '80%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logo: {
    width: dp(91),
    height: dp(51),
    resizeMode: 'contain',
  },
  section: {
    alignItems: 'center',
    paddingBottom: dp(13),
  },
  title: {
    color: '#000000',
    fontSize: dp(18),
    fontWeight: '500',
  },
  text: {
    color: '#000000',
    fontSize: dp(10),
    fontWeight: '400',
  },
  sectionTitle: {
    color: '#000000',
    fontSize: dp(16),
    fontWeight: '600',
  },
});
export {About};
