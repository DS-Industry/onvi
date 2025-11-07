import {Image, StyleSheet, Text, View} from 'react-native';
import {dp} from '@utils/dp.ts';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {Button, Tile} from '@styled/buttons';
import {Slide} from '@styled/silder';
import useStore from '@state/store.ts';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {getFreeVacuum} from '@services/api/user';

const PostPaymentVacuum = () => {
  const {t} = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [freeVacuumeActivate, setFreeVacuumeActivate] = useState(false);

  const {
    isBottomSheetOpen,
    orderDetails,
    setOrderDetails,
    freeVacuum,
    setFreeVacuum,
  } = useStore();

  const InputSums: {label: string; description?: string; active?: boolean}[] = [
    {
      label: '10',
      description: t('common.labels.rubles'),
    },
    {
      label: '20',
      description: t('common.labels.rubles'),
    },
    {
      label: '30',
      description: t('common.labels.rubles'),
    },
    {
      label: '40',
      description: t('common.labels.rubles'),
    },
    {
      label: '50',
      description: t('common.labels.rubles'),
    },
  ];

  useEffect(() => {
    if (freeVacuum.remains - 1 > 0) {
      setFreeVacuumeActivate(true);
    }
  }, []);

  const handleTileClick = (tile: any, index: number) => {
    setActiveIndex(index);
  };

  const restart = async () => {
    setOrderDetails({
      ...orderDetails,
      sum: freeVacuumeActivate ? 0 : Number(InputSums[activeIndex].label),
    });

    if (freeVacuumeActivate) {
      const data = await getFreeVacuum();
      setFreeVacuum(data);
    }

    navigateBottomSheet('Payment', {});
  };

  const finish = () => {
    setOrderDetails({
      posId: null,
      sum: 0,
      bayNumber: null,
      promoCodeId: null,
      rewardPointsUsed: null,
      type: null,
      name: null,
      prices: undefined,
      order: null,
      orderDate: null,
      carwashIndex: undefined,
      status: undefined,
    });
    navigateBottomSheet('Main', {});
  };

  return (
    <View style={styles.container}>
      <BottomSheetScrollView
        scrollEnabled={isBottomSheetOpen}
        nestedScrollEnabled={true}>
        <View style={styles.mainView}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../../assets/images/success_vacuum.webp')}
              style={styles.image}
            />
            <Text style={styles.titleText}>
              {t('app.payment.vacuum.sessionEnded')}
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.contentText}>
              {t('app.payment.vacuum.retrySession')} 🚙
            </Text>
            {!freeVacuumeActivate && (
              <>
                <Slide
                  items={InputSums}
                  initialActiveIndex={0}
                  onItemClick={(tile, index) => handleTileClick(tile, index)}
                  renderItem={(sum, index, isActive, onClick) => (
                    <Tile
                      key={`tile-${index}`}
                      label={sum.label}
                      description={sum.description}
                      active={activeIndex === index}
                      onClick={onClick}
                      width={dp(120)}
                      height={dp(90)}
                      borderRadius={dp(25)}
                      labelFontSize={dp(32)}
                      descriptionFontSize={dp(18)}
                    />
                  )}
                />
                <View style={styles.marginBottom} />
              </>
            )}

            <Button
              label={
                freeVacuumeActivate
                  ? t('app.payment.vacuum.activateFree')
                  : t('app.payment.restartService')
              }
              color={'blue'}
              height={dp(40)}
              width={dp(280)}
              onClick={restart}
            />
          </View>
          <View style={styles.footer}>
            <Button
              label={t('common.buttons.finish')}
              color={'blue'}
              height={dp(40)}
              width={dp(280)}
              outlined={true}
              onClick={finish}
            />
            <Text style={styles.text}>{t('app.payment.problemsContact')}</Text>
            <Text style={styles.text}>{t('app.payment.techSupport')}</Text>
          </View>
        </View>
      </BottomSheetScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(20),
    backgroundColor: '#fff',
    borderRadius: dp(22),
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainView: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: dp(248),
  },
  image: {
    width: '100%',
    marginBottom: dp(16),
    resizeMode: 'contain',
  },
  titleText: {
    textAlign: 'center',
    fontSize: dp(21),
    fontWeight: '600',
    color: 'black',
  },
  content: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: dp(30),
  },
  contentText: {
    fontSize: dp(21),
    fontWeight: '400',
    color: 'black',
    marginBottom: dp(10),
  },
  marginBottom: {
    marginBottom: dp(10),
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dp(40),
  },
  text: {
    fontSize: dp(12),
    color: 'black',
  },
});

export {PostPaymentVacuum};
