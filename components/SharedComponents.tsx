import { StyleSheet } from "react-native";
import styled from "styled-components/native";

export const H1 = styled.Text`
  font-size: 36px;
  font-family: "${({ theme }) => theme.fonts.body}";
`;
export const H2 = styled.Text`
  font-size: 32px;
  font-family: "${({ theme }) => theme.fonts.body}";
`;
export const H3 = styled.Text`
  font-size: 24px;
  font-family: "${({ theme }) => theme.fonts.body}";
`;
export const H4 = styled.Text`
  font-size: 20px;
  font-family: "${({ theme }) => theme.fonts.bodyMedium}";
`;
export const H5 = styled.Text`
  font-size: 16px;
  font-family: "${({ theme }) => theme.fonts.bodyMedium}";
`;

export const StyledTextLarge = styled.Text`
  font-size: 14px;
  font-family: "${({ theme }) => theme.fonts.body}";
  color: #fff;
`;

export const StyledTextLargeDark = styled.Text`
  font-size: 14px;
  font-family: "${({ theme }) => theme.fonts.body}";
  color: ${({ theme }) => theme.colors.primary};
`;


export const StyledText = styled.Text`
  font-size: 14px;
  font-family: "${({ theme }) => theme.fonts.body}";
  color: #fff;
`;

export const StyledTextDark = styled.Text`
  font-size: 14px;
  font-family: "${({ theme }) => theme.fonts.body}";
  color: ${({ theme }) => theme.colors.primaryLight};
`;


export const FinerText = styled.Text`
  font-size: 12px;
  font-style: italic;
  font-family: "${({ theme }) => theme.fonts.body}";
  color: ${({ theme }) => theme.colors.primaryLighter};
`;

export const DangerText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
`;

export const commonStyles = StyleSheet.create({
  flex_1: {
    flex: 1,
  },
});

export const MainContainer = styled.View`
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.maxWidth};
  margin: 0 auto;
  flex: 1;
  align-self: center;
  overflow: auto;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

// Styles for home screen
export const HomeContainer = styled.View<{ smallScreen: boolean }>`
  flex: 1;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

export const HeroSection = styled.View<{ smallScreen: boolean }>`
  display: flex;
  padding: ${(props) => (props.smallScreen ? "32px 16px" : "64px")};
  flex-direction: ${(props) => (props.smallScreen ? "column" : "row")};
`;

export const LeftSection = styled.View<{ smallScreen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${(props) => (props.smallScreen ? "0" : "100px 0")};
  max-width: ${(props) => (props.smallScreen ? "100%" : "50%")};
  min-height: ${(props) => (props.smallScreen ? "90vh" : "initial")};
  border-radius: 10px;
  overflow: hidden;
`;

export const RightSection = styled.View<{ smallScreen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(props) => (props.smallScreen ? "0" : "100px 0")};
  max-width: ${(props) => (props.smallScreen ? "100%" : "50%")};
  min-height: ${(props) => (props.smallScreen ? "30vh" : "initial")};
  margin: ${(props) => (props.smallScreen ? "32px 0 0 0" : "0 0 0 32px")};
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
`;

export const ButtonSection = styled.View<{ smallScreen: boolean }>`
  display: flex;
  justify-content: left;
  flex-direction: ${(props) => (props.smallScreen ? "column" : "row")};
  gap: 16px;
  width: ${(props) => (props.smallScreen ? "100%" : "initial")};
`;

export const InsightsSection = styled.View<{ smallScreen: boolean }>`
  display: flex;
  padding: ${(props) => (props.smallScreen ? "32px 16px" : "64px")};
  flex-direction: ${(props) => (props.smallScreen ? "column" : "row")};
`;

export const InsightCardLeft = styled.View<{ smallScreen: boolean }>`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  max-width: ${(props) => (props.smallScreen ? "100%" : "50%")};
  overflow: hidden;
`;

export const InsightCardRight = styled.View<{ smallScreen: boolean }>`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  margin: ${(props) => (props.smallScreen ? "32px 0 0 0" : "0 0 0 32px")};
  max-width: ${(props) => (props.smallScreen ? "100%" : "50%")};
  overflow: hidden;
`;

export const StyledImageBackground = styled.ImageBackground`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

export const InsightContent = styled.View`
  min-height: 400px;
  display: flex;
  padding: 60px 20px;
  flex-direction: column;
`;

