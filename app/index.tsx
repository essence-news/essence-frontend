import { Redirect } from "expo-router";
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Analytics: {
    Pinpoint: {
      appId: '6b4a7558e1c044109085f007534b134d',
      region: 'us-east-1'
    }
  }
});

export default function RootLayout() {
  return <Redirect href="/home" />;
}
