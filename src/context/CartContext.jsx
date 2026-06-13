import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as apiService from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

// Call sites pass either a product object or a raw id — normalize to the id
// the backend expects (Mongo _id, also exposed as `id` on serialized products).
const idOf = (p) => (p && typeof p === "object" ? p._id || p.id : p);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from backend when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [isLoggedIn]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await apiService.getCart();
      setItems(cartData.items || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Derived from items so they never go stale after add/remove/update.
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  const addItem = useCallback(
    async (product, quantity = 1) => {
      if (!isLoggedIn) {
        setError("Please login to add items to cart");
        return;
      }
      try {
        setLoading(true);
        const updatedCart = await apiService.addToCart(idOf(product), quantity);
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
    async (product) => {
      if (!isLoggedIn) return;
      try {
        setLoading(true);
        const updatedCart = await apiService.removeFromCart(idOf(product));
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
    async (product, quantity) => {
      if (!isLoggedIn) return;
      try {
        setLoading(true);
        if (quantity <= 0) {
          await removeItem(product);
        } else {
          const updatedCart = await apiService.updateCartItem(
            idOf(product),
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
