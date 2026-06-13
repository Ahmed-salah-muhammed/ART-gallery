import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating, IconButton, Button } from "@mui/material";
import {
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  ShoppingBagOutlined as CartIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

const FALLBACK =
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product, 1);
    toast(`"${product.title.slice(0, 22)}…" added to cart`, "success");
  };
  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    toast(
      isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist",
      "info",
    );
  };

  const isNew = (product.stock ?? 0) % 3 === 0;
  const isSale = product.discountPercentage > 10;
  const isHouse = product.category === "art";

  return (
    <div
      onClick={() => navigate(`/shop/${product.id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl card-entry border"
      style={{
        backgroundColor: "var(--color-surface-container-low)",
        borderColor: "var(--color-outline-variant)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div
        className="relative pt-[120%] overflow-hidden rounded-t-2xl"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
      >
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
          {isHouse && (
            <span className="bg-[#2a14b4] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              A R T.
            </span>
          )}
          {isNew && !isHouse && (
            <span className="bg-[#131b2e] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
              NEW
            </span>
          )}
          {isSale && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
              SALE
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div
          className={`absolute top-2.5 right-2.5 flex flex-col gap-2 z-10 transition-opacity duration-300 ${hover ? "opacity-100" : "opacity-0"}`}
        >
          <IconButton
            size="small"
            onClick={handleWishlist}
            sx={{
              bgcolor: "white",
              "&:hover": { bgcolor: "#131b2e", color: "white" },
            }}
          >
            {isInWishlist(product.id) ? (
              <FavoriteFilledIcon fontSize="small" className="text-red-500" />
            ) : (
              <FavoriteIcon fontSize="small" />
            )}
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/shop/${product.id}`);
            }}
            sx={{
              bgcolor: "white",
              "&:hover": { bgcolor: "#131b2e", color: "white" },
            }}
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Product Image */}
        <img
          src={imgError ? FALLBACK : product.thumbnail}
          alt={product.title}
          onError={() => setImgError(true)}
          loading="lazy"
          className={`absolute top-0 left-0 w-full h-full object-contain p-6 transition-transform duration-500 ${hover ? "scale-110" : "scale-100"}`}
        />

        {/* Add to Cart Slide-up */}
        <div
          className={`absolute bottom-0 left-0 w-full transition-transform duration-300 z-10 ${hover ? "translate-y-0" : "translate-y-full"}`}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={handleAdd}
            startIcon={<CartIcon />}
            className="rounded-none py-3 text-[11px] font-extrabold tracking-widest"
            sx={{
              borderRadius: 0,
              bgcolor: "#131b2e",
              "&:hover": { bgcolor: "black" },
            }}
          >
            ADD TO CART
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50"
          style={{ color: "var(--color-on-surface)" }}
        >
          {product.category}
        </p>
        <h3
          className="font-extrabold uppercase tracking-tight mb-2 text-sm line-clamp-1 transition-colors"
          style={{ color: "var(--color-on-surface)" }}
        >
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <Rating
            value={product.rating ?? 4}
            readOnly
            size="small"
            precision={0.1}
            sx={{ color: "#FBBF24", fontSize: "0.9rem" }}
          />
          <span
            className="font-semibold text-xs"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            ({product.stock})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="font-black text-lg"
            style={{ color: "var(--color-on-surface)" }}
          >
            ${product.price.toFixed(2)}
          </span>
          {isSale && (
            <span
              className="line-through font-semibold text-xs"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              $
              {(product.price / (1 - product.discountPercentage / 100)).toFixed(
                2,
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
