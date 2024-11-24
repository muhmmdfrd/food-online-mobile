import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { StringHelper } from "@/helpers";
import { Dashboard } from "@/models/dashboard";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { getDashboard } from "@/services/DashboardService";
import { openOrder } from "@/services/OrderService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  useColorScheme,
  Alert,
} from "react-native";
import { useAuth } from "../context";
import { ThemedText } from "@/components/ThemedText";

const DashboardScreen: FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationKey: ["open-order"],
    mutationFn: openOrder,
    onSuccess: () => {
      Alert.alert("Success", "Order opened");
    },
    onError: (err) => {
      Alert.alert("Error", err.message);
    },
  });

  if (user?.id != 1) {
    return (
      <ThemedView
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText>Dashboard Forbidden for customer</ThemedText>
      </ThemedView>
    );
  }

  const { data, isLoading } = useQuery<
    ApiResponse<Dashboard>,
    string,
    Dashboard
  >({
    enabled: user?.roleId == 1,
    queryKey: ["dashboard"],
    queryFn: async () => await getDashboard(),
    select: (response) => {
      return response.data;
    },
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: colors.secondary }]}>
          <Text style={styles.boxText}>
            {isLoading ? "..." : data?.orderCount ?? 0}
          </Text>
          <Text style={styles.boxLabel}>Orders</Text>
        </View>
        <View style={[styles.box, { backgroundColor: colors.primary }]}>
          <Text style={styles.boxText}>
            {isLoading ? "..." : data?.menuCount ?? 0}
          </Text>
          <Text style={styles.boxLabel}>Menus</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.box, { backgroundColor: colors.primary }]}>
          <Text style={styles.boxText}>
            {isLoading ? "..." : data?.merchantCount ?? 0}
          </Text>
          <Text style={styles.boxLabel}>Merchants</Text>
        </View>
        <View style={[styles.box, { backgroundColor: colors.secondary }]}>
          <Text style={styles.boxText}>
            {isLoading
              ? "..."
              : StringHelper.currencyFormat(data?.totalPayment ?? 0)}
          </Text>
          <Text style={styles.boxLabel}>Total Payments</Text>
        </View>
      </View>
      <TouchableOpacity
        disabled={isPending}
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => mutate()}
      >
        <Text style={styles.buttonText}>
          {isPending ? "Loading..." : "Open Order"}
        </Text>
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
