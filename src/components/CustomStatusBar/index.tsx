import {StatusBar} from 'react-native';
import {useTheme} from '@context/ThemeProvider';

const CustomStatusBar = () => {
  const {theme} = useTheme();

  const statusBarStyle =
    theme.themeMode === 'default' ? 'dark-content' : 'light-content';

  return <StatusBar barStyle={statusBarStyle} />;
};

export default CustomStatusBar;
