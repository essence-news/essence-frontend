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
  ButtonText,
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
  const [userFirstName, setUserFirstName] = useState("");
  useEffect(() => {
    async function init() {
      const user = await AsyncStorage.getItem("user");
      await AsyncStorage.clear();
      if (user) {
        await AsyncStorage.setItem("user", user);
        setUserFirstName(JSON.parse(user).first_name);
      }
    }
    init();
  }, []);
  const handleSignin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const signInResponse = await login(
        email.toLowerCase(),
        userFirstName || firstName,
        "GB",
        "EN",
      );
      // const result = await verifyEmail(email, name);
      console.log({ signInResponse });
      setPromptForToken(true);
    } catch (error) {
      console.error("sign in  error:", error);
      setError("An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerify = async () => {
    setError("");
    setIsLoading(true);
    try {
      const success = await verify(
        email.toLowerCase(),
        verificationCode,
        userFirstName || firstName,
      );
      if (success) {
        console.log("userFirstName", userFirstName);
        if (userFirstName) {
          console.log("will go to player");
          router.replace("/player");
        } else {
          console.log("will go to preferences");
          router.replace({
            pathname: "/preferences",
            params: {
              fromSignIn: "yes",
            },
          });
        }
      } else {
        throw new Error(
          "Verification failed. Please check your code and try again.",
        );
      }
    } catch (error) {
      console.error("Verify token error:", error);
      setError("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View>
      {promptForToken ? (
        <>
          <BrandHeader />
          <AppContainer
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height}
          >
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
                    {isLoading ? (
                      <ButtonText>Verifying...</ButtonText>
                    ) : (
                      <ButtonText>Verify</ButtonText>
                    )}
                  </Button>
                </FormContainer>
              </MainContent>
            </ContentContainer>
          </AppContainer>
        </>
      ) : (
        <>
          <BrandHeader />

          <AppContainer
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height}
          >
            <ContentContainer>
              <SigninMainContent>
                <Header>
                  <Title>Welcome {userFirstName ?? ""}</Title>
                  <SubtitleDark>Please sign in</SubtitleDark>
                </Header>
                <FormContainer>
                  {!userFirstName ? (
                    <Input
                      placeholder="First Name"
                      value={firstName}
                      onChangeText={onChangeFirstName}
                    />
                  ) : (
                    <Text></Text>
                  )}
                  <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => onChangeEmail(text.toLowerCase())}
                    autoCapitalize="none"
                  />
                  {error ? <ErrorMessage>{error}</ErrorMessage> : <Text></Text>}
                  <Button onPress={handleSignin} disabled={isLoading}>
                    {isLoading ? (
                      <ButtonText>Signing In...</ButtonText>
                    ) : (
                      <ButtonText>Sign In</ButtonText>
                    )}
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
