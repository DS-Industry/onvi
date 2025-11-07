import {useEffect, useState, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';

const useAppState = () => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  const previousAppState = useRef<AppStateStatus>(appState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        previousAppState.current === 'active' &&
        nextAppState === 'background'
      ) {
        // Logic when app goes to background
      }

      // Update appState and close modal
      setAppState(nextAppState);

      // Update ref with the latest app state
      previousAppState.current = nextAppState;
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Cleanup on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  return appState;
};

export default useAppState;
