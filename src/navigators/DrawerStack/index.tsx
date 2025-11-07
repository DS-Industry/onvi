import React, {Suspense} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

import HomeScreen from './HomeScreen';

// Lazy load screens
const Promos = React.lazy(() =>
  import('@screens/Promos').then(module => ({default: module.Promos})),
);
const Settings = React.lazy(() =>
  import('@screens/Settings').then(module => ({default: module.Settings})),
);
const Favorites = React.lazy(() =>
  import('@screens/Favorites').then(module => ({default: module.Favorites})),
);
const About = React.lazy(() =>
  import('@screens/About').then(module => ({default: module.About})),
);
const PromosInput = React.lazy(() =>
  import('@screens/PromosInput').then(module => ({
    default: module.PromosInput,
  })),
);
const TransferBalance = React.lazy(() =>
  import('@screens/TransferBalance').then(module => ({
    default: module.TransferBalance,
  })),
);
const Legals = React.lazy(() =>
  import('@screens/Legals').then(module => ({default: module.Legals})),
);

import {useTheme} from '@context/ThemeProvider';
import useStore from '../../state/store';

//CustomDrawerContent
import {CustomDrawerContent} from './CustomDrawerContent';
import {DrawerNavProp} from '../../types/navigation/DrawerNavigation.ts';

import LoadingScreen from '@navigators/NavigatorLoader';

const DrawerStack = () => {
  const {theme} = useTheme();
  const {user} = useStore.getState();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: theme.mainColor,
        },
        lazy: true,
      }}
      initialRouteName={'Главная'}
      drawerContent={props => {
        return (
          <>
            {user && (
              <CustomDrawerContent
                navigation={props.navigation as unknown as DrawerNavProp}
                theme={theme}
                user={user}
              />
            )}
          </>
        );
      }}>
      <Drawer.Screen name="Главная" component={HomeScreen} />
      <Drawer.Screen name="Промокоды">
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <Promos />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Настройки">
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <Settings />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Избранное">
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <Favorites />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="О приложении">
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <About />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Ввод Промокода">
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <PromosInput />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Перенести баланс">
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <TransferBalance />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Правовые документы">
        {() => (
          <Suspense fallback={<LoadingScreen />}>
            <Legals />
          </Suspense>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default DrawerStack;
