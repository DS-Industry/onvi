import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { dp } from '../../../utils/dp';
import Skeleton from 'react-native-reanimated-skeleton';
import { avatarSwitch } from '@screens/Settings';
import { formatPhoneNumber } from '../../../utils/phoneFormat';
import { DrawerNavProp } from '../../../types/navigation/DrawerNavigation.ts';
import { useTranslation } from 'react-i18next';

interface CustomDrawerItemProps {
  label: string;
  color: string;
  onPress: any;
  iconName?: string;
  isActive: boolean;
}

interface CustomDrawerContentProps {
  navigation: DrawerNavProp;
  theme: any;
  user: any;
}

const HomeIcon = ({ active = false }: { active?: boolean }) => (
  <Svg width={dp(24)} height={dp(24)} viewBox="0 0 24 24" fill="none" style={{ zIndex: 0 }}>
    <Path
      d="M6 19H9V13H15V19H18V10L12 5.5L6 10V19ZM4 21V9L12 3L20 9V21H13V15H11V21H4Z"
      fill={active ? "#0B68E1" : "#000000"}
    />
  </Svg>
);

const TagIcon = ({ active = false }: { active?: boolean }) => (
  <Svg width={dp(24)} height={dp(24)} viewBox="0 0 24 24" fill="none" style={{ zIndex: 0 }}>
    <Path
      d="M21.41 11.58L12.41 2.58C12.035 2.20808 11.5281 1.99958 11 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V11C1.99979 11.2639 2.05182 11.5253 2.15308 11.769C2.25434 12.0127 2.40283 12.2339 2.59 12.42L11.59 21.42C11.965 21.7919 12.4719 22.0004 13 22C13.5296 21.9978 14.0367 21.7856 14.41 21.41L21.41 14.41C21.7856 14.0367 21.9978 13.5296 22 13C22.0002 12.7361 21.9482 12.4747 21.8469 12.231C21.7457 11.9873 21.5972 11.7661 21.41 11.58ZM13 20L4 11V4H11L20 13M6.5 5C6.79667 5 7.08668 5.08797 7.33336 5.2528C7.58003 5.41762 7.77229 5.65189 7.88582 5.92598C7.99935 6.20006 8.02906 6.50166 7.97118 6.79264C7.9133 7.08361 7.77044 7.35088 7.56066 7.56066C7.35088 7.77044 7.08361 7.9133 6.79264 7.97118C6.50166 8.02906 6.20006 7.99935 5.92598 7.88582C5.65189 7.77229 5.41762 7.58003 5.2528 7.33336C5.08797 7.08668 5 6.79667 5 6.5C5 6.10218 5.15804 5.72064 5.43934 5.43934C5.72064 5.15804 6.10218 5 6.5 5Z"
      fill={active ? "#0B68E1" : "#000000"}
    />
  </Svg>
);

const HeartIcon = ({ active = false }: { active?: boolean }) => (
  <Svg width={dp(24)} height={dp(24)} viewBox="0 0 24 24" fill="none" style={{ zIndex: 0 }}>
    <Path
      d="M12.1 18.55L12 18.65L11.89 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 6 11.07 7.36H12.93C13.46 6 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55ZM16.5 3C14.76 3 13.09 3.81 12 5.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5C2 12.27 5.4 15.36 10.55 20.03L12 21.35L13.45 20.03C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
      fill={active ? "#0B68E1" : "#000000"}
    />
  </Svg>
);

