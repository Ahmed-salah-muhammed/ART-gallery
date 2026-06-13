import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as apiService from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const WishlistContext = createContext();

// Call sites pass either a product object or a raw id — normalize to the id.
const idOf = (p) => (p && typeof p === "object" ? p._id || p.id : p);

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load wishlist from backend when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      loadWishlist();
    } else {
      setProducts([]);
    }
  }, [isLoggedIn]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const wishlistData = await apiService.getWishlist();
      setProducts(wishlistData.products || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = useCallback(
    async (product) => {
      if (!isLoggedIn) {
        setError("Please login to manage wishlist");
        return;
      }

      const productId = idOf(product);
      const alreadyIn = products.some((p) => (p._id || p.id) === productId);

      try {
        setLoading(true);
        if (alreadyIn) {
          await apiService.removeFromWishlist(productId);
          setProducts((prev) =>
            prev.filter((p) => (p._id || p.id) !== productId)
          );
        } else {
          await apiService.addToWishlist(productId);
          // Reload wishlist to get full product data
          await loadWishlist();
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, products]
  );

  const isInWishlist = (product) => {
    const productId = idOf(product);
    return products.some((p) => (p._id || p.id) === productId);
  };

  const removeItem = useCallback(
    async (product) => {
      if (!isLoggedIn) return;
      const productId = idOf(product);
      try {
        setLoading(true);
        await apiService.removeFromWishlist(productId);
        setProducts((prev) =>
          prev.filter((p) => (p._id || p.id) !== productId)
        );
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn]
  );

  const clearWishlist = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      for (const product of products) {
        const id = product._id || product.id;
        await apiService.removeFromWishlist(id);
      }
      setProducts([]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, products]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist: products,
        toggleWishlist,
        isInWishlist,
        removeItem,
        clearWishlist,
        loading,
        error,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
