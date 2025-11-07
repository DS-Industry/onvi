import React, {useEffect, useState} from 'react';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {AuthStack} from '@navigators/AuthStack';
import DrawerStack from '@navigators/DrawerStack';

import Toast from 'react-native-toast-message';
import {toastConfig} from '@styled/alerts/toasts';

import useStore from '../../state/store';
import {navigationRef} from '../../services/api/interceptors';
import {config} from '@navigators/DrawerStack/LinkingConfig.ts';
import {Linking} from 'react-native';
import branch from 'react-native-branch';

const Application = () => {
  const isAuthenticated = useStore().isAuthenticated;
  const [isReady, setIsReady] = useState(false);

  // Enhanced linking configurationr
  const linking: LinkingOptions<{}> = {
    prefixes: ['https://onvione.ru', 'http://onvione.ru', 'onvione://'],
    config,
    // Handle any custom URL processing if needed
    async getInitialURL() {
      // First check if app was opened from a deep link
      const url = await Linking.getInitialURL();
      if (url != null) {
        return url;
      }

      // Check if we have any stored state to restore
      return null;
    },
    subscribe(listener) {
      const onReceiveURL = ({url}: {url: string}) => listener(url);

      // Listen to incoming links from deep linking
      const subscription = Linking.addEventListener('url', onReceiveURL);

      return () => {
        // Clean up the event listener
        subscription.remove();
      };
    },
  };

  // Handle initial deep link
  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl) {
          // Log for debugging
        }

        // Mark navigation as ready
        setIsReady(true);
      } catch (e) {
        // Handle error if needed
        setIsReady(true);
      }
    };

    restoreState();

    const unsubscribeFromBranch = branch.subscribe(({error}) => {
      if (error) {
        return;
      }

      // Just log the deep link data for debugging

      // We don't need to do anything special with the params
      // The user will be sent to Home page or Login based on authentication status
    });

    return () => unsubscribeFromBranch();
  }, []);

  // Wait until we're ready to render
  if (!isReady) {
    return null; // or a splash screen
  }

  return (
    <>
      <NavigationContainer ref={navigationRef} linking={linking}>
        {!isAuthenticated ? <AuthStack /> : <DrawerStack />}
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export {Application};
