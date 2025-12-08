import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {Button} from '@styled/buttons';
import useStore from '@state/store';
import PaymentMethods from '@components/PaymentMethods';
import PaymentSummary from '@components/BottomSheetViews/Payment/PaymentSummary';
import PointsToggle from '@components/BottomSheetViews/Payment/PointsToggle';
import {useBonusPoints} from '@hooks/useBonusPoints.ts';
import {usePaymentProcess} from '@hooks/usePaymentProcess.ts';
import PromocodeSection from '@components/BottomSheetViews/Payment/PromocodeSection';
import {usePromoCode} from '@hooks/usePromoCode.ts';
import {
  calculateActualDiscount,
  calculateActualPointsUsed,
  calculateFinalAmount,
} from '@utils/paymentHelpers.ts';
import AppMetrica from '@appmetrica/react-native-analytics';
import { DiscountType, IPersonalPromotion } from '@app-types/models/PersonalPromotion';
import { navigateBottomSheet } from '@navigators/BottomSheetStack';
import { dp } from '@utils/dp';

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

  const {
    inputCodeValue,
    discount,
    promoError,
    isMutating,
    promoCodeId,
    setPromocode,
    applyPromoCode,
    debouncedApplyPromoCode,
  } = usePromoCode(order?.posId || 0);

  const { usedPoints, toggled, applyPoints, togglePoints } = useBonusPoints(
    user,
    order,
    discount,
  );

  const { loading, setPaymentMethod, paymentMethod } = usePaymentProcess(
    user!,
    order,
    discount,
    usedPoints,
    promoCodeId,
    loadUser,
  );

  useEffect(() => {
    AppMetrica.reportEvent('Open Payment Content Modal');
  }, []);

  const handlePromoPress = (promo: IPersonalPromotion) => {
    if (!promo) {
      return;
    }
    setPromocode(promo.code);
    applyPromoCode(promo.code);
  };

  useEffect(() => {
    if (!order?.sum) return;

    const actualDiscount = calculateActualDiscount(discount, order.sum);
    const actualPoints = calculateActualPointsUsed(
      order.sum,
      actualDiscount,
      usedPoints,
    );
    const finalSum = calculateFinalAmount(
      order.sum,
      actualDiscount,
      actualPoints,
    );
    setFinalOrderCost(finalSum);
  }, [order?.sum, discount, usedPoints, toggled, user]);

  const handlePayment = () => {
    if (!order) return;

    // Закрываем модалку перед переходом
    onClose();

    // Переход на экран загрузки оплаты
    navigateBottomSheet('PaymentLoading', {
      user,
      order,
      discount,
      usedPoints,
      promoCodeId,
      loadUser,
      freeOn,
      paymentMethod,
    });
  };

  const handleApplyPromocode = () => {
    if (inputCodeValue && inputCodeValue.trim().length > 0) {
      applyPromoCode(inputCodeValue);
    }
  };

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

      <View style={styles.paymentCard}>
        <PaymentSummary
          order={order}
          user={user}
          selectedPos={selectedPos}
          finalOrderCost={freeOn ? 0 : finalOrderCost}
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

          {/* <View style={styles.row}>
            <Text style={styles.itemName}>Итого</Text>
            <Text style={styles.itemPrice}>{freeOn ? '0' : finalOrderCost} ₽</Text>
          </View> */}

          <View style={styles.badgesContainer}>
            {/* {discount && !freeOn ? (
              <View style={styles.badgeWrapper}>
                <Button
                  label={`${t(
                    'app.payment.havePromocodeFor',
                  ).toUpperCase()} ${discount.type === DiscountType.CASH
                      ? discount.discount + '₽'
                      : discount.discount + '%'
                    }`}
                  color="blue"
                  width={184}
                  height={31}
                  fontSize={10}
                  fontWeight={'600'}
                />
              </View>
            ) : null} */}

            {/* {usedPoints ? (
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
              ) : null} */}
          </View>
        </View>
        
        {!freeOn && (
          <PaymentMethods
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
          />
        )}
      </View>

      <View style={styles.paymentActions}>
        <Button
          label={
            freeOn
              ? t('common.buttons.activate')
              : t('app.payment.payAmount', { finalOrderCost })
          }
          onClick={handlePayment}
          color="blue"
          height={43}
          fontSize={18}
          fontWeight={'600'}
          showLoading={loading}
        />

        {/* <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>
            {t('app.payment.cancelOrder')}
          </Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: dp(30),
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: dp(30),
    height: dp(30),
    borderRadius: dp(15),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dp(10),
  },
  closeButtonText: {
    fontSize: dp(24),
    color: '#666',
    lineHeight: dp(28),
  },
  title: {
    fontSize: dp(24),
    fontWeight: '600',
    color: '#000',
    marginBottom: dp(12),
  },
  paymentCard: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    borderRadius: dp(25),
    paddingHorizontal: dp(16),
    paddingVertical: dp(10),

    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: {
    //       width: 0,
    //       height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 3.84,
    //   },
    //   android: {
    //     elevation: 5,
    //   },
    // }),
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
    marginBottom: dp(20),
    marginTop: dp(20),
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