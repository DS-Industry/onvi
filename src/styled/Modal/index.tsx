import React from 'react';
import {
  Modal as ModalView,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  children: React.ReactNode;
  title?: string;
  titleStyle?: object;
  maskHidden?: boolean;
  statusBarTranslucent?: boolean;
  bottomSheet?: boolean;
  modalStyles?: ViewStyle;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  animationType = 'slide',
  transparent = true,
  children,
  title,
  titleStyle,
  maskHidden = false,
  statusBarTranslucent = false,
  bottomSheet = false,
  modalStyles,
}) => {
  return (
    <ModalView
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose} // Ensure iOS handles close correctly
      statusBarTranslucent={statusBarTranslucent}>
      <View
        style={{
          ...styles.position,
          ...(maskHidden ? {} : styles.overlay),
        }}>
        <View
          style={[
            styles.modalContainer,
            bottomSheet ? styles.bottomSheetContainer : null,
            modalStyles ? modalStyles : null,
          ]}>
          {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {children}
        </View>
      </View>
    </ModalView>
  );
};

const styles = StyleSheet.create({
  position: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 1000,
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    position: 'relative', // Allow absolute positioning of the close button
  },
  bottomSheetContainer: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    marginHorizontal: 0,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Modal;
