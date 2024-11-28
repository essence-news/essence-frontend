import { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  AppState,
  View,
  ImageBackground,
  Pressable,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { fetchNews } from "@/utils/api";
import {
  CategoryButton,
  CategoryContainer,
  ControlButton,
  Controls,
  ErrorMessage,
  InfoMessage,
  NewsHeadline,
  NewsInfo,
  PlaylistInfo,
  Progress,
  ProgressBar,
  RatingButton,
  RatingButtons,
  RatingMessage,
  CenterButton,
  Subtitle,
  SummaryText,
  SummaryTitle,
  SummaryWrapper,
  Title,
  TopSection,
  ReplayButton,
} from "@/components/SharedComponents";
import { useTheme } from "styled-components/native";
import BrandHeader from "@/components/BrandHeader";
import { useAuth } from "@/utils/AuthProvider";
import { mockNewsData } from "@/constants/mock";
import { flushQueue, trackEvent } from "@/utils/trackingUtil";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { createSoundObject } from "@/utils/commonUtils";

export const CircularButton = styled.Pressable`
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  border: 1px solid #999;
  position: fixed;
  top: 50%;
  left: 50%;
`;

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

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

export default function Player() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(-1);
  const { user, ensureTokenValidity, initialWelcomeSound } = useAuth();
  const mounted = useRef(false);
  const userRef = useRef(user);
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [progress, setProgress] = useState(0);
  const [needsUserInput, setNeedsUserInput] = useState(false);
  const [welcomeSoundStatus, setWelcomeSoundStatus] =
    useState<string>("loading");
  const [ratingMessage, setRatingMessage] = useState("");
  const currentlyPlaying = useRef<Sound | null>(null);
  const soundRefs = useRef<Sound[] | null[]>([]);
  const autoPlayStarted = useRef(false);
  const newsResponse = useRef<News>();
  const welcomeSoundRef = useRef<Sound | null>(null);
  const appState = useRef(AppState.currentState);
  const { logout } = useAuth();

  const showWelcomeScreen =
    welcomeSoundStatus === "playing" ||
    welcomeSoundStatus === "loading" ||
    needsUserInput;

  const showPlayerControls = useMemo(() => {
    return (
      articles &&
      articles.length > 0 &&
      currentNewsIndex < articles.length &&
      !showWelcomeScreen
    );
  }, [articles, currentNewsIndex, showWelcomeScreen]);

  const renderContent = () => {
    if (showWelcomeScreen) return null;
    if (
      !articles ||
      articles.length === 0 ||
      currentNewsIndex >= articles.length
    ) {
      return (
        <InfoMessage>
          Great job on listening!
          <br />
          <br /> All caught up!
          <br /> Please check back later for more news
          <View
            style={{
              marginTop: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReplayButton
              onPress={async () => {
                await AsyncStorage.setItem("currentNewsIndex", "0");
                setCurrentNewsIndex(0);
              }}
            >
              <AntDesign
                style={{ fontWeight: "bold" }}
                name="reload1"
                size={24}
                color="black"
              />
            </ReplayButton>
            <Text style={{ color: "#fff" }}>Replay</Text>
          </View>
        </InfoMessage>
      );
    }

    const article = articles[currentNewsIndex];
    return (
      <>
        <NewsHeadline>{article.title}</NewsHeadline>
        <CategoryContainer>
          {article.categories.map((category, index) => (
            <CategoryButton key={index}>#{category}</CategoryButton>
          ))}
        </CategoryContainer>
      </>
    );
  };

  const onPlaybackStatusUpdate = (status: any) => {
    // console.log({ status });
    if (status.isLoaded && status.durationMillis) {
      const progressPercent =
        (status.positionMillis / status.durationMillis) * 100;
      setProgress(progressPercent);
    }
    if (status.didJustFinish) {
      setIsPlaying(false);
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
    console.log({ welcomeSoundStatus, articles: articles.length });
    const localCurrentNewsIndex = currentNewsIndex;

    if (
      (welcomeSoundStatus !== "completed" &&
        welcomeSoundStatus !== "ignored") ||
      articles.length === 0
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
      // soundRefs: soundRefs.current,
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
      console.log(
        "Not found in refs, creating sound object",
        currentNewsIndex,
        articles[currentNewsIndex].audio_summary,
      );
      sound = await createSoundObject(
        articles[currentNewsIndex].audio_summary,
        articles[currentNewsIndex].id,
        articles[currentNewsIndex].title,
        currentNewsIndex,
      );
    }
    if (localCurrentNewsIndex !== currentNewsIndex) {
      // not the current sound to play
      await sound?.stopAsync();
      await sound?.unloadAsync();
      sound = null;
      console.log("not matching, will not play", {
        localCurrentNewsIndex,
        currentNewsIndex,
      });
      return;
    }
    console.log("Playing Sound", {
      index: currentNewsIndex,
      ref: soundRefs.current[currentNewsIndex],
      file: articles[currentNewsIndex].audio_summary,
      sound,
    });
    setIsLoading(false);
    if (sound) {
      currentlyPlaying.current = sound;
      if (autoPlayStarted.current) {
        await sound
          .playAsync()
          .then(() => {
            trackEvent(
              "play",
              articles[currentNewsIndex].id,
              articles[currentNewsIndex].title,
              currentNewsIndex,
              progress,
            );
            // console.log("Src=", await getData("src"))
            setIsPlaying(true);
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
          })
          .catch((error) => {
            console.error(
              "Auto-play failed:",
              error,
              error.message,
              articles[currentNewsIndex],
            );
            trackEvent(
              "error",
              articles[currentNewsIndex]?.id,
              articles[currentNewsIndex]?.title,
              currentNewsIndex,
              0,
              { errorType: "autoplay-play", message: error.message },
            );
          });
      } else {
        // initial time, to handle user input waiting error
        const tryToPlay = setInterval(async () => {
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
              setNeedsUserInput(false);
              autoPlayStarted.current = true;
              sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            })
            .catch((error) => {
              console.error(
                "Auto-play failed:",
                error,
                error.message,
                articles[currentNewsIndex],
              );
              if (error.message.includes("interact")) setNeedsUserInput(true);
              else {
                trackEvent(
                  "error",
                  articles[currentNewsIndex]?.id,
                  articles[currentNewsIndex]?.title,
                  currentNewsIndex,
                  0,
                  { errorType: "autoplay-play", message: error.message },
                );
                clearInterval(tryToPlay);
              }
            });
        }, 500);
      }
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

  const prepareSounds = async (index: number) => {
    if (articles?.length > 0) {
      // console.log("prepareSound", {
      //   currentNewsIndex,
      //   articles,
      //   soundRefs: soundRefs.current,
      // });
      for (let i = 0; i < 5; i++) {
        const backIndex = index - i;
        const frontIndex = index + i;
        console.log("prepareSound", { i, backIndex, frontIndex });
        if (backIndex >= 0) {
          if (i === 4) {
            console.log("iunsetting", { backIndex });
            // unset the 5th object from back
            if (soundRefs.current[backIndex]) {
              await soundRefs.current[backIndex]?.unloadAsync();
            }
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
            if (soundRefs.current[frontIndex]) {
              await soundRefs.current[frontIndex]?.unloadAsync();
            }
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
      console.log("prepareSound", {
        soundRefs: soundRefs.current.map((s) => (s ? s?._key?.src : s)),
      });
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

  const isSameDay = (lastTime: number) => {
    return new Date(lastTime).getDate() === new Date().getDate();
  };

  const setAndPlayWelcomeSound = async () => {
    console.log("setandplayWelcomesound", initialWelcomeSound);
    let sound = initialWelcomeSound.sound;
    if (!sound) {
      console.info(
        "cound not find welcome sound - will initialize from uri",
        initialWelcomeSound,
      );
      sound = await createSoundObject(initialWelcomeSound.uri);
    }
    if (!sound) {
      console.error(
        "failed to initialize welcome sound - missing URI",
        initialWelcomeSound,
      );
      setWelcomeSoundStatus("ignored");
    }
    welcomeSoundRef.current = sound;
    console.log("Playing welcomeSound", initialWelcomeSound.uri);
    if (sound) {
      const tryToPlay = setInterval(async () => {
        await sound
          .playAsync()
          .then(() => {
            clearInterval(tryToPlay);
            setWelcomeSoundStatus("playing");
            setNeedsUserInput(false);
            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.didJustFinish) {
                setWelcomeSoundStatus("completed");
                welcomeSoundRef.current = null;
              }
            });
          })
          .catch((error) => {
            if (error.message.includes("interact")) {
              console.info("User has not interacted with document yet.");
              setNeedsUserInput(true);
            } else {
              console.error(
                "Welcome message Auto-play failed:",
                error,
                error.message,
                initialWelcomeSound.uri,
              );
              clearInterval(tryToPlay);
              setWelcomeSoundStatus("completed");
            }
          });
      }, 500);
    }
  };

  async function load(append = false) {
    setIsLoading(true);
    const newsData = await AsyncStorage.getItem("newsData");
    const inactiveSince = await AsyncStorage.getItem("inactiveSince");
    const currentNewsIndex = await AsyncStorage.getItem("currentNewsIndex");

    const parsed: News = newsData ? JSON.parse(newsData) : null;
    console.log("Loading Sound", {
      currentNewsIndex,
      articles: articles.length,
      append,
      inactiveSince,
      parsed,
      user,
    });

    if (!append && (!inactiveSince || !isLessThan2Hours(+inactiveSince))) {
      console.log("will play welcome sound");
      // handle when we get data after last entry
      setAndPlayWelcomeSound();
    } else {
      console.log("welcome sound  ignored");
      setWelcomeSoundStatus("ignored");
    }

    if (
      !append &&
      parsed &&
      currentNewsIndex &&
      +currentNewsIndex > -1 &&
      +currentNewsIndex < parsed.articles.length &&
      inactiveSince &&
      isLessThan2Hours(+inactiveSince)
    ) {
      console.log("within 2 hrs", new Date(+inactiveSince));
      // If coming back in last 2 hrs, serve from cache
      // console.log({ newsData: parsed });
      setArticles(parsed.articles);
      setCurrentNewsIndex(+currentNewsIndex);
      setWelcomeSoundStatus("ignored");
    } else {
      // if (!user) {
      //   userRef.current = await ensureTokenValidity();
      // }
      console.log("load() else block", {
        inactiveSince,
        user,
        userRef: userRef.current,
        currentNewsIndex,
        append,
      });
      try {
        if (
          !append &&
          currentNewsIndex &&
          +currentNewsIndex < articles.length
        ) {
          // dont load welcome screen when loading next items or when reached end
          setWelcomeSoundStatus("loading");
        }
        const articlesResponse: News = await fetchNews({
          isFirstTimeEver: (
            userRef.current?.isFirstTimeEver ?? true
          ).toString(),
          isFirstTimeToday: (
            userRef.current?.isFirstTimeToday ?? true
          ).toString(),
        });
        // If first time or coming back on next day
        let articlesToSet;
        if (parsed && currentNewsIndex !== null) {
          if (!inactiveSince || isSameDay(+inactiveSince)) {
            // if coming back within current day
            console.log("same day", {
              append,
              inactiveSince,
              parsed,
              currentNewsIndex,
              articlesResponse,
            });
            if (append) {
              // If reached end of list, add new items
              articlesToSet = [
                ...parsed.articles,
                ...articlesResponse.articles,
              ];
            } else {
              // after hrs, add new items to beginning of list
              articlesToSet = [
                ...articlesResponse.articles,
                ...parsed.articles.splice(+currentNewsIndex),
              ];
              console.log("not append", { articlesToSet });
              soundRefs.current = []; // reset objects
              if (articlesToSet.length > 0) {
                setCurrentNewsIndex(0);
                await AsyncStorage.setItem("currentNewsIndex", "0");
              }
            }
          } else {
            // on next day
            soundRefs.current = []; // reset objects
            articlesToSet = articlesResponse.articles;
            setCurrentNewsIndex(0);
            await AsyncStorage.setItem("currentNewsIndex", "0");
          }
        } else {
          articlesToSet = articlesResponse.articles;
          soundRefs.current = []; // reset objects
          setCurrentNewsIndex(0);
          await AsyncStorage.setItem("currentNewsIndex", "0");
        }

        setArticles(articlesToSet);
        const modifiedResponse = {
          ...articlesResponse,
          count: articlesToSet.length,
          articles: articlesToSet,
        };
        // console.log({ articlesToSet, currentNewsIndex, modifiedResponse });
        newsResponse.current = modifiedResponse;
        await AsyncStorage.setItem(
          "newsData",
          JSON.stringify(modifiedResponse),
        );
        console.log({
          inactiveSince,
          lessThan: inactiveSince ? isLessThan2Hours(+inactiveSince) : "no",
        });
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
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!", {
          welcomeSoundStatus,
          isPlaying,
          currentlyPlaying: currentlyPlaying.current,
        });
        if (
          !isPlaying &&
          (welcomeSoundStatus === "completed" ||
            welcomeSoundStatus === "ignored") &&
          !currentlyPlaying.current
        ) {
          console.log("++++++++++++++++++callling load");

          load();
        }
      }

      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        // console.log("App has come to the background!");
        setLastInactive();
        flushQueue();
      }
      trackEvent("visibilityChange", null, null, null, null, { nextAppState });

      appState.current = nextAppState;
      console.log("AppState", appState.current);
    });
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [welcomeSoundStatus, currentlyPlaying.current]);

  useEffect(() => {
    console.log("***********callling load");
    load();
    return async () => {
      await currentlyPlaying.current?.stopAsync();
      await currentlyPlaying.current?.unloadAsync();
      await welcomeSoundRef.current?.stopAsync();
      await welcomeSoundRef.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    console.log("will call play sound with currentNewsIndex", {
      currentNewsIndex,
    });
    if (mounted.current && currentNewsIndex < articles.length) {
      playSound();
      prepareSounds(currentNewsIndex);
    }
    if (currentNewsIndex >= articles.length) {
      setWelcomeSoundStatus("ignored");
    }
    mounted.current = true;
  }, [currentNewsIndex]);

  const handleNext = async () => {
    if (currentlyPlaying.current) {
      await currentlyPlaying.current?.stopAsync();
      // await currentlyPlaying.current?.unloadAsync();
      currentlyPlaying.current = null;
    }
    const newIndex = currentNewsIndex + 1;
    console.log("handleNext", {
      newIndex,
      currentNewsIndex,
      articles: articles.length,
    });
    await AsyncStorage.setItem("currentNewsIndex", "" + newIndex);
    setCurrentNewsIndex(newIndex);
    if (newIndex === articles.length - 1) {
      await load(true);
    }
    trackEvent(
      "next",
      articles[currentNewsIndex].id,
      articles[currentNewsIndex].title,
      currentNewsIndex,
      progress,
    );
  };

  const handlePrev = async () => {
    await currentlyPlaying.current?.stopAsync();
    // await currentlyPlaying.current?.unloadAsync();
    currentlyPlaying.current = null;
    const newIndex = currentNewsIndex - 1;
    trackEvent(
      "previous",
      articles[currentNewsIndex].id,
      articles[currentNewsIndex].title,
      currentNewsIndex,
      progress,
    );
    await AsyncStorage.setItem("currentNewsIndex", "" + newIndex);
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
  const prevDisabled =
    currentNewsIndex <= 0 || currentNewsIndex >= articles.length;
  const nextDisabled = !articles || currentNewsIndex >= articles.length - 1;
  const handleRightSwipe = () => {
    console.log("Right swipe detected!");
    if (!prevDisabled) handlePrev();
  };
  const handleLeftSwipe = () => {
    console.log("Left swipe detected!");
    if (!nextDisabled) handleNext();
  };
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };
  // console.log({ progress, showPlayerControls });
  console.log({
    welcomeSoundStatus,
    isPlaying,
    isLoading,
    needsUserInput,
    articles: articles.length,
    currentNewsIndex,
    u: userRef.current,
    user,
  });
  return (
    <SafeAreaView style={styles.container}>
      <BrandHeader />
      <Pressable>
        <AntDesign name="setting" color={theme.colors.primary} size={16} />
      </Pressable>
      <GestureRecognizer
        onSwipeLeft={handleLeftSwipe}
        onSwipeRight={handleRightSwipe}
        config={config}
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 500,
            justifyContent: "flex-end",
            marginTop: 0,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: "space-between",
              // backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
          >
            <ImageBackground
              source={
                showWelcomeScreen
                  ? require("@/assets/cliparts/podcast.jpg")
                  : articles.length > 0 && currentNewsIndex < articles.length
                    ? {
                        uri: articles[currentNewsIndex].image,
                      }
                    : require("@/assets/cliparts/ecommerce.jpg")
              }
              resizeMode="cover"
              style={styles.image}
            >
              <LinearGradient
                id="gradient"
                colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: "100%",
                }}
              />
              {needsUserInput && (
                <CenterButton
                  style={{
                    transform: [{ translateX: -50 }],
                  }}
                >
                  <AntDesign name="caretright" size={36} color="black" />
                </CenterButton>
              )}
              <View style={styles.container}>
                <TopSection>
                  {showWelcomeScreen && welcomeSoundStatus !== "loading" ? (
                    <PlaylistInfo>
                      <Title>Hello {user?.firstName}</Title>
                      <Subtitle>Your {getTimeOfDay()} newscast</Subtitle>
                    </PlaylistInfo>
                  ) : (
                    <NewsInfo>{renderContent()}</NewsInfo>
                  )}
                </TopSection>
              </View>
              {showPlayerControls && (
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
                    <ControlButton onPress={handlePrev} disabled={prevDisabled}>
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
                      disabled={
                        isLoading || currentNewsIndex >= articles.length
                      }
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
                    <ControlButton onPress={handleNext} disabled={nextDisabled}>
                      <Svg
                        viewBox="0 0 24 24"
                        width={30}
                        height={30}
                        fill={theme.colors.text}
                      >
                        <Path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                      </Svg>
                    </ControlButton>
                    <Text style={{ color: "white" }}>
                      {currentNewsIndex + 1}/{articles.length}
                    </Text>
                  </Controls>
                  <SummaryWrapper>
                    <SummaryTitle>Summary</SummaryTitle>
                    <SummaryText>
                      {articles[currentNewsIndex]?.summary_50 ||
                        "No summary available."}
                    </SummaryText>
                  </SummaryWrapper>
                </View>
              )}
            </ImageBackground>
          </ScrollView>
        </View>
      </GestureRecognizer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  playerControls: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  flex: {
    flex: 1,
  },
  image: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
