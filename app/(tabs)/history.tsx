import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useAuth } from "../context";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  useColorScheme,
  RefreshControl,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { StringHelper } from "@/helpers";
import { getMyOrders } from "@/services/OrderService";
import DateHelper from "@/helpers/DateHelper";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HistoryScreen: FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery<
    ApiResponse<OrderResponse[]>,
    string,
    OrderResponse[]
  >({
    queryKey: ["my-history"],
    queryFn: async () => await getMyOrders(user?.id ?? 0),
    select: (response) => {
      return response.data;
    },
  });

  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  if (isError) {
    Alert.alert("Error", error ?? "Error while fetching data.");
  }

  return (
    <ThemedView style={styles.container}>
      {isLoading ? (
        <ThemedView
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <ActivityIndicator size={52} color={colors.primary} />
        </ThemedView>
      ) : data?.length === 0 ? (
        <ThemedView
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="food-off"
            size={108}
            color={Colors[scheme ?? "light"].primary}
          />
          <ThemedText style={{ marginTop: 8 }}>No items found</ThemedText>
          <ThemedText type="link" onPress={() => refetch()}>
            Refresh
          </ThemedText>
        </ThemedView>
      ) : (
        <ScrollView
          style={styles.menuList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        >
          {data?.map((item) => {
            return (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: "/my-order/detail",
                    params: {
                      orderId: item.id,
                      userId: user?.id,
                    },
                  })
                }
              >
                <ThemedView style={styles.menuItem}>
                  <ThemedView
                    style={{
                      height: 100,
                      width: 100,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 12,
                    }}
                  >
                    <ThemedText style={{ fontSize: 24 }}>
                      {DateHelper.getInitialMonth(item.date).toUpperCase()}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.menuInfo}>
                    <ThemedText style={styles.menuName}>
                      {DateHelper.formatDate(item.date)}
                    </ThemedText>
                    <ThemedText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.menuDescription}
                    >
                      {item.menus.join(", ")}
                    </ThemedText>
                    <ThemedText style={styles.menuPrice}>
                      {StringHelper.currencyFormat(item.total)}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </TouchableWithoutFeedback>
            );
          })}
        </ScrollView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    // padding: 16,
  },
  menuList: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    marginBottom: 15,
    position: "relative",
    borderRadius: 16,
  },
  menuImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  menuInfo: {
    marginLeft: 10,
    justifyContent: "center",
    flex: 1,
    borderRadius: 16,
  },
  menuName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
    paddingEnd: 24,
  },
  menuPrice: {
    fontSize: 16,
    marginBottom: 5,
  },
  quantityIndicator: {
    position: "absolute",
    right: 8,
    width: 36,
    height: 36,
    top: "40%",
    transform: [{ translateY: -8 }],
    borderRadius: 32,
    padding: 8,
  },
  qtyText: {
    paddingLeft: 6,
    marginTop: -2,
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    fontSize: 16,
  },
});

export default HistoryScreen;
