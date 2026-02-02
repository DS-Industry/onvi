import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button } from '@styled/buttons';
import useStore from '@state/store';
import PaymentMethods from '@components/PaymentMethods';
import PaymentSummary from '@components/BottomSheetViews/Payment/PaymentSummary';
import PointsToggle from '@components/BottomSheetViews/Payment/PointsToggle';
import { useBonusPoints } from '@hooks/useBonusPoints.ts';
import { usePaymentProcess } from '@hooks/usePaymentProcess.ts';
import PromocodeSection from '@components/BottomSheetViews/Payment/PromocodeSection';
import { usePromoCode } from '@hooks/usePromoCode.ts';
import AppMetrica from '@appmetrica/react-native-analytics';
import { IPersonalPromotion } from '@app-types/models/PersonalPromotion';
import { navigateBottomSheet } from '@navigators/BottomSheetStack';
import { dp } from '@utils/dp';
import { useCalculateDiscount } from '@hooks/useCalculateDiscount';
import { BayTypeEnum } from '@app-types/BayTypeEnum';
import { IUsedTransactionalCampaign } from '@app-types/api/payment/res/ICalculateDiscountResponse';

interface PaymentContentProps {
  onClose: () => void;
  isFreeVacuum: boolean;
}

const PaymentContent: React.FC<PaymentContentProps> = ({ onClose, isFreeVacuum }) => {
  const { t } = useTranslation();
  const { user, loadUser, selectedPos } = useStore.getState();
  const { orderDetails } = useStore();

  const freeOn = isFreeVacuum && orderDetails?.sum === 0;

  const order = orderDetails;

  const [finalOrderCost, setFinalOrderCost] = useState<number>(order?.sum || 0);
  const [cashbackAmount, setCashbackAmount] = useState<number>(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [transactionalCampaign, setTransactionalCampaign] = useState<IUsedTransactionalCampaign | null>(null);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState<number>(0);
  const [transactionalCampaignDiscount, setTransactionalCampaignDiscount] = useState<number>(0);

  const {
    inputCodeValue,
    discount,
    promoError,
    isMutating,
    promoCodeId,
    setPromocode,
    applyPromoCode,
  } = usePromoCode(order?.posId || 0);

  // Рассчитываем общую скидку для расчета бонусов
  const calculateTotalDiscount = useCallback(() => {
    if (!order?.sum) return 0;
    
    return promoCodeDiscount + transactionalCampaignDiscount;
  }, [order, promoCodeDiscount, transactionalCampaignDiscount, discount]);

  const { usedPoints, maxPoints, toggled, applyPoints, togglePoints } = useBonusPoints(
    user,
    order,
    discount,
    calculateTotalDiscount(),
  );

  // Новый хук для расчета скидок
  const { calculate, discountData, isLoading: isDiscountLoading, error: discountError } = useCalculateDiscount();

  const { loading, setPaymentMethod, paymentMethod } = usePaymentProcess(
    user!,
    order,
    discount,
    usedPoints,
    promoCodeId,
    loadUser,
    finalOrderCost, 
  );

  // Функция для вызова calculate-discount
  const calculateDiscountCall = useCallback(async () => {
    if (!order || freeOn) return;

    const requestData = {
      sum: order.sum,
      carWashId: Number(order.posId) || 0,
      carWashDeviceId: Number(order.carWashDeviceId) || 0,
      bayType: order.bayType as BayTypeEnum || BayTypeEnum.PORTAL,
      rewardPointsUsed: toggled ? maxPoints : undefined,
      promoCodeId: promoCodeId || undefined,
    };
        
    try {
      const result = await calculate(requestData);
      if (result) {
        setFinalOrderCost(result.sumReal);
        setCashbackAmount(result.sumCashback);
        setTransactionalCampaign(result.usedTransactionalCampaign);
        setPromoCodeDiscount(result.promoCodeDiscount || 0);
        setTransactionalCampaignDiscount(result.transactionalCampaignDiscount || 0);
      }
    } catch (error) {
    } finally {
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    }
  }, [order, freeOn, toggled, maxPoints, promoCodeId, calculate, isFirstLoad, transactionalCampaign]);

  useEffect(() => {
    AppMetrica.reportEvent('Open Payment Content Modal');
    calculateDiscountCall();
  }, []);

  // Эффект для перерасчета при изменении промокода или бонусных баллов
  useEffect(() => {
    if (!isFirstLoad) {
      calculateDiscountCall();
    }
  }, [toggled, promoCodeId, maxPoints]);

  const handlePromoPress = (promo: IPersonalPromotion) => {
    if (!promo) {
      return;
    }
    setPromocode(promo.code);
    applyPromoCode(promo.code);
  };

  const handlePayment = () => {
    if (!order) return;

    onClose();

    navigateBottomSheet('PaymentLoading', {
      user,
      order,
      discount,
      usedPoints: toggled ? maxPoints : 0,
      promoCodeId,
      loadUser,
      freeOn,
      paymentMethod,
      finalOrderCost,
    });
  };

  const handleApplyPromocode = () => {
    if (inputCodeValue && inputCodeValue.trim().length > 0) {
      applyPromoCode(inputCodeValue);
    }
  };

  // Проверяем, можно ли нажать кнопку оплаты
  const isPaymentDisabled = isFirstLoad || isDiscountLoading || !order || freeOn;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {freeOn && (
        <Text style={styles.title}>
          {t('app.payment.vacuumActivation')}
        </Text>
      )}

      {
        !freeOn
        &&
        <View style={styles.paymentCard}>
          <PaymentSummary
            order={order}
            user={user}
            selectedPos={selectedPos}
            finalOrderCost={freeOn ? 0 : finalOrderCost}
            cashbackAmount={cashbackAmount}
            isCashbackLoading={isFirstLoad || isDiscountLoading}
          />

          <View style={styles.choice}>
            {!freeOn && (
              <>
                {selectedPos?.IsLoyaltyMember && (
                  <PointsToggle
                    user={user}
                    order={order}
                    discount={discount}
                    toggled={toggled}
                    onToggle={togglePoints}
                    applyPoints={applyPoints}
                    maxPoints={maxPoints}
                  />
                )}

                <PromocodeSection
                  promocode={inputCodeValue}
                  onPromocodeChange={setPromocode}
                  onApplyPromocode={handleApplyPromocode}
                  promoError={promoError}
                  isMutating={isMutating}
                  discount={discount}
                  quickPromoSelect={handlePromoPress}
                  quickPromoDeselect={() => setPromocode(undefined)}
                />
              </>
            )}

            <View style={styles.badgesContainer}>
              {transactionalCampaign && (
                <View style={styles.badgeWrapper}>
                  <Button
                    label={`${transactionalCampaign.campaignName}: ${transactionalCampaign.discountAmount}₽`}
                    color="blue"
                    width={184}
                    height={31}
                    fontSize={12}
                    fontWeight={'600'}
                  />
                </View>
              )}

              {/* Бейдж для использованных баллов */}
              {/* {usedPoints > 0 && (
                <View style={styles.badgeWrapper}>
                  <Button
                    label={t('app.payment.usedPoints', {usedPoints})}
                    color="blue"
                    width={184}
                    height={31}
                    fontSize={10}
                    fontWeight={'600'}
                  />
                </View>
              )} */}

              {/* Бейдж для промокода */}
              {/* {discount && (
                <View style={styles.badgeWrapper}>
                  <Button
                    label={`${t('app.payment.havePromocodeFor')} ${discount.discount}${discount.type === 'CASH' ? '₽' : '%'}`}
                    color="blue"
                    width={184}
                    height={31}
                    fontSize={10}
                    fontWeight={'600'}
                  />
                </View>
              )} */}
            </View>
          </View>

          <PaymentMethods
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
          />

        </View>
      }

      <View style={styles.paymentActions}>
        {freeOn ? (
          <Button
            label={t('common.buttons.activate')}
            onClick={handlePayment}
            color="blue"
            height={43}
            width={'100%'}
            fontSize={18}
            fontWeight={'600'}
            showLoading={loading}
          />
        ) : (
          <Button
            label={t('common.buttons.pay')}
            price={`${finalOrderCost}₽`}
            onClick={handlePayment}
            color="blue"
            height={43}
            width={'100%'}
            fontSize={18}
            fontWeight={'600'}
            priceFontSize={18}
            priceFontWeight={'500'}
            showLoading={loading || isDiscountLoading}
            disabled={isPaymentDisabled}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingBottom: dp(30),
    flexGrow: 1,
  },
  title: {
    fontSize: dp(24),
    fontWeight: '600',
    color: '#000',
    marginBottom: dp(12),
    textAlign: 'center',
    paddingHorizontal: dp(16),
  },
  paymentCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: dp(25),
    paddingHorizontal: dp(16),
    paddingVertical: dp(10),
    marginHorizontal: dp(16),

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  choice: {
    marginTop: dp(15),
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: dp(10),
  },
  badgeWrapper: {
    paddingTop: dp(15),
    marginRight: dp(10),
  },
  paymentActions: {
    alignItems: 'center',
    marginBottom: dp(40),
    marginTop: dp(20),
    paddingHorizontal: dp(16),
    width: '100%',
  },
  cancelButton: {
    marginTop: dp(12),
    padding: dp(8),
  },
  cancelText: {
    fontSize: dp(12),
    textDecorationLine: 'underline',
    color: '#666',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dp(10),
  },
  itemName: {
    fontWeight: '700',
    fontSize: dp(15),
    color: 'rgba(0, 0, 0, 1)',
    flexShrink: 1,
    flex: 1,
    flexWrap: 'wrap',
  },
  itemPrice: {
    color: 'rgba(0, 0, 0, 1)',
    fontWeight: '700',
    fontSize: dp(16),
  },
});

export default PaymentContent;