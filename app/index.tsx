import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRootNavigationState, Redirect, router } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

export default function RootLayout() {
  const rootNavigationState = useRootNavigationState();

  const init = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      router.push("/player");
    } else {
      router.push("/sign-in");
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (!rootNavigationState?.key) return null;

  return <Text>Index</Text>;
}
