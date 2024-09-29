import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

const CartScreen = () => {
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <SafeAreaThemedView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.headerText}>Your Cart</ThemedText>

        {/* Daftar Item di Keranjang */}
        <ScrollView style={styles.cartList}>
          <ThemedView style={styles.cartItem}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.cartImage}
            />
            <ThemedView style={styles.cartInfo}>
              <ThemedText style={styles.cartName}>{"item.name"}</ThemedText>
              <ThemedText style={styles.cartPrice}>
                {"item.qty"} x {"item.price"}
              </ThemedText>
              <ThemedText style={styles.cartTotal}>Total: 2 Juta</ThemedText>
            </ThemedView>
          </ThemedView>
        </ScrollView>

        {/* Total Harga */}
        <ThemedView style={styles.totalContainer}>
          <ThemedText style={styles.totalText}>
            Total to Pay: ${totalPrice}
          </ThemedText>
        </ThemedView>

        {/* Tombol Konfirmasi Pesanan */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => alert("Order Confirmed!")}
        >
          <ThemedText style={styles.confirmButtonText}>
            Confirm Order
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
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
    backgroundColor: "#f0f0f0",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 15,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});

export default CartScreen;
