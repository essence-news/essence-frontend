import theme from "@/constants/theme";
import { AuthProvider } from "@/utils/AuthProvider";
import { Platform } from "react-native";
import { SplashScreen } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { EventProvider as OutsideEventProvider } from "react-native-outside-press";
import { usePathname } from "expo-router";

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
import { commonStyles, MainContainer } from "@/components/SharedComponents";
import { initGA, logPageView } from "@/utils/analytics";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Analytics: {
    Pinpoint: {
      appId: "6b4a7558e1c044109085f007534b134d",
      region: "us-east-1",
    },
  },
});

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

  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS === "web") {
      if (document) {
        document.title = "Essence - Your own news player";
      }
      initGA();
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "web" && pathname) {
      logPageView(pathname);
    }
  }, [pathname]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SafeAreaProvider>
          <OutsideEventProvider>
            <SafeAreaView style={commonStyles.flex_1} edges={["top"]}>
              <MainContainer>
                {/* <ScrollView> */}
                <Slot />
                {/* </ScrollView> */}
              </MainContainer>
            </SafeAreaView>
          </OutsideEventProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
