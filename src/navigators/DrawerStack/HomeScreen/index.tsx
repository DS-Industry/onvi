import {useEffect} from 'react';

import {Home} from '@screens/Home';

import {useNavStore} from '@state/useNavStore';
import {DrawerNavProp} from '@app-types/navigation/DrawerNavigation.ts';

const HomeScreen = ({navigation}: {navigation: DrawerNavProp}) => {
  const setDrawerNavigation = useNavStore(state => state.setDrawerNavigation);

  useEffect(() => {
    setDrawerNavigation(navigation);
  }, [navigation, setDrawerNavigation]);

  return <Home />;
};

export default HomeScreen;
