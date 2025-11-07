import React, {Suspense} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoadingScreen from '@navigators/NavigatorLoader';
import {AuthStackParamList} from '@app-types/navigation/AuthNavigation.ts';

const SignIn = React.lazy(() =>
  import('@screens/SignIn').then(module => ({default: module.SignIn})),
);
const Verification = React.lazy(() =>
  import('@screens/Verification').then(module => ({
    default: module.Verification,
  })),
);

const RootStack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SignIn">
      <RootStack.Screen name="SignIn">
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <SignIn />
          </Suspense>
        )}
      </RootStack.Screen>
      <RootStack.Screen name="Verify">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <Verification {...props} />
          </Suspense>
        )}
      </RootStack.Screen>
    </RootStack.Navigator>
  );
};

export {AuthStack};
