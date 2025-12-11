import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import useStore from '../../state/store';
import { Button } from '@styled/buttons';
import { dp } from '@utils/dp';

interface NotificationModalProps {
  animationType?: 'fade' | 'slide' | 'none';
  duration?: number;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  animationType = 'fade',
}) => {
  const {
    isNotificationModalOpen,
    notificationModalConfig,
    closeNotificationModal,
  } = useStore();

  if (!notificationModalConfig || !isNotificationModalOpen) {
    return null;
  }

  const {
    title,
    description,
    image,
    buttonText,
    onButtonPress,
    showCloseButton = true,
  } = notificationModalConfig;

  const handleButtonPress = () => {
    onButtonPress();
    closeNotificationModal();
  };

  const handleBackdropPress = () => {
    closeNotificationModal();
  };

  return (
    <Modal
      visible={isNotificationModalOpen}
      transparent
      animationType={animationType}
      onRequestClose={closeNotificationModal}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />

        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            {showCloseButton && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeNotificationModal}
                hitSlop={{ top: dp(10), bottom: dp(10), left: dp(10), right: dp(10) }}
              >
                <Image
                  source={require('@assets/icons/close-btn.png')}
                  style={styles.closeImg}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {image && (
              <Image
                source={typeof image === 'string' ? { uri: image } : image}
                style={styles.image}
                resizeMode="contain"
              />
            )}

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <View style={styles.buttonContainer}>
              <Button
                label={buttonText}
                onClick={handleButtonPress}
                color="blue"
                width={dp(259)}
              />
            </View>
          </View>
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
    position: 'absolute',
    top: dp(0),
    left: dp(0),
    right: dp(0),
    bottom: dp(0),
  },
  overlay: {
    position: 'absolute',
    top: dp(0),
    left: dp(0),
    right: dp(0),
    bottom: dp(0),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  contentWrapper: {
    width: '85%',
    maxWidth: dp(400),
    zIndex: 1,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: dp(16),
    padding: dp(16),
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: dp(0),
      height: dp(4),
    },
    shadowOpacity: 0.25,
    shadowRadius: dp(8),
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: dp(15),
    right: dp(15),
    zIndex: 2,
  },
  closeImg: {
    width: dp(11),
    height: dp(11),
  },
  image: {
    width: dp(120),
    height: dp(120),
    marginLeft: dp(14),
    marginBottom: dp(12),
  },
  title: {
    fontSize: dp(24),
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: dp(10),
    lineHeight: dp(24),
  },
  description: {
    fontSize: dp(16),
    color: 'gray',
    textAlign: 'left',
    marginBottom: dp(24),
    lineHeight: dp(24),
  },
  buttonContainer: {
    width: '100%',
    marginTop: dp(8),
    alignItems: 'center',
  },
});

export default NotificationModal;