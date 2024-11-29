import { useRootNavigationState, Redirect } from "expo-router";

export default function RootLayout() {
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return null;

  return <Redirect href="/home" />;
}
