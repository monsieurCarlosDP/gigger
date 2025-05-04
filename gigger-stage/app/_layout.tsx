import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ServiceContexProvider } from '@/src/context/service-context';
import { ReactQueryContextProvider } from '@/src/context/react-query-context/react-query-context';
import ReactQuerySetupSingleton from '@/src/context/react-query-context/react-query-setup-singleton';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ReactQueryContextProvider
        reactQuerySetupSingleton={ReactQuerySetupSingleton.getInstance()}    >
        <ServiceContexProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Setlist' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ServiceContexProvider>
      </ReactQueryContextProvider>
    </ThemeProvider>
  );
}
