import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StringHelper } from "@/helpers";
import { calculate } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
  useColorScheme,
  Alert,
} from "react-native";
import { useCart } from "../context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { OrderDetailRequest } from "@/models/requests/OrderDetailRequest";
import { createOrder } from "@/services/OrderService";
import { Response } from "@/constants/Response";
import { router } from "expo-router";
import { Button, Divider } from "react-native-paper";
import ChartPaymentModal from "@/modals/ChartPaymentModal";
import MenuImage from "@/components/MenuImage";

const CartScreen = () => {
  const [cash, setCash] = useState<number>(0);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const { cartItems, clearCart } = useCart();

  useEffect(() => {
    calculateChange(data?.grandTotal ?? 0);
  }, [cash]);

  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["calculate", cartItems],
    queryFn: async () => await calculate(cartItems),
    select: (data) => data.data,
  });

  const mutation = useMutation<ApiResponse<any>, string, OrderDetailRequest>({
    mutationFn: createOrder,
    onSuccess: (response) => {
      if (response.code === Response.successCode) {
        Alert.alert("Sucess", response.message);
        clearCart();
        router.back();
        return;
      }

      Alert.alert("Error", response.message);
    },
    onError: (err: string) => {
      Alert.alert("Failed", err ?? "Something went wrong!");
    },
  });

  const handleOrder = () => {
    Alert.alert("Confirmation", "Are you sure want to create this order?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          const request: OrderDetailRequest = {
            paymentAmount: cash,
            details: cartItems,
          };
          mutation.mutate(request);
        },
      },
    ]);
  };

  const calculateChange = (total: number): number => {
    const result = cash - total;
    if (result <= 0) {
      return 0;
    }

    return result;
  };

  const isButtonDisabled = (): boolean => {
    if (mutation.isPending) {
      return true;
    }

    if (cash <= 0) {
      return true;
    }

    if (cash < (data?.grandTotal ?? 0)) {
      return true;
    }

    return calculateChange(data?.grandTotal ?? 0) < 0;
  };

  if (cartItems.length <= 0) {
    return (
      <SafeAreaThemedView>
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
            color={colors.primary}
          />
          <ThemedText style={{ marginTop: 8 }}>No items found</ThemedText>
        </ThemedView>
      </SafeAreaThemedView>
    );
  }

  return (
    <>
      <SafeAreaThemedView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.headerText}>Your Cart</ThemedText>

          <ScrollView
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          >
            {isLoading ? (
              <ThemedText>Loading...</ThemedText>
            ) : (
              data?.items.map((item) => {
                return (
                  <ThemedView key={item.menuName} style={styles.cartItem}>
                    <MenuImage
                      code={item.code}
                      size={50}
                      styles={styles.cartImage}
                    />
                    <ThemedView style={styles.cartInfo}>
                      <ThemedText style={styles.cartName}>
                        {item.menuName}
                      </ThemedText>
                      <ThemedText style={styles.cartPrice}>
                        {item.qty} pcs
                      </ThemedText>
                      <ThemedText style={styles.cartPrice}>
                        {StringHelper.currencyFormat(item.total)}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                );
              })
            )}
          </ScrollView>

          <Divider />
          <ThemedView style={styles.containerPayment}>
            <ThemedView style={styles.row}>
              <ThemedText style={[styles.text, { color: colors.text }]}>
                Payment
              </ThemedText>
              <ThemedText style={[styles.text, { color: colors.text }]}>
                Cash
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.row}>
              <ThemedText style={[styles.text, { color: colors.text }]}>
                Amount Paid
              </ThemedText>
              <ThemedView style={styles.row}>
                <MaterialCommunityIcons
                  name="pen"
                  size={20}
                  style={{ marginEnd: 4 }}
                  color={colors.text}
                  onPress={() => setVisibleModal((s) => !s)}
                />
                <ThemedText style={[styles.text, { color: colors.text }]}>
                  {StringHelper.currencyFormat(cash)}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.row}>
              <ThemedText style={[styles.text, { color: colors.text }]}>
                Change
              </ThemedText>
              <ThemedText style={[styles.text, { color: colors.text }]}>
                {StringHelper.currencyFormat(
                  calculateChange(data?.grandTotal ?? 0)
                )}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <Button
            disabled={isButtonDisabled()}
            style={[
              styles.confirmButton,
              {
                backgroundColor: isButtonDisabled() ? "gray" : colors.primary,
              },
            ]}
            onPress={handleOrder}
          >
            <ThemedText style={styles.confirmButtonText}>
              {mutation.isPending
                ? "Creating order..."
                : `Order ${StringHelper.currencyFormat(data?.grandTotal ?? 0)}`}
            </ThemedText>
          </Button>
        </ThemedView>
      </SafeAreaThemedView>
      <ChartPaymentModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        setCash={setCash}
      />
    </>
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cartImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cartInfo: {
    marginLeft: 10,
    justifyContent: "center",
    flex: 1,
  },
  cartName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartPrice: {
    fontSize: 16,
    marginTop: 5,
  },
  cartTotal: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  totalContainer: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 5,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmButton: {
    paddingVertical: 8,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  containerPayment: {
    padding: 16,
  },
});

export default CartScreen;
