import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StringHelper } from "@/helpers";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import {
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableNativeFeedback,
  Image,
} from "react-native";
import { getOrderToday } from "@/services/OrderDetailService";
import { OrderTodayResponse } from "@/models/responses/OrderTodayResponse";
import { RefreshControl } from "react-native";

const ListOrder: FC = () => {
  const {
    data = [],
    isLoading,
    isError,
    error: errorMenu,
    refetch,
  } = useQuery<ApiResponse<OrderTodayResponse[]>, string, OrderTodayResponse[]>(
    {
      queryKey: ["order-today"],
      queryFn: async () => await getOrderToday(),
      select: (response) => {
        return response.data;
      },
    }
  );

  if (isError) {
    Alert.alert("Error", errorMenu ?? "Error while fetching menu.");
  }

  return (
    <ThemedView style={styles.container}>
      {isLoading ? (
        <ThemedView
          style={{
            height: "75%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={52} />
        </ThemedView>
      ) : (
        <ScrollView
          style={styles.menuList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        >
          {data.length === 0 ? (
            <ThemedText>No data found</ThemedText>
          ) : (
            data.map((item) => {
              return (
                <TouchableNativeFeedback key={item.name}>
                  <ThemedView style={styles.menuItem}>
                    <Image
                      source={{ uri: "https://via.placeholder.com/100" }}
                      style={styles.menuImage}
                    />
                    <ThemedView style={styles.menuInfo}>
                      <ThemedText style={styles.menuName}>
                        {item.name}
                      </ThemedText>
                      <ThemedText
                        style={styles.menuDescription}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.details.map((q) => q.menuName).join(", ")}
                      </ThemedText>
                      <ThemedText style={styles.menuPrice}>
                        {StringHelper.currencyFormat(item.total)}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </TouchableNativeFeedback>
              );
            })
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    marginBottom: 15,
    position: "relative",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 12,
    paddingStart: 12,
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
    backgroundColor: "white",
    borderRadius: 16,
    paddingEnd: 24,
  },
  menuName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
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

export default ListOrder;
