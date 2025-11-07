import React /*, {useState} */ from 'react';

import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {DrawerContentScrollView} from '@react-navigation/drawer';

import {dp} from '../../../utils/dp';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {avatarSwitch} from '@screens/Settings';
import {formatPhoneNumber} from '../../../utils/phoneFormat';

import {DrawerNavProp} from '../../../types/navigation/DrawerNavigation.ts';
import {useTranslation} from 'react-i18next';

interface CustomDrawerItemProps {
  label: string;
  color: string;
  onPress: any;
}

interface CustomDrawerContentProps {
  navigation: DrawerNavProp;
  theme: any;
  user: any;
}

const CustomDrawerItem = ({label, color, onPress}: CustomDrawerItemProps) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingBottom: dp(25),
      }}
      onPress={onPress}>
      <Text
        style={{
          color: color,
          fontWeight: '500',
          fontSize: dp(20),
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomDrawerContent = ({
  navigation,
  theme,
  user,
}: CustomDrawerContentProps) => {
  const initialAvatar = user.avatar;

  const avatarValue = avatarSwitch(initialAvatar);
  const route = navigation.getState().routes[navigation.getState().index].name;
  const {t} = useTranslation();

  return (
    <>
      <View style={{flex: 1}}>
        <DrawerContentScrollView scrollEnabled={false}>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              paddingTop: dp(20),
              paddingLeft: dp(20),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingBottom: dp(15),
                borderRadius: dp(10),
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Настройки')}>
              {/*Profile*/}
              <View style={styles.profileContainer}>
                <Image source={avatarValue} style={styles.avatar} />
              </View>
            </TouchableOpacity>
            {/*items*/}
            <View>
              {!user || !user.name ? (
                <View style={{paddingTop: dp(20)}}>
                  <SkeletonPlaceholder borderRadius={4}>
                    <Text
                      style={{
                        paddingTop: dp(24),
                        fontStyle: 'normal',
                        fontSize: dp(24),
                        fontWeight: '600',
                        lineHeight: dp(23),
                        color: theme.textColor,
                      }}
                    />
                  </SkeletonPlaceholder>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    paddingBottom: dp(10),
                  }}
                  onPress={() =>
                    navigation.reset({
                      index: 0,
                      routes: [{name: 'Настройки'}],
                    })
                  }>
                  <Text
                    style={{
                      fontStyle: 'normal',
                      fontSize: dp(20),
                      fontWeight: '600',
                      lineHeight: dp(23),
                      letterSpacing: 0.43,
                      color: theme.textColor,
                    }}>
                    {user.name}
                  </Text>
                </TouchableOpacity>
              )}
              {!user || !user.phone ? (
                <View style={{paddingTop: dp(18)}}>
                  <SkeletonPlaceholder borderRadius={4}>
                    <Text
                      style={{
                        marginBottom: dp(45),
                        fontStyle: 'normal',
                        fontSize: dp(10),
                        fontWeight: '800',
                        lineHeight: dp(20),
                        letterSpacing: 0.43,
                        color: '#BEBEBE',
                        width: '70%',
                      }}
                    />
                  </SkeletonPlaceholder>
                </View>
              ) : (
                <Text
                  style={{
                    marginBottom: dp(45),
                    fontStyle: 'normal',
                    fontSize: dp(10),
                    fontWeight: '800',
                    lineHeight: dp(20),
                    color: '#BEBEBE',
                    letterSpacing: 0.23,
                  }}>
                  {formatPhoneNumber(user.phone)}
                </Text>
              )}

              <CustomDrawerItem
                label={t('navigation.home')}
                color={route === 'Главная' ? theme.primary : theme.textColor}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Главная'}],
                  });
                }}
              />
              <CustomDrawerItem
                label={t('navigation.stock')}
                color={route === 'Промокоды' ? theme.primary : theme.textColor}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Промокоды'}],
                  });
                }}
              />
              <CustomDrawerItem
                label={t('navigation.favorites')}
                color={route === 'Избранное' ? theme.primary : theme.textColor}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Избранное'}],
                  });
                }}
              />
              <CustomDrawerItem
                label={t('navigation.settings')}
                color={route === 'Настройки' ? theme.primary : theme.textColor}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Настройки'}],
                  });
                }}
              />
            </View>
          </View>
        </DrawerContentScrollView>
        <View
          style={{
            padding: dp(20),
            display: 'flex',
            flexDirection: 'column',
            marginBottom: dp(80),
          }}>
          <TouchableOpacity
            style={{
              borderColor: '#3461FF',
              borderWidth: 2,
              borderRadius: 20,
              padding: 8,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingEnd: dp(10),
              paddingStart: dp(10),
            }}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Перенести баланс'}],
              });
            }}>
            <Text
              style={{
                fontSize: dp(16),
                fontWeight: '500',
                color: 'black',
              }}>
              {t('app.main.transferBalance')}
            </Text>
            <Image
              style={{
                width: dp(20),
                height: dp(20),
                marginLeft: dp(0),
              }}
              source={require('../../../assets/icons/transfer-balance-icon.png')}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: dp(20),
            }}>
            <Image
              style={{
                marginRight: dp(5),
                width: dp(25),
                height: dp(25),
              }}
              source={require('../../../assets/icons/telegram.png')}
            />

            <TouchableOpacity
              onPress={() => Linking.openURL('https://t.me/OnviSupportBot')}>
              <Text
                style={{
                  fontSize: dp(10),
                  color: '#717586',
                  fontWeight: '600',
                }}>
                {t('app.main.support')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    width: dp(68),
    height: dp(68),
    borderRadius: dp(68) / 2,
    borderWidth: dp(1),
    borderColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: dp(58),
    height: dp(58),
    borderRadius: dp(58) / 2,
  },
});

export {CustomDrawerContent};
