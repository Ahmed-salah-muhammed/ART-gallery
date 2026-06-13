import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Rating, Button, Skeleton, IconButton } from "@mui/material";
import {
  FavoriteBorder as WishlistIcon,
  Favorite as WishlistFilledIcon,
  ShoppingBagOutlined as CartIcon,
  ArrowBack as BackIcon,
  LocalShipping as ShipIcon,
  Refresh as ReturnIcon,
  Shield as ShieldIcon,
  AccessTime as TimeIcon,
  Place as PlaceIcon,
} from "@mui/icons-material";
import useFetchProduct from "../hooks/useFetchProduct";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import QuantityControl from "../components/QuantityControl";
import Breadcrumbs from "../components/Breadcrumbs";
import StreetMap from "../components/StreetMap";

const NOSEJ_LOCATION = [31.23583, 29.9675];

const TRUST_ITEMS = [
  {
    icon: <ShipIcon sx={{ fontSize: 18 }} />,
    label: "Free Shipping",
    sub: "On orders over $150",
  },
  {
    icon: <ReturnIcon sx={{ fontSize: 18 }} />,
    label: "Free Returns",
    sub: "30-day return policy",
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 18 }} />,
    label: "Secure Payment",
    sub: "SSL encrypted checkout",
  },
];

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useFetchProduct(id);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();

  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [brokenImgs, setBrokenImgs] = useState(new Set());
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Set initial main image when product loads
  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    } else if (product?.thumbnail) {
      setMainImage(product.thumbnail);
    }
    setBrokenImgs(new Set());
  }, [product]);

  // Delivery estimation via geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setDeliveryInfo({
        text: "Standard Delivery",
        sub: "Ships in 2-5 business days",
        color: "text-gray-500",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const R = 6371;
        const dLat = ((latitude - NOSEJ_LOCATION[0]) * Math.PI) / 180;
        const dLon = ((longitude - NOSEJ_LOCATION[1]) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((NOSEJ_LOCATION[0] * Math.PI) / 180) *
            Math.cos((latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        if (distance < 50) {
          setDeliveryInfo({
            text: "Get it by Tomorrow",
            sub: "Fast delivery in Cairo",
            color: "text-green-600",
          });
        } else {
          setDeliveryInfo({
            text: "Delivery in 2-3 Days",
            sub: "Standard shipping to your location",
            color: "text-blue-600",
          });
        }
      },
      () =>
        setDeliveryInfo({
          text: "Standard Delivery",
          sub: "Ships in 2-5 business days",
          color: "text-gray-500",
        }),
    );
  }, []);

  const handleAdd = () => {
    addItem(product, qty);
    toast(`"${product.title.slice(0, 22)}…" added to cart`, "success");
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast(
      isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist",
      "info",
    );
  };

  // Resolve image src — use fallback if broken
  const imgSrc = useCallback(
    (src) => (brokenImgs.has(src) ? FALLBACK_IMG : src || FALLBACK_IMG),
    [brokenImgs],
  );

  const markBroken = useCallback((src) => {
    setBrokenImgs((prev) => new Set([...prev, src]));
  }, []);

  if (error)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl text-red-600 font-black">Product not found</h2>
        <Button variant="contained" onClick={() => navigate("/shop")}>
          Back to Shop
        </Button>
      </div>
    );

  // All unique images for thumbnails
  const allImages = product
    ? Array.from(
        new Set([product.thumbnail, ...(product.images ?? [])]),
      ).filter(Boolean)
    : [];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Header */}
      <div
        className="py-12"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumbs title={product?.title?.slice(0, 30)} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 mb-10 font-extrabold text-xs hover:opacity-70 transition-opacity uppercase tracking-widest"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <BackIcon fontSize="small" />
          BACK TO COLLECTION
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* ── Image Gallery ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <Skeleton
                variant="rectangular"
                className="rounded-3xl h-[560px] w-full"
              />
            ) : (
              <>
                {/* Main image */}
                <div
                  className="relative rounded-3xl overflow-hidden flex items-center justify-center min-h-[520px] p-12 border"
                  style={{
                    backgroundColor: "var(--color-surface-container-low)",
                    borderColor: "var(--color-outline-variant)",
                  }}
                >
                  <img
                    src={imgSrc(mainImage)}
                    alt={product?.title}
                    onError={() => markBroken(mainImage)}
                    className="max-w-full max-h-[440px] object-contain transition-transform duration-500 hover:scale-105"
                  />
                  {product?.discountPercentage > 10 && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase">
                      SALE
                    </span>
                  )}
                  <IconButton
                    onClick={handleWishlist}
                    className="absolute top-4 right-4 shadow-lg"
                    sx={{
                      bgcolor: "white",
                      "&:hover": { bgcolor: "#131b2e", color: "white" },
                    }}
                  >
                    {isInWishlist(product?.id) ? (
                      <WishlistFilledIcon className="text-red-500" />
                    ) : (
                      <WishlistIcon />
                    )}
                  </IconButton>
                </div>

                {/* ── Thumbnails ── */}
                {allImages.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {allImages.map((img, idx) => {
                      const isActive = mainImage === img;
                      const src = imgSrc(img);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setMainImage(img);
                          }}
                          className={`
                            relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-1
                            transition-all duration-200 hover:border-[#131b2e] hover:scale-105
                            ${
                              isActive
                                ? "border-[#131b2e] ring-1 ring-[#131b2e] ring-offset-1"
                                : "border-transparent"
                            }
                          `}
                          style={{
                            backgroundColor:
                              "var(--color-surface-container-low)",
                          }}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img
                            src={src}
                            alt={`${product?.title} view ${idx + 1}`}
                            onError={() => markBroken(img)}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {/* Active overlay indicator */}
                          {isActive && (
                            <span className="absolute inset-0 bg-[#131b2e]/10 pointer-events-none" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ── Street Routing Map ── */}
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: "var(--color-outline-variant)" }}
                >
                  <button
                    onClick={() => setShowMap((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 font-black text-[11px] tracking-widest uppercase transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: "var(--color-surface-container-low)",
                      color: "var(--color-on-surface)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <PlaceIcon sx={{ fontSize: 16 }} />
                      Find in Store — A R T. Gallery Cairo
                    </span>
                    <span
                      className={`text-[10px] transition-transform duration-300 ${showMap ? "rotate-180" : ""}`}
                    >
                      ▼
                    </span>
                  </button>
                  {showMap && (
                    <div
                      className="p-4"
                      style={{ backgroundColor: "var(--color-surface)" }}
                    >
                      <StreetMap productTitle={product?.title} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Product Info ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {loading ? (
              <div className="flex flex-col gap-4">
                <Skeleton height={32} width="40%" />
                <Skeleton height={60} width="90%" />
                <Skeleton height={30} width="30%" />
                <Skeleton height={120} />
              </div>
            ) : (
              <>
                <div>
                  <span
                    className="font-black text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {product?.category}
                    {product?.brand && product.brand !== product.category && (
                      <span className="ml-2 opacity-60">· {product.brand}</span>
                    )}
                  </span>
                  <h1
                    className="text-5xl font-black leading-tight mt-2 font-serif"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    {product?.title}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <Rating
                    value={product?.rating ?? 4.5}
                    readOnly
                    precision={0.1}
                    sx={{ color: "#FBBF24" }}
                  />
                  <span
                    className="font-bold text-sm"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {product?.rating} ({product?.stock} in stock)
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-4xl font-black"
                      style={{ color: "var(--color-on-surface)" }}
                    >
                      ${product?.price?.toFixed(2)}
                    </span>
                    {product?.discountPercentage > 10 && (
                      <span
                        className="text-xl line-through font-bold"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        $
                        {(
                          product.price /
                          (1 - product.discountPercentage / 100)
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {deliveryInfo && (
                    <div className="flex items-center gap-2 mt-1">
                      <TimeIcon
                        className={deliveryInfo.color}
                        sx={{ fontSize: 16 }}
                      />
                      <div>
                        <span
                          className={`text-xs font-black uppercase tracking-wider ${deliveryInfo.color}`}
                        >
                          {deliveryInfo.text}
                        </span>
                        <p
                          className="text-[10px] font-bold"
                          style={{ color: "var(--color-on-surface-variant)" }}
                        >
                          {deliveryInfo.sub}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <hr style={{ borderColor: "var(--color-outline-variant)" }} />

                <p
                  className="leading-relaxed text-lg"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {product?.description}
                </p>

                <div className="flex items-center gap-6">
                  <span
                    className="font-black text-xs tracking-widest"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    QTY
                  </span>
                  <QuantityControl value={qty} onChange={setQty} size="md" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CartIcon />}
                    onClick={handleAdd}
                    className="flex-1 py-4 font-black text-sm tracking-widest rounded-xl"
                    sx={{
                      bgcolor: "#131b2e",
                      "&:hover": { bgcolor: "black" },
                      borderRadius: "12px",
                    }}
                  >
                    ADD TO CART
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleWishlist}
                    startIcon={
                      isInWishlist(product?.id) ? (
                        <WishlistFilledIcon className="text-red-500" />
                      ) : (
                        <WishlistIcon />
                      )
                    }
                    sx={{
                      px: 4,
                      borderColor: "var(--color-outline-variant)",
                      color: "var(--color-on-surface)",
                      borderRadius: "12px",
                      "&:hover": { borderColor: "#131b2e" },
                    }}
                  >
                    WISHLIST
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex gap-4 flex-wrap pt-4">
                  {TRUST_ITEMS.map((t) => (
                    <div
                      key={t.label}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
                      style={{
                        backgroundColor: "var(--color-surface-container-low)",
                        borderColor: "var(--color-outline-variant)",
                      }}
                    >
                      <div style={{ color: "var(--color-on-surface)" }}>
                        {t.icon}
                      </div>
                      <div>
                        <h4
                          className="text-[10px] font-black uppercase tracking-wider"
                          style={{ color: "var(--color-on-surface)" }}
                        >
                          {t.label}
                        </h4>
                        <p
                          className="text-[9px] font-bold"
                          style={{ color: "var(--color-on-surface-variant)" }}
                        >
                          {t.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
