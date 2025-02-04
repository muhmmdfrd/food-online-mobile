import React, { useEffect, useState } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  useColorScheme,
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
import { Divider } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import MenuImage from "@/components/MenuImage";

const MenuDetailScreen = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isNew, setIsNew] = useState<boolean>(true);

  const { menuId } = useLocalSearchParams();
  const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } =
    useCart();

  const scheme = useColorScheme();
  const primaryColor = Colors[scheme ?? "light"].primary;

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
    return;
  }

  return (
    <SafeAreaThemedView style={styles.safeArea}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <MenuImage size={200} code={item?.code} styles={styles.menuImage} />
        }
      >
        <ThemedText style={styles.menuName}>{item?.name ?? ""}</ThemedText>
        <ThemedView style={styles.priceContainer}>
          <ThemedText style={styles.price}>
            {StringHelper.currencyFormat(item?.price ?? 0)}
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.merchant}>{item?.merchantName}</ThemedText>
        <Divider />
        <ThemedText style={{ marginBottom: 24 }}>
          {item?.description ?? "-"}
        </ThemedText>
        <ThemedView style={styles.priceWrapper}>
          <ThemedText style={styles.price}>
            {StringHelper.currencyFormat(item?.price ?? 0)}
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>

      <ThemedView style={styles.addButtonContainer}>
        <ThemedView style={styles.qtyControl}>
          <TouchableOpacity
            style={[styles.qtyButton, { backgroundColor: primaryColor }]}
            onPress={decreaseQuantity}
          >
            <ThemedText style={styles.qtyButtonText}>-</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.qtyText}>{quantity}</ThemedText>
          <TouchableOpacity
            style={[styles.qtyButton, { backgroundColor: primaryColor }]}
            onPress={increaseQuantity}
          >
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
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: primaryColor }]}
            onPress={handleAddToCart}
          >
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
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  merchant: {
    fontSize: 16,
  },
  qtyControl: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  qtyButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  qtyButtonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
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
