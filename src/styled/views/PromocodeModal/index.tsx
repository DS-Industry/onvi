import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Button} from '@styled/buttons';

import {useTranslation} from 'react-i18next';
import {dp} from '../../../utils/dp';

interface IPromocodeModal {
  visible: boolean;
  onClose: () => void;
  promocode: string;
  handleSearchChange: (text: string) => void;
  apply: () => void;
  promocodeError: string | null;
  fetching: boolean;
}

const PromocodeModal = (props: IPromocodeModal) => {
  const {t} = useTranslation();
  const textInputRef = useRef<TextInput>(null);

  const handleOpenKeyboard = () => {
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  return (
    <Modal
      visible={props.visible}
      transparent={true}
      animationType="slide"
      onRequestClose={props.onClose}
      onShow={handleOpenKeyboard}>
      <TouchableWithoutFeedback onPress={props.onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
              <SafeAreaView style={styles.safeArea}>
                <Text style={styles.titleText}>
                  {t('app.promos.enterPromocode')}
                </Text>
                <View style={styles.textInputGroup}>
                  <TextInput
                    ref={textInputRef}
                    value={props.promocode}
                    placeholder={t('app.promos.promocode').toLocaleUpperCase()}
                    onChangeText={props.handleSearchChange}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    label={t('common.buttons.close')}
                    color={'blue'}
                    width={dp(140)}
                    height={dp(40)}
                    fontSize={dp(16)}
                    fontWeight={'600'}
                    onClick={() => props.onClose()}
                  />
                  <View style={{width: dp(14)}} />
                  <Button
                    label={t('common.buttons.apply')}
                    color={'blue'}
                    width={dp(140)}
                    height={dp(40)}
                    fontSize={dp(16)}
                    fontWeight={'600'}
                    disabled={false}
                    onClick={() => {
                      props.apply();
                    }}
                    showLoading={props.fetching}
                  />
                </View>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: dp(20),
    borderTopRightRadius: dp(20),
    padding: dp(20),
    width: '100%',
  },
  safeArea: {
    width: '100%',
  },
  titleText: {
    fontSize: dp(24),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: dp(20),
  },
  textInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: dp(15),
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: dp(22),
    paddingHorizontal: dp(10),
  },
  textInput: {
    flex: 1,
    height: dp(45),
    fontSize: dp(16),
    fontWeight: '500',
    color: '#3461FF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dp(43),
  },
  button: {
    backgroundColor: 'blue',
    width: dp(140),
    height: dp(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(10),
  },
  buttonText: {
    color: 'white',
    fontSize: dp(16),
    fontWeight: '600',
  },
});

export {PromocodeModal};
