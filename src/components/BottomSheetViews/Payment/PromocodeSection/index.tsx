import React, {useState, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import {dp} from '@utils/dp.ts';
import PromotionsSlider from '@components/BottomSheetViews/Payment/PromotionsSlider';
import {IPersonalPromotion} from '@app-types/models/PersonalPromotion.ts';
import {useTranslation} from 'react-i18next';

interface PromocodeSectionProps {
  promocode: string | undefined;
  onPromocodeChange: (text: string) => void;
  onApplyPromocode: () => void;
  promoError: string | null;
  isMutating: boolean;
  discount: any;
  quickPromoSelect: (promo: IPersonalPromotion) => void;
  quickPromoDeselect: () => void;
}

const PromocodeSection: React.FC<PromocodeSectionProps> = ({
  promocode,
  onPromocodeChange,
  onApplyPromocode,
  promoError,
  isMutating,
  discount,
  quickPromoSelect,
  quickPromoDeselect,
}) => {
  const {t} = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const hasPromocode = !!promocode && promocode.trim().length > 0;
  
  const isSubmitEnabled = hasPromocode && !isMutating;

  const handleSubmit = () => {
    if (isSubmitEnabled) {
      onApplyPromocode();
    }
  };

  const handleTextChange = (text: string) => {
    if (discount && text.length > 0) {
      quickPromoDeselect();
    }
    
    onPromocodeChange(text);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={t('app.promos.promocode')}
            placeholderTextColor="#8B8B8C"
            value={promocode || ''}
            onChangeText={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={true}
            returnKeyType="done"
            autoCapitalize="characters"
            onSubmitEditing={handleSubmit}
          />
          
          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={!isSubmitEnabled}
            style={styles.submitButton}
          >
              <Image
                source={require('../../../../assets/icons/carbon_next-filled.png')}
                style={[
                  styles.submitIcon,
                ]}
                resizeMode="contain"
              />
          </TouchableOpacity>
        </View>

        {!isMutating && (discount || promoError) && (
          <View style={styles.statusContainer}>
            {discount ? (
              <Text style={styles.successText}>
                {t('app.promos.promocodeApplied')}
              </Text>
            ) : (
              <Text style={styles.errorText}>
                {t('app.promos.promocodeNotFound')}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* <PromotionsSlider
        value={promocode}
        onSelect={quickPromoSelect}
        onDeselect={quickPromoDeselect}
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: dp(25),
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: dp(42),
    paddingHorizontal: dp(15),
    borderRadius: dp(10),
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    fontSize: dp(12),
    fontWeight: '400',
    color: '#000000',
    padding: 0,
    height: '100%',
  },
  submitButton: {
    width: dp(28),
    height: dp(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitIcon: {
    width: dp(24),
    height: dp(24),
  },
  statusContainer: {
    // marginTop: dp(6),
    minHeight: dp(18),
  },
  successText: {
    fontSize: dp(10),
    color: '#0B68E1',
    fontWeight: '500',
    marginLeft: dp(15),
  },
  errorText: {
    fontSize: dp(10),
    color: '#FF3B30',
    fontWeight: '500',
    marginLeft: dp(15),
  },
});

export default PromocodeSection;