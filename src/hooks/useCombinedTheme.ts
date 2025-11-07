import {useTheme as useTamaguiTheme} from '@tamagui/core';
import {useTheme} from '@context/ThemeProvider';

export const useCombinedTheme = () => {
  const appTheme = useTheme();

  const tamaguiTheme = useTamaguiTheme();

  return {
    ...appTheme,
    tamaguiTheme,
    currentThemeName: appTheme.themeMode,

    get backgroundColor() {
      return tamaguiTheme.bg;
    },
    get textColor() {
      return tamaguiTheme.color;
    },
    get primaryColor() {
      return tamaguiTheme.primary;
    },
  };
};
