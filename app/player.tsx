import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, AppState } from "react-native";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { fetchNews } from "@/utils/api";

import {
  AppContainer,
  BackgroundOverlay,
  Card,
  CategoryButton,
  CategoryContainer,
  ContentContainer,
  ContentWrapper,
  ControlButton,
  Controls,
  ControlsWrapper,
  ErrorMessage,
  FullScreenBackground,
  MainContent,
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
import { useTheme } from "styled-components/native";
import BrandHeader from "@/components/BrandHeader";
import { useAuth } from "@/utils/AuthProvider";
import { mockNewsData } from "@/constants/mock";
import { flushQueue, trackEvent } from "@/utils/trackingUtil";

export interface News {
  articles: Article[];
  count: number;
  intro_audio: string;
}

export interface Article {
  audio_summary: string;
  audio_summary_url: any;
  categories: string[];
  date_published: string;
  full_text: any;
  id: string;
  image: string | null;
  importance_score: number;
  processing_status: string;
  region: string;
  rss_summary: string;
  single_news_item: boolean;
  source_name: string;
  summary_200: string;
  summary_50: string;
  summary_vector: any;
  title: string;
  type: string;
  url: string;
  sound?: Audio.Sound;
}

const formatCategory = (category: string) => {
  return (
    "#" +
    category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("")
  );
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

export default function Player() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(-1);
  const { user } = useAuth();
  const mounted = useRef(false);
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeSoundStatus, setWelcomeSoundStatus] = useState<string>("");
  const [ratingMessage, setRatingMessage] = useState("");
  const currentlyPlaying = useRef<Sound | null>(null);
  const soundRefs = useRef<Sound[] | null[]>([]);
  const autoPlayStarted = useRef(false);
  const newsResponse = useRef<News>();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { logout } = useAuth();

  const showPlayerControls = useMemo(() => {
    return (
      articles && articles.length > 0 && currentNewsIndex < articles.length
    );
  }, [articles, currentNewsIndex]);

  const renderContent = useMemo(() => {
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
            <CategoryButton key={index}>
              {formatCategory(category)}
            </CategoryButton>
          ))}
        </CategoryContainer>
      </>
    );
  }, [currentNewsIndex, articles]);

  const onPlaybackStatusUpdate = (status: any) => {
    // console.log({ status });
    if (status.isLoaded && status.durationMillis) {
      const progressPercent =
        (status.positionMillis / status.durationMillis) * 100;
      setProgress(progressPercent);
    }
    if (status.didJustFinish) {
      handleNext();
      trackEvent(
        "audioCompleted",
        articles[currentNewsIndex].id,
        articles[currentNewsIndex].title,
        currentNewsIndex,
      );
    }
  };

  const onPlayAfterPause = () => {
    currentlyPlaying.current?.playAsync();
    setIsPlaying(true);
    trackEvent(
      "pause",
      articles[currentNewsIndex].id,
      articles[currentNewsIndex].title,
      currentNewsIndex,
      progress,
    );
  };

  async function playSound() {
    console.log({ welcomeSoundStatus });
    if (
      welcomeSoundStatus !== "completed" &&
      welcomeSoundStatus !== "ignored"
    ) {
      return;
    }
    if (currentlyPlaying.current) {
      console.log("will play from pause");
      onPlayAfterPause();
      return;
    }
    setIsLoading(true);
    let sound: Sound | null = null;
    console.log({
      currentNewsIndex,
      soundRefsLength: soundRefs.current.length,
      soundRefs: soundRefs.current,
    });
    //Check if sound object present and use
    if (
      currentNewsIndex < soundRefs.current.length &&
      soundRefs.current[currentNewsIndex]
    ) {
      console.log("Loading sound from refs");
      sound = soundRefs.current[currentNewsIndex];
      console.log("got from ref", sound);
    } else {
      sound = await createSoundObject(
        articles[currentNewsIndex].audio_summary,
        articles[currentNewsIndex].id,
        articles[currentNewsIndex].title,
        currentNewsIndex,
      );
    }
    console.log("Playing Sound", articles[currentNewsIndex], sound._key.src);
    setIsLoading(false);
    if (sound) {
      currentlyPlaying.current = sound;
      const tryToPlay = setInterval(
        async () => {
          await sound
            .playAsync()
            .then(() => {
              clearInterval(tryToPlay);
              trackEvent(
                "play",
                articles[currentNewsIndex].id,
                articles[currentNewsIndex].title,
                currentNewsIndex,
                progress,
              );
              // console.log("Src=", await getData("src"))
              setIsPlaying(true);
              autoPlayStarted.current = true;
              sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            })
            .catch((error) => {
              console.error("Auto-play failed:", error.message);
              trackEvent(
                "error",
                articles[currentNewsIndex]?.id,
                articles[currentNewsIndex]?.title,
                currentNewsIndex,
                0,
                { errorType: "autoplay-play", message: error.message },
              );
            });
        },
        autoPlayStarted.current ? 0 : 500,
      );
    }
  }

  async function pauseSound() {
    await currentlyPlaying.current?.pauseAsync();
    setIsPlaying(false);
    trackEvent(
      "pause",
      articles[currentNewsIndex].id,
      articles[currentNewsIndex].title,
      currentNewsIndex,
      progress,
    );
  }

  const createSoundObject = async (
    uri: string,
    id = "",
    title = "",
    index = -1,
  ) => {
    const audio = await Audio.Sound.createAsync({
      uri,
    }).catch((error) => {
      console.error("Create Async failed:", error);
      trackEvent("error", id, title, index, 0, {
        errorType: "autoplay-create",
        message: error.message,
      });
    });
    return audio.sound;
  };

  const prepareSounds = async () => {
    if (articles?.length > 0) {
      console.log("prepareSound", {
        currentNewsIndex,
        articles,
        soundRefs: soundRefs.current,
      });
      for (let i = 0; i < 5; i++) {
        const backIndex = currentNewsIndex - i;
        const frontIndex = currentNewsIndex + i;
        console.log("prepareSound", { i, backIndex, frontIndex });
        if (backIndex >= 0) {
          if (i === 4) {
            console.log("iunsetting", { backIndex });
            // unset the 5th object from back
            soundRefs.current[backIndex] = null;
          } else {
            if (!soundRefs.current[backIndex]) {
              console.log("creating", {
                backIndex,
                file: articles[backIndex].audio_summary,
              });
              const sound = await createSoundObject(
                articles[backIndex].audio_summary,
                articles[backIndex].id,
                articles[backIndex].title,
                backIndex,
              );
              soundRefs.current[backIndex] = sound;
            }
          }
        }

        if (frontIndex < articles.length) {
          if (i === 4 && frontIndex < soundRefs.current.length) {
            console.log("iunsetting", { frontIndex });
            soundRefs.current[frontIndex] = null;
          } else {
            if (!soundRefs.current[frontIndex]) {
              console.log("creating", {
                frontIndex,
                file: articles[frontIndex].audio_summary,
              });
              const sound = await createSoundObject(
                articles[frontIndex].audio_summary,
                articles[frontIndex].id,
                articles[frontIndex].title,
                frontIndex,
              );
              soundRefs.current[frontIndex] = sound;
            }
          }
        }
      }
      console.log("prepareSound", { soundRefs: soundRefs.current });
    }
  };

  const setLastInactive = () => {
    console.log("setLastInactive called", new Date().getTime());
    AsyncStorage.setItem("inactiveSince", "" + new Date().getTime());
  };

  const isLessThan2Hours = (lastTime: number) => {
    console.log("isLessThen2Hrs value", {
      lastTime,
      current: new Date().getTime(),
      diff: new Date().getTime() - lastTime,
      Twohrs: 2 * 60 * 60 * 1000,
    });
    return new Date().getTime() - lastTime <= 2 * 60 * 60 * 1000;
  };

  const isNextDay = (lastTime: number) => {
    return new Date(lastTime).getDate() < new Date().getDate();
  };

  const setAndPlayWelcomeSound = async (welcomeSoundUri: string) => {
    const { sound } = await Audio.Sound.createAsync({
      uri: welcomeSoundUri,
    }).catch((error) => {
      console.error("welcomeSoundUri Create Async failed:", error);
      return;
    });
    console.log("Playing welcomeSound", welcomeSoundUri);
    if (sound) {
      const tryToPlay = setInterval(async () => {
        await sound
          .playAsync()
          .then(() => {
            clearInterval(tryToPlay);
            setWelcomeSoundStatus("playing");
            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.didJustFinish) {
                setWelcomeSoundStatus("completed");
              }
            });
          })
          .catch((error) => {
            console.info("User has not interacted with document yet.");
          });
      }, 500);
    }
  };

  async function load(append = false) {
    setIsLoading(true);
    console.log("Loading Sound");
    const newsData = await AsyncStorage.getItem("newsData");
    const inactiveSince = await AsyncStorage.getItem("inactiveSince");
    const currentNewsIndex = await AsyncStorage.getItem("currentNewsIndex");

    if (
      !append &&
      newsData &&
      currentNewsIndex > -1 &&
      inactiveSince &&
      isLessThan2Hours(+inactiveSince)
    ) {
      console.log("within 2 hrs", new Date(+inactiveSince));
      // If coming back in last 2 hrs, serve from cache
      const parsed = JSON.parse(newsData);
      console.log({ newsData: parsed });
      setArticles(parsed.articles);
      setCurrentNewsIndex(+currentNewsIndex);
      setWelcomeSoundStatus("ignored");
    } else {
      console.log("not within 2 hrs", { inactiveSince, user });
      try {
        setWelcomeSoundStatus("loading");
        const articlesResponse: News = await fetchNews({
          isFirstTimeEver: (user?.isFirstTimeEver || true).toString(),
          isFirstTimeToday: (user?.isFirstTimeToday || true).toString(),
        });

        // If first time or coming back on next day
        let articlesToSet = articlesResponse.articles;

        if (newsData && currentNewsIndex !== null) {
          if (inactiveSince && !isNextDay(+inactiveSince)) {
            console.log("current day", {
              append,
              inactiveSince: new Date(+inactiveSince),
              newsData,
              currentNewsIndex,
            });
            // if coming back within current day
            const parsed: News = JSON.parse(newsData);
            if (append) {
              // If reached end of list, add new items
              articlesToSet = [
                ...parsed.articles,
                ...articlesResponse.articles,
              ];
            } else {
              articlesToSet = [
                ...articlesResponse.articles,
                ...parsed.articles.splice(+currentNewsIndex),
              ];
              setCurrentNewsIndex(0);
              await AsyncStorage.setItem("currentNewsIndex", "0");
            }
          } else {
            setCurrentNewsIndex(+currentNewsIndex);
          }
        } else {
          setCurrentNewsIndex(0);
        }

        setArticles(articlesToSet);
        const modifiedResponse = {
          ...articlesResponse,
          count: articlesToSet.length,
          articles: articlesToSet,
        };
        console.log({ articlesToSet, currentNewsIndex, modifiedResponse });
        newsResponse.current = modifiedResponse;
        await AsyncStorage.setItem(
          "newsData",
          JSON.stringify(modifiedResponse),
        );

        if (articlesResponse.intro_audio)
          setAndPlayWelcomeSound(articlesResponse.intro_audio);
        else welcomeSoundStatus = "ignored";
      } catch (err) {
        if (err.message >= 400) {
          logout();
        }
        console.error(err);
        // setArticles(mockNewsData.articles);
        // await AsyncStorage.setItem("newsData", JSON.stringify(mockNewsData));
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (welcomeSoundStatus === "completed") {
      playSound();
    }
  }, [welcomeSoundStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 10000); // 15000 milliseconds = 15 seconds

    load();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!", isPlaying);
        if (
          !isPlaying &&
          (welcomeSoundStatus === "completed" ||
            welcomeSoundStatus === "ignored")
        )
          load();
      }

      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log("App has come to the background!");
        setLastInactive();
        flushQueue();
      }
      trackEvent("visibilityChange", null, null, null, null, { nextAppState });

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (mounted.current) {
      playSound();
      prepareSounds();
    }
    mounted.current = true;
  }, [currentNewsIndex]);

  const handleNext = async () => {
    if (currentlyPlaying.current) {
      currentlyPlaying.current?.stopAsync();
      // currentlyPlaying.current?.unloadAsync();
      currentlyPlaying.current = null;
    }
    const newIndex = currentNewsIndex + 1;
    if (newIndex >= articles.length - 2) {
      await load(true);
    }
    trackEvent(
      "next",
      articles[currentNewsIndex].id,
      articles[currentNewsIndex].title,
      currentNewsIndex,
      progress,
    );
    AsyncStorage.setItem("currentNewsIndex", "" + newIndex);
    setCurrentNewsIndex(newIndex);
  };

  const handlePrev = () => {
    currentlyPlaying.current?.stopAsync();
    // currentlyPlaying.current?.unloadAsync();
    currentlyPlaying.current = null;
    const newIndex = currentNewsIndex - 1;
    trackEvent(
      "previous",
      articles[currentNewsIndex].id,
      articles[currentNewsIndex].title,
      currentNewsIndex,
      progress,
    );
    AsyncStorage.setItem("currentNewsIndex", "" + newIndex);
    setCurrentNewsIndex(newIndex);
  };

  const getCurrentNewsItem = () => {
    return articles &&
      articles.length > 0 &&
      currentNewsIndex >= 0 &&
      currentNewsIndex < articles.length
      ? articles[currentNewsIndex]
      : null;
  };

  const handleRating = async (rating: any) => {
    const currentItem = getCurrentNewsItem();
    if (currentItem) {
      try {
        trackEvent(
          rating === "positive" ? "like" : "dislike",
          currentItem.id,
          currentItem.title,
          currentNewsIndex,
          progress,
        );
        setRatingMessage("Thanks for rating!");
        setTimeout(() => setRatingMessage(""), 3000);
      } catch (error) {
        console.error("Failed to submit rating:", error);
        setRatingMessage("Rating failed. Please try again.");
        setTimeout(() => setRatingMessage(""), 3000);
      }
    }
  };

  // console.log({ progress, showPlayerControls });
  if (articles.length === 0) return null;
  // console.log({ isPlaying, isLoading });
  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />
      {welcomeSoundStatus === "playing" || welcomeSoundStatus === "loading" ? (
        <FullScreenBackground src={"../assets/logo.png"} />
      ) : (
        <AppContainer>
          <FullScreenBackground
            src={articles?.[currentNewsIndex]?.image || "../assets/bg1.jpg"}
          />
          <ContentContainer>
            <Card>
              <BackgroundOverlay
                source={
                  articles?.[currentNewsIndex]?.image
                    ? { uri: articles?.[currentNewsIndex]?.image }
                    : require("../assets/bg1.jpg")
                }
              />

              <ContentWrapper>
                <MainContent>
                  <TopSection welcomeShown={showWelcome}>
                    <PlaylistInfo show={showWelcome}>
                      <Title>
                        Hello{" "}
                        {/* {user.firstName.charAt(0).toUpperCase() +
                user.firstName.slice(1).toLowerCase()} */}
                      </Title>
                      <Subtitle>Your {getTimeOfDay()} newscast</Subtitle>
                    </PlaylistInfo>
                    <NewsInfo welcomeShown={showWelcome}>
                      {renderContent}
                    </NewsInfo>
                  </TopSection>
                  {showPlayerControls ? (
                    <>
                      <ControlsWrapper>
                        <RatingButtons>
                          <RatingMessage visible={!!ratingMessage}>
                            {ratingMessage}
                          </RatingMessage>
                          <RatingButton
                            onPress={() => handleRating("negative")}
                            disabled={isLoading}
                          >
                            <Svg viewBox="0 0 24 24">
                              <Path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                            </Svg>
                          </RatingButton>
                          <RatingButton
                            onPress={() => handleRating("positive")}
                            disabled={isLoading}
                          >
                            <Svg viewBox="0 0 24 24">
                              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
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
                            onPress={() =>
                              isPlaying ? pauseSound() : playSound()
                            }
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
                              !articles ||
                              currentNewsIndex >= articles.length - 1
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
                      </ControlsWrapper>
                      <SummaryWrapper>
                        <SummaryTitle>Summary</SummaryTitle>
                        <SummaryText>
                          {articles[currentNewsIndex]?.summary_50 ||
                            "No summary available."}
                        </SummaryText>
                      </SummaryWrapper>
                    </>
                  ) : (
                    <Text></Text>
                  )}
                </MainContent>
              </ContentWrapper>
            </Card>
          </ContentContainer>
        </AppContainer>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    // alignItems: 'center',
    // justifyContent: 'center',
    // position: "absolute"
  },
  flex: {
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
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
