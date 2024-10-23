import { Platform } from "react-native";
import Config, { NativeConfig } from "react-native-config";

const getEnv = (): NodeJS.ProcessEnv | NativeConfig => {
  if (Platform.OS === "web") {
    return process.env;
  }

  return Config;
};

const EnvHelper = {
  getEnv,
};

export default EnvHelper;
