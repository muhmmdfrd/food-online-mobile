import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { getMyOrderDetail } from "@/services/OrderService";
import { ThemedView } from "@/components/ThemedView";
import DateHelper from "@/helpers/DateHelper";
import { StringHelper } from "@/helpers";
import { Colors } from "@/constants/Colors";

const MyOrderDetail = () => {
  const { userId, orderId } = useLocalSearchParams();
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["my-order-history-detail", userId, orderId],
    queryFn: async () => await getMyOrderDetail(+userId, +orderId),
    select: (data) => data.data,
  });

  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

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
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.dateText, { color: colors.text }]}>
            {DateHelper.formatDateTime(data?.date ?? "")}
          </Text>
          <View style={styles.bookingIdContainer}>
            <Text style={[styles.bookingText, { color: colors.text }]}>
              Order ID
            </Text>
            <View style={styles.bookingId}>
              <Text style={[styles.idText, { color: colors.text }]}>
                {data?.code}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Summary
          </Text>
        </View>
        {data?.orderDetails.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <View style={styles.orderItem}>
                <Text style={[styles.itemText, { color: colors.text }]}>
                  {item.qty}x {item.name}
                </Text>
                <Text style={[styles.priceText, { color: colors.text }]}>
                  {StringHelper.currencyFormat(item.total)}
                </Text>
              </View>
              <Text style={[styles.subText, { color: colors.text }]}>
                {StringHelper.currencyFormat(item.price)}
              </Text>
            </React.Fragment>
          );
        })}

        {/* Costs */}
        <View style={styles.costContainer}>
          <View style={styles.discountRow}>
            <FontAwesome name="money" size={16} color={colors.primary} />
            <Text style={[styles.discountText, { color: colors.text }]}>
              Payment
            </Text>
            <Text style={[styles.discountValue, { color: colors.primary }]}>
              {StringHelper.currencyFormat(
                data?.orderPayment.totalPayment ?? 0
              )}
            </Text>
          </View>

          <View style={styles.discountRow}>
            <FontAwesome name="tag" size={16} color={colors.primary} />
            <Text style={[styles.discountText, { color: colors.text }]}>
              Cashback
            </Text>
            <Text style={[styles.discountValue, { color: colors.primary }]}>
              {StringHelper.currencyFormat(data?.orderPayment.cashback ?? 0)}
            </Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={[styles.totalText, { color: colors.text }]}>Total</Text>
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
  },
  discountValue: {
    fontWeight: "bold",
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
});

export default MyOrderDetail;
