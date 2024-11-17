import BrandHeader from "@/components/BrandHeader";
import {
  AppContainer,
  Button,
  ContentContainer,
  ErrorMessage,
  FormContainer,
  Header,
  Input,
  MainContent,
  SigninMainContent,
  SubtitleDark,
  Title,
  ButtonText
} from "@/components/SharedComponents";
import { useAuth } from "@/utils/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, Dimensions } from "react-native";

export default function Login() {
  const { login, verify } = useAuth();
  const [promptForToken, setPromptForToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstName, onChangeFirstName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [verificationCode, onChangeVerificationCode] = useState("");
  useEffect(() => {
    async function init() {
      const firstName = await AsyncStorage.getItem("firstName");
      await AsyncStorage.clear();
      if (firstName) {
        await AsyncStorage.setItem("firstName", firstName);
      }
    }
    init();
  }, []);
  const handleSignin = async () => {
    const signInResponse = await login(email, firstName, "GB", "EN");
    // const result = await verifyEmail(email, name);
    console.log({ signInResponse });
    setPromptForToken(true);
  };
  const handleVerify = async () => {
    setError("");
    setIsLoading(true);
    try {
      const success = await verify(email, verificationCode);
      if (success) {
        router.replace("/player");
      } else {
        throw new Error(
          "Verification failed. Please check your code and try again.",
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error.message || "An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View>
      {promptForToken ? (
        <>
          <BrandHeader />
          <AppContainer width={Dimensions.get('window').width} height={Dimensions.get('window').width}>
            <ContentContainer>
              <MainContent>
                <Header>
                  <Title>Verify Your Account</Title>
                </Header>
                <FormContainer>
                  <SubtitleDark>Enter the verification code</SubtitleDark>
                  <Input
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChangeText={onChangeVerificationCode}
                    // disabled={isLoading}
                    style={{ marginTop: 10 }}
                  />
                  {error ? <ErrorMessage>{error}</ErrorMessage> : <Text></Text>}
                  <Button onPress={handleVerify} disabled={isLoading}>
                    {isLoading ? <ButtonText>Verifying...</ButtonText> : <ButtonText>Verify</ButtonText>}
                  </Button>
                </FormContainer>
              </MainContent>
            </ContentContainer>
          </AppContainer>
        </>
      ) : (
        <>
          <BrandHeader />
          
          <AppContainer width={Dimensions.get('window').width} height={Dimensions.get('window').width}>
          
            <ContentContainer>
              <SigninMainContent>
                <Header>
                  <Title>Welcome</Title>
                  <SubtitleDark>Please sign in</SubtitleDark>
                </Header>
                <FormContainer>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={onChangeEmail}
                  />
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={onChangeFirstName}
                  />
                  {error ? <ErrorMessage>{error}</ErrorMessage> : <Text></Text>}
                  <Button onPress={handleSignin} disabled={isLoading}>
                    {isLoading ? <ButtonText>Signing In...</ButtonText> : <ButtonText>Sign In</ButtonText>}
                  </Button>
                </FormContainer>
              </SigninMainContent>
            </ContentContainer>
          </AppContainer>
        </>
      )}
    </View>
  );
}
