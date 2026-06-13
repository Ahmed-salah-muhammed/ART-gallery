import api from "../config/api.js";

// ========== PRODUCTS ==========
export async function fetchProducts(filters = {}) {
  // The axios response interceptor already unwraps to the JSON body,
  // which is { success, count, products }.
  const data = await api.get("/products", { params: filters });
  return data.products || [];
}

export async function fetchProduct(id) {
  const data = await api.get(`/products/${id}`);
  return data.product;
}

export async function fetchCategories() {
  const data = await api.get("/products/categories");
  return data.categories || [];
}

// ========== AUTH ==========
const persistToken = (token) => {
  if (token) localStorage.setItem("shopwave-token", token);
};

export async function registerUser({
  firstName,
  lastName,
  email,
  phone,
  password,
  passwordConfirm,
}) {
  // Strict verification: registration does NOT return a session token.
  // Returns { needsVerification, email, message }.
  const data = await api.post("/auth/register", {
    firstName,
    lastName,
    email,
    phone,
    password,
    passwordConfirm,
  });
  return data;
}

export async function loginUser(email, password) {
  const data = await api.post("/auth/login", { email, password });
  persistToken(data.token);
  return data.user;
}

export async function logoutUser() {
  localStorage.removeItem("shopwave-token");
  localStorage.removeItem("shopwave-user");
}

export async function verifyEmail(token) {
  const data = await api.post(`/auth/verify-email/${token}`);
  persistToken(data.token);
  return data.user;
}

export async function resendVerification(email) {
  return api.post("/auth/resend-verification", { email });
}

export async function forgotPassword(email) {
  return api.post("/auth/forgot-password", { email });
}

export async function resetPassword(token, password, passwordConfirm) {
  const data = await api.post(`/auth/reset-password/${token}`, {
    password,
    passwordConfirm,
  });
  persistToken(data.token);
  return data.user;
}

export async function googleAuth(credential) {
  const data = await api.post("/auth/google", { credential });
  persistToken(data.token);
  return data.user;
}

export async function facebookAuth(accessToken, userID) {
  const data = await api.post("/auth/facebook", { accessToken, userID });
  persistToken(data.token);
  return data.user;
}

// ========== CART ==========
export async function getCart() {
  const data = await api.get("/cart");
  return data;
}

export async function addToCart(productId, quantity) {
  const data = await api.post("/cart", { productId, quantity });
  return data.cart;
}

export async function updateCartItem(productId, quantity) {
  const data = await api.put(`/cart/${productId}`, { quantity });
  return data.cart;
}

export async function removeFromCart(productId) {
  const data = await api.delete(`/cart/${productId}`);
  return data.cart;
}

export async function clearCart() {
  const data = await api.delete("/cart");
  return data.cart;
}

// ========== WISHLIST ==========
export async function getWishlist() {
  const data = await api.get("/wishlist");
  return data;
}

export async function addToWishlist(productId) {
  const data = await api.post("/wishlist", { productId });
  return data.wishlist;
}

export async function removeFromWishlist(productId) {
  const data = await api.delete(`/wishlist/${productId}`);
  return data.wishlist;
}

// ========== ORDERS ==========
export async function createOrder(shippingAddress) {
  const data = await api.post("/orders", { shippingAddress });
  return data.order;
}

export async function getUserOrders() {
  const data = await api.get("/orders/user");
  return data.orders || [];
}

export async function getOrderById(orderId) {
  const data = await api.get(`/orders/${orderId}`);
  return data.order;
}

// ========== USER PROFILE ==========
export async function getUserProfile() {
  const data = await api.get("/users/profile");
  return data.user;
}

export async function updateUserProfile(profileData) {
  const data = await api.put("/users/profile", profileData);
  return data.user;
}

export async function changePassword(
  currentPassword,
  newPassword,
  passwordConfirm
) {
  const data = await api.post("/users/change-password", {
    currentPassword,
    newPassword,
    passwordConfirm,
  });
  return data;
}

export async function deleteAccount(password) {
  await api.delete("/users/account", { data: { password } });
  localStorage.removeItem("shopwave-token");
  localStorage.removeItem("shopwave-user");
}
