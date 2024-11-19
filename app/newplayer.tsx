import BrandHeader from "@/components/BrandHeader";
import {
  CategoryButton,
  CategoryContainer,
  ControlButton,
  Controls,
  ErrorMessage,
  NewsHeadline,
  NewsInfo,
  PlaylistInfo,
  Progress,
  ProgressBar,
  RatingButton,
  RatingButtons,
  RatingMessage,
  Subtitle,
  SummaryText,
  SummaryTitle,
  SummaryWrapper,
  Title,
  TopSection,
} from "@/components/SharedComponents";
import { mockNewsData } from "@/constants/mock";
import theme from "@/constants/theme";
import React, { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const image = require("@/assets/logo512.png");
const image1 = {
  uri: "https://i.guim.co.uk/img/media/7b61e0553886769be00b841cd315ca2a3cd84554/0_230_5507_3304/master/5507.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&s=d5c8ade4f271f1c378d019ef1260ebf8",
};
const articles = mockNewsData.articles;
const handlePrev = () => {
  console.log("handlePrev");
};
const playSound = () => {
  console.log("handlePlay");
};
const pauseSound = () => {
  console.log("handlePause");
};
const handleNext = () => {
  console.log("handleNextr");
};
const currentNewsIndex = 0;
const isPlaying = false;

const ratingMessage = "Rating Message";
const isLoading = false;
const progress = 20;
const show = false;
const user = { firstName: "Nikhil" };

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 10000); // 15000 milliseconds = 15 seconds
  }, []);
  const renderContent = () => {
    if (
      !articles ||
      articles.length === 0 ||
      currentNewsIndex >= articles.length
    ) {
      return (
        <ErrorMessage>
          All caught up! Check back later for more news
        </ErrorMessage>
      );
    }

    const article = articles[currentNewsIndex];
    return (
      <>
        <NewsHeadline>{article.title}</NewsHeadline>
        <CategoryContainer>
          {article.categories.map((category, index) => (
            <CategoryButton key={index}>{category}</CategoryButton>
          ))}
        </CategoryContainer>
      </>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />
      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          maxWidth: "500px",
          justifyContent: "flex-end",
          marginTop: "70px",
        }}
      >
        {show ? (
          <ImageBackground
            source={image}
            resizeMode="cover"
            style={styles.image}
          />
        ) : (
          <ImageBackground
            source={{ uri: articles[currentNewsIndex].image }}
            resizeMode="cover"
            style={styles.image}
          >
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <View>
                <TopSection welcomeShown={showWelcome}>
                  <PlaylistInfo show={showWelcome}>
                    <Title>Hello {user?.firstName || ""}</Title>
                    <Subtitle>Your {getTimeOfDay()} newscast</Subtitle>
                  </PlaylistInfo>
                  <NewsInfo welcomeShown={showWelcome}>
                    {renderContent()}
                  </NewsInfo>
                </TopSection>
              </View>
              <View style={styles.playerControls}>
                <RatingButtons>
                  <RatingMessage visible={!!ratingMessage}>
                    {ratingMessage}
                  </RatingMessage>
                  <RatingButton
                    onPress={() => handleRating("negative")}
                    disabled={isLoading}
                  >
                    <Svg fill="#fff" viewBox="0 0 24 24">
                      <Path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                    </Svg>
                  </RatingButton>
                  <RatingButton
                    onPress={() => handleRating("positive")}
                    disabled={isLoading}
                  >
                    <Svg fill="#fff" viewBox="0 0 24 24">
                      <Path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                    </Svg>
                  </RatingButton>
                </RatingButtons>
                <ProgressBar>
                  <Progress progress={progress} />
                </ProgressBar>
                <Controls>
                  <ControlButton
                    onPress={handlePrev}
                    disabled={currentNewsIndex <= 0}
                  >
                    <Svg
                      viewBox="0 0 24 24"
                      width={30}
                      height={30}
                      fill={theme.colors.text}
                    >
                      <Path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </Svg>
                  </ControlButton>
                  <ControlButton
                    onPress={() => (isPlaying ? pauseSound() : playSound())}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Svg
                        viewBox="0 0 24 24"
                        width={30}
                        height={30}
                        fill={theme.colors.text}
                      >
                        <Path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z" />
                      </Svg>
                    ) : isPlaying ? (
                      <Svg
                        viewBox="0 0 24 24"
                        width={30}
                        height={30}
                        fill={theme.colors.text}
                      >
                        <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </Svg>
                    ) : (
                      <Svg
                        viewBox="0 0 24 24"
                        width={30}
                        height={30}
                        fill={theme.colors.text}
                      >
                        <Path d="M8 5v14l11-7z" />
                      </Svg>
                    )}
                  </ControlButton>
                  <ControlButton
                    onPress={handleNext}
                    disabled={
                      !articles || currentNewsIndex >= articles.length - 1
                    }
                  >
                    <Svg
                      viewBox="0 0 24 24"
                      width={30}
                      height={30}
                      fill={theme.colors.text}
                    >
                      <Path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </Svg>
                  </ControlButton>
                </Controls>
                <SummaryWrapper>
                  <SummaryTitle>Summary</SummaryTitle>
                  <SummaryText>
                    {articles[currentNewsIndex]?.summary_50 ||
                      "No summary available."}
                  </SummaryText>
                </SummaryWrapper>
              </View>
            </ScrollView>
          </ImageBackground>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  playerControls: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingInline: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  flex: {
    flex: 1,
  },
  image: {
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});

export default App;
