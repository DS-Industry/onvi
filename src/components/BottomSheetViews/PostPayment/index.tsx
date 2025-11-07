import {Image, StyleSheet, Text, View} from 'react-native';
import {dp} from '@utils/dp.ts';
import {useTranslation} from 'react-i18next';
import React, {useState} from 'react';
import {Button, Tile} from '@styled/buttons';
import {Slide} from '@styled/silder';
import useStore from '@state/store.ts';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

const PostPayment = () => {
  const {t} = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const InputSums: {label: string; description?: string; active?: boolean}[] = [
    {
      label: '50',
      description: t('common.labels.rubles'),
    },
    {
      label: '100',
      description: t('common.labels.rubles'),
    },
    {
      label: '150',
      description: t('common.labels.rubles'),
    },
    {
      label: '200',
      description: t('common.labels.rubles'),
    },
  ];

  const {isBottomSheetOpen, orderDetails, setOrderDetails} = useStore();

  const handleTileClick = (tile: any, index: number) => {
    setActiveIndex(index); // Update the active index
  };

  const restart = async () => {
    setOrderDetails({
      ...orderDetails,
      sum: Number(InputSums[activeIndex].label),
    });

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
        <View
          style={{
            flex: 3,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <Image
            source={require('../../../assets/images/success_image.png')}
            style={styles.image}
          />
          <Text style={styles.titleText}>
            {t('app.payment.paymentSuccessful')}
          </Text>
          <Text style={styles.titleText}>{t('app.payment.goodWash')}</Text>
        </View>

        {orderDetails.type === 'SelfService' ? (
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {t('app.payment.continueWashing')}
            </Text>
            <Slide
              items={InputSums}
              initialActiveIndex={0}
              onItemClick={(tile, index) => handleTileClick(tile, index)}
              renderItem={(sum, index, isActive, onClick) => (
                <Tile
                  key={`tile-${index}`}
                  label={sum.label}
                  description={sum.description}
                  active={activeIndex === index} // Highlight the active tile
                  onClick={onClick}
                  width={dp(120)} // Adjust size as needed
                  height={dp(90)}
                  borderRadius={dp(25)}
                  labelFontSize={dp(32)} // Example of custom font size
                  descriptionFontSize={dp(18)}
                />
              )}
            />
            <Button
              label={t('app.payment.restartService')}
              color={'blue'}
              height={dp(40)}
              width={dp(280)}
              outlined={true}
              onClick={restart}
            />
          </View>
        ) : (
          <></>
        )}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            label={t('common.buttons.finish')}
            color={'blue'}
            height={dp(40)}
            width={dp(280)}
            onClick={finish}
          />
          <Text style={styles.text}>{t('app.payment.problemsContact')}</Text>
          <Text style={styles.text}>{t('app.payment.techSupport')}</Text>
        </View>
      </BottomSheetScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    backgroundColor: '#fff',
    borderRadius: dp(22),
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: dp(248),
    height: dp(129),
    marginBottom: dp(16),
    resizeMode: 'contain',
  },
  content: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: dp(40),
  },
  titleText: {
    fontSize: dp(21),
    fontWeight: '700',
    color: 'black',
  },
  contentText: {
    fontSize: dp(21),
    fontWeight: '600',
    color: 'black',
  },
  text: {
    fontSize: dp(12),
    color: 'black',
  },
});

export {PostPayment};
