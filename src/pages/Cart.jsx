import { useNavigate, Link } from "react-router-dom";
import { IconButton, Button, Divider, Chip } from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingBagOutlined as ShoppingIcon,
  ArrowBack as ArrowBackIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import QuantityControl from "../components/QuantityControl";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";

function CartItemRow({ product, quantity }) {
  const { removeItem, updateQty } = useCart();
  const isSale = product.discountPercentage > 10;
  return (
    <div className="flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-100 last:border-none items-start sm:items-center">
      <div className="w-24 h-28 bg-gray-50 rounded-2xl border border-gray-100 flex-shrink-0 flex items-center justify-center p-2">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="flex-1 min-w-0 w-full">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-black text-sm text-gray-900 leading-snug line-clamp-2">
            {product.title}
          </h3>
          <button
            onClick={() => removeItem(product._id)}
            className="p-1 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">
          {product.category}
        </span>
        <div className="flex items-center justify-between gap-4">
          <QuantityControl
            value={quantity}
            onChange={(v) => updateQty(product._id, v)}
            size="sm"
          />
          <div className="text-right">
            <span className="block font-black text-lg text-gray-900">
              ${(product.price * quantity).toFixed(2)}
            </span>
            {isSale && (
              <span className="text-[10px] font-bold text-gray-400 line-through">
                $
                {(
                  (product.price / (1 - product.discountPercentage / 100)) *
                  quantity
                ).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, clearCart, totalPrice, totalCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0)
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-black mb-4 font-serif text-gray-900">
              Shopping Cart
            </h1>
            <Breadcrumbs />
          </div>
        </div>
        <div className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4">
          <ShoppingIcon className="text-gray-100 text-9xl mb-8" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 max-w-sm mb-10">
            There are no pieces in your archive yet. Discover our curated
            collection.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-12 py-4 text-white font-black text-sm tracking-widest rounded-xl hover:bg-black transition-all"
          >
            GO TO SHOP
          </button>
        </div>
        <Footer />
      </div>
    );

  const shipping = totalPrice >= 150 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-black mb-4 font-serif text-gray-900">
            Shopping Cart
          </h1>
          <Breadcrumbs />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Items List */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">
                {totalCount} {totalCount === 1 ? "Item" : "Items"}
              </h2>
              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-red-600 transition-colors tracking-widest"
              >
                <RefreshIcon sx={{ fontSize: 14 }} /> CLEAR CART
              </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              {items.map(({ product, quantity }) => (
                <CartItemRow
                  key={product._id}
                  product={product}
                  quantity={quantity}
                />
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate("/shop")}
                className="flex items-center gap-2 text-[11px] font-black text-gray-500 hover:text-[#131b2e] transition-colors tracking-widest"
              >
                <ArrowBackIcon sx={{ fontSize: 16 }} /> CONTINUE SHOPPING
              </button>
            </div>
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="bg-gray-50 rounded-[32px] border border-gray-100 p-10 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-8">
                  Order Summary
                </h2>

                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <div className="mb-8 p-6 bg-white rounded-2xl border border-dashed border-[#131b2e]/30">
                    <p className="text-[10px] font-black  mb-3 tracking-wider">
                      🚚 Add ${(150 - totalPrice).toFixed(2)} more for FREE
                      shipping
                    </p>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#131b2e] transition-all duration-500"
                        style={{
                          width: `${Math.min((totalPrice / 150) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-5 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">
                      Subtotal ({totalCount} items)
                    </span>
                    <span className="text-gray-900 font-black">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">
                      Estimated Tax
                    </span>
                    <span className="text-gray-900 font-black">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">Shipping</span>
                    <span
                      className={`font-black ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}
                    >
                      {shipping === 0 ? "✓ FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <hr className="border-dashed border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-gray-900">
                      Total
                    </span>
                    <span className="text-3xl font-black ">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="cursor-pointer w-full  hover:bg-blue-200 py-4 border-2 border-gray-200 text-gray-900 font-black text-sm tracking-widest rounded-xl hover:border-[#131b2e] transition-all my-4"
                >
                  PROCEED TO CHECKOUT
                </button>
                <button
                  onClick={() => navigate("/shop")}
                  className="cursor-pointer w-full py-4 border-2 border-gray-200 text-gray-900 font-black text-sm tracking-widest rounded-xl hover:border-[#131b2e] transition-all"
                >
                  CONTINUE SHOPPING
                </button>

                <div className="flex items-center justify-center gap-2 mt-8 text-gray-400">
                  <LockIcon sx={{ fontSize: 14 }} />
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    Secured with SSL encryption
                  </span>
                </div>

                {/* Payment Icons */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {["VISA", "MC", "PayPal", "Apple Pay"].map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 border border-gray-200 rounded-md text-[9px] font-black text-gray-400"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
