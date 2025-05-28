import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ServiceContexProvider } from '@/src/context/service-context';
import { ReactQueryContextProvider } from '@/src/context/react-query-context/react-query-context';
import ReactQuerySetupSingleton from '@/src/context/react-query-context/react-query-setup-singleton';
import { AuthContextProvider, useAuthContext } from '@/src/context/auth-context';

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

const ScreenLayout = () => {

  const {isLogged} = useAuthContext();
  console.log("HOLO")

/*   if(isLogged) return <Redirect href="/(tabs)"/>

  return <Stack>
    <Stack.Screen name="Login" />
  </Stack>
   */
  return <Stack>
            <Stack.Protected guard={isLogged}>
                <Stack.Screen name="(tabs)" options={{
                  headerShown: false
                }}/>
            </Stack.Protected>
            <Stack.Protected guard={!isLogged}>
                <Stack.Screen name="index" options={{
                  title: 'Login'
                }}/>
            </Stack.Protected>
          </Stack>
}

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ReactQueryContextProvider
        reactQuerySetupSingleton={ReactQuerySetupSingleton.getInstance()}    >
        <ServiceContexProvider>
          <AuthContextProvider>
            <ScreenLayout />
          </AuthContextProvider>
          <StatusBar style="auto" />
        </ServiceContexProvider>
      </ReactQueryContextProvider>
    </ThemeProvider>
  );
}
