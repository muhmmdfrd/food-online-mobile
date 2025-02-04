import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { getMyOrderDetail, updatePaymentStatus } from "@/services/OrderService";
import DateHelper from "@/helpers/DateHelper";
import { StringHelper } from "@/helpers";
import { Colors } from "@/constants/Colors";
import Loading from "@/components/Loading";
import { ThemedView } from "@/components/ThemedView";
import { PaymentUpdateStatusRequest } from "@/models/requests/PaymentUpdateStatusRequest";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { Response } from "@/constants/Response";

const MyOrderDetail = () => {
  const { userId, orderId } = useLocalSearchParams();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-order-history-detail", userId, orderId],
    queryFn: async () => await getMyOrderDetail(+userId, +orderId),
    select: (data) => data.data,
  });

  const mutation = useMutation<
    ApiResponse<number>,
    string,
    PaymentUpdateStatusRequest
  >({
    mutationFn: updatePaymentStatus,
    onSuccess: (response) => {
      if (response.code === Response.successCode) {
        Alert.alert("Sucess", response.message);
        refetch();
        return;
      }

      Alert.alert("Error", response.message);
    },
    onError: (err: string) => {
      Alert.alert("Failed", err ?? "Something went wrong!");
    },
  });

  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  if (isLoading) {
    return (
      <Loading
        styles={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  if (isError) {
    return;
  }

  const handleConfirmOrder = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you have received your order and your change?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const request: PaymentUpdateStatusRequest = {
              userId: data!.userId,
              orderId: data!.orderId,
            };

            mutation.mutate(request);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaThemedView style={styles.safeArea}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
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
          <Text style={[styles.totalAmount, { color: colors.primary }]}>
            {StringHelper.currencyFormat(data?.total ?? 0)}
          </Text>
        </View>
      </ScrollView>

      {data?.orderPayment.statusId == 0 && (
        <ThemedView style={styles.footer}>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: colors.primary }]}
            onPress={handleConfirmOrder}
            disabled={mutation.isPending}
          >
            <Text style={styles.confirmButtonText}>Order Received</Text>
          </TouchableOpacity>
        </ThemedView>
      )}
    </SafeAreaThemedView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  header: { borderBottomWidth: 1, borderColor: "#ddd", paddingBottom: 10 },
  dateText: { fontSize: 16, fontWeight: "bold" },
  bookingIdContainer: { marginTop: 10 },
  bookingText: { fontSize: 14 },
  bookingId: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  idText: { fontSize: 14, fontWeight: "bold" },
  section: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  itemText: { fontSize: 14 },
  priceText: { fontSize: 14, fontWeight: "bold" },
  subText: { marginTop: 4 },
  costContainer: { marginTop: 16 },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  discountText: { flex: 1, marginLeft: 5 },
  discountValue: { fontWeight: "bold" },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalText: { fontSize: 16, fontWeight: "bold" },
  totalAmount: { fontSize: 16, fontWeight: "bold" },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default MyOrderDetail;
