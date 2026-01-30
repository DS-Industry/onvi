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
import {AvailablePromocodeResponse} from '@app-types/models/Promotion';

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
        setCode('');

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
            {type === 'personal' && promocode.discountValue !== undefined ? (
              <View style={styles.bannerContainer}>
                <PersonalPromoBanner
                  title={t('app.promos.promocodeForVariables', {
                    discount: promocode.discountValue,
                    unit:
                      promocode.discountType === 'percentage'
                        ? '%'
                        : t('common.labels.ballov'),
                  })}
                  date={promocode.validUntil ? new Date(promocode.validUntil) : new Date()}
                  disable={true}
                />
              </View>
            ) : (
              <View style={styles.imageContainer}>
                {promocode.mobileDisplay?.imageLink && (
                  <Image
                    source={{uri: promocode.mobileDisplay.imageLink}}
                    style={styles.image}
                  />
                )}
              </View>
            )}
            {type == 'personal' ? (
              <View style={styles.promoCodeSection}>
                <Text style={styles.title}>{t('app.promos.promocode')}</Text>
                <View style={styles.promoCodeRow}>
                  <Text style={styles.promoCode}>{promocode.code}</Text>
                  <Pressable
                    onPress={copyToClipboard}
                    style={styles.copyButton}>
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
            ) : null}
            <View style={styles.descriptionSection}>
              <Text style={styles.title}>{t('common.labels.description')}</Text>
              <Text style={styles.text}>
                {type === 'personal'
                  ? promocode.mobileDisplay?.description || ''
                  : promocode.campaign?.description || ''}
              </Text>
            </View>
          </View>
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
  },
  bannerContainer: {
    width: '100%',
    marginBottom: dp(20),
  },
  imageContainer: {
    width: '100%',
    height: dp(250),
    borderRadius: dp(12),
    marginBottom: dp(20),
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  promoCodeSection: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: dp(20),
  },
  promoCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(5),
  },
  copyButton: {
    marginLeft: dp(10),
  },
  descriptionSection: {
    width: '100%',
  },
  title: {
    fontSize: dp(14),
    fontWeight: '600',
    marginBottom: dp(10),
    color: '#000',
  },
  promoCode: {
    fontSize: dp(18),
    fontWeight: '700',
    color: '#3461FF',
  },
  text: {
    fontSize: dp(14),
    letterSpacing: 0.5,
    lineHeight: dp(20),
    color: '#333',
  },
});

export {PromosInput};