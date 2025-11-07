import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {dp} from '@utils/dp.ts';
import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import {openWebURL} from '@utils/openWebUrl.ts';
import ScreenHeader from '@components/ScreenHeader';
import {useTranslation} from 'react-i18next';

const Legals = () => {
  const navigation =
    useNavigation<GeneralDrawerNavigationProp<'Правовые документы'>>();
  const {t} = useTranslation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <ScreenHeader
          screenTitle={t('app.legal.legalDocuments')}
          btnType="back"
          btnCallback={() => navigation.navigate('Настройки')}
        />

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionBody}>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  style={[styles.row, styles.rowFirst]}
                  onPress={() => {
                    openWebURL(
                      'https://docs.google.com/document/d/1H5DFxDJfFBxK6wNK3iIydC9Qp1zaQsuSxZkjaPcCVyc/edit?usp=sharing',
                    );
                  }}>
                  <Text style={styles.rowLabel}>
                    {t('app.legal.privacyPolicy')}
                  </Text>
                  <Image
                    style={{
                      height: dp(24),
                      width: dp(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/icons/arrow-up.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  style={[styles.row, styles.rowFirst]}
                  onPress={() =>
                    openWebURL(
                      'https://docs.google.com/document/d/1zqgcqbfsn7_64tUcD5iN7t9DkYt8YdqC/edit?usp=sharing&ouid=111405890257322006921&rtpof=true&sd=true',
                    )
                  }>
                  <Text style={styles.rowLabel}>
                    {t('app.legal.loyaltyProgram')}
                  </Text>
                  <Image
                    style={{
                      height: dp(24),
                      width: dp(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/icons/arrow-up.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
    marginTop: '10%',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    marginLeft: dp(10),
    marginBottom: dp(10),
    fontSize: 13,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
    letterSpacing: 0.33,
  },
  sectionBody: {
    borderRadius: dp(10),
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: dp(10),
  },
  rowWrapper: {
    paddingLeft: dp(10),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderRadius: dp(10),
    borderColor: '#f0f0f0',
  },
  row: {
    height: dp(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: dp(5),
  },
  rowLabel: {
    fontSize: dp(13),
    letterSpacing: 0.22,
    color: '#000',
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export {Legals};
