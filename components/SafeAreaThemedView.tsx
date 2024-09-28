import { type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";

export type SafeAreaThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function SafeAreaThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: SafeAreaThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}
