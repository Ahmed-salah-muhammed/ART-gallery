import api from "../config/api.js";

// ========== PRODUCTS ==========
export async function fetchProducts(filters = {}) {
  const { data } = await api.get("/products", { params: filters });
  return data.products || [];
}

export async function fetchProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
}

export async function fetchCategories() {
  const { data } = await api.get("/products/categories");
  return data.categories || [];
}

// ========== AUTH ==========
export async function registerUser(
  firstName,
  lastName,
  email,
  password,
  passwordConfirm
) {
  const data = await api.post("/auth/register", {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
  });
  if (data.token) {
    localStorage.setItem("shopwave-token", data.token);
  }
  return data.user;
}

export async function loginUser(email, password) {
  const data = await api.post("/auth/login", { email, password });
  if (data.token) {
    localStorage.setItem("shopwave-token", data.token);
  }
  return data.user;
}

export async function logoutUser() {
  localStorage.removeItem("shopwave-token");
  localStorage.removeItem("shopwave-user");
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
