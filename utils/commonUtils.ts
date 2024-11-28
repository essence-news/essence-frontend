import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { trackEvent } from "./trackingUtil";

export const createSoundObject = async (
  uri: string,
  id = "",
  title = "",
  index = -1,
) => {
  await Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
    allowsRecordingIOS: false,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    playsInSilentModeIOS: true,
  });
  const audio = await Audio.Sound.createAsync({
    uri,
  }).catch((error) => {
    console.error("Create Async failed:", error, uri);
    if (id || title || index >= 0)
      trackEvent("error", id, title, index, 0, {
        errorType: "autoplay-create",
        message: error.message,
      });
  });
  return audio.sound;
};
