import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { signIn, verifyEmail, verifyToken, refreshToken } from "./api";
import { toCamelCase } from "./stringUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export type Auth = {
  user?: User;
  login: (
    email: string,
    inputFirstName: string,
    country: string,
    language: string,
  ) => Promise<{ token?: string }>;
  verify: (email: string, verificationCode: string) => Promise<boolean>;
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
  ensureTokenValidity: () => Promise.resolve(undefined),
};

const AuthContext = createContext<Auth>(initialState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // New function to update firstName in localStorage and state
  const updateFirstName = async (newFirstName: string) => {
    if (newFirstName) {
      await AsyncStorage.setItem("firstName", toCamelCase(newFirstName));
      setUser((prevUser) => ({
        ...prevUser,
        firstName: toCamelCase(newFirstName),
      }));
    }
  };

  // Modified getLoginStatus method
  const getLoginStatus = async () => {
    const today = new Date().toDateString();
    const firstName = (await AsyncStorage.getItem("firstName")) ?? "";
    const lastLoginDate = await AsyncStorage.getItem("lastLoginDate");
    const isFirstTimeEver =
      (await AsyncStorage.getItem("isFirstTimeEver")) || "true";
    const isFirstTimeToday = lastLoginDate !== today;

    await AsyncStorage.setItem("lastLoginDate", today);
    if (isFirstTimeEver === "true") {
      await AsyncStorage.setItem("isFirstTimeEver", "false");
    }

    console.log("last login status", {
      firstName,
      isFirstTimeEver,
      isFirstTimeToday,
      today,
      lastLoginDate,
    });

    return { firstName, isFirstTimeEver, isFirstTimeToday };
  };

  // Modified logout method
  const logout = async () => {
    const firstName = await AsyncStorage.getItem("firstName");
    await AsyncStorage.clear();
    if (firstName) {
      await AsyncStorage.setItem("firstName", firstName);
    }
    setUser(undefined);
    router.push("/sign-in");
  };

  // New method to check token expiration
  const ensureTokenValidity = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      try {
        // Check if the token is valid
        await verifyToken();
        // Get the user's login status - to update the login time, etc
        const { firstName, isFirstTimeEver, isFirstTimeToday } =
          await getLoginStatus();
        const userObj = {
          token,
          firstName,
          isFirstTimeEver,
          isFirstTimeToday,
        };
        setUser(userObj);
        return userObj;
      } catch (error) {
        console.error("Token verification failed:", error);
        // If the token is invalid, try to refresh it
        try {
          const newToken = await refreshToken();
          await AsyncStorage.setItem("userToken", newToken);
          const { firstName, isFirstTimeEver, isFirstTimeToday } =
            await getLoginStatus();
          const userObj = {
            token,
            firstName,
            isFirstTimeEver,
            isFirstTimeToday,
          };
          setUser(userObj);
          return userObj;
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // If the token refresh fails, log the user out
          logout();
        }
      }
    } else {
      // If there's no token, just set user to null without attempting verification
      setUser(undefined);
    }
    setLoading(false);
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
      if (result.token) {
        await AsyncStorage.setItem("userToken", result.token);
        updateFirstName(inputFirstName);

        const { firstName, isFirstTimeEver, isFirstTimeToday } =
          await getLoginStatus();

        setUser({
          token: result.token,
          firstName,
          isFirstTimeEver,
          isFirstTimeToday,
        });
      }
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Modified verify method
  const verify = async (email: string, verificationCode: string) => {
    try {
      setLoading(true);
      const userData = await verifyEmail(email, verificationCode);
      if (userData.token) {
        await AsyncStorage.setItem("userToken", userData.token);
        updateFirstName(userData.firstName);
        await AsyncStorage.setItem("isFirstTimeEver", "true");
        await AsyncStorage.setItem("lastLoginTime", "" + new Date().getTime());

        const { firstName, isFirstTimeEver, isFirstTimeToday } =
          await getLoginStatus();

        setUser({
          token: userData.token,
          firstName,
          isFirstTimeEver,
          isFirstTimeToday,
        });
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
    updateFirstName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