const SettingsIcon = ({ active = false }: { active?: boolean }) => (
  <Svg width={dp(24)} height={dp(24)} viewBox="0 0 24 24" fill="none" style={{ zIndex: 0 }}>
    <Path
      d="M19.4301 12.98C19.4701 12.66 19.5001 12.34 19.5001 12C19.5001 11.66 19.4701 11.34 19.4301 11.02L21.5401 9.37003C21.7301 9.22003 21.7801 8.95003 21.6601 8.73003L19.6601 5.27003C19.6011 5.16685 19.5074 5.08804 19.3956 5.04773C19.2838 5.00742 19.1613 5.00823 19.0501 5.05003L16.5601 6.05003C16.0401 5.65003 15.4801 5.32003 14.8701 5.07003L14.4901 2.42003C14.4731 2.30255 14.4141 2.19521 14.324 2.11796C14.2339 2.04072 14.1188 1.99881 14.0001 2.00003H10.0001C9.75008 2.00003 9.54008 2.18003 9.51008 2.42003L9.13008 5.07003C8.52008 5.32003 7.96008 5.66003 7.44008 6.05003L4.95008 5.05003C4.89196 5.03091 4.83126 5.02079 4.77008 5.02003C4.60008 5.02003 4.43008 5.11003 4.34008 5.27003L2.34008 8.73003C2.21008 8.95003 2.27008 9.22003 2.46008 9.37003L4.57008 11.02C4.53008 11.34 4.50008 11.67 4.50008 12C4.50008 12.33 4.53008 12.66 4.57008 12.98L2.46008 14.63C2.27008 14.78 2.22008 15.05 2.34008 15.27L4.34008 18.73C4.39903 18.8332 4.4928 18.912 4.60458 18.9523C4.71636 18.9926 4.83885 18.9918 4.95008 18.95L7.44008 17.95C7.96008 18.35 8.52008 18.68 9.13008 18.93L9.51008 21.58C9.54008 21.82 9.75008 22 10.0001 22H14.0001C14.2501 22 14.4601 21.82 14.4901 21.58L14.8701 18.93C15.4801 18.68 16.0401 18.34 16.5601 17.95L19.0501 18.95C19.1101 18.97 19.1701 18.98 19.2301 18.98C19.4001 18.98 19.5701 18.89 19.6601 18.73L21.6601 15.27C21.7801 15.05 21.7301 14.78 21.5401 14.63L19.4301 12.98ZM17.4501 11.27C17.4901 11.58 17.5001 11.79 17.5001 12C17.5001 12.21 17.4801 12.43 17.4501 12.73L17.3101 13.86L18.2001 14.56L19.2801 15.4L18.5801 16.61L17.3101 16.1L16.2701 15.68L15.3701 16.36C14.9401 16.68 14.5301 16.92 14.1201 17.09L13.0601 17.52L12.9001 18.65L12.7001 20H11.3001L11.1101 18.65L10.9501 17.52L9.89008 17.09C9.46008 16.91 9.06008 16.68 8.66008 16.38L7.75008 15.68L6.69008 16.11L5.42008 16.62L4.72008 15.41L5.80008 14.57L6.69008 13.87L6.55008 12.74C6.52008 12.43 6.50008 12.2 6.50008 12C6.50008 11.8 6.52008 11.57 6.55008 11.27L6.69008 10.14L5.80008 9.44003L4.72008 8.60003L5.42008 7.39003L6.69008 7.90003L7.73008 8.32003L8.63008 7.64003C9.06008 7.32003 9.47008 7.08003 9.88008 6.91003L10.9401 6.48003L11.1001 5.35003L11.3001 4.00003H12.6901L12.8801 5.35003L13.0401 6.48003L14.1001 6.91003C14.5301 7.09003 14.9301 7.32003 15.3301 7.62003L16.2401 8.32003L17.3001 7.89003L18.5701 7.38003L19.2701 8.59003L18.2001 9.44003L17.3101 10.14L17.4501 11.27ZM12.0001 8.00003C9.79008 8.00003 8.00008 9.79003 8.00008 12C8.00008 14.21 9.79008 16 12.0001 16C14.2101 16 16.0001 14.21 16.0001 12C16.0001 9.79003 14.2101 8.00003 12.0001 8.00003ZM12.0001 14C10.9001 14 10.0001 13.1 10.0001 12C10.0001 10.9 10.9001 10 12.0001 10C13.1001 10 14.0001 10.9 14.0001 12C14.0001 13.1 13.1001 14 12.0001 14Z"
      fill={active ? "#0B68E1" : "#000000"}
    />
  </Svg>
);

