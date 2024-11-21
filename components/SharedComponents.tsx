import styled from "styled-components/native";

export const AppContainer = styled.View<{ width: number; height: number }>`
  width: ${(props) => props.width + "px" || "100vw"};
  height: ${(props) => props.height + "px" || "100vh"};
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
  width: ${(props) => props.width + "px" || "100vw"};
  max-width: 100%;
  box-sizing: border-box;
  position: absolute;
  overflow: hidden;
  padding: 10px 20px;
  z-index: 10;

  background-color: rgba(0, 0, 0, 0.5);
`;

export const ContentContainer = styled.View`
  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
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

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.brand};
  font-family: "${({ theme }) => theme.fonts.heading}";
`;

export const Subtitle = styled.Text`
  font-size: 20px;
  margin-top: 0;
  font-family: "${({ theme }) => theme.fonts.body}";
`;

export const SubtitleDark = styled.Text`
  font-size: 20px;
  margin-top: 0;
  font-family: "${({ theme }) => theme.fonts.body}";
  color: "${({ theme }) => theme.colors.primary}";
`;

export const ButtonText = styled.Text`
  font-size: 18px;
  color: #fff;
  font-family: "${({ theme }) => theme.fonts.body}";
  text-align: center;
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
  &:hover {
    background-color: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.accent} 85%, black)`};
  }
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
export const ErrorMessage = styled.Text`
  font-family: "${({ theme }) => theme.fonts.body}";
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
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
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  padding-top: 100px;
`;

export const SigninMainContent = styled.View`
  flex: 1;
  display: block;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  padding-top: 100px;
`;

export const TopSection = styled.View<{ welcomeShown: boolean }>`
  padding-top: ${(props) => (props.welcomeShown ? "80px" : "40px")};
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: padding-top 1s ease-out;
`;

export const PlaylistInfo = styled.View<{ show: boolean }>`
  opacity: ${(props) => (props.show ? 1 : 0)};
  pointerevents: ${(props) => (props.show ? "auto" : "none")};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transition:
    opacity 1s ease-out,
    transform 1s ease-out;
  z-index: 10;
  padding: 20px;
`;

export const NewsInfo = styled.View<{ welcomeShown: boolean }>`
  transform: ${(props) =>
    props.welcomeShown ? "translateY(0px)" : "translateY(-40px)"};
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
  margin-bottom: 20px;
  flex-direction: row;
  padding-inline: 20px;
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
  margin-bottom: 20px;
`;

export const Progress = styled.View<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.accent};
`;

export const Controls = styled.View`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
  flex-direction: row;
`;

export const ControlButton = styled.Pressable`
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.3s ease;
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

export const NewsHeadline = styled.Text`
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  padding: 10px;
  color: #fff;
  margin: auto;
  font-family: "${({ theme }) => theme.fonts.body}";
`;

export const SummaryWrapper = styled.View`
  width: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  margin-bottom: 20px;
  font-family: "${({ theme }) => theme.fonts.body}";
`;

export const SummaryTitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 10px 0;
  font-family: "${({ theme }) => theme.fonts.body}";
`;

export const SummaryText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: "${({ theme }) => theme.fonts.body}";
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

export const RatingMessage = styled.Text<{ visible: boolean }>`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent};
  margin-left: 10px;
  font-family: "${({ theme }) => theme.fonts.body}";
  transition: opacity 0.3s ease;
`;

export const CategoryButton = styled.Text`
  display: inline-block;
  margin: 10px;
  color: ${(props) => props.theme.colors.background};
  border-radius: 5px;
  font-weight: 500;
  font-size: 16px;
  font-family: "${({ theme }) => theme.fonts.body}";
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
