import styled from "styled-components/native";

import { useAuth } from "../utils/AuthProvider";
import { ScrollView, View } from "react-native";
import { Link, router } from "expo-router";
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";
import { ButtonText } from "@/components/SharedComponents";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import screenshot1 from "@/assets/screenshots/1.jpg";
import ecommercePic from "@/assets/cliparts/ecommerce.jpg";
import audioPic from "@/assets/cliparts/audio.jpg";
import hourglassPic from "@/assets/cliparts/hourglass.jpg";
import podcastPic from "@/assets/cliparts/podcast.jpg";

// Keep the existing styled components that are specific to Home
const HomeContainer = styled.View`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  color: #fff;
  padding: 32px;
  background: #333;
`;

const MainContent = styled.View<{ smallScreen: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.smallScreen ? "column" : "row")};
`;

const LeftSection = styled.View<{ smallScreen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: ${(props) => (props.smallScreen ? "100%" : "50%")};
  min-height: ${(props) => (props.smallScreen ? "90vh" : "initial")};
`;

const RightSection = styled.View<{ smallScreen: boolean }>`
  border-radius: 10px;
  margin-top: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primaryDark};
  max-width: ${(props) => (props.smallScreen ? "100%" : "50%")};
  min-height: ${(props) => (props.smallScreen ? "90vh" : "initial")};
  margin-left: ${(props) => (props.smallScreen ? "0" : "20px")};
  width: 100%;
`;

const InsightsSection = styled.View<{ smallScreen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.smallScreen ? "0" : "32px")};
  flex-direction: ${(props) => (props.smallScreen ? "column" : "row")};
`;

const InsightCard = styled.View<{ smallScreen: boolean }>`
  background: ${({ theme }) => theme.colors.primaryDark};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${(props) => (props.smallScreen ? "32px" : "48px")};
  padding: ${(props) => (props.smallScreen ? "32px 16px" : "32px")};
  flex: ${(props) => (props.smallScreen ? "none" : 1)};
`;

const Brand = styled.Text`
  font-family: "${({ theme }) => theme.fonts.brand}";
  font-size: 68px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.brand};
  margin-bottom: 32px;
  margin-top: 0;
`;

const Headline = styled.Text`
  font-family: "${({ theme }) => theme.fonts.heading}";
  font-size: 48px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
`;

const Subheadline = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
`;

const InsightTitle = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  font-size: 25px;
  font-weight: 400;
  margin-top: 0;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
`;

const InsightTitleSmall = styled.Text`
  font-family: "${({ theme }) => theme.fonts.heading}";
  font-size: 16px;
  margin: 0;
  color: ${({ theme }) => theme.colors.primaryLighter};
`;

const InsightSubtitle = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  font-size: 16px;
  color: ${({ theme }) => theme.colors.background};
  margin-bottom: 32px;
`;

const AppImage = styled.Image<{ smallScreen: boolean }>`
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  height: ${(props) => (props.smallScreen ? "60vh" : "800px")};
  max-width: ${(props) => (props.smallScreen ? "100%" : "500px")};
`;

const InsightImage = styled.Image<{ smallScreen: boolean }>`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
  margin-top: auto;
  filter: brightness(0.7) contrast(0.8);
  transition: filter 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  &:hover {
    filter: brightness(0.9) contrast(1.05);
  }

  max-width: ${(props) => (props.smallScreen ? "100%" : "600px")};
`;

const Footer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 64px;
  padding: 12px;
  color: #fff;
`;

const FooterLinks = styled.View`
  display: flex;
  gap: 16px;
  flex-direction: row;
  margin-top: 32px;
  align-items: center;
  justify-content: center;
`;

const FooterLink = styled.Text`
  color: #888;
  text-decoration: none;
  &:hover {
    color: #fff;
  }
  font-size: 16px;
`;

const StyledPressable = styled.Pressable`
  font-family: "${({ theme }) => theme.fonts.heading}";
  background: rgb(71, 144, 255);
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: rgb(255, 255, 255);
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s;
  text-align: center;
