import {TamaguiProvider as BaseTamaguiProvider} from '@tamagui/core';
import config from '../../../tamagui.config';

interface TamaguiProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark';
}

export default function TamaguiProvider({
  children,
  defaultTheme = 'light',
}: TamaguiProviderProps) {
  return (
    <BaseTamaguiProvider config={config} defaultTheme={defaultTheme}>
      {children}
    </BaseTamaguiProvider>
  );
}
