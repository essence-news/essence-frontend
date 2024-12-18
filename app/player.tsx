import { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  AppState,
  View,
  ImageBackground,
  Pressable,
  Platform,
  Linking,
  Share,
  Alert,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import AntDesign from "@expo/vector-icons/AntDesign";
import { WebView } from "react-native-webview";

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
  ContentWrapper,
  MainContent,
  H5,
  StyledActivityIndicator,
  H3,
} from "@/components/SharedComponents";
import { useTheme } from "styled-components/native";
import BrandHeader from "@/components/BrandHeader";
import { useAuth } from "@/utils/AuthProvider";
import { mockNewsData } from "@/constants/mock";
import { flushQueue, trackEvent } from "@/utils/trackingUtil";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { createSoundObject, getTimeOfDay } from "@/utils/commonUtils";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import { Article, News } from "@/utils/types";
import OutsidePressHandler from "react-native-outside-press";
import JoinButton from "@/components/JoinButton";
import FadeInView from "@/components/FadeInView";

const StyledCollapsibleHeaderScrollView = styled(CollapsibleHeaderScrollView)`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const WebViewContainer = styled.View`
  flex: 1;
  margin-top: 0px;
`;

const SummaryTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const SummaryContentContainer = styled.View`
  margin-top: 20px;
`;

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

const ReplayButtonContainer = styled.View`
  margintop: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReplayText = styled.Text`
  color: #fff;
`;
const SpeedLabel = styled(H3)`
  color: #fff;
`;

const CollapsibleHeaderScrollViewContainer = styled.View`
  flex: 1;
  width: 100%;
  max-width: 500px;
  justify-content: flex-start;
  margin-top: 0px;
  padding-top: 10px;
  border: none;
`;

const BackButton = styled.Pressable`
  padding: 20px;
  margin-top: 30px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
`;

const BackToPlayerText = styled(H5)`
  color: black;
`;

const StyledLinearGradient = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
`;

const PlayerContainer = styled.View`
  flex: 1;
  width: 100%;
  max-width: 500px;
  justify-content: flex-start;
  border: none;
`;

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    // minHeight: 800,
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  playerControls: {
    width: "100%",
    marginTop: "auto",
    justifyContent: "space-around",
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
  image: {
    marginTop: 50,
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

const SpeedOptionsContainer = styled.View`
  position: absolute;
  top: -250px;
  right: -75px;
`;

const SpeedText = styled(H5) <{ selected: boolean }>`
  background-color: ${({ theme }) => theme.colors.overlay};
  color: ${({ selected, theme }) =>
    selected ? theme.colors.accent : theme.colors.text};
  padding: 10px 30px;
  font-family: "${({ theme }) => theme.fonts.bodyBold}";
`;

const JoinEssenceContainer = styled(View)`
  flex-direction: column;
  gap: 10px;
  margin-block: 10px;
  justify-content: center;
  align-items: center;
