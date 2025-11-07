import {View, Image, Text, StyleSheet} from 'react-native';

import Modal from '@styled/Modal';

import {dp} from '@utils/dp';

import {YELLOW} from '@utils/colors';

import {Button} from '@styled/buttons';
import {useTranslation} from 'react-i18next';

interface TransferSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const TransferSuccessModal = ({
  visible,
  onClose,
}: TransferSuccessModalProps) => {
  const {t} = useTranslation();

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      modalStyles={{
        backgroundColor: YELLOW,
        borderRadius: dp(25),
      }}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/success_image.png')}
          style={styles.image}
        />
        <Text style={styles.titleText}>
          {t('app.transferBalance.transferWasSuccessful')}
        </Text>
      </View>
      <View
        style={{
          marginTop: dp(20),
          display: 'flex',
          alignItems: 'center',
        }}>
        <Button
          width={110}
          label={t('common.buttons.ok')}
          onClick={onClose}
          color="blue"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: dp(16),
    backgroundColor: YELLOW,
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    width: dp(248),
    height: dp(129),
    marginBottom: dp(16),
    resizeMode: 'contain',
  },

  titleText: {
    fontSize: dp(21),
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default TransferSuccessModal;
