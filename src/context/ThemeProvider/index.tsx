import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {defaultTheme, darkTheme} from '../../utils/theme';

interface ThemeContextType {
  themeMode: 'light' | 'dark';
  isLoadingTheme: boolean;
  toggleTheme: () => void;
  theme: typeof defaultTheme | typeof darkTheme;
}

const ThemeContext = createContext<ThemeContextType>(null!);

interface ThemeProviderProps {
  children: any;
}

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  const findOldTheme = async () => {
    const savedThemeMode = await AsyncStorage.getItem('themeMode');
    if (savedThemeMode === 'dark') {
      setThemeMode('light');
      setCurrentTheme(defaultTheme);
    } else {
      setThemeMode('light');
      setCurrentTheme(defaultTheme);
    }
    setIsLoadingTheme(false);
  };

  const toggleTheme = () => {
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
    const newTheme = newThemeMode === 'light' ? defaultTheme : darkTheme;

    setThemeMode(newThemeMode);
    setCurrentTheme(newTheme);
    AsyncStorage.setItem('themeMode', newThemeMode);
  };

  useEffect(() => {
    findOldTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isLoadingTheme,
        toggleTheme,
        theme: currentTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