`;

export default function Player({ sharedArticle }: { sharedArticle?: Article }) {
  const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(-1);
  const { user, prepareWelcomeSound, initialWelcomeSound } = useAuth();
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [rate, setRate] = useState(1.0);
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
  const [showWebView, setShowWebView] = useState(false);
  const showWelcomeScreen =
    welcomeSoundStatus === "playing" || welcomeSoundStatus === "loading";

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
          {user ? (
            <Text>
              Great job on listening!{"\n\n"}
              All caught up!{"\n"}
              Please check back later for more news
            </Text>
          ) : (
            <JoinEssenceContainer>
              <Text>Join essence for more news.</Text>
              <JoinButton />
            </JoinEssenceContainer>
          )}
          <ReplayButtonContainer>
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
            <ReplayText>Replay</ReplayText>
          </ReplayButtonContainer>
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
        articles[currentNewsIndex].article_id,
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
      articles[currentNewsIndex].article_id,
      articles[currentNewsIndex].title,
      currentNewsIndex,
      progress,
    );
  };

  async function playSound() {
    console.log("playSound called");
    console.log({ welcomeSoundStatus, articles: articles.length });
    const localCurrentNewsIndex = currentNewsIndex;

    if (
      (welcomeSoundStatus !== "completed" &&
        welcomeSoundStatus !== "ignored") ||
      articles.length === 0 ||
      isPlaying
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
        articles[currentNewsIndex].article_id,
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
      publicKey: articles[currentNewsIndex].public_key,
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
              articles[currentNewsIndex].article_id,
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
              articles[currentNewsIndex]?.article_id,
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
                articles[currentNewsIndex].article_id,
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
                  articles[currentNewsIndex]?.article_id,
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
      sound.setStatusAsync({ rate, shouldCorrectPitch: true });
    }
  }

  async function pauseSound() {
    console.log("pausing sound");
    await currentlyPlaying.current?.pauseAsync();
    setIsPlaying(false);
    trackEvent(
      "pause",
      articles[currentNewsIndex].article_id,
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
                articles[backIndex].article_id,
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
                articles[frontIndex].article_id,
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
      res: new Date().getTime() - lastTime <= 2 * 60 * 60 * 1000,
    });
    return new Date().getTime() - lastTime <= 2 * 60 * 60 * 1000;
  };

  const isSameDay = (lastTime: number) => {
    return new Date(lastTime).getDate() === new Date().getDate();
  };

  const setAndPlayWelcomeSound = async () => {
    console.log("setandplayWelcomesound", initialWelcomeSound);
    let sound = initialWelcomeSound?.sound;
    if (!sound) {
      console.error(
        "failed to initialize welcome sound - missing URI",
        initialWelcomeSound,
      );
      setWelcomeSoundStatus("ignored");
      return;
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
              welcomeSoundRef.current = null;
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
      if (inactiveSince && !isLessThan2Hours(+inactiveSince))
        await prepareWelcomeSound();
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

  const handleLeavePlayer = () => {
    setLastInactive();
    flushQueue();
  };

  const handleSharedArticlePresent = async () => {
    let articlesToSet = [];
    const newsDataFromStorage = await AsyncStorage.getItem("newsData");
    const newIndexFromStorage = await AsyncStorage.getItem("currentNewsIndex");

    if (user && newsDataFromStorage) {
      const parsed = JSON.parse(newsDataFromStorage);
      articlesToSet = [
        sharedArticle,
        ...parsed.articles.splice(+(newIndexFromStorage || 0)),
      ];
      await AsyncStorage.setItem(
        "newsData",
        JSON.stringify({
          ...parsed,
          articles: articlesToSet,
        }),
      );
    } else {
      articlesToSet.push(sharedArticle);
    }
    setArticles(articlesToSet);
    setCurrentNewsIndex(0);
    AsyncStorage.setItem("currentNewsIndex", "0");
    setWelcomeSoundStatus("ignored");
  };

  useEffect(() => {
    console.log("useEffect", {
      currentNewsIndex,
      currentlyPlaying: currentlyPlaying.current,
    });
    if (sharedArticle) return;
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
          currentNewsIndex,
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
        console.log("App has come to the background!", {
          welcomeSoundStatus,
          isPlaying,
          currentNewsIndex,
          currentlyPlaying: currentlyPlaying.current,
        });
        handleLeavePlayer();
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
  }, [welcomeSoundStatus]);

  useEffect(() => {
    // console.log("***********callling load");
    // load();
    return async () => {
      handleLeavePlayer();
      if (currentlyPlaying.current?._loaded) {
        await currentlyPlaying.current?.stopAsync();
        await currentlyPlaying.current?.unloadAsync();
      }
      if (welcomeSoundRef.current?._loaded) {
        await welcomeSoundRef.current?.stopAsync();
        await welcomeSoundRef.current?.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    console.log("will call play sound with currentNewsIndex", {
      currentNewsIndex,
      currentlyPlaying: currentlyPlaying.current,
    });

    if (mounted.current && currentNewsIndex < articles.length) {
      playSound();
      prepareSounds(currentNewsIndex);
    }
    if (
      currentNewsIndex >= articles.length &&
      welcomeSoundStatus !== "playing"
    ) {
      setWelcomeSoundStatus("ignored");
    }
    if (!mounted.current) {
      console.log("***********callling load", { sharedArticle });
      if (sharedArticle) {
        handleSharedArticlePresent();
      } else {
        load();
      }
    }
    mounted.current = true;
  }, [currentNewsIndex]);

  useEffect(() => {
    if (currentlyPlaying.current) {
      currentlyPlaying.current.setStatusAsync({
        rate,
        shouldCorrectPitch: true,
      });
    }
  }, [rate]);

  const handleNext = async () => {
    if (!user && isPlaying) {
      goToHome();
      return;
    }
    console.log("handleNext before", {
      currentlyPlaying: currentlyPlaying.current,
    });
    if (currentlyPlaying.current) {
      await currentlyPlaying.current?.stopAsync();
      // await currentlyPlaying.current?.unloadAsync();
      currentlyPlaying.current = null;
    }
    setIsPlaying(false);
    const newIndex = currentNewsIndex + 1;
    console.log("handleNext", {
      newIndex,
      currentlyPlaying: currentlyPlaying.current,
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
      articles[currentNewsIndex].article_id,
      articles[currentNewsIndex].title,
      currentNewsIndex,
      progress,
    );
  };

  const handlePrev = async () => {
    if (!user && isPlaying) {
      goToHome();
      return;
    }
    await currentlyPlaying.current?.stopAsync();
    setIsPlaying(false);

    // await currentlyPlaying.current?.unloadAsync();
    currentlyPlaying.current = null;
    const newIndex = currentNewsIndex - 1;
    trackEvent(
      "previous",
      articles[currentNewsIndex].article_id,
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
          currentItem.article_id,
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

  const toggleShowArticleDetails = (val: boolean) => {
    console.log("will show details", {
      val,
      url: articles[currentNewsIndex].url,
    });
    if (val) {
      pauseSound();
      if (Platform.OS === "web")
        Linking.openURL(articles[currentNewsIndex].url);
      else {
        setIsLoading(true);
        setShowWebView(true);
      }
    } else {
      playSound();
      setIsLoading(false);
      setShowWebView(false);
    }
  };
  const [webViewHeight, setWebViewHeight] = useState(null);
  const onMessage = (event) => {
    console.log(event.nativeEvent.data);
    setWebViewHeight(Number(event.nativeEvent.data));
  };
  const injectedJavaScript = `
  window.ReactNativeWebView.postMessage(
    Math.max(document.body.offsetHeight, document.body.scrollHeight)
  );`;

  const handleGoToPreferences = async () => {
    if (currentlyPlaying.current) {
      await currentlyPlaying.current.stopAsync();
      await currentlyPlaying.current.unloadAsync();
    }
    router.push("/preferences");
  };
  const handleShareClick = async () => {
    if (Platform.OS === "web") {
      if (navigator?.share) {
        navigator.share({
          text: `Open this link to listen to article \n \n ${process.env.EXPO_PUBLIC_ESSENCE_APP_URL}/sharedNews/${articles[currentNewsIndex].public_key}`,
        });
      } else {
        alert("Not supported");
      }
    } else {
      const options = {
        // message: "https://getessence.app",
        message: `Open this link to listen to article \n \n ${process.env.EXPO_PUBLIC_ESSENCE_APP_URL}/sharedNews/${articles[currentNewsIndex].public_key}`,
      };
      console.log("will share", {
        article: articles[currentNewsIndex],
        options,
      });
      try {
        const result = await Share.share(options);
        console.log("will share", { result });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error: any) {
        Alert.alert(error.message);
      }
    }
  };

  const handleShowSpeedOptions = () => {
    setShowSpeedOptions(true);
  };

  const handleSpeedChange = (_rate: number) => {
    setRate(_rate);
    setShowSpeedOptions(false);
  };

  const goToHome = () => {
    router.push("/home");
  };
  // console.log({ progress, showPlayerControls });
  // console.log({
  //   welcomeSoundStatus,
  //   showWelcomeScreen,
  //   isPlaying,
  //   isLoading,
  //   needsUserInput,
  //   articles: articles.length,
  //   currentNewsIndex,
  //   OS: Platform.OS,
  // });
  return (
    <SafeAreaView
      style={styles.container}
      onTouchEnd={() => console.log("touch end")}
    >
      <BrandHeader />
      <View style={{ zIndex: 11, position: "absolute", right: 20, top: 12 }}>
        {user ? (
          <Pressable onPress={handleGoToPreferences}>
            <AntDesign name="setting" color={theme.colors.brand} size={24} />
          </Pressable>
        ) : (
          <JoinButton />
        )}
      </View>
      {showWebView ? (
        <CollapsibleHeaderScrollViewContainer>
          <StyledCollapsibleHeaderScrollView
            CollapsibleHeaderComponent={
              <BackButton onPress={() => toggleShowArticleDetails(false)}>
                <AntDesign name="left" size={20} color={theme.colors.primary} />
                <BackToPlayerText>Back to player</BackToPlayerText>
              </BackButton>
            }
            headerHeight={110}
            headerContainerBackgroundColor={theme.colors.secondary}
            statusBarHeight={Platform.OS === "ios" ? 20 : 0}
          >
            <WebViewContainer>
              {Platform.OS === "web" ? (
                <iframe
                  src={articles[currentNewsIndex].url}
                  style={styles.webview}
                />
              ) : (
                <>
                  {isLoading && (
                    <StyledActivityIndicator
                      size="large"
                      color={theme.colors.primary}
                    />
                  )}
                  <WebView
                    onMessage={onMessage}
                    injectedJavaScript={injectedJavaScript}
                    originWhitelist={["*"]}
                    onNavigationStateChange={(p) => {
                      console.log("state change", p);
                      setIsLoading(p.loading);
                    }}
                    // nestedScrollEnabled
                    source={{
                      uri: articles[currentNewsIndex].url,
                    }}
                    style={{ ...styles.webview, height: webViewHeight }}
                  />
                </>
              )}
            </WebViewContainer>
          </StyledCollapsibleHeaderScrollView>
        </CollapsibleHeaderScrollViewContainer>
      ) : (
        <GestureRecognizer
          onSwipeLeft={handleLeftSwipe}
          onSwipeRight={handleRightSwipe}
          config={config}
          style={styles.container}
        >
          <PlayerContainer>
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
              <StyledLinearGradient
                id="gradient"
                colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
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
              <ContentWrapper style={styles.container}>
                <MainContent>
                  <TopSection>
                    {showWelcomeScreen && welcomeSoundStatus !== "loading" ? (
                      <PlaylistInfo>
                        <Title>Hello {user?.first_name}</Title>
                        <Subtitle>Your {getTimeOfDay()} newscast</Subtitle>
                      </PlaylistInfo>
                    ) : (
                      <NewsInfo>{renderContent()}</NewsInfo>
                    )}
                  </TopSection>

                  {showPlayerControls && (
                    <View style={styles.playerControls}>
                      {user && (
                        <RatingButtons>
                          <RatingMessage visible={!!ratingMessage}>
                            {ratingMessage}
                          </RatingMessage>
                          <RatingButton
                            onPress={() => handleRating("negative")}
                            disabled={isLoading}
                          >
                            <AntDesign
                              name="dislike2"
                              color={theme.colors.text}
                              size={30}
                            />
                          </RatingButton>
                          <RatingButton
                            onPress={() => handleRating("positive")}
                            disabled={isLoading}
                          >
                            <AntDesign
                              name="like2"
                              color={theme.colors.text}
                              size={30}
                            />
                          </RatingButton>
                        </RatingButtons>
                      )}
                      <ProgressBar>
                        <Progress progress={progress} />
                      </ProgressBar>
                      <Controls>
                        <ControlButton onPress={handleShowSpeedOptions}>
                          <SpeedLabel>{rate}x</SpeedLabel>
                          {/* <AntDesign
                            name="dashboard"
                            color={theme.colors.text}
                            size={26}
                          /> */}
                          {showSpeedOptions && (
                            <OutsidePressHandler
                              onOutsidePress={() => {
                                setShowSpeedOptions(false);
                              }}
                            >
                              <FadeInView>
                                <SpeedOptionsContainer>
                                  <Pressable
                                    onPress={() => handleSpeedChange(0.75)}
                                  >
                                    <SpeedText selected={rate === 0.75}>
                                      0.75x
                                    </SpeedText>
                                  </Pressable>
                                  <Pressable
                                    onPress={() => handleSpeedChange(1)}
                                  >
                                    <SpeedText selected={rate === 1}>
                                      1x
                                    </SpeedText>
                                  </Pressable>
                                  <Pressable
                                    onPress={() => handleSpeedChange(1.25)}
                                  >
                                    <SpeedText selected={rate === 1.25}>
                                      1.25x
                                    </SpeedText>
                                  </Pressable>
                                  <Pressable
                                    onPress={() => handleSpeedChange(1.5)}
                                  >
                                    <SpeedText selected={rate === 1.5}>
                                      1.5x
                                    </SpeedText>
                                  </Pressable>
                                  <Pressable
                                    onPress={() => handleSpeedChange(1.75)}
                                  >
                                    <SpeedText selected={rate === 1.75}>
                                      1.75x
                                    </SpeedText>
                                  </Pressable>
                                  <Pressable
                                    onPress={() => handleSpeedChange(2)}
                                  >
                                    <SpeedText selected={rate === 2}>
                                      2x
                                    </SpeedText>
                                  </Pressable>
                                </SpeedOptionsContainer>
                              </FadeInView>
                            </OutsidePressHandler>
                          )}
                        </ControlButton>
                        <ControlButton
                          onPress={handlePrev}
                          disabled={prevDisabled}
                        >
                          <AntDesign
                            name="leftcircleo"
                            color={theme.colors.text}
                            size={26}
                          />
                          {/* <Svg
                            viewBox="0 0 24 24"
                            width={30}
                            height={30}
                            fill={theme.colors.text}
                          >
                            <Path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                          </Svg> */}
                        </ControlButton>
                        <ControlButton
                          onPress={() =>
                            isPlaying ? pauseSound() : playSound()
                          }
                          disabled={
                            isLoading || currentNewsIndex >= articles.length
                          }
                        >
                          {isLoading ? (
                            <AntDesign
                              name="hourglass"
                              color={theme.colors.text}
                              size={26}
                            />
                          ) : // <Svg
                            //   viewBox="0 0 24 24"
                            //   width={30}
                            //   height={30}
                            //   fill={theme.colors.text}
                            // >
                            //   <Path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z" />
                            // </Svg>
                            isPlaying ? (
                              // <Svg
                              //   viewBox="0 0 24 24"
                              //   width={30}
                              //   height={30}
                              //   fill={theme.colors.text}
                              // >
                              //   <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                              // </Svg>
                              <AntDesign
                                name="pausecircleo"
                                color={theme.colors.text}
                                size={30}
                              />
                            ) : (
                              <AntDesign
                                name="playcircleo"
                                color={theme.colors.text}
                                size={26}
                              />
                              // <Svg
                              //   viewBox="0 0 24 24"
                              //   width={30}
                              //   height={30}
                              //   fill={theme.colors.text}
                              // >
                              //   <Path d="M8 5v14l11-7z" />
                              // </Svg>
                            )}
                        </ControlButton>
                        <ControlButton
                          onPress={handleNext}
                          disabled={user ? nextDisabled : false}
                        >
                          {/* <Svg
                            viewBox="0 0 24 24"
                            width={30}
                            height={30}
                            fill={theme.colors.text}
                          >
                            <Path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                          </Svg> */}
                          <AntDesign
                            name="rightcircleo"
                            color={theme.colors.text}
                            size={26}
                          />
                        </ControlButton>
                        {/* <Text style={{ color: "white" }}>
                          {currentNewsIndex + 1}/{articles.length}
                        </Text> */}
                        {/* {articles[currentNewsIndex]?.public_key && (
                          <ControlButton onPress={handleShareClick}>
                            <AntDesign
                              name="sharealt"
                              color={theme.colors.text}
                              size={30}
                            />
                          </ControlButton>
                        )} */}
                      </Controls>
                      <SummaryWrapper>
                        <SummaryTitleContainer>
                          <SummaryTitle>Summary</SummaryTitle>
                          <Pressable
                            onPress={() => {
                              toggleShowArticleDetails(true);
                            }}
                          >
                            <Ionicons
                              name="open-outline"
                              size={24}
                              color={theme.colors.white}
                            />
                          </Pressable>
                        </SummaryTitleContainer>
                        <SummaryContentContainer>
                          <SummaryText>
                            {articles[currentNewsIndex]?.summary_50 ||
                              "No summary available."}
                          </SummaryText>
                        </SummaryContentContainer>
                      </SummaryWrapper>
                    </View>
                  )}
                </MainContent>
              </ContentWrapper>
            </ImageBackground>
          </PlayerContainer>
        </GestureRecognizer>
      )}
    </SafeAreaView>
  );
}
