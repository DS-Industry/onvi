import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {dp} from '@utils/dp';
import React, {useEffect, useState} from 'react';
import {Button} from '@styled/buttons/Button';
import {useNavigation} from '@react-navigation/core';
import useSWRMutation from 'swr/mutation';
import {apply} from '@services/api/promotion';
import {IApplyPromotionRequest} from '../../types/api/promotion/req/IApplyPromotionRequest.ts';
import Toast from 'react-native-toast-message';

import {
  DrawerParamList,
  GeneralDrawerNavigationProp,
} from '../../types/navigation/DrawerNavigation.ts';
import {PersonalPromoBanner} from '@styled/banners/PersonalPromoBanner';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Copy} from 'react-native-feather';
import Clipboard from '@react-native-clipboard/clipboard';
import ScreenHeader from '@components/ScreenHeader/index.tsx';
import useStore from '../../state/store';
import {useTranslation} from 'react-i18next';

type PromoInputRouteProp = RouteProp<DrawerParamList, 'Ввод Промокода'>;

const PromosInput = () => {
  const [_, setCode] = useState('');
  const navigation =
    useNavigation<GeneralDrawerNavigationProp<'Ввод Промокода'>>();
  const {t} = useTranslation();

  const route = useRoute<PromoInputRouteProp>();
  const {promocode, type} = route.params;
  const {setUserBalance} = useStore.getState();

  const {trigger, isMutating} = useSWRMutation(
    'applyUserPromo',
    (key, {arg}: {arg: IApplyPromotionRequest}) => apply(arg),
    {
      onError: err => {
        let message = t('app.errors.genericError');
        setCode(''); // Clear the code input

        if (err.response && err.response.data) {
          const errorCode = parseInt(err.response.data.code);
          switch (errorCode) {
            case 84:
              message = t('app.errors.invalidPromocode');
              break;
            case 88:
              message = t('app.errors.expiredPromocode');
              break;
            default:
              message = t('app.errors.genericError');
          }
        }

        Toast.show({
          type: 'customErrorToast',
          text1: message,
        });
      },
      onSuccess: data => {
        data.totalPoints && setUserBalance(data.totalPoints);

        Toast.show({
          type: 'customSuccessToast',
          text1: t('app.promos.successfullyApplied'),
        });
      },
    },
  );

  const [promoCode, setPromocode] = useState('');
  const [color, setColor] = useState('#000000');

  const copyToClipboard = () => {
    Clipboard.setString(promoCode);
  };

  useEffect(() => {
    setPromocode(promocode.code);
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <ScreenHeader
            screenTitle={t('app.promos.title')}
            btnType="back"
            btnCallback={() => navigation.navigate('Промокоды')}
          />
          <View style={styles.content}>
            {type == 'personal' &&
            'discount' in promocode &&
            'discountType' in promocode ? (
              <PersonalPromoBanner
                title={t('app.promos.promocodeForVariables', {
                  discount: promocode.discount,
                  unit:
                    promocode.discountType == 2
                      ? '%'
                      : t('common.labels.ballov'),
                })}
                date={new Date(promocode.expiryDate)}
                disable={true}
              />
            ) : (
              <View
                style={{width: '100%', height: '60%', borderRadius: dp(25)}}>
                {promocode.image && (
                  <Image
                    source={{uri: promocode.image}}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </View>
            )}
            {type == 'personal' ? (
              <View style={styles.promoCodeSection}>
                <Text style={styles.title}>{t('app.promos.promocode')}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.promoCode}>{promocode.code}</Text>
                  <Pressable
                    onPress={copyToClipboard}
                    style={{marginLeft: dp(10)}}>
                    <Copy
                      stroke={color}
                      width={dp(22)}
                      height={dp(22)}
                      onPressIn={() => {
                        setColor('#AAA7A7FF');
                      }}
                      onPressOut={() => {
                        setColor('#000000');
                      }}
                    />
                  </Pressable>
                </View>
              </View>
            ) : (
              <></>
            )}
            <Text style={styles.title}>{t('common.labels.description')}</Text>
            <Text style={styles.text}>
              {type === 'personal'
                ? promocode.image
                : 'description' in promocode
                ? promocode.description
                : ''}
            </Text>
          </View>
          {type == 'global' && (
            <View style={{alignSelf: 'center'}}>
              <Button
                label={t('common.buttons.activate')}
                color={'blue'}
                showLoading={isMutating}
                onClick={() => trigger({code: promoCode})}
              />
            </View>
          )}
        </View>
      </ScrollView>
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
    flex: 1,
    flexDirection: 'column',
    marginTop: dp(30),
    alignItems: 'center',
  },
  action: {
    width: '85%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: dp(30),
    justifyContent: 'space-between',
  },
  promoCodeSection: {
    flexDirection: 'column',
    width: '100%',
  },
  title: {
    fontSize: dp(14),
    fontWeight: '600',
    marginTop: dp(30),
    marginBottom: dp(10),
    alignSelf: 'flex-start',
  },
  promoCode: {
    fontSize: dp(18),
    fontWeight: '700',
    color: '#3461FF',
  },
  text: {
    fontSize: dp(14),
    letterSpacing: 1.5,
  },
});

export {PromosInput};
