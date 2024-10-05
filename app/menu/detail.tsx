import React, { useEffect, useState } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StringHelper } from "@/helpers";
import { Menu } from "@/models/menu";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { getMenuById } from "@/services";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useCart } from "@/app/context/CartContext";
import { OrderDetailItem } from "@/models/requests/OrderDetailRequest";

const MenuDetailScreen = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isNew, setIsNew] = useState<boolean>(true);

  const { menuId } = useLocalSearchParams();
  const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } =
    useCart();

  useEffect(() => {
    const existing = cartItems.find((q) => q.menuId === +menuId);
    if (existing) {
      setQuantity(existing.qty);
      setIsNew(false);
    }
  }, [menuId]);

  const {
    data: item,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<Menu>, string, Menu>({
    queryKey: ["menu", menuId],
    queryFn: async () => await getMenuById(+menuId),
    select: (response) => response.data,
  });

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    const item: OrderDetailItem = {
      menuId: +menuId,
      qty: quantity,
    };

    if (isNew) {
      addToCart(item);
    } else {
      updateCartItemQuantity(item);
    }
    router.back();
  };

  const handleRemoveItem = () => {
    removeFromCart(+menuId);
    router.back();
  };

  const calculatePrice = (): string => {
    if (!item) return "-";
    return StringHelper.currencyFormat(item.price * quantity);
  };

  if (isLoading)
    return (
      <SafeAreaThemedView>
        <ThemedView
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <ActivityIndicator size={56} />
        </ThemedView>
      </SafeAreaThemedView>
    );

  if (isError) {
    Alert.alert("Error", error ?? "Something went wrong");
  }

  return (
    <SafeAreaThemedView style={styles.safeArea}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Image
            source={{ uri: "https://via.placeholder.com/200" }}
            style={styles.menuImage}
          />
        }
      >
        <ThemedText style={styles.menuName}>{item?.name ?? ""}</ThemedText>
        <ThemedView style={styles.priceContainer}>
          <ThemedView style={styles.priceWrapper}>
            <ThemedText style={styles.price}>
              {StringHelper.currencyFormat(item?.price ?? 0)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText style={styles.description}>
          {item?.merchantName ?? ""}
        </ThemedText>
      </ParallaxScrollView>

      <ThemedView style={styles.addButtonContainer}>
        <ThemedView style={styles.qtyControl}>
          <TouchableOpacity style={styles.qtyButton} onPress={decreaseQuantity}>
            <ThemedText style={styles.qtyButtonText}>-</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.qtyText}>{quantity}</ThemedText>
          <TouchableOpacity style={styles.qtyButton} onPress={increaseQuantity}>
            <ThemedText style={styles.qtyButtonText}>+</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        {quantity <= 0 ? (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveItem}
          >
            {<ThemedText style={styles.addButtonText}>Remove</ThemedText>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            {
              <ThemedText style={styles.addButtonText}>
                Add to Cart - {calculatePrice()}
              </ThemedText>
            }
          </TouchableOpacity>
        )}
      </ThemedView>
    </SafeAreaThemedView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  menuImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  menuName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  qtyControl: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  qtyButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  qtyButtonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});

export default MenuDetailScreen;
