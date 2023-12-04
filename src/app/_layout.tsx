import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

import { useMainStore } from "@/stores/main";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
/**
 * An adapted version of the material theme for the react navigation.
 */
const darkAdapted = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    text: MD3DarkTheme.colors.onBackground,
    background: MD3DarkTheme.colors.background,
    primary: MD3DarkTheme.colors.primary,
    border: MD3DarkTheme.colors.outline,
  },
};

/**
 * An adapted version of the material theme for the react navigation.
 */
const lightAdapted = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: MD3LightTheme.colors.onBackground,
    background: MD3LightTheme.colors.background,
    primary: MD3LightTheme.colors.primary,
    border: MD3LightTheme.colors.backdrop,
  },
};

export default function RootLayout() {
  const hydrated = useMainStore(state => state._hasHydrated);

  if (!hydrated) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider
      theme={colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme}
    >
      <ThemeProvider
        value={colorScheme === "dark" ? darkAdapted : lightAdapted}
      >
        <Stack>
          <Stack.Screen
            name="accounts/add"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="accounts/[account]"
            options={{ presentation: "modal" }}
          />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
