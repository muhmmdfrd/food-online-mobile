import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FC } from "react";

const HistoryScreen: FC = () => {
  return (
    <SafeAreaThemedView>
      <ThemedView>
        <ThemedText>History</ThemedText>
      </ThemedView>
    </SafeAreaThemedView>
  );
};

export default HistoryScreen;
