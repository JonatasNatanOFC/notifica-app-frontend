import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useContext } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import AuthProvider, { AuthContext } from '../context/AuthContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index', // app/index.tsx será a raiz
};

// Evita esconder a splash antes de carregar
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { userData } = useContext(AuthContext);

  // 🔹 Redireciona de acordo com login
  useEffect(() => {
    if (userData?.role === 'USER') {
      router.push('/(user)/minhasNotificacoes')
    }
  
    if (userData?.role === 'PREFECTURE') {
      console.log(userData);
      router.push('/(prefeitura)/notificacaoPrefeitura')
    }
  },[userData])

  // 🔹 Caso não esteja logado → libera telas públicas
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />   {/* Home inicial */}
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </ThemeProvider>
  );
}
