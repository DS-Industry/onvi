import {useEffect, useState} from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import useStore from '../../state/store.ts';
import {DdLogs} from '@datadog/mobile-react-native';

const RemoteNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const {setFcmToken} = useStore();

  const checkNotificationPermissionStatus = async (): Promise<boolean> => {
    try {
      const enabled = await messaging().hasPermission();
      return (
        enabled === messaging.AuthorizationStatus.AUTHORIZED ||
        enabled === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      DdLogs.error('Permission check error', {error});
      return false;
    }
  };

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const isEnabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (isEnabled) {
        setIsEnabled(true);
        await getDeviceToken();
      }
    } catch (error) {
      DdLogs.error('Permission request error', {error});
    }
  };

  const getDeviceToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const newToken = await messaging().getToken();
      setFcmToken(newToken);
    } catch (error) {
      DdLogs.error('Failed to get FCM token', {error});
    }
  };

  const handleNotification = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    if (!remoteMessage) {
      return;
    }
    if (remoteMessage.data?.postId) {
      // Навигация на экран поста
    }
  };

  useEffect(() => {
    async function setupNotifications() {
      const granted = await checkNotificationPermissionStatus();
      if (granted) {
        setIsEnabled(true);
        await getDeviceToken();
      } else {
        await requestUserPermission();
      }
    }
    setupNotifications();
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const unsubscribeOnMessage = messaging().onMessage(handleNotification);
    const unsubscribeOnNotificationOpened =
      messaging().onNotificationOpenedApp(handleNotification);
    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(
      async newToken => {
        setFcmToken(newToken);
      },
    );

    messaging().getInitialNotification().then(handleNotification);

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
      unsubscribeOnTokenRefresh();
    };
  }, [isEnabled]);

  return null;
};

export default RemoteNotifications;
