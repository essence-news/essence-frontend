import { Redirect } from "expo-router";
import { Amplify } from 'aws-amplify';

// Configure Amplify using the auto-generated configuration
Amplify.configure({
  // Configuration will be automatically picked up from your Amplify setup
});

export default function RootLayout() {
  return <Redirect href="/home" />;
}
