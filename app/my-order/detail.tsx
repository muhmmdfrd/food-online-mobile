import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { getMyOrderDetail } from "@/services/OrderService";
import { ThemedView } from "@/components/ThemedView";
import DateHelper from "@/helpers/DateHelper";
import { StringHelper } from "@/helpers";

const MyOrderDetail = () => {
  const { userId, orderId } = useLocalSearchParams();
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["my-order-history-detail", userId, orderId],
    queryFn: async () => await getMyOrderDetail(+userId, +orderId),
    select: (data) => data.data,
  });

  if (isLoading) {
    return (
      <ThemedView
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={52} />
      </ThemedView>
    );
  }

  if (isError) {
    return;
  }

  return (
    <SafeAreaThemedView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Date and Booking ID */}
        <View style={styles.header}>
          <Text style={styles.dateText}>
            {DateHelper.formatDateTime(data?.date ?? "")}
          </Text>
          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingText}>Order ID</Text>
            <View style={styles.bookingId}>
              <Text style={styles.idText}>{data?.code}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
        </View>
        {data?.orderDetails.map((item, idx) => {
          return (
            <>
              <View style={styles.orderItem} key={idx}>
                <Text style={styles.itemText}>
                  {item.qty}x {item.name}
                </Text>
                <Text style={styles.priceText}>
                  {StringHelper.currencyFormat(item.total)}
                </Text>
              </View>
              <Text style={styles.subText}>
                {StringHelper.currencyFormat(item.price)}
              </Text>
            </>
          );
        })}

        {/* Costs */}
        <View style={styles.costContainer}>
          <View style={styles.discountRow}>
            <FontAwesome name="money" size={16} color="orange" />
            <Text style={styles.discountText}>Payment</Text>
            <Text style={styles.discountValue}>
              {StringHelper.currencyFormat(
                data?.orderPayment.totalPayment ?? 0
              )}
            </Text>
          </View>

          <View style={styles.discountRow}>
            <FontAwesome name="tag" size={16} color="orange" />
            <Text style={styles.discountText}>Cashback</Text>
            <Text style={styles.discountValue}>
              {StringHelper.currencyFormat(data?.orderPayment.cashback ?? 0)}
            </Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>
            {StringHelper.currencyFormat(data?.total ?? 0)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaThemedView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookingIdContainer: {
    marginTop: 10,
  },
  bookingText: {
    fontSize: 14,
    color: "#666",
  },
  bookingId: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  idText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  deliveryContainer: {
    marginVertical: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deliveredText: {
    color: "#888",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addressText: {
    marginLeft: 10,
    color: "#333",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reorderText: {
    color: "#007bff",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  itemText: {
    fontSize: 14,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subText: {
    color: "#888",
    marginTop: 4,
  },
  costContainer: {
    marginTop: 16,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  costLabel: {
    color: "#666",
  },
  costValue: {
    fontWeight: "bold",
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  discountText: {
    flex: 1,
    marginLeft: 5,
    color: "#666",
  },
  discountValue: {
    fontWeight: "bold",
    color: "green",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  pointsContainer: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  pointsText: {
    color: "#333",
  },
});

export default MyOrderDetail;