export const Brand = styled.Text`
  font-family: "${({ theme }) => theme.fonts.brand}";
  font-size: 68px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.brand};
  margin-bottom: 40px;
  margin-top: 0;
`;

export const Headline = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  font-size: 34px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
`;

export const Subheadline = styled.Text`
  font-family: "${({ theme }) => theme.fonts.bodyLight}";
  font-size: 20px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.primaryLight};
  margin-bottom: 40px;
`;

export const InsightTitle = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  font-size: 25px;
  font-weight: 400;
  margin-top: 0;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
`;

export const InsightTitleSmall = styled.Text`
  font-family: "${({ theme }) => theme.fonts.heading}";
  font-size: 16px;
  margin: 0;
  color: ${({ theme }) => theme.colors.secondaryDark};
`;

export const InsightSubtitle = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  font-size: 16px;
  color: ${({ theme }) => theme.colors.background};
  margin-bottom: 32px;
`;

export const AppImage = styled.Image<{ smallScreen: boolean }>`
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  height: ${(props) => (props.smallScreen ? "82vh" : "800px")};
  max-width: ${(props) => (props.smallScreen ? "100%" : "500px")};
`;

export const Footer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 64px 0;
  padding: 32px;
`;

export const FooterLinks = styled.View`
  display: flex;
  gap: 16px;
  flex-direction: row;
  margin-top: 32px;
  align-items: center;
  justify-content: center;
`;

export const FooterLink = styled.Text`
  color: #888;
  text-decoration: none;
  &:hover {
    color: #fff;
  }
  font-size: 16px;
`;

export const StyledPressable = styled.Pressable`
  font-family: "${({ theme }) => theme.fonts.heading}";
  background: ${({ theme }) => theme.colors.secondary};
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  padding: 10px 40px;
  border-radius: 5px;
  transition: background-color 0.3s;
  text-align: center;
`;

export const BetaPressable = styled.Pressable`
  font-family: "${({ theme }) => theme.fonts.heading}";
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  padding: 10px 40px;
  border-radius: 5px;
  transition: background-color 0.3s;
  text-align: center;
`;

export const AppContainer = styled.View<{ width: number; height: number }>`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  margin: 0 auto;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
`;

export const HeaderContainer = styled.View<{ width: number }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  position: absolute;
  overflow: hidden;
  padding: 10px 20px;
  z-index: 10;
  background-color: ${({ theme }) => theme.colors.darkOverlay};
`;

export const ContentContainer = styled.View`
  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  margin-top: 50px;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const VideoContainer = styled.View<{ smallScreen: boolean }>`
  width: 100%;
  aspect-ratio: 16/9;
  border: 0;
  overflow: hidden;
  border-radius: 10px;
`;

export const Card = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.darkOverlay};
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;
`;

export const FormContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  background-color: ${({ theme }) => theme.formBackground};
  width: 90%;
  flex: 1;
  height: 100%;
  padding-top: 30px;
  position: relative;
`;

export const Header = styled.View`
  align-items: center;
  margin-top: 40px;
`;

export const Title = styled(H3)`
  font-weight: bold;
  margin-block: 5px;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.brand};
  font-family: "${({ theme }) => theme.fonts.heading}";
`;

export const Subtitle = styled(H4)`
  margin-top: 0;
  color: ${({ theme }) => theme.colors.text};
`;

export const SubtitleDark = styled(H4)`
  margin-top: 0;
  color: "${({ theme }) => theme.colors.primary}";
`;

export const ButtonText = styled(H5)`
  text-align: center;
  color: inherit;
`;

export const Button = styled.Pressable`
  background: ${({ theme }) => theme.colors.accent};
  font-family: "${({ theme }) => theme.fonts.body}";
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
`;

export const StyledActivityIndicator = styled.ActivityIndicator`
  flex: 1;
  justify-content: center;
`;

export const Input = styled.TextInput`
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 0 10px;
  font-size: 16px;
  font-family: "${({ theme }) => theme.fonts.body}";
  background-color: #fff;
  width: 100%;
`;

// Add this near the top of the file with other styled components
export const ErrorMessage = styled(H5)`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: 10px;
`;

export const FormErrorMessage = styled(StyledText)`
  color: ${({ theme }) => theme.colors.error};
`;

