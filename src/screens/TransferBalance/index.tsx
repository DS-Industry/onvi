import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  TextInput,
  SafeAreaView,
  Pressable,
  Platform,
  Modal,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {dp} from '../../utils/dp';
import {useNavigation} from '@react-navigation/core';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import {getBalance} from '@services/api/balance';
import {transferBalance} from '@services/api/balance';
import TransferFailModal from '@components/TransferBalance/TransferFailModal';
import TransferSuccessModal from '@components/TransferBalance/TransferSuccessModal';
import TransferBalanceOnboardingStory from '@components/TransferBalance/OnboardingStory';
import useStore from '../../state/store';
import ScreenHeader from '@components/ScreenHeader';

type FindBalanceResponse = {
  balance: number;
  balanceAfterTransfer: number;
  bonusAsPromo: number;
};

const TransferBalance = () => {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [balance, setBalance] = useState<FindBalanceResponse>();
  const {t} = useTranslation();
  const [error, setError] = useState<string>('');
  const [showContent, setShowContent] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [transferFailModal, setTransferFailModal] = useState(false);
  const [transferSuccessModal, setTransferSuccessModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const {loadUser} = useStore.getState();

  const url =
    'https://docs.google.com/document/d/1z4eILEuMX58WQRyf17mhU50NbH1A_QyosilFs18vqA4/edit?usp=sharing';

  const handlePress = () => {
    Linking.openURL(url).catch(() => {});
  };

  const navigation =
    useNavigation<GeneralDrawerNavigationProp<'Перенести баланс'>>();

  const formatCardNumber = (text: string) => {
    setError('');
    const digits = text.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1-');
    setCardNumber(formatted);
  };

  const findBalance = async () => {
    setError('');

    if (cardNumber.replaceAll('-', '').length < 4) {
      setError(t('app.transferBalance.minSymbolsError'));
      setBalance(undefined);
      return;
    }

    getBalance({
      devNomer: cardNumber.replaceAll('-', ''),
    })
      .then(data => {
        setBalance({
          balance: data.airBalance + data.realBalance,
          balanceAfterTransfer: data.realBalance ?? 0,
          bonusAsPromo: data.airBalance ?? 0,
        });
      })
      .catch(() => {
        setError(t('app.transferBalance.cardNotFound'));
        setBalance(undefined);
      });
  };

  const confirmTransfer = () => {
    setModalVisible(false);
    transfer();
  };

  const transfer = async () => {
    transferBalance({
      devNomer: cardNumber.replaceAll('-', ''),
      airBalance: balance?.bonusAsPromo ?? 0,
      realBalance: balance?.balanceAfterTransfer ?? 0,
    })
      .then(() => {
        setTransferSuccessModal(true);
      })
      .catch(() => {
        setTransferFailModal(true);
      });
  };

  const getButtonStyle = () => {
    if (balance?.balanceAfterTransfer === 0 && balance?.bonusAsPromo < 50) {
      return [styles.button, styles.disabledButton];
    }
    return styles.button;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? dp(40) : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <SafeAreaView style={styles.safeArea}>
            {(!showContent || showInstructions) && (
              <TransferBalanceOnboardingStory
                onComplete={() => {
                  setShowContent(true);
                  setShowInstructions(false);
                }}
                isManualTrigger={showInstructions}
              />
            )}

            <View style={styles.header}>
              <ScreenHeader
                screenTitle={t('app.transferBalance.transferBalance')}
                btnType="back"
                btnCallback={() => navigation.navigate('Главная')}
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.modalTitle}>
                {t('app.transferBalance.transferBalance')}
              </Text>

              {balance?.balance === 0 ? (
                <>
                  <Text style={styles.modalDescription}>
                    {t('app.transferBalance.zeroBalanceMessage')}
                  </Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Главная')}>
                    <Text style={styles.buttonText}>
                      {t('common.buttons.ok')}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.modalDescription}>
                    {!balance
                      ? t('app.transferBalance.description')
                      : t('app.transferBalance.cardFound')}
                  </Text>
                  <TouchableOpacity onPress={() => setShowInstructions(true)}>
                    <Text style={styles.instructionsLink}>
                      {t('app.transferBalance.howItWorks')}
                    </Text>
                    <Text style={styles.instructionsLink} onPress={handlePress}>
                      {t('app.transferBalance.transferRules')}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.cardInputContainer}>
                    <ImageBackground
                      source={require('../../assets/images/balance-transfer-input.png')}
                      style={styles.imageBackground}
                      resizeMode="cover">
                      <View style={styles.overlay}>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={[
                              styles.input,
                              error ? {color: 'red'} : undefined,
                            ]}
                            value={cardNumber}
                            onChangeText={formatCardNumber}
                            placeholder="xxxx-xxxx-xxxx"
                            keyboardType="numeric"
                            maxLength={19}
                            placeholderTextColor="#999"
                            editable={balance ? false : true}
                          />
                          {balance ? (
                            <Text style={{...styles.balanceText, marginTop: 0}}>
                              {balance?.balance} {t('common.labels.points')}
                            </Text>
                          ) : (
                            <></>
                          )}
                          {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                          ) : (
                            <></>
                          )}
                        </View>
                      </View>
                    </ImageBackground>
                  </View>

                  {balance ? (
                    <>
                      <View style={styles.cardInputContainer}>
                        <ImageBackground
                          source={require('../../assets/images/transfer-balance-success.png')}
                          style={styles.imageBackground}
                          resizeMode="cover">
                          <View style={styles.overlay}>
                            <View style={styles.inputContainer}>
                              <Text style={styles.balanceText}>
                                {t('app.transferBalance.balanceAfterTransfer')}{' '}
                                {'\n'}
                                {balance?.balanceAfterTransfer}{' '}
                                {t('common.labels.points')}
                              </Text>
                            </View>
                          </View>
                        </ImageBackground>
                      </View>

                      {balance?.bonusAsPromo > 0 &&
                        (balance?.bonusAsPromo < 50 ? (
                          <Text style={{marginTop: dp(10)}}>
                            💡 {balance?.bonusAsPromo}{' '}
                            {t('app.transferBalance.bonusPointsNotTransferred')}
                            .{' '}
                            {balance.balanceAfterTransfer === 0 &&
                              t('app.transferBalance.transferNotPossible')}
                            {balance.balanceAfterTransfer !== 0 &&
                              t('app.transferBalance.onlyRealBalance')}
                            .
                          </Text>
                        ) : (
                          <Text style={{marginTop: dp(10)}}>
                            💡 {balance?.bonusAsPromo}{' '}
                            {t('app.transferBalance.bonusesReturn')}
                            <Pressable
                              style={{display: 'flex', alignItems: 'flex-end'}}>
                              <Text
                                style={{
                                  color: 'blue',
                                  textDecorationLine: 'underline',
                                }}>
                                {t('navigation.promos')}
                              </Text>
                            </Pressable>
                          </Text>
                        ))}
                    </>
                  ) : (
                    <></>
                  )}

                  {!balance ? (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={findBalance}>
                      <Text style={styles.buttonText}>
                        {t('common.buttons.find')}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={getButtonStyle()}
                      onPress={() => setModalVisible(true)}
                      disabled={
                        balance.balanceAfterTransfer === 0 &&
                        balance.bonusAsPromo < 50
                      }>
                      <Text style={styles.buttonText}>
                        {t('common.buttons.transfer')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalOverlay} />
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    {t('app.transferBalance.modalTextPart1')}
                    <Text style={styles.instructionsLink} onPress={handlePress}>
                      {t('app.transferBalance.modalTextPart2')}
                    </Text>
                    {t('app.transferBalance.modalTextPart3')}
                  </Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={styles.buttonText}>
                        {t('common.buttons.cancel')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.buttonConfirm]}
                      onPress={confirmTransfer}>
                      <Text style={styles.buttonText}>
                        {t('common.buttons.yes')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <TransferFailModal
              visible={transferFailModal}
              onClose={() => {
                setTransferFailModal(false);
                setError('');
                setCardNumber('');
                setBalance(undefined);
              }}
            />
            <TransferSuccessModal
              visible={transferSuccessModal}
              onClose={() => {
                setTransferSuccessModal(false);
                setError('');
                setCardNumber('');
                setBalance(undefined);
                loadUser().then(() => {
                  navigation.navigate('Главная');
                });
              }}
            />
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: dp(16),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: dp(20),
    paddingBottom: dp(20),
    paddingTop: dp(50),
  },
  modalTitle: {
    fontSize: dp(24),
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: dp(16),
    marginTop: dp(8),
  },
  instructionsLink: {
    color: '#0B68E1',
    fontSize: dp(14),
    marginTop: dp(10),
    marginBottom: dp(5),
    textDecorationLine: 'underline',
  },
  helpButton: {
    width: dp(36),
    height: dp(36),
    borderRadius: dp(18),
    backgroundColor: '#0B68E1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  helpButtonText: {
    color: 'white',
    fontSize: dp(20),
    fontWeight: 'bold',
  },
  cardInputContainer: {
    position: 'relative',
    marginTop: dp(10),
  },
  imageBackground: {
    width: '100%',
    aspectRatio: 342 / 118,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 10,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    padding: dp(10),
    width: '100%',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: dp(20),
    fontWeight: '700',
    color: 'black',
  },
  balanceText: {
    paddingLeft: dp(10),
    fontSize: dp(18),
    fontWeight: '600',
    marginTop: dp(10),
    color: 'black',
  },
  errorText: {
    paddingLeft: dp(10),
    fontSize: dp(14),
    color: 'red',
    marginTop: dp(5),
  },
  button: {
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dp(10),
    marginBottom: dp(30),
    backgroundColor: '#3461FF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: dp(18),
    fontWeight: '600',
    color: '#FFF',
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: dp(24),
    textAlignVertical: 'center',
    letterSpacing: 0.2,
    color: '#000',
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '48%',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#ccc',
  },
  buttonConfirm: {
    backgroundColor: '#3461FF',
  },
});

export {TransferBalance};
