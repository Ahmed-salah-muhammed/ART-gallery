import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
} from "@mui/material";
import {
  ChevronRight as ChevronIcon,
  LocalShippingOutlined as ShippingIcon,
  VerifiedUserOutlined as SecureIcon,
  CreditCardOutlined as CardIcon,
  CheckCircle as CheckIcon,
  ReceiptLong as ReceiptIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import {
  createOrder,
  getUserProfile,
  updateUserProfile,
} from "../services/api";
import Footer from "../components/Footer";

const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: "12px" } };

export default function Checkout() {
  const { items, totalPrice, loadCart } = useCart();
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [saveInfo, setSaveInfo] = useState(true);
  const [placedOrder, setPlacedOrder] = useState(null); // confirmation snapshot
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Prefill from the signed-in user's profile.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const profile = await getUserProfile();
        if (!active || !profile) return;
        setForm((f) => ({
          ...f,
          fullName: profile.fullName || `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address?.street || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          zip: profile.address?.zipCode || "",
          country: profile.address?.country || "",
        }));
      } catch {
        // Fall back to whatever's in the auth context.
        if (!active) return;
        setForm((f) => ({
          ...f,
          fullName: user?.fullName || user?.firstName || "",
          email: user?.email || "",
          phone: user?.phone || "",
        }));
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  // Redirect to cart only if it's empty AND we haven't just placed an order.
  useEffect(() => {
    if (items.length === 0 && !placedOrder) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, placedOrder, navigate]);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const shipping = totalPrice >= 150 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!/^[+\d][\d\s()-]{6,}$/.test(form.phone))
      e.phone = "Valid phone required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (paymentMethod === "credit_card") {
      if (form.cardNumber.replace(/\s/g, "").length < 12)
        e.cardNumber = "Enter a valid card number";
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(form.expiry)) e.expiry = "MM/YY";
      if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "CVV";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast("Please fix the highlighted fields.", "error");
      return;
    }
    setIsProcessing(true);

    // Snapshot cart for the confirmation screen before the server clears it.
    const snapshotItems = items.map(({ product, quantity }) => ({
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      quantity,
    }));
    const snapshotTotals = { subtotal: totalPrice, shipping, tax, grandTotal };

    try {
      const order = await createOrder({
        name: form.fullName,
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zip,
        country: form.country,
        phone: form.phone,
      });

      // Persist phone (and address if requested) back to the profile.
      if (saveInfo) {
        try {
          const updated = await updateUserProfile({
            phone: form.phone,
            address: {
              street: form.address,
              city: form.city,
              state: form.state,
              zipCode: form.zip,
              country: form.country,
            },
          });
          updateUser({ phone: updated?.phone || form.phone });
        } catch {
          // Non-fatal — the order already went through.
        }
      }

      await loadCart(); // cart was emptied server-side — sync local state
      setPlacedOrder({
        id: order?._id,
        items: snapshotItems,
        totals: snapshotTotals,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast("Order placed! Thank you for choosing A R T. Gallery.", "success");
    } catch (err) {
      toast(err.message || "Could not place order. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Order confirmation ────────────────────────────────────────────────────
  if (placedOrder) {
    const { totals } = placedOrder;
    return (
      <div className="bg-white pb-24">
        <div className="max-w-3xl mx-auto px-4 pt-24 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8">
            <CheckIcon sx={{ fontSize: 48, color: "#16a34a" }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 font-serif text-gray-900">
            Order confirmed!
          </h1>
          <p className="text-gray-500 mb-2">
            Thank you, <strong>{form.fullName}</strong>. A confirmation has been
            sent to <strong>{form.email}</strong>.
          </p>
          {placedOrder.id && (
            <p className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-10">
              Order #{String(placedOrder.id).slice(-8).toUpperCase()}
            </p>
          )}

          <div className="bg-gray-50 rounded-[32px] border border-gray-100 p-8 text-left mb-10">
            <div className="flex items-center gap-2 mb-6">
              <ReceiptIcon sx={{ fontSize: 20, color: "#131b2e" }} />
              <h2 className="text-lg font-black text-gray-900">Order summary</h2>
            </div>
            <div className="flex flex-col gap-4 mb-6">
              {placedOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-14 bg-white rounded-lg p-1 flex items-center justify-center flex-shrink-0 border border-gray-100">
                      <img
                        src={it.thumbnail}
                        alt=""
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-gray-900 truncate">
                        {it.title}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400">
                        Qty: {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-900">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <hr className="border-gray-200 mb-4" />
            <div className="flex justify-between text-sm font-black text-gray-900">
              <span>Total paid</span>
              <span>${totals.grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] font-bold text-gray-400 mt-4">
              Shipping to {form.address}, {form.city} {form.zip},{" "}
              {form.country} · {form.phone}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-10 py-4 bg-[#131b2e] text-white font-black text-sm tracking-widest rounded-xl hover:bg-black transition-all"
            >
              CONTINUE SHOPPING
            </Link>
            <Link
              to="/profile"
              className="px-10 py-4 border-2 border-[#131b2e] text-[#131b2e] font-black text-sm tracking-widest rounded-xl hover:bg-gray-50 transition-all"
            >
              VIEW MY ORDERS
            </Link>
          </div>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="bg-white pb-24">
      {/* Header with Breadcrumbs */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-black mb-4 font-serif text-gray-900">
            Checkout
          </h1>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-[10px] font-black text-gray-400 hover:text-[#131b2e] transition-colors uppercase tracking-widest"
            >
              HOME
            </Link>
            <ChevronIcon className="text-gray-300" sx={{ fontSize: 14 }} />
            <Link
              to="/cart"
              className="text-[10px] font-black text-gray-400 hover:text-[#131b2e] transition-colors uppercase tracking-widest"
            >
              CART
            </Link>
            <ChevronIcon className="text-gray-300" sx={{ fontSize: 14 }} />
            <span className="text-[10px] font-black text-[#131b2e] uppercase tracking-widest">
              CHECKOUT
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Form Column */}
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-16">
                {/* Shipping Details */}
                <div>
                  <h2 className="text-3xl font-black mb-8 text-gray-900">
                    Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                      fullWidth
                      label="Full Name"
                      required
                      value={form.fullName}
                      onChange={set("fullName")}
                      error={!!errors.fullName}
                      helperText={errors.fullName}
                      variant="outlined"
                      sx={inputSx}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      error={!!errors.email}
                      helperText={errors.email}
                      variant="outlined"
                      sx={inputSx}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      required
                      type="tel"
                      placeholder="+20 100 000 0000"
                      value={form.phone}
                      onChange={set("phone")}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      variant="outlined"
                      sx={inputSx}
                    />
                    <TextField
                      fullWidth
                      label="Country"
                      required
                      value={form.country}
                      onChange={set("country")}
                      error={!!errors.country}
                      helperText={errors.country}
                      variant="outlined"
                      sx={inputSx}
                    />
                    <div className="md:col-span-2">
                      <TextField
                        fullWidth
                        label="Street Address"
                        required
                        value={form.address}
                        onChange={set("address")}
                        error={!!errors.address}
                        helperText={errors.address}
                        variant="outlined"
                        sx={inputSx}
                      />
                    </div>
                    <TextField
                      fullWidth
                      label="Town / City"
                      required
                      value={form.city}
                      onChange={set("city")}
                      error={!!errors.city}
                      helperText={errors.city}
                      variant="outlined"
                      sx={inputSx}
                    />
                    <TextField
                      fullWidth
                      label="State / Province"
                      value={form.state}
                      onChange={set("state")}
                      variant="outlined"
                      sx={inputSx}
                    />
                    <TextField
                      fullWidth
                      label="Postcode / ZIP"
                      required
                      value={form.zip}
                      onChange={set("zip")}
                      error={!!errors.zip}
                      helperText={errors.zip}
                      variant="outlined"
                      sx={inputSx}
                    />
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h2 className="text-3xl font-black mb-8 text-gray-900">
                    Payment Information
                  </h2>
                  <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                    <FormControl component="fieldset" className="w-full">
                      <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <div className="flex flex-col gap-6">
                          <div
                            className={`p-6 bg-white rounded-2xl shadow-sm border-2 ${paymentMethod === "credit_card" ? "border-[#131b2e]" : "border-transparent"}`}
                          >
                            <FormControlLabel
                              value="credit_card"
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    color: "#131b2e",
                                    "&.Mui-checked": { color: "#131b2e" },
                                  }}
                                />
                              }
                              label={
                                <div className="flex items-center gap-3">
                                  <CardIcon className="text-[#131b2e]" />
                                  <span className="text-sm font-black text-gray-900">
                                    Credit / Debit Card
                                  </span>
                                </div>
                              }
                            />
                            {paymentMethod === "credit_card" && (
                              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                  <TextField
                                    fullWidth
                                    label="Card Number"
                                    value={form.cardNumber}
                                    onChange={set("cardNumber")}
                                    error={!!errors.cardNumber}
                                    helperText={errors.cardNumber}
                                    placeholder="0000 0000 0000 0000"
                                    variant="outlined"
                                    size="small"
                                  />
                                </div>
                                <TextField
                                  fullWidth
                                  label="Expiry Date"
                                  value={form.expiry}
                                  onChange={set("expiry")}
                                  error={!!errors.expiry}
                                  helperText={errors.expiry}
                                  placeholder="MM/YY"
                                  variant="outlined"
                                  size="small"
                                />
                                <TextField
                                  fullWidth
                                  label="CVV"
                                  value={form.cvv}
                                  onChange={set("cvv")}
                                  error={!!errors.cvv}
                                  helperText={errors.cvv}
                                  placeholder="123"
                                  variant="outlined"
                                  size="small"
                                />
                              </div>
                            )}
                          </div>

                          <div
                            className={`p-6 bg-white rounded-2xl border ${paymentMethod === "cod" ? "border-2 border-[#131b2e]" : "border-gray-100"} hover:border-gray-200 transition-colors`}
                          >
                            <FormControlLabel
                              value="cod"
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    color: "#131b2e",
                                    "&.Mui-checked": { color: "#131b2e" },
                                  }}
                                />
                              }
                              label={
                                <span className="text-sm font-black text-gray-900">
                                  Cash on Delivery
                                </span>
                              }
                            />
                          </div>

                          <div
                            className={`p-6 bg-white rounded-2xl border ${paymentMethod === "paypal" ? "border-2 border-[#131b2e]" : "border-gray-100"} hover:border-gray-200 transition-colors`}
                          >
                            <FormControlLabel
                              value="paypal"
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    color: "#131b2e",
                                    "&.Mui-checked": { color: "#131b2e" },
                                  }}
                                />
                              }
                              label={
                                <span className="text-sm font-black text-gray-900">
                                  PayPal
                                </span>
                              }
                            />
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      size="small"
                      sx={{
                        color: "#131b2e",
                        "&.Mui-checked": { color: "#131b2e" },
                      }}
                    />
                  }
                  label={
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Save my phone & address to my profile for future
                      purchases.
                    </span>
                  }
                />
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#131b2e] text-white p-10 rounded-[40px] shadow-2xl sticky top-32">
                <h2 className="text-2xl font-black mb-8">Your Order</h2>

                <div className="flex flex-col gap-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product._id}
                      className="flex justify-between items-center gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 bg-white rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={product.thumbnail}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-black uppercase tracking-wider truncate w-32">
                            {product.title}
                          </h4>
                          <p className="text-[10px] font-bold opacity-50">
                            Qty: {quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-white/10 mb-8" />

                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex justify-between text-xs">
                    <span className="opacity-60 font-bold">Subtotal</span>
                    <span className="font-black">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-60 font-bold">Shipping</span>
                    <span className="font-black">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-60 font-bold">Est. Tax (8%)</span>
                    <span className="font-black">${tax.toFixed(2)}</span>
                  </div>
                  <hr className="border-white/20 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black">Total</span>
                    <span className="text-3xl font-black text-white">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="cursor-pointer w-full py-4 bg-white text-[#131b2e] font-black text-sm tracking-widest rounded-xl hover:bg-gray-100 transition-all mb-8 disabled:opacity-50"
                >
                  {isProcessing ? "PROCESSING..." : "COMPLETE PURCHASE"}
                </button>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 opacity-50">
                    <SecureIcon sx={{ fontSize: 18 }} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Secure encrypted payment
                    </span>
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <ShippingIcon sx={{ fontSize: 18 }} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Global delivery 5-7 days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
