import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { signIn, verifyEmail, verifyToken, refreshToken } from "./api";
import { capitalize, toCamelCase } from "./stringUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Sound } from "expo-av/build/Audio";
import { createSoundObject, getTimeOfDay } from "./commonUtils";
import { ActivityIndicator } from "react-native";
import theme from "@/constants/theme";

export type Auth = {
  user?: User;
  initialWelcomeSound: {
    sound: Sound | null;
    uri: string;
  };
  login: (
    email: string,
    inputFirstName: string,
    country: string,
    language: string,
  ) => Promise<{ token?: string }>;
  verify: (
    email: string,
    verificationCode: string,
    firstName: string,
  ) => Promise<boolean>;
  logout: () => void;
  ensureTokenValidity: () => Promise<User | undefined>;
};
type User = {
  token?: string;
  firstName: string;
  isFirstTimeEver?: string;
  isFirstTimeToday?: boolean;
};
const initialState = {
  user: undefined,
  login: () => Promise.resolve({ token: "" }),
  logout: () => console.log("logout"),
  verify: () => Promise.resolve(true),
  initialWelcomeSound: {
    sound: null,
    uri: "",
  },
  ensureTokenValidity: () => Promise.resolve(undefined),
};

const AuthContext = createContext<Auth>(initialState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const initialWelcomeSound = useRef<{
    sound: Sound | null;
    uri: string;
  } | null>(null);

  // Modified getLoginStatus method
  const getLoginStatus = async () => {
    const today = new Date().toDateString();
    const user = (await AsyncStorage.getItem("user")) ?? "";
    const lastLoginDate = await AsyncStorage.getItem("lastLoginDate");
    const isFirstTimeToday = lastLoginDate !== today;
    const inactiveSince = await AsyncStorage.getItem("inactiveSince");
    await AsyncStorage.setItem("lastLoginDate", today);
    let isFirstTimeEver = true;
    if (inactiveSince) {
      isFirstTimeEver = false;
    }

    console.log("last login status", {
      firstName: user?.first_name,
      isFirstTimeEver,
      isFirstTimeToday,
      today,
      lastLoginDate,
    });

    return {
      firstName: user?.first_name,
      isFirstTimeEver,
      isFirstTimeToday,
    };
  };

  // Modified logout method
  const logout = async () => {
    const user = await AsyncStorage.getItem("user");
    await AsyncStorage.clear();
    if (user) {
      await AsyncStorage.setItem("user", user);
    }
    setUser(undefined);
    router.push("/sign-in");
    initialWelcomeSound.current = null;
  };

  const prepareWelcomeSound = async () => {
    const user = await AsyncStorage.getItem("user");
    console.log("prepareWelcomeSound", { user });

    const initialWelcomeSoundURI = await AsyncStorage.getItem(
      "initial_welcome_sound_uri",
    );
    if (user) {
      const userObj = JSON.parse(user);
      const { intro_audio_urls } = userObj;
      const introFileName =
        capitalize(userObj.isFirstTimeEver.toString()) +
        "_" +
        capitalize(userObj.isFirstTimeToday.toString()) +
        "_" +
        getTimeOfDay();

      console.log("ensureTokenValidity", {
        intro_audio_urls,
        introFileName,
      });
      const welcomeSoundURI = intro_audio_urls[introFileName];
      const welcomeSound = await createSoundObject(welcomeSoundURI);
      initialWelcomeSound.current = {
        sound: welcomeSound,
        uri: welcomeSoundURI,
      };
    } else if (initialWelcomeSoundURI) {
      const welcomeSound = await createSoundObject(initialWelcomeSoundURI);
      initialWelcomeSound.current = {
        sound: welcomeSound,
        uri: initialWelcomeSoundURI,
      };
    }
  };

  // New method to check token expiration
  const ensureTokenValidity = async () => {
    const user = await AsyncStorage.getItem("user");
    console.log("ensure token validity", { user });
    if (!user) {
      logout();
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        // Check if the token is valid
        await verifyToken();
        // Get the user's login status - to update the login time, etc
        const { isFirstTimeEver, isFirstTimeToday } = await getLoginStatus();
        //  {
        //   token,
        //   firstName,
        //   isFirstTimeEver,
        //   isFirstTimeToday,
        // };
        await prepareWelcomeSound();
        if (user) {
          const userObj = JSON.parse(user);

          console.log("Setting", { userObj });
          const userPayload = { ...userObj, isFirstTimeToday, isFirstTimeEver };
          await AsyncStorage.setItem("user", JSON.stringify(userPayload));
          if (userObj) setUser(userPayload);
          return userObj;
        }
      } else {
        // If there's no token, just set user to null without attempting verification
        setUser(undefined);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      // If the token is invalid, try to refresh it
      try {
        const newToken = await refreshToken();
        await AsyncStorage.setItem("userToken", newToken);
        const { isFirstTimeEver, isFirstTimeToday } = await getLoginStatus();
        if (user) {
          const userObj = JSON.parse(user);

          const userPayload = { ...userObj, isFirstTimeToday, isFirstTimeEver };
          await AsyncStorage.setItem("user", JSON.stringify(userPayload));
          if (userObj) setUser(userPayload);
          return userObj;
        }
        return undefined;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // If the token refresh fails, log the user out
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Modified login method
  const login = async (
    email: string,
    inputFirstName: string,
    country: string,
    language: string,
  ) => {
    try {
      const result = await signIn(email, inputFirstName, country, language);
      // const welcomeSound = await createSoundObject(result.welcomeSound);
      await AsyncStorage.setItem(
        "initial_welcome_sound_uri",
        result.welcomeSound,
      );
      await prepareWelcomeSound();
      // initialWelcomeSound.current = {
      //   sound: welcomeSound,
      //   uri: result.welcomeSound,
      // };
      console.log("Result welcome sound", { w: result.welcomeSound });
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Modified verify method
  const verify = async (
    email: string,
    verificationCode: string,
    inputFirstName: string,
  ) => {
    try {
      setLoading(true);
      const response = await verifyEmail(email, verificationCode);
      if (response.token) {
        await AsyncStorage.setItem("userToken", response.token);

        const user = await AsyncStorage.getItem("user");
        let userObj;
        let isFirstTimeEver = false;
        if (user) {
          isFirstTimeEver = false;
        } else {
          isFirstTimeEver = true;
        }
        userObj = response.user;
        const { isFirstTimeToday } = await getLoginStatus();
        const userPayload = { ...userObj, isFirstTimeToday, isFirstTimeEver };
        console.log("verify will set user", { userPayload });
        await AsyncStorage.setItem("user", JSON.stringify(userPayload));
        setUser(userPayload);
      }
      return true;
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        ensureTokenValidity();
      } else {
        setLoading(false);
      }
    }
    init();
  }, []);

  const value = {
    user,
    login,
    verify,
    logout,
    loading,
    setLoading,
    ensureTokenValidity,
    prepareWelcomeSound,
    initialWelcomeSound: initialWelcomeSound.current,
  };
  console.log({ loading });
  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center" }}
        size="large"
        color={theme.colors.primary}
      />
    );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