`;

const Home = () => {
  const { user } = useAuth();
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 768px)",
  });

  const handleSignin = async () => {
    router.push("/sign-in");
  };
  const handleGotoNews = async () => {
    router.push("/player");
  };

  const init = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const firstName = await AsyncStorage.getItem("firstName");
    if (token) {
      router.push("/player");
    } else {
      if (firstName) router.push("/sign-in");
    }
  };

  useEffect(() => {
    init();
  }, []);

  console.log("Home page");

  return (
    <ScrollView style={{ flex: 1 }}>
      <HomeContainer>
        <MainContent smallScreen={isTabletOrMobileDevice}>
          <LeftSection smallScreen={isTabletOrMobileDevice}>
            <Brand>essence</Brand>
            <Headline>e-commerce news in 30-second soundbites</Headline>
            <Subheadline>
              Essence delivers curated, personalized audio insights for busy
              professionals. Get informed on your commute, no reading required.
            </Subheadline>
            <StyledPressable
              onPress={() => (user ? handleGotoNews() : handleSignin())}
            >
              {user ? (
                <ButtonText>Go to News</ButtonText>
              ) : (
                <ButtonText>Try it out</ButtonText>
              )}
            </StyledPressable>
          </LeftSection>
          <RightSection smallScreen={isTabletOrMobileDevice}>
            <AppImage
              smallScreen={isTabletOrMobileDevice}
              source={screenshot1}
              alt="App screenshot"
            />
          </RightSection>
        </MainContent>
        <InsightsSection smallScreen={isTabletOrMobileDevice}>
          <InsightCard smallScreen={isTabletOrMobileDevice}>
            <View>
              <InsightTitleSmall>Your Industry. Your News.</InsightTitleSmall>
              <InsightTitle>Tailored for You</InsightTitle>
              <InsightSubtitle>
                Essence curates content from top sources, tailored to your
                specific industry and role. Stay relevant without the noise
              </InsightSubtitle>
            </View>
            <InsightImage
              smallScreen={isTabletOrMobileDevice}
              source={ecommercePic}
              alt="App screenshot"
            />
          </InsightCard>
          <InsightCard smallScreen={isTabletOrMobileDevice}>
            <View>
              <InsightTitleSmall>Listen, Don't Read</InsightTitleSmall>
              <InsightTitle>Audio-First Experience</InsightTitle>
              <InsightSubtitle>
                Transform your daily routine into a learning opportunity. Catch
                up on industry trends while you commute, exercise, or prep for
                your day.
              </InsightSubtitle>
            </View>
            <InsightImage
              smallScreen={isTabletOrMobileDevice}
              source={audioPic}
              alt="App screenshot"
            />
          </InsightCard>
        </InsightsSection>
        <InsightsSection smallScreen={isTabletOrMobileDevice}>
          <InsightCard smallScreen={isTabletOrMobileDevice}>
            <View>
              <InsightTitleSmall>News in byte size</InsightTitleSmall>
              <InsightTitle>30 Seconds to Savvy</InsightTitle>
              <InsightSubtitle>
                Each news item is distilled into a 30-second audio clip. Get the
                essentials quickly, without sacrificing depth.
              </InsightSubtitle>
            </View>
            <InsightImage
              smallScreen={isTabletOrMobileDevice}
              source={hourglassPic}
              alt="App screenshot"
            />
          </InsightCard>
          <InsightCard smallScreen={isTabletOrMobileDevice}>
            <View>
              <InsightTitleSmall>Engaging dialogue</InsightTitleSmall>
              <InsightTitle>News That Feels Like Conversation</InsightTitle>
              <InsightSubtitle>
                Our hosts present insights in a lively, podcast-style format.
                It's not just information—it's infotainment.
              </InsightSubtitle>
            </View>
            <InsightImage
              smallScreen={isTabletOrMobileDevice}
              source={podcastPic}
              alt="App screenshot"
            />
          </InsightCard>
        </InsightsSection>
        <Footer>
          <Brand>essence</Brand>

          <StyledPressable
            onPress={() => (user ? handleGotoNews() : handleSignin())}
          >
            {user ? (
              <ButtonText>Go to News</ButtonText>
            ) : (
              <ButtonText>Try it out</ButtonText>
            )}
          </StyledPressable>
          <FooterLinks>
            <Link href="/">
              <FooterLink>Terms</FooterLink>
            </Link>
            <Link href="/">
              <FooterLink>Privacy</FooterLink>
            </Link>
            <Link href="/">
              <FooterLink>Contact</FooterLink>
            </Link>
          </FooterLinks>
        </Footer>
      </HomeContainer>
    </ScrollView>
  );
};

export default Home;
