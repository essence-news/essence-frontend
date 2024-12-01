import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockNewsData } from "../constants/mock";

const API_BASE_URL = process.env.EXPO_PUBLIC_ESSENCE_REST_API_URL;
console.log({ API_BASE_URL });

const getToken = async () => {
  return await AsyncStorage.getItem("userToken");
};

const setToken = async (token: string) => {
  await AsyncStorage.setItem("userToken", token);
};

const clearToken = async () => {
  await AsyncStorage.removeItem("userToken");
  router.push("/sign-in");
};

const apiCall = async (endpoint: string, method = "GET", data?: unknown) => {
  const token = await getToken();
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method,
    headers,
    body: undefined,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (response.status === 401) {
    if (token) clearToken();
    throw new Error("Unauthorized");
  }

  return response;
};

export const signIn = async (
  email: string,
  firstName: string,
  country: string,
  language: string,
) => {
  const response = await apiCall("/user/signin", "POST", {
    email,
    first_name: firstName,
    country,
    language,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Sign in failed");
  }

  if (data.isNewUser) {
    return {
      isNewUser: true,
      message: data.message,
    };
  } else {
    return {
      isNewUser: false,
      verificationRequired: data.verificationRequired,
      token: data.token,
    };
  }
};

export const verifyEmail = async (email: string, verificationCode: string) => {
  const response = await apiCall("/user/verify", "POST", {
    email,
    verification_code: verificationCode,
  });

  if (!response.ok) {
    throw new Error("Verification failed");
  }

  const data = await response.json();
  await setToken(data.token);
  return data;
};

let i = 0;
export const fetchNews = async (user: {
  isFirstTimeEver: string;
  isFirstTimeToday: string;
}) => {
  const firstTimeEver = user.isFirstTimeEver;
  const firstTimeToday = user.isFirstTimeToday;
  const currentTime = new Date().toISOString();

  const queryParams = new URLSearchParams({
    first_time_ever: firstTimeEver,
    first_time_today: firstTimeToday,
    current_time: currentTime,
  }).toString();

  console.log(`Fetching news with query params: ${queryParams}`);
  const response = await apiCall(`/public/latest_news?${queryParams}`, "GET");
  console.log({ response });
  if (!response.ok) {
    throw new Error("" + response.status);
  }
  return await response.json();
  // i++;
  // return Promise.resolve(i > 1 ? { articles: [] } : mockNewsData);
};

export const verifyToken = async () => {
  try {
    const response = await apiCall("/user/verify_token", "POST");
    if (!response.ok) {
      throw new Error("Token verification failed");
    }
    return await response.json();
  } catch (error) {
    await clearToken();
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await apiCall("/user/refresh_token", "POST");
    if (!response.ok) {
      if (response.status === 401) {
        clearToken();
        throw new Error("Unauthorized: Token refresh failed");
      }
      throw new Error("Token refresh failed");
    }
    const data = await response.json();
    await setToken(data.token);
    return data.token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const trackEvents = async (events: unknown) => {
  try {
    const response = await apiCall("/tracking/track-event", "POST", { events });
    if (!response.ok) {
      throw new Error("Failed to send events");
    }
    return await response.json();
  } catch (error) {
    console.error("Error tracking events:", error);
    throw error;
  }
};
