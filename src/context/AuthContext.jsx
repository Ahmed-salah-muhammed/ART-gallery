import { createContext, useContext, useState, useCallback } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail as verifyEmailApi,
  resendVerification as resendVerificationApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  googleAuth as googleAuthApi,
  facebookAuth as facebookAuthApi,
} from "../services/api.js";

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

  // Persist a freshly authenticated user (login / verify / reset / OAuth).
  const setSession = useCallback((userData) => {
    setUser(userData);
    try {
      localStorage.setItem("shopwave-user", JSON.stringify(userData));
    } catch {}
    return userData;
  }, []);

  // Merge updates into the current user (e.g. profile edits, photo upload).
  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem("shopwave-user", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const runAuth = useCallback(
    async (fn, fallbackMsg) => {
      setLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err) {
        const msg = err.data?.message || err.message || fallbackMsg;
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const login = useCallback(
    (email, password) =>
      runAuth(
        async () => setSession(await loginUser(email, password)),
        "Login failed"
      ),
    [runAuth, setSession]
  );

  // Simple signup: register logs the user in immediately.
  const register = useCallback(
    (payload) =>
      runAuth(
        async () => setSession(await registerUser(payload)),
        "Registration failed"
      ),
    [runAuth, setSession]
  );

  const verifyEmail = useCallback(
    (token) =>
      runAuth(
        async () => setSession(await verifyEmailApi(token)),
        "Verification failed"
      ),
    [runAuth, setSession]
  );

  const resendVerification = useCallback(
    (email) =>
      runAuth(() => resendVerificationApi(email), "Could not resend email"),
    [runAuth]
  );

  const forgotPassword = useCallback(
    (email) => runAuth(() => forgotPasswordApi(email), "Request failed"),
    [runAuth]
  );

  const resetPassword = useCallback(
    (token, password, passwordConfirm) =>
      runAuth(
        async () =>
          setSession(await resetPasswordApi(token, password, passwordConfirm)),
        "Reset failed"
      ),
    [runAuth, setSession]
  );

  const loginWithGoogle = useCallback(
    (credential) =>
      runAuth(
        async () => setSession(await googleAuthApi(credential)),
        "Google sign-in failed"
      ),
    [runAuth, setSession]
  );

  const loginWithFacebook = useCallback(
    (accessToken, userID) =>
      runAuth(
        async () => setSession(await facebookAuthApi(accessToken, userID)),
        "Facebook sign-in failed"
      ),
    [runAuth, setSession]
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await logoutUser();
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem("shopwave-user");
    } catch {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        updateUser,
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
