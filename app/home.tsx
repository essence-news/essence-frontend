import { useAuth } from "../utils/AuthProvider";
import { Link, router } from "expo-router";
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";
import {
  ButtonText,
  VideoContainer,
  HomeContainer,
  HeroSection,
  LeftSection,
  RightSection,
  InsightContent,
  InsightTitle,
  InsightTitleSmall,
  InsightSubtitle,
  Footer,
  ButtonSection,
  FooterLinks,
  FooterLink,
  Brand,
  Headline,
  Subheadline,
  BetaPressable,
  StyledPressable,
  StyledImageBackground,
  Overlay,
  InsightCardRight,
  InsightCardLeft,
  commonStyles,
} from "@/components/SharedComponents";
import { WebView } from "react-native-web-webview";
import { record } from 'aws-amplify/analytics';

import screenshot1 from "@/assets/screenshots/1.jpg";
import ecommercePic from "@/assets/cliparts/ecommerce.jpg";
import audioPic from "@/assets/cliparts/audio.jpg";
import hourglassPic from "@/assets/cliparts/hourglass.jpg";
import podcastPic from "@/assets/cliparts/podcast.jpg";
import BrandHeader from "@/components/BrandHeader";
import theme from "@/constants/theme";

// Keep the existing styled components that are specific to Home

export default function Home() {
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
    record({ name: 'PAGE_VIEW' });
    init();
  }, []);

  console.log("Home page");

  const handleJoinBeta = () => {
    router.push("/beta-access");
  };

  return (
    <HomeContainer smallScreen={isTabletOrMobileDevice}>
      <HeroSection smallScreen={isTabletOrMobileDevice}>
        <LeftSection smallScreen={isTabletOrMobileDevice}>
          <Brand>essence</Brand>
          <Headline>Business news that speaks to you</Headline>
          <Subheadline>
            Purpose-built for Retail Leaders—concise 30-second audio news, expertly curated for your role and industry
          </Subheadline>
          <ButtonSection smallScreen={isTabletOrMobileDevice}>
            <BetaPressable onPress={handleJoinBeta}>
              <ButtonText>Join the Beta</ButtonText>
            </BetaPressable>
            <StyledPressable
              onPress={() => (user ? handleGotoNews() : handleSignin())}
            >
              {user ? (
                <ButtonText>Go to News</ButtonText>
              ) : (
                <ButtonText>Sign in</ButtonText>
              )}
            </StyledPressable>
          </ButtonSection>
        </LeftSection>
        <RightSection smallScreen={isTabletOrMobileDevice}>
          {/* <AppImage
              smallScreen={isTabletOrMobileDevice}
              source={screenshot1}
              alt="App screenshot"
            /> */}
          <VideoContainer smallScreen={isTabletOrMobileDevice}>
            <WebView
              source={{
                html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                          * { margin: 0; padding: 0; border: none; }
                          html, body { 
                            margin: 0; 
                            padding: 0; 
                            height: 100%;
                            overflow: hidden;
                          }
                          .video-container { 
                            position: relative; 
                            padding-bottom: 56.25%; 
                            height: 0; 
                            overflow: hidden; 
                          }
                          iframe { 
                            position: absolute; 
                            top: 0;  
                            left: 0; 
                            width: 100%; 
                            height: 100%; 
                            border: 0; 
                          }
                        </style>
                      </head>
                      <body>
                        <div class="video-container">
                          <iframe 
                            src="https://player.vimeo.com/video/1034598104?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
                            frameborder="0" 
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                            style="position:absolute;top:0;left:0;width:100%;height:100%;" 
                            title="EssenceDemoFashion"
                          ></iframe>                        
                        </div>
                      </body>
                    </html>
                  `,
              }}
              style={commonStyles.flex_1}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
            />
          </VideoContainer>
        </RightSection>
      </HeroSection>
      <HeroSection smallScreen={isTabletOrMobileDevice}>
        <InsightCardLeft smallScreen={isTabletOrMobileDevice}>
          <StyledImageBackground source={ecommercePic} resizeMode="cover" />
          <Overlay />
          <InsightContent>
            <InsightTitleSmall>Your Industry. Your News.</InsightTitleSmall>
            <InsightTitle>Tailored for You</InsightTitle>
            <InsightSubtitle>
              Essence curates content from top sources, even from behind paywalls, tailored to your
              specific industry and role. Stay relevant without the noise and hassle.
            </InsightSubtitle>
          </InsightContent>
        </InsightCardLeft>
        <InsightCardRight smallScreen={isTabletOrMobileDevice}>
          <StyledImageBackground source={audioPic} resizeMode="cover" />
          <Overlay />
          <InsightContent>
            <InsightTitleSmall>Listen, Don't Read</InsightTitleSmall>
            <InsightTitle>Audio-First Experience</InsightTitle>
            <InsightSubtitle>
              Transform your daily routine into a learning opportunity. Catch up
              on industry trends while you commute, exercise, or prep for your
              day.
            </InsightSubtitle>
          </InsightContent>
        </InsightCardRight>
      </HeroSection>
      <HeroSection smallScreen={isTabletOrMobileDevice}>
        <InsightCardLeft smallScreen={isTabletOrMobileDevice}>
          <StyledImageBackground source={hourglassPic} resizeMode="cover" />
          <Overlay />
          <InsightContent>
            <InsightTitleSmall>News in byte size</InsightTitleSmall>
            <InsightTitle>30 Seconds to Savvy</InsightTitle>
            <InsightSubtitle>
              Each news item is distilled into a 30-second audio clip. Get the
              essentials quickly, without sacrificing depth.
            </InsightSubtitle>
          </InsightContent>
        </InsightCardLeft>
        <InsightCardRight smallScreen={isTabletOrMobileDevice}>
          <StyledImageBackground source={podcastPic} resizeMode="cover" />
          <Overlay />
          <InsightContent>
            <InsightTitleSmall>Engaging dialogue</InsightTitleSmall>
            <InsightTitle>News That Feels Like Conversation</InsightTitle>
            <InsightSubtitle>
              Our hosts present insights in a lively, podcast-style format. It's
              not just information—it's infotainment.
            </InsightSubtitle>
          </InsightContent>
        </InsightCardRight>
      </HeroSection>
      <Footer>
        <Brand>essence</Brand>
        <ButtonSection smallScreen={isTabletOrMobileDevice}>
          <BetaPressable onPress={handleJoinBeta}>
            <ButtonText>Join the Beta</ButtonText>
          </BetaPressable>
          <StyledPressable
            onPress={() => (user ? handleGotoNews() : handleSignin())}
          >
            {user ? (
              <ButtonText>Go to News</ButtonText>
            ) : (
              <ButtonText>Sign in</ButtonText>
            )}
          </StyledPressable>
        </ButtonSection>
        <FooterLinks>
          <Link href="/terms">
            <FooterLink>Terms</FooterLink>
          </Link>
          <Link href="/privacy">
            <FooterLink>Privacy</FooterLink>
          </Link>
          <Link href="mailto:hi@getessence.app">
            <FooterLink>Contact</FooterLink>
          </Link>
        </FooterLinks>
      </Footer>
    </HomeContainer>
  );
}
