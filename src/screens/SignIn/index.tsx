import React, {useState} from 'react';
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
import {useTranslation} from 'react-i18next';
import {Button} from '@styled/buttons';
import {PhoneInp} from '@styled/inputs';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@context/ThemeProvider';
import {dp} from '@utils/dp';
import useStore from '@state/store';
import {GeneralAuthNavigationProp} from '@app-types/navigation/AuthNavigation.ts';

const SignIn = () => {
  const {sendOtp} = useStore.getState();
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const navigation = useNavigation<GeneralAuthNavigationProp<'SignIn'>>();
  const [phone, setPhone] = useState('');

  const validate = (number: string) => {
    if (number.length === 18) {
      return true;
    }
    return false;
  };

  const login = async () => {
    if (validate(phone)) {
      setIsLoading(true);
      sendOtp(phone)
        .then(() => {
          setIsLoading(false);
          navigation.navigate('Verify', {phone: phone, type: 'register'});
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
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
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Image source={require('../../assets/icons/small-icon.png')} />
            </View>
            <View style={styles.middleContainer}>
              <Text style={[styles.text, {color: theme.textColor}]}>
                {t('app.auth.enterPhone')}
              </Text>
              <Text style={styles.descriptionText}>
                {t('app.auth.sendActivationCode')}
              </Text>
              <PhoneInp phoneNumber={phone} setPhoneNumber={setPhone} />
              <View style={styles.buttonContainer}>
                <Button
                  label={t('common.buttons.next')}
                  color={phone ? 'blue' : 'grey'}
                  disabled={phone ? false : true}
                  onClick={login}
                  showLoading={isLoading}
                />
              </View>
            </View>
            <View style={styles.bottomContainer} />
          </View>
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
    paddingTop: dp(40),
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: dp(20),
  },
  buttonContainer: {
    paddingTop: dp(70),
  },
});

export {SignIn};
