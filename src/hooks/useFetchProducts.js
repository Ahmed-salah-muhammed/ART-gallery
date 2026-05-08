import { useState, useEffect } from "react";
import { fetchProducts } from "../services/api.js";

export default function useFetchProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProducts(filters)
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters.category, filters.search, filters.sort]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchProducts(filters)
      .then((data) => setProducts(data))
      .catch((e) => setError(e.message));
  };

  return { products, loading, error, refetch };
}

export { useFetchProducts };
