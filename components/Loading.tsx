import { FC } from "react";
import { ThemedView } from "./ThemedView";
import {
  ActivityIndicator,
  useColorScheme,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";

type LoadingProps = {
  styles: StyleProp<ViewStyle>;
};

const Loading: FC<LoadingProps> = ({ styles }) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <ThemedView style={styles}>
      <ActivityIndicator size={52} color={colors.primary} />
    </ThemedView>
  );
};

export default Loading;
