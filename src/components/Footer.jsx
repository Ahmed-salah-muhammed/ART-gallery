import { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton, TextField, Button, InputAdornment } from "@mui/material";
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import Logo from "./Logo";

const SHOP_LINKS = [
  "New Arrivals",
  "Best Sellers",
  "Men's Clothing",
  "Women's Clothing",
  "Accessories",
  "Sale",
];
const COMPANY_LINKS = [
  "Our Story",
  "Sustainability",
  "Press",
  "Careers",
  "Investors",
];
const SUPPORT_LINKS = [
  "Help Center",
  "Track Order",
  "Returns & Exchanges",
  "Size Guide",
  "Contact Us",
];

const SOCIALS = [
  {
    icon: <GoogleIcon fontSize="small" />,
    href: "mailto:ahmedsalah219013@gmail.com",
    label: "Google",
  },
  {
    icon: <GitHubIcon fontSize="small" />,
    href: "https://github.com/Ahmed-salah-muhammed/",
    label: "GitHub",
  },
  { icon: <TwitterIcon fontSize="small" />, href: "#", label: "X (Twitter)" },
  { icon: <FacebookIcon fontSize="small" />, href: "#", label: "Facebook" },
  { icon: <InstagramIcon fontSize="small" />, href: "#", label: "Instagram" },
];

const PAYMENT_METHODS = [
  { name: "VISA", color: "#1A1F71" },
  { name: "MC", color: "#EB001B" },
  { name: "PayPal", color: "#003087" },
  { name: "Apple Pay", color: "#000000" },
  { name: "Stripe", color: "#635BFF" },
];

function PaymentBadge({ name, color }) {
  return (
    <div
      className="px-4 py-2 rounded-lg min-w-[52px] text-center border"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-outline-variant)",
      }}
    >
      <span className="text-[10px] font-black tracking-wider" style={{ color }}>
        {name}
      </span>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);
  const [err, setErr] = useState("");

  const validate = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const handleSub = () => {
    if (!validate(email)) {
      setErr("Enter a valid email");
      return;
    }
    setErr("");
    setSubDone(true);
  };

  return (
    <footer
      className="pt-20 pb-8 border-t"
      style={{
        backgroundColor: "var(--color-surface-container-low)",
        borderColor: "var(--color-outline-variant)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <div
              className="mb-4"
              style={{ color: "var(--color-on-surface)" }}
            >
              <Logo size={30} wordClassName="text-xl" />
            </div>
            <p
              className="text-sm leading-relaxed mb-6 max-w-sm"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              The Digital Gallery — a destination for those who value
              craftsmanship, minimalism, and the art of the modern wardrobe.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3">
                <EmailIcon
                  sx={{ fontSize: 16, color: "var(--color-primary)" }}
                />
                <a
                  href="mailto:ahmedsalah219013@gmail.com"
                  className="text-sm transition-colors"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  ahmedsalah219013@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon
                  sx={{ fontSize: 16, color: "var(--color-primary)" }}
                />
                <a
                  href="tel:+201225246488"
                  className="text-sm transition-colors"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  +20 122 524 6488
                </a>
              </div>
            </div>

            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <IconButton
                  key={s.label}
                  component="a"
                  href={s.href}
                  target="_blank"
                  size="small"
                  sx={{
                    border: "1px solid var(--color-outline-variant)",
                    borderRadius: "12px",
                    color: "var(--color-on-surface-variant)",
                    "&:hover": {
                      bgcolor: "#131b2e",
                      color: "white",
                      borderColor: "#131b2e",
                    },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              { title: "SHOP", links: SHOP_LINKS },
              { title: "COMPANY", links: COMPANY_LINKS },
              { title: "SUPPORT", links: SUPPORT_LINKS },
            ].map((col) => (
              <div key={col.title}>
                <span
                  className="text-[11px] font-black mb-6 block tracking-widest uppercase"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {col.title}
                </span>
                <ul className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        to="#"
                        className="text-sm transition-colors"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end text-left md:text-left">
            <span
              className="text-[11px] font-black mb-6 block tracking-widest uppercase"
              style={{ color: "var(--color-on-surface)" }}
            >
              NEWSLETTER
            </span>
            <p
              className="text-sm leading-relaxed mb-6 max-w-[240px]"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Subscribe for exclusive deals & new drops.
            </p>
            {subDone ? (
              <div className="flex items-center gap-2 text-green-500">
                <CheckIcon sx={{ fontSize: 18 }} />
                <span className="font-bold text-xs">Subscribed!</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full max-w-[240px]">
                <TextField
                  size="small"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErr("");
                  }}
                  error={!!err}
                  helperText={err}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ fontSize: 16 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSub}
                  sx={{
                    bgcolor: "#131b2e",
                    "&:hover": { bgcolor: "black" },
                    borderRadius: "8px",
                    fontWeight: 900,
                  }}
                >
                  SUBSCRIBE
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-12">
          <span
            className="text-[10px] font-black block mb-4 tracking-[0.2em] uppercase"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            SECURE PAYMENT METHODS
          </span>
          <div className="flex flex-wrap gap-3">
            {PAYMENT_METHODS.map((p) => (
              <PaymentBadge key={p.name} {...p} />
            ))}
          </div>
        </div>

        <hr
          style={{
            borderColor: "var(--color-outline-variant)",
            marginBottom: "2rem",
          }}
        />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p
            className="text-[11px]"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            © {new Date().getFullYear() + " "}
            <strong style={{ color: "var(--color-on-surface)" }}>
              Ahmed Salah
            </strong>{" "}
            — A R T. Gallery. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (l) => (
                <Link
                  key={l}
                  to="#"
                  className="text-[11px] transition-colors"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {l}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
