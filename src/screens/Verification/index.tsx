import React, {useEffect, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button} from '@styled/buttons';
import {Popup, PopupRefProps} from '@components/Popup';
import {useTheme} from '@context/ThemeProvider';
import useStore from '@state/store';
import {dp} from '@utils/dp';
import Spinner from 'react-native-loading-spinner-overlay/src';
import {YELLOW} from '@utils/colors.ts';
import CheckBox from '@react-native-community/checkbox';
import {openWebURL} from '@utils/openWebUrl.ts';
import {OtpInput} from 'react-native-otp-entry';
import {useRoute} from '@react-navigation/native';
import {GeneralAuthRouteProp} from '@app-types/navigation/AuthNavigation.ts';

const WAITING_TIME = 60;

interface VerificationProps {}
const Verification = ({}: VerificationProps) => {
  const route = useRoute<GeneralAuthRouteProp<'Verify'>>();
  const popRef = useRef<PopupRefProps>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const {sendOtp, register, login} = useStore.getState();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [otpInput, setOtpInput] = useState<string>('');
  const inputRef = useRef<any>(null);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(WAITING_TIME);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPersonalDataCollectionAccepted, setPersonalDataCollectionAccepted] =
    useState(true);

  const clear = () => inputRef.current?.clear();

  const verifyCode = async (otp: string) => {
    setLoading(true);
    if (otp.length === 4) {
      const res = await login(route.params.phone, otp);
      setLoading(false);
      if (!res) {
        setLoading(false);
        clear();
      }
      switch (res?.type) {
        case 'register-required':
          popRef.current?.scrollTo(-500);
          break;
        case 'wrong-otp':
          setLoading(false);
          break;
        default:
          break;
      }
    }
  };

  const activateButton = () => {
    setDisabled(false);
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (intervalRef.current && timer === 0) {
      stopTimer();
      activateButton();
    } else if (timer === WAITING_TIME) {
      startTimer();
    }
  }, [timer]);

  useEffect(() => {
    if (otpInput.length === 4) {
      verifyCode(otpInput);
    }
  }, [otpInput]);

  const scrollToButton = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[
          styles.keyboardAvoidingView,
          {backgroundColor: theme.mainColor},
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? dp(40) : 0}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.topContainer}>
            <Image source={require('../../assets/icons/small-icon.png')} />
          </View>
          <Spinner
            visible={loading}
            color={'#0B68E1'}
            size={'large'}
            overlayColor="rgba(0, 0, 0, 0.4)"
            textStyle={styles.spinnerText}
          />
          <View style={styles.middleContainer}>
            <Text style={[styles.text, {color: theme.textColor}]}>
              {t('app.auth.enterSmsCode')}
            </Text>
            <Text style={styles.descriptionText}>
              {t('app.auth.codeSentTo')} {route.params.phone}
            </Text>
            <OtpInput
              numberOfDigits={4}
              focusColor={YELLOW}
              onFocus={scrollToButton}
              onFilled={otp => setOtpInput(otp)}
              textInputProps={{
                accessibilityLabel: 'One-Time Password',
              }}
              type={'numeric'}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.pinCodeContainer,
              }}
            />
            <View style={styles.newCodeButtonContainer}>
              <Button
                label={t('app.auth.getNewCode')}
                color={!disabled ? 'blue' : 'grey'}
                disabled={!disabled ? false : true}
                onClick={() => {
                  setDisabled(true);
                  sendOtp(route.params.phone);
                  setTimer(60);
                }}
              />
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {t('app.auth.codeNotReceived')}
              </Text>
              <Text style={styles.timerText}>
                {t('app.auth.canGetNewIn', {timer})}
              </Text>
            </View>
          </View>
          <View style={styles.bottomContainer} />
        </ScrollView>
        <Popup background="white" ref={popRef}>
          <View style={styles.popupHeader}>
            <CheckBox
              value={isPersonalDataCollectionAccepted}
              onValueChange={newValue =>
                setPersonalDataCollectionAccepted(newValue)
              }
            />
            <Text style={styles.termsText}>
              {t('app.auth.dataProcessingConsent')}
            </Text>
          </View>
          <View style={styles.popupButtonContainer}>
            <Button
              label={t('common.buttons.register')}
              color="blue"
              disabled={!isPersonalDataCollectionAccepted}
              onClick={() => {
                setLoading(true);
                register(otpInput, route.params.phone, true, true);
                setLoading(false);
              }}
            />
          </View>
          <View style={styles.popupInfo}>
            <View style={styles.infoLine}>
              <Text style={styles.termsText}>
                {t('app.auth.byClickingRegister')}
              </Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.termsText}>{t('app.auth.acceptTerms')}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text
                style={[styles.termsText, styles.underlineText]}
                onPress={() =>
                  openWebURL(
                    'https://docs.google.com/document/d/1zqgcqbfsn7_64tUcD5iN7t9DkYt8YdqC/edit?usp=sharing&ouid=111405890257322006921&rtpof=true&sd=true',
                  )
                }>
                {t('app.auth.loyaltyProgram')}
              </Text>
            </View>
          </View>
        </Popup>
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
    paddingTop: dp(40),
  },
  topContainer: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: dp(20),
  },
  bottomContainer: {
    flex: 4,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: dp(20),
    width: dp(240),
  },
  text: {
    fontSize: dp(24),
  },
  descriptionText: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: dp(16),
  },
  otpContainer: {
    flexDirection: 'row',
    paddingLeft: dp(20),
    paddingRight: dp(40),
    marginTop: dp(40),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
  },
  pinCodeContainer: {
    width: dp(60),
    height: dp(60),
  },
  newCodeButtonContainer: {
    paddingTop: dp(40),
  },
  timerContainer: {
    paddingTop: dp(20),
    alignItems: 'center',
  },
  timerText: {
    alignSelf: 'center',
    fontSize: dp(14),
  },
  spinnerText: {
    zIndex: 9999,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: dp(20),
  },
  popupButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: dp(20),
  },
  termsText: {
    paddingLeft: dp(30),
    paddingRight: dp(30),
    fontSize: dp(16),
    fontWeight: '400',
    color: 'rgba(38, 38, 38, 1)',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  popupInfo: {
    flexDirection: 'column',
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {Verification};
