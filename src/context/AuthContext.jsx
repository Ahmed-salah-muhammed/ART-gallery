import { createContext, useContext, useState, useCallback } from "react";
import { loginUser, registerUser, logoutUser } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopwave-user") || "null");
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      try {
        localStorage.setItem("shopwave-user", JSON.stringify(userData));
      } catch {}
      return userData;
    } catch (err) {
      const errorMsg = err.data?.message || err.message || "Login failed";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (firstName, lastName, email, password, passwordConfirm) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await registerUser(firstName, lastName, email, password, passwordConfirm);
      setUser(userData);
      try {
        localStorage.setItem("shopwave-user", JSON.stringify(userData));
      } catch {}
      return userData;
    } catch (err) {
      const errorMsg = err.data?.message || err.message || "Registration failed";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser();
      setUser(null);
      try {
        localStorage.removeItem("shopwave-user");
      } catch {}
    } catch (err) {
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoggedIn: !!user,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
