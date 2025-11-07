import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {dp} from '../../../utils/dp';
import Modal from '@styled/Modal';

interface ILoadingModal {
  isVisible: boolean;
  color: string;
  modalStyle: StyleProp<ViewStyle>;
  textStyle: object;
  status: 'start' | 'processing' | 'end' | 'waiting_payment' | 'polling';
  stageText: {
    start: string;
    processing: string;
    end: string;
    waiting_payment: string;
    polling: string;
  };
}

enum loadingState {
  start = 'https://storage.yandexcloud.net/onvi-mobile/Saly-39loading_in_process.png',
  processing = 'https://storage.yandexcloud.net/onvi-mobile/Saly-39loading_in_process.png',
  waiting_payment = 'https://storage.yandexcloud.net/onvi-mobile/Saly-39loading_in_process.png',
  polling = 'https://storage.yandexcloud.net/onvi-mobile/Saly-39loading_in_process.png',
  end = 'https://storage.yandexcloud.net/onvi-mobile/success_loading.png',
}

const LoadingModal = (props: ILoadingModal) => {
  const [loaderState, setLoaderState] = useState({
    text: props.stageText.start,
    imageUri: loadingState.start,
    state: 'start',
  });

  useEffect(() => {
    switch (props.status) {
      case 'start':
        setLoaderState({
          text: props.stageText.start,
          imageUri: loadingState.start,
          state: 'start',
        });
        break;
      case 'processing':
        setLoaderState({
          text: props.stageText.processing,
          imageUri: loadingState.processing,
          state: 'processing',
        });
        break;
      case 'waiting_payment':
        setLoaderState({
          text: props.stageText.waiting_payment,
          imageUri: loadingState.waiting_payment,
          state: 'end',
        });
        break;
      case 'polling':
        setLoaderState({
          text: props.stageText.polling,
          imageUri: loadingState.polling,
          state: 'end',
        });
        break;
      case 'end':
        setLoaderState({
          text: props.stageText.end,
          imageUri: loadingState.end,
          state: 'end',
        });
        break;
      default:
        break;
    }
  }, [props.status]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isVisible}
      statusBarTranslucent={true}
      onClose={() => {}}>
      <View style={[styles.container, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
        <View
          style={[
            styles.modalView,
            {
              backgroundColor:
                loaderState.state === 'end' ? '#BFFA00' : props.color,
            },
          ]}>
          <Image
            source={{uri: loaderState.imageUri}}
            style={styles.modalImage}
          />
          <Text style={[styles.modalText, props.textStyle]}>
            {loaderState.text}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0008',
    zIndex: 1000, // Ensure it's above other components
  },
  modalView: {
    height: dp(278),
    width: dp(341),
    borderRadius: dp(38),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: dp(135),
    height: dp(135),
  },
  modalText: {
    fontSize: dp(20),
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
});

export {LoadingModal};
