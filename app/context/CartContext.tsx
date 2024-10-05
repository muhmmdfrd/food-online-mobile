import React, {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
  FC,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderDetailItem } from "@/models/requests/OrderDetailRequest";
import { Storage } from "@/constants/Storage";

type CartContextType = {
  cartItems: OrderDetailItem[];
  addToCart: (item: Omit<OrderDetailItem, "quantity">) => void;
  removeFromCart: (menuId: number) => void;
  clearCart: () => void;
  updateCartItemQuantity: (item: OrderDetailItem) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const [cartItems, setCartItems] = useState<OrderDetailItem[]>([]);

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const loadCartFromStorage = async () => {
    try {
      const storedCart = await AsyncStorage.getItem(Storage.cart);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
  };

  const saveCartToStorage = async (newCart: OrderDetailItem[]) => {
    try {
      await AsyncStorage.setItem(Storage.cart, JSON.stringify(newCart));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  };

  const addToCart = (item: OrderDetailItem) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.menuId === item.menuId
    );
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((cartItem) =>
        cartItem.menuId === item.menuId
          ? { ...cartItem, qty: cartItem.qty + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cartItems, { ...item }];
    }

    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const removeFromCart = (menuId: number) => {
    const updatedCart = cartItems.filter((item) => item.menuId !== menuId);
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartToStorage([]);
  };

  const updateCartItemQuantity = (params: OrderDetailItem) => {
    const updatedCart = cartItems.map((item) =>
      item.menuId === params.menuId
        ? { ...item, qty: Math.max(1, params.qty) }
        : item
    );
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within an CartProvider");
  }
  return context;
};

export default CartContext;
