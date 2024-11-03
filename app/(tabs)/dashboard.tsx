import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { FC } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";

const DashboardScreen: FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: colors.secondary }]}>
          <Text style={styles.boxText}>9</Text>
          <Text style={styles.boxLabel}>Orders</Text>
        </View>
        <View style={[styles.box, { backgroundColor: colors.primary }]}>
          <Text style={styles.boxText}>15</Text>
          <Text style={styles.boxLabel}>Menus</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: colors.primary }]}>
          <Text style={styles.boxText}>8</Text>
          <Text style={styles.boxLabel}>Merchants</Text>
        </View>
        <View style={[styles.box, { backgroundColor: colors.secondary }]}>
          <Text style={styles.boxText}>Rp.230.000</Text>
          <Text style={styles.boxLabel}>Total Payments</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.buttonText}>Open Order</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    backgroundColor: "#e0e0e0",
    width: "45%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  boxText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  boxLabel: {
    fontSize: 14,
    color: "white",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default DashboardScreen;
