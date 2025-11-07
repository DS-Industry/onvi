import {View, Text, StyleSheet} from 'react-native';

import Modal from '@styled/Modal';

import {dp} from '@utils/dp';
import {Button} from '@styled/buttons';
import {useTranslation} from 'react-i18next';

interface TransferFailModalProps {
  visible: boolean;
  onClose: () => void;
}

const TransferFailModal = ({visible, onClose}: TransferFailModalProps) => {
  const {t} = useTranslation();

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View>
          <Text style={[styles.emoji]}>🤔</Text>
        </View>
        <View>
          <Text style={styles.message}>
            <Text style={styles.highlight}>{t('app.errors.error')}.</Text>
            {t('app.errors.contactSupport')}
          </Text>
        </View>
        <View
          style={{
            marginTop: dp(20),
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            width={180}
            label={t('common.buttons.retry')}
            onClick={onClose}
            color="blue"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: dp(60),
    padding: dp(30),
    height: dp(250),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleText: {
    fontSize: dp(60),
    fontWeight: '600',
    color: '#000',
  },
  emoji: {
    fontSize: 60,
  },
  message: {
    marginTop: dp(10),
    fontWeight: '500',
    fontSize: dp(16),
    textAlign: 'center',
  },
  highlight: {
    color: 'red',
  },
});

export default TransferFailModal;
