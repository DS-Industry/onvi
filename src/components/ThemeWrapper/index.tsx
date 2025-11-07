import {useTheme} from '@context/ThemeProvider';

const ThemeWrapper = ({children}: any) => {
  const {isLoadingTheme} = useTheme();

  if (isLoadingTheme) {
    return null;
  } else {
    return children;
  }
};

export default ThemeWrapper;