const TransferIcon = () => (
  <Svg width={dp(24)} height={dp(24)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 4C17.1217 4 19.1566 4.84285 20.6569 6.34315C22.1571 7.84344 23 9.87827 23 12C23 14.1217 22.1571 16.1566 20.6569 17.6569C19.1566 19.1571 17.1217 20 15 20C12.8783 20 10.8434 19.1571 9.34315 17.6569C7.84285 16.1566 7 14.1217 7 12C7 9.87827 7.84285 7.84344 9.34315 6.34315C10.8434 4.84285 12.8783 4 15 4ZM15 18C16.5913 18 18.1174 17.3679 19.2426 16.2426C20.3679 15.1174 21 13.5913 21 12C21 10.4087 20.3679 8.88258 19.2426 7.75736C18.1174 6.63214 16.5913 6 15 6C13.4087 6 11.8826 6.63214 10.7574 7.75736C9.63214 8.88258 9 10.4087 9 12C9 13.5913 9.63214 15.1174 10.7574 16.2426C11.8826 17.3679 13.4087 18 15 18ZM3 12C2.99995 13.2399 3.3847 14.4493 4.10116 15.4613C4.81762 16.4733 5.83048 17.2381 7 17.65V19.74C3.55 18.85 1 15.73 1 12C1 8.27 3.55 5.15 7 4.26V6.35C4.67 7.17 3 9.39 3 12Z"
      fill="#000000"
    />
  </Svg>
);

const getIconComponent = (iconName: string, isActive: boolean) => {
  switch (iconName) {
    case 'home':
      return <HomeIcon active={isActive} />;
    case 'tag':
      return <TagIcon active={isActive} />;
    case 'heart':
      return <HeartIcon active={isActive} />;
    case 'settings':
      return <SettingsIcon active={isActive} />;
    default:
      return null;
  }
};

const CustomDrawerItem = ({ label, color, onPress, iconName, isActive }: CustomDrawerItemProps) => {
  return (
    <TouchableOpacity 
      style={styles.drawerItem} 
      onPress={onPress}
      hitSlop={{ top: dp(10), bottom: dp(10)}}
    >
      {iconName && getIconComponent(iconName, isActive)}
      <Text style={[styles.drawerItemText, { color }]}>{label}</Text>
      {isActive && (
        <Svg height="100%" width="100%" style={[styles.drawerItemGradient, { zIndex: 0 }]}>
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#0B68E1" stopOpacity="0" />
              <Stop offset="0.5" stopColor="#0B68E1" stopOpacity="0.025" />
              <Stop offset="1" stopColor="#0B68E1" stopOpacity="0.05" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" rx={5} ry={5} width="100%" height="100%" fill="url(#gradient)" />
        </Svg>
      )}
    </TouchableOpacity>
  );
};

const CustomDrawerContent = ({ navigation, theme, user }: CustomDrawerContentProps) => {
  const initialAvatar = user.avatar;
  const avatarValue = avatarSwitch(initialAvatar);
  const route = navigation.getState().routes[navigation.getState().index].name;
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.container}>
        <DrawerContentScrollView scrollEnabled={false}>
          <View style={styles.content}>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Настройки')}>
              <View style={styles.profileContainer}>
                <Image source={avatarValue} style={styles.avatar} />
              </View>
            </TouchableOpacity>
            <View style={styles.itemsContainer}>
              {!user || !user.name ? (
                <Skeleton
                  isLoading={true}
                  layout={[
                    {
                      key: 'user-name-skeleton',
                      width: dp(150),
                      height: dp(24),
                      borderRadius: 4,
                    },
                  ]}
                  boneColor="#f0f0f0"
                  highlightColor="#e0e0e0"
                  animationType="shiver"
                />
              ) : (
                <TouchableOpacity
                  style={styles.userNameButton}
                  onPress={() =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Настройки' }],
                    })
                  }>
                  <Text style={[styles.userNameText, { color: theme.textColor }]}>
                    {user.name}
                  </Text>
                </TouchableOpacity>
              )}
              {!user || !user.phone ? (
                <Skeleton
                  isLoading={true}
                  layout={[
                    {
                      key: 'user-phone-skeleton',
                      width: dp(100),
                      height: dp(20),
                      borderRadius: 4,
                      marginBottom: dp(45),
                    },
                  ]}
                  boneColor="#f0f0f0"
                  highlightColor="#e0e0e0"
                  animationType="shiver"
                />
              ) : (
                <Text style={[styles.userPhoneText, { color: theme.textColor }]}>
                  {formatPhoneNumber(user.phone)}
                </Text>
              )}
              <View style={styles.drawerItems}>
                <CustomDrawerItem
                  label={t('navigation.home')}
                  color={route === 'Главная' ? theme.primary : theme.textColor}
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Главная' }],
                    });
                  }}
                  iconName="home"
                  isActive={route === 'Главная'}
                />
                <CustomDrawerItem
                  label={t('navigation.stock')}
                  color={route === 'Промокоды' ? theme.primary : theme.textColor}
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Промокоды' }],
                    });
                  }}
                  iconName="tag"
                  isActive={route === 'Промокоды'}
                />
                <CustomDrawerItem
                  label={t('navigation.favorites')}
                  color={route === 'Избранное' ? theme.primary : theme.textColor}
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Избранное' }],
                    });
                  }}
                  iconName="heart"
                  isActive={route === 'Избранное'}
                />
                <CustomDrawerItem
                  label={t('navigation.settings')}
                  color={route === 'Настройки' ? theme.primary : theme.textColor}
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Настройки' }],
                    });
                  }}
                  iconName="settings"
                  isActive={route === 'Настройки'}
                />
                <CustomDrawerItem
                  label={t('navigation.game')}
                  color={route === 'Игра' ? theme.primary : theme.textColor}
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{name: 'Игра'}],
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </DrawerContentScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.transferButton}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Перенести баланс' }],
              });
            }}
          >
            {TransferIcon()}
            <View style={styles.transferTextContainer}>
              <Text style={[styles.transferText, { color: theme.textColor }]}>
                {t('app.main.transferBalance')}
              </Text>
              <Image
                style={styles.transferImage}
                source={require('../../../assets/icons/moyka-transfer.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.supportContainer}>
            <Image
              style={styles.telegramIcon}
              source={require('../../../assets/icons/telegram.png')}
            />
            <TouchableOpacity onPress={() => Linking.openURL('https://t.me/OnviSupportBot')}>
              <Text style={[styles.supportText, { color: theme.textColor }]}>
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: dp(20),
    paddingLeft: dp(20),
  },
  profileButton: {
    flexDirection: 'row',
    paddingBottom: dp(15),
    borderRadius: dp(10),
    alignItems: 'center',
  },
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
  itemsContainer: {
    width: '100%',
    paddingRight: dp(9),
  },
  userNameButton: {
    flexDirection: 'row',
    paddingBottom: dp(2),
  },
  userNameText: {
    fontStyle: 'normal',
    fontSize: dp(20),
    fontWeight: '600',
    lineHeight: dp(23),
    letterSpacing: 0.43,
  },
  userPhoneText: {
    marginBottom: dp(45),
    fontStyle: 'normal',
    fontSize: dp(11),
    fontWeight: '400',
    lineHeight: dp(20),
    letterSpacing: 0.23,
  },
  drawerItems: {
    gap: dp(35),
  },
  drawerItem: {
    height: dp(30),
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    borderRadius: dp(5),
  },
  drawerItemGradient: {
    position: 'absolute',
    left: dp(0),
    width: '100%',
    height: dp(28),
    zIndex: 1,
    borderRadius: dp(5),
  },
  drawerItemText: {
    marginLeft: dp(20),
    fontWeight: '400',
    fontSize: dp(17),
    zIndex: 5,
  },
  footer: {
    paddingLeft: dp(20),
    display: 'flex',
    flexDirection: 'column',
    marginBottom: dp(80),
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transferTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transferText: {
    fontWeight: '400',
    fontSize: dp(17),
    marginLeft: dp(20),
  },
  transferImage: {
    marginLeft: dp(6),
    width: dp(85),
    objectFit: 'contain',
  },
  supportContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: dp(30),
  },
  telegramIcon: {
    marginRight: dp(20),
    width: dp(25),
    height: dp(25),
  },
  supportText: {
    fontSize: dp(17),
    fontWeight: '400',
  },
});

export { CustomDrawerContent };
