import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/app/context/CartContext";
import { PaperProvider } from "react-native-paper";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import notifee from "@notifee/react-native";
import { updateFirebaseToken } from "@/services";
import messaging from "@react-native-firebase/messaging";

SplashScreen.preventAutoHideAsync();

function AppRoutes() {
  const { authorized } = useAuth();

  useEffect(() => {
    if (authorized) {
      router.replace("/(tabs)");
    } else {
      router.replace("/auth/login");
    }
  }, [authorized]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen
        name="cart/cart"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="menu/detail" options={{ headerShown: false }} />
      <Stack.Screen name="my-order/detail" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    "Crimson-Text": require("../assets/fonts/CrimsonText-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      const _updateFirebaseToken = async () => {
        try {
          const token = await messaging().getToken();
          if (token) {
            updateFirebaseToken(token);
          }
        } catch (error) {
          console.error("Error getting Firebase token:", error);
        }
      };

      _updateFirebaseToken();

      const unsubscribe = messaging().onTokenRefresh((token) => {
        if (token) {
          updateFirebaseToken(token);
        }
      });

      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") {
      const unsubscribe = messaging().onMessage(async (message) => {
        const { title, body } = message.notification!;
        Alert.alert(title ?? "Title", body);
      });

      return unsubscribe;
    }
  }, []);

  if (!loaded) {
    return null;
  }

  if (Platform.OS !== "web") {
    messaging().setBackgroundMessageHandler(async (message) => {
      const { title, body } = message.notification!;
      await notifee.displayNotification({
        title: title,
        body: body,
      });
    });
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={theme}>
          <CartProvider>
            <PaperProvider>
              <AppRoutes />
            </PaperProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
