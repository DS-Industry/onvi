import React, {Suspense} from 'react';
import {DefaultTheme} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useStore from '@state/store';
import {createNavigationContainerRef} from '@react-navigation/native';

import {
  Main,
  Business,
  BusinessInfo,
  Boxes,
  Launch,
  Payment,
  AddCard,
  PostPayment,
  PostPaymentVacuum,
  PaymentLoading,
} from '@components/BottomSheetViews';

// Lazy load components

const Notifications = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.Notifications,
  })),
);
const History = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.History,
  })),
);
const Search = React.lazy(() =>
  import('@components/BottomSheetViews/Search').then(module => ({
    default: module.Search,
  })),
);
const Filters = React.lazy(() =>
  import('@components/BottomSheetViews/Filters').then(module => ({
    default: module.Filters,
  })),
);
const Post = React.lazy(() =>
  import('@components/BottomSheetViews/Post').then(module => ({
    default: module.Post,
  })),
);
const Campaign = React.lazy(() =>
  import('@components/BottomSheetViews/Campaign').then(module => ({
    default: module.Campaign,
  })),
);

import {RootStackParamList} from '@app-types/navigation/BottomSheetNavigation.ts';

import LoadingScreen from '@navigators/NavigatorLoader';
import {useNavStore} from '@state/useNavStore';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// const navigateBottomSheet = function (name: string, params: any) {
//   if (navigationRef.isReady()) {
//     if (name === 'Main') {
//       try {
//         navigationRef.reset({
//           index: 0,
//           routes: [{name, params}],
//         });
//       } catch (error) {
//         // Error handling removed
//       }
//     } else {
//       try {
//         navigationRef.navigate(name, params);
//       } catch (error) {
//         console.error('[NAVIGATION] Navigation error:', error);
//         console.debug('[NAVIGATION] Navigation parameters:', {name, params});
//       }
//     }
//   }
// };

const navigateBottomSheet = <T extends keyof RootStackParamList>(
  name: T,
  params: RootStackParamList[T],
) => {
  const currentRoute = navigationRef.current?.getCurrentRoute();
  if (currentRoute?.name !== name) {
    navigationRef.current?.navigate(name as any, params);
  }
};

interface BottomSheetStackInterface {
  active: boolean;
}

const BottomSheetStack = React.memo(({active}: BottomSheetStackInterface) => {
  const {setShowBurgerButton} = useStore.getState();

  const {setIsMainScreen, setCurrentRouteName} = useNavStore.getState();

  return (
    <NavigationContainer
      theme={navTheme}
      ref={navigationRef}
      independent={true}
      onStateChange={(navigationState: any) => {
        if (!navigationState) {
          return;
        }

        const currentRoute =
          navigationState.routes?.[navigationState.routes.length - 1];

        if (!currentRoute) {
          return;
        }

        setCurrentRouteName(currentRoute.name);

        if (
          navigationState.routes &&
          navigationState.routes.length &&
          currentRoute?.name === 'Main'
        ) {
          setIsMainScreen(true);
          setShowBurgerButton(true);
        } else if (
          currentRoute?.name === 'PostPayment' ||
          currentRoute?.name === 'PaymentLoading'
        ) {
          setShowBurgerButton(false);
        } else {
          setIsMainScreen(false);
          setShowBurgerButton(true);
        }
      }}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 300,
        }}
        initialRouteName="Main">
        <RootStack.Screen
          name="Main"
          key="MainScreen"
          component={Main}
          initialParams={{
            active,
          }}
        />
        <RootStack.Screen name="Search" key="SearchScreen">
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <Search />
            </Suspense>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Filters" key="FiltersScreen">
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <Filters />
            </Suspense>
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="Business"
          key="BusinessScreen"
          component={Business}
        />
        <RootStack.Screen
          name="BusinessInfo"
          key="BusinessInfoScreen"
          component={BusinessInfo}
        />
        <RootStack.Screen
          name="Boxes"
          key="BoxesScreen"
          component={Boxes}
          initialParams={{active}}
        />
        <RootStack.Screen
          name="Launch"
          key="LaunchScreen"
          component={Launch}
          initialParams={{active}}
        />
        <RootStack.Screen name="Notifications" key="NotificationsScreen">
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <Notifications />
            </Suspense>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="History" key="HistoryScreen">
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <History />
            </Suspense>
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="Payment"
          key="PaymentScreen"
          component={Payment}
        />
        <RootStack.Screen
          name="AddCard"
          key="AddCardScreen"
          component={AddCard}
        />
        <RootStack.Screen name="Post" key="PostScreen">
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <Post />
            </Suspense>
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Campaign" key="CampaignScreen">
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <Campaign />
            </Suspense>
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="PostPayment"
          key="PostPaymentScreen"
          component={PostPayment}
        />
        <RootStack.Screen
          name="PostPaymentVacuum"
          key="PostPaymentVacuumScreen"
          component={PostPaymentVacuum}
        />
        <RootStack.Screen
          name="PaymentLoading"
          key="PaymentLoadingScreen"
          component={PaymentLoading}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
});

export {BottomSheetStack, navigateBottomSheet};