export const InfoMessage = styled(H5)`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  margin-top: 20px;
  padding: 10px;
`;

export const ScrollableContent = styled.View`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const BackgroundOverlay = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const ContentWrapper = styled.View<{ width: number }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${(props) => props.width + "px"};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const MainContent = styled.View`
  flex: 1;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

export const SigninMainContent = styled.View`
  flex: 1;
  display: block;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  padding-top: 100px;
`;

export const TopSection = styled.View`
  width: 100%;
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const CenterButton = styled.Pressable`
  border-radius: 100%;
  height: 100px;
  width: 100px;
  border: 1px solid #333;
  color: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  background: ${({ theme }) => theme.colors.text};
`;

export const ReplayButton = styled.Pressable`
  border-radius: 100%;
  height: 50px;
  width: 50px;
  border: 1px solid #333;
  color: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.text};
`;

export const PlaylistInfo = styled.View`
  position: absolute;
  top: 50px;
  right: 0;
  transition:
    opacity 1s ease-out,
    transform 1s ease-out;
  z-index: 10;
  padding: 20px;
  width: 100%;
`;

export const NewsInfo = styled.View`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin: 100px 0;
  transition: transform 1s ease-out;
`;

export const ControlsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
`;

export const RatingButtons = styled.View`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 40px;
  flex-direction: row;
`;

export const RatingButton = styled.Pressable`
  border: none;
  cursor: pointer;
  margin-left: 40px;
  padding: 0;
  width: 24px;
  height: 24px;
  fill: ${({ theme }) => theme.colors.text};
`;

export const ProgressBar = styled.View`
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-bottom: 30px;
`;

export const Progress = styled.View<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.accent};
`;

export const Controls = styled.View`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-direction: row;
`;

export const ControlButton = styled.Pressable`
  position: relative;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.3s ease;
  font-size: 20px;
  &:disabled {
    opacity: 0.5;
  }
  svg {
    width: 30px;
    height: 30px;
    fill: ${({ theme }) => theme.colors.text};
    transition: fill 0.3s ease;
  }
  &:hover:not(:disabled) svg {
    fill: ${({ theme }) => theme.colors.accent};
  }
`;

export const NewsHeadline = styled(H4)`
  font-weight: 500;
  text-align: left;
  padding: 10px;
  color: #fff;
  margin: auto;
`;

export const SummaryWrapper = styled.View`
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.darkOverlay};
  border-radius: 10px;
  margin: 20px 0;
  font-family: "${({ theme }) => theme.fonts.body}";
`;

export const SummaryTitle = styled(H4)`
  color: ${({ theme }) => theme.colors.text};
`;

export const SummaryText = styled(StyledText)`
  color: ${({ theme }) => theme.colors.secondary};
`;

export const FullScreenBackground = styled.View<{ src: string }>`
  background-image: url(${(props) => props.src});
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
`;

export const RatingMessage = styled(H5) <{ visible: boolean }>`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  color: ${({ theme }) => theme.colors.accent};
  margin-left: 10px;
  transition: opacity 0.3s ease;
`;

export const CategoryButton = styled(H5)`
  display: inline-block;
  margin: 10px;
  color: ${(props) => props.theme.colors.background};
  border-radius: 5px;
  font-weight: 500;
  text-transform: capitalize;
`;

export const CategoryContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

export const BrandName = styled(H3)`
  margin: 0;
  padding: 0;
  height: 30px;
  color: ${({ theme }) => theme.colors.white};
  font-family: "${({ theme }) => theme.fonts.brand}";
  flex: 1;
  align-items: center;
  display: flex;
  justify-content: flex-start;
`;

export const LogoContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 10px 20px;
`;

export const Logo = styled.Image`
  height: 28px;
  width: 28px;
`;

export const PrivacyContainer = styled.View`
  padding: 60px 20px;
  width: 90%;
  margin: 0 auto;
`;

export const PrivacyHeading = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  font-size: 34px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 32px;
`;

export const PrivacySubheading = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primaryLight};
  margin-top: 16px;
  margin-bottom: 8px;
`;

export const PrivacyText = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  font-size: 15px;
  color: ${({ theme }) => theme.colors.primaryLighter};
  margin-bottom: 16px;
`;

export const PrivacyLink = styled.Text`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
`;
