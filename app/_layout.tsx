import theme from "@/constants/theme";
import { AuthProvider } from "@/utils/AuthProvider";
import { Platform, StyleSheet, ScrollView } from "react-native";
import { SplashScreen } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { Slot } from "expo-router";
import { useEffect } from "react";

import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import {
  Nunito_200ExtraLight,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  Nunito_200ExtraLight_Italic,
  Nunito_300Light_Italic,
  Nunito_400Regular_Italic,
  Nunito_500Medium_Italic,
  Nunito_600SemiBold_Italic,
  Nunito_700Bold_Italic,
  Nunito_800ExtraBold_Italic,
  Nunito_900Black_Italic,
} from "@expo-google-fonts/nunito";
import {
  Comfortaa_300Light,
  Comfortaa_400Regular,
  Comfortaa_500Medium,
  Comfortaa_600SemiBold,
  Comfortaa_700Bold,
} from "@expo-google-fonts/comfortaa";
import { useFonts } from "expo-font";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MainContainer } from "@/components/SharedComponents";

export default function Root() {
  const [loaded, error] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Comfortaa_300Light,
    Comfortaa_400Regular,
    Comfortaa_500Medium,
    Comfortaa_600SemiBold,
    Comfortaa_700Bold,
    Nunito_200ExtraLight,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    Nunito_200ExtraLight_Italic,
    Nunito_300Light_Italic,
    Nunito_400Regular_Italic,
    Nunito_500Medium_Italic,
    Nunito_600SemiBold_Italic,
    Nunito_700Bold_Italic,
    Nunito_800ExtraBold_Italic,
    Nunito_900Black_Italic,
  });
  console.log({ loaded, error });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      if (Platform.OS === "web" && document)
        document.title = "Essence - Your own news player";
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  console.log({ loaded });
  if (!loaded) {
    return null;
  }
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container} edges={["top"]}>
            <MainContainer>
              {/* <ScrollView> */}
              <Slot />
              {/* </ScrollView> */}
            </MainContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
