import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as apiService from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from backend when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    } else {
      setItems([]);
      setTotalPrice(0);
    }
  }, [isLoggedIn]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await apiService.getCart();
      setItems(cartData.items || []);
      setTotalPrice(cartData.totalPrice || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      if (!isLoggedIn) {
        setError("Please login to add items to cart");
        return;
      }
      try {
        setLoading(true);
        const updatedCart = await apiService.addToCart(productId, quantity);
        setItems(updatedCart.items || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn]
  );

  const removeItem = useCallback(
    async (productId) => {
      if (!isLoggedIn) return;
      try {
        setLoading(true);
        const updatedCart = await apiService.removeFromCart(productId);
        setItems(updatedCart.items || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn]
  );

  const updateQty = useCallback(
    async (productId, quantity) => {
      if (!isLoggedIn) return;
      try {
        setLoading(true);
        if (quantity <= 0) {
          await removeItem(productId);
        } else {
          const updatedCart = await apiService.updateCartItem(
            productId,
            quantity
          );
          setItems(updatedCart.items || []);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, removeItem]
  );

  const clearCart = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      await apiService.clearCart();
      setItems([]);
      setTotalPrice(0);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalPrice,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        loading,
        error,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
