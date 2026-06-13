import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Badge,
  Tooltip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  FavoriteBorder as FavoriteIcon,
  ShoppingBagOutlined as CartIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  PersonOutline as UserIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { fetchProducts } from "../services/api";
import Logo from "./Logo";

/* ── Announcement Bar ─────────────────────────────────────────── */
function AnnouncementBar() {
  const items = [
    "🚚 FREE SHIPPING ON ALL ORDERS OVER $99",
    "💳 BUY NOW PAY LATER — 0% INTEREST FOR 6 MONTHS",
    "🌍 WORLDWIDE DELIVERY IN 3–7 BUSINESS DAYS",
  ];
  const text = items.join("     ·     ");
  return (
    <div className=" bg-blue-900 text-white py-2 overflow-hidden relative">
      <div className="flex animate-marquee whitespace-nowrap">
        {[text, text].map((t, i) => (
          <span
            key={i}
            className="px-8 text-[10px] font-black tracking-widest uppercase"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Live Search ──────────────────────────────────────────────── */
function LiveSearch({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      allProducts.filter((p) => p.title.toLowerCase().includes(q)).slice(0, 5),
    );
  }, [query, allProducts]);

  return (
    <div className="relative flex-1 max-w-lg">
      <div
        className="flex items-center px-4 py-2 rounded-xl border-2 shadow-lg"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-primary)",
        }}
      >
        <SearchIcon
          sx={{ fontSize: 20, color: "var(--color-primary)", mr: 1.5 }}
        />
        <input
          autoFocus
          placeholder="Search for products..."
          className="flex-1 bg-transparent outline-none text-sm font-bold"
          style={{ color: "var(--color-on-surface)" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={onClose}
          className="p-1 rounded-full transition-colors hover:opacity-60"
        >
          <CloseIcon
            sx={{ fontSize: 18, color: "var(--color-on-surface-variant)" }}
          />
        </button>
      </div>

      {results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border overflow-hidden z-[1500]"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-outline-variant)",
          }}
        >
          {results.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                navigate(`/shop/${p.id}`);
                onClose();
                setQuery("");
              }}
              className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors border-b last:border-none"
              style={{ borderColor: "var(--color-outline-variant)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-surface-container-low)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              <div
                className="w-12 h-14 rounded-lg overflow-hidden flex items-center justify-center p-1 flex-shrink-0"
                style={{
                  backgroundColor: "var(--color-surface-container-low)",
                }}
              >
                <img
                  src={p.thumbnail}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-sm font-black truncate"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {p.title}
                </h4>
                <span
                  className="text-xs font-black"
                  style={{ color: "var(--color-primary)" }}
                >
                  ${p.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Navbar ───────────────────────────────────────────────────── */
export default function Navbar() {
  const { totalCount, totalPrice } = useCart();
  const { wishlist } = useWishlist();
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Wishlist", path: "/wishlist" },
    { label: "Profile", path: "/profile" },
  ];

  const iconBtnStyle = {
    color: "var(--color-on-surface)",
    padding: "8px",
    borderRadius: "50%",
    transition: "background 0.2s",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
  };

  return (
    <>
      <AnnouncementBar />
      <nav
        className={`sticky top-0 z-[1100] transition-all duration-300 border-b ${scrolled ? "backdrop-blur-xl shadow-lg py-2" : "py-4"}`}
        style={{
          backgroundColor: scrolled
            ? dark
              ? "rgba(15,22,41,0.93)"
              : "rgba(250,248,255,0.93)"
            : "var(--color-surface)",
          borderColor: "var(--color-outline-variant)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {searchOpen ? (
              <LiveSearch onClose={() => setSearchOpen(false)} />
            ) : (
              <>
                {/* Logo */}
                <NavLink to="/" style={{ color: "var(--color-on-surface)" }}>
                  <Logo size={26} wordClassName="text-lg" />
                </NavLink>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-10">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className="text-[11px] font-black uppercase tracking-widest transition-all pb-1 border-b-2"
                      style={({ isActive }) => ({
                        color: isActive
                          ? "var(--color-on-surface)"
                          : "var(--color-on-surface-variant)",
                        borderColor: isActive
                          ? "var(--color-primary)"
                          : "transparent",
                      })}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-1 md:gap-2">
                  <Tooltip title="Search">
                    <button
                      style={iconBtnStyle}
                      onClick={() => setSearchOpen(true)}
                    >
                      <SearchIcon sx={{ fontSize: 22 }} />
                    </button>
                  </Tooltip>

                  <Tooltip title="Wishlist">
                    <NavLink to="/wishlist" style={iconBtnStyle}>
                      <Badge
                        badgeContent={wishlist.length}
                        color="primary"
                        sx={{ "& .MuiBadge-badge": { bgcolor: "#2a14b4" } }}
                      >
                        <FavoriteIcon sx={{ fontSize: 22 }} />
                      </Badge>
                    </NavLink>
                  </Tooltip>

                  <Tooltip title="Cart">
                    <NavLink to="/cart" style={iconBtnStyle}>
                      <Badge
                        badgeContent={totalCount}
                        color="primary"
                        sx={{ "& .MuiBadge-badge": { bgcolor: "#2a14b4" } }}
                      >
                        <CartIcon sx={{ fontSize: 22 }} />
                      </Badge>
                    </NavLink>
                  </Tooltip>

                  <div className="hidden lg:block px-2">
                    <span
                      className="text-xs font-black"
                      style={{ color: "var(--color-on-surface)" }}
                    >
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      mx: 1,
                      height: 24,
                      alignSelf: "center",
                      borderColor: "var(--color-outline-variant)",
                      display: { xs: "none", sm: "block" },
                    }}
                  />

                  {/* Theme Toggle */}
                  <Tooltip title={dark ? "Light Mode" : "Dark Mode"}>
                    <button style={iconBtnStyle} onClick={toggle}>
                      {dark ? (
                        <LightModeIcon sx={{ fontSize: 22 }} />
                      ) : (
                        <DarkModeIcon sx={{ fontSize: 22 }} />
                      )}
                    </button>
                  </Tooltip>

                  {user ? (
                    <div className="flex items-center gap-3">
                      <Tooltip title="Profile">
                        <NavLink to="/profile">
                          <Avatar
                            src={user.profilePhoto || undefined}
                            sx={{
                              width: 30,
                              height: 30,
                              fontSize: 13,
                              fontWeight: 900,
                              bgcolor: "#131b2e",
                            }}
                          >
                            {(user.firstName || user.email)?.[0]?.toUpperCase()}
                          </Avatar>
                        </NavLink>
                      </Tooltip>
                      <span
                        className="text-xs font-black hidden sm:block"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {user.fullName || user.firstName || user.name}
                      </span>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                        className="text-[10px] font-black tracking-widest hover:underline cursor-pointer"
                        style={{ color: "var(--color-primary)" }}
                      >
                        LOGOUT
                      </button>
                    </div>
                  ) : (
                    <Tooltip title="Login">
                      <NavLink to="/login" style={iconBtnStyle}>
                        <UserIcon sx={{ fontSize: 22 }} />
                      </NavLink>
                    </Tooltip>
                  )}

                  <button
                    className="md:hidden"
                    style={iconBtnStyle}
                    onClick={() => setMobileOpen(true)}
                  >
                    <MenuIcon />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "var(--color-surface)",
            color: "var(--color-on-surface)",
          },
        }}
      >
        <div className="w-72 p-8">
          <div className="flex justify-between items-center mb-10">
            <span style={{ color: "var(--color-on-surface)" }}>
              <Logo size={24} wordClassName="text-base" />
            </span>
            <button
              style={{ ...iconBtnStyle, padding: "6px" }}
              onClick={() => setMobileOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <List className="flex flex-col gap-2">
            {[
              ...navLinks,
              { label: "Cart", path: "/cart" },
              { label: "Login", path: "/login" },
            ].map((l) => (
              <ListItem
                key={l.path}
                component={NavLink}
                to={l.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "var(--color-surface-container-low)",
                  },
                }}
              >
                <ListItemText
                  primary={l.label}
                  primaryTypographyProps={{
                    style: {
                      color: "var(--color-on-surface)",
                      fontWeight: 900,
                      fontSize: "0.75rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
}
