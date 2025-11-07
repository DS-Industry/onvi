import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Button} from '@styled/buttons';
import {dp} from '../../utils/dp';

import Modal from '@styled/Modal';
import {useTranslation} from 'react-i18next';

export interface IInputData {
  placeholder: string;
  inputType?: string;
}

export interface IPromoCodeData {
  code: string;
}

export interface IPromoModalProps {
  isVisible?: boolean;
  type?: 'input' | 'promo_code';
  title: string;
  content: string;
  inputData?: IInputData;
  promoCodeData?: IPromoCodeData;
  buttonText: string;
  onClose?: () => void;
  onConfirm?: (data?: string) => void;
}

const PromoModal: React.FC<IPromoModalProps> = ({
  type,
  isVisible,
  title,
  content,
  inputData,
  promoCodeData,
  buttonText,
  onClose = () => {},
  onConfirm = () => {},
}) => {
  const {t} = useTranslation();

  const [inputText, setInputText] = useState('');

  const handleConfirm = () => {
    if (type === 'input') {
      onConfirm(inputText);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible ?? false}
      transparent={true}
      onClose={onClose}
      title={title}
      titleStyle={styles.modalTitle}
      modalStyles={{
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {type === 'input' ? (
        <>
          <Text style={styles.modalText}>{content}</Text>
          {inputData && (
            <TextInput
              style={styles.inputField}
              placeholder={inputData.placeholder}
              value={inputText}
              onChangeText={setInputText}
            />
          )}
        </>
      ) : type === 'promo_code' ? (
        <>
          <Text style={styles.modalText}>{content}</Text>
          {promoCodeData && (
            <Text style={styles.modalText}>{promoCodeData.code}</Text>
          )}
        </>
      ) : (
        <Text style={styles.modalText}>{content}</Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: dp(10),
          width: '100%',
        }}>
        <Button
          label={t('common.buttons.close')}
          width={dp(150)}
          height={dp(40)}
          onClick={onClose}
          color={'grey'}
          fontSize={dp(12)}
        />

        <Button
          label={buttonText}
          width={dp(150)}
          height={dp(40)}
          onClick={handleConfirm}
          color={'blue'}
          fontSize={dp(12)}
        />
      </View>

      {/*<View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X stroke={'rgba(0, 0, 0, 0.5)'} />
            </TouchableOpacity>
          </View>

          {type === 'input' ? (
            <>
              <Text style={styles.modalText}>{content}</Text>
              {inputData && (
                <TextInput
                  style={styles.inputField}
                  placeholder={inputData.placeholder}
                  value={inputText}
                  onChangeText={setInputText}
                />
              )}
            </>
          ) : type === 'promo_code' ? (
            <>
              <Text style={styles.modalText}>{content}</Text>
              {promoCodeData && (
                <Text style={styles.modalText}>{promoCodeData.code}</Text>
              )}
            </>
          ) : (
            <Text style={styles.modalText}>{content}</Text>
          )}
          <Button
            label={buttonText}
            width={dp(125)}
            onClick={handleConfirm}
            color={'blue'}
            fontSize={dp(12)}
          />
        </View>
      </View>*/}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'green',
    padding: dp(20),
    borderRadius: dp(10),
    alignItems: 'center',
    width: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalTitle: {
    textAlign: 'auto',
    fontSize: dp(18),
    fontWeight: 'bold',
    marginBottom: dp(10),
    alignSelf: 'center',
    color: 'black',
  },
  modalText: {
    alignSelf: 'flex-start',
    fontSize: dp(14),
    marginBottom: dp(15),
    color: 'black',
  },
  inputField: {
    borderWidth: 1,
    borderRadius: dp(15),
    borderColor: 'gray',
    padding: dp(10),
    marginBottom: dp(15),
    width: '100%',
  },
});

export default PromoModal;
