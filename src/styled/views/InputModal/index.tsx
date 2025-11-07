import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {dp} from '../../../utils/dp';
import {Button} from '@styled/buttons';
import Modal from '@styled/Modal';
import {useTranslation} from 'react-i18next';

interface ILoadingModal {
  isVisible: boolean;
  title: string;
  text: string;
  inputText: string;
  onClick: () => void;
}

const InputModal = (props: ILoadingModal) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    setModalVisible(props.isVisible);
  }, [props.isVisible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}
      onClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{props.title}</Text>
          <Text style={styles.modalText}>{props.text}</Text>
          <TextInput
            placeholder={props.inputText}
            value={input}
            onChangeText={text => setInput(text)}
          />
          <View style={styles.actionButtons}>
            <View>
              <Button
                onClick={props.onClick}
                label={t('common.buttons.activate')}
                color="blue"
                width={129}
                height={42}
                fontSize={18}
                fontWeight="600"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 38,
    width: dp(341),
    height: dp(222),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontWeight: '500',
    fontSize: dp(14),
    paddingBottom: dp(3),
  },
  modalText: {
    fontSize: dp(12),
    paddingTop: dp(16),
    fontWeight: '400',
    textAlign: 'center',
    color: '#000',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: dp(27),
  },
});

export {InputModal};
