import {
  BrowserRouter,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

import "./styles/global.css";

function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 bg-white">
      <h1 className="text-[10rem] md:text-[15rem] font-black tracking-tighter text-gray-50 leading-none">
        404
      </h1>
      <h2 className="text-4xl font-black tracking-tight text-gray-900 -mt-20">
        Page not found
      </h2>
      <p className="text-gray-500 text-center max-w-md">
        The piece you're looking for has moved or no longer exists.
      </p>
      <RouterLink
        to="/"
        className="px-10 py-4 bg-[#131b2e] text-white font-black text-sm tracking-widest rounded-xl hover:bg-black transition-all"
      >
        RETURN TO ATELIER
      </RouterLink>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <ErrorBoundary>
          <Navbar />
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />

            {/* Protected */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AppProviders>
    </BrowserRouter>
  );
}
