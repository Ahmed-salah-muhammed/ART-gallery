import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Avatar,
  Rating,
  TextField,
  InputAdornment,
} from "@mui/material";
import { IconButton } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import {
  ArrowForward as ArrowIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
  Email as EmailIcon,
  CheckCircle as CheckIcon,
  FormatQuote as QuoteIcon,
} from "@mui/icons-material";
import useFetchProducts from "../hooks/useFetchProducts";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

/* ── Hero Carousel ── */
const SLIDES = [
  {
    id: 1,
    bg: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070",
    label: `SPRING / SUMMER ${new Date().getFullYear()}`,
    title: "The New\nCollection",
    sub: "Timeless essentials reimagined for the modern wardrobe.",
    cta: "SHOP COLLECTION",
    ctaPath: "/shop",
    accent: "#2a14b4",
  },
  {
    id: 2,
    bg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070",
    label: "EXCLUSIVE DROPS",
    title: "The Digital\nGallery",
    sub: "Where innovation meets timeless craftsmanship.",
    cta: "DISCOVER MORE",
    ctaPath: "/shop",
    accent: "#c8442a",
  },
  {
    id: 3,
    bg: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=1200",
    label: "LIMITED EDITION",
    title: "Curated\nFor You",
    sub: "Premium pieces selected by our style editors.",
    cta: "EXPLORE NOW",
    ctaPath: "/shop",
    accent: "#0d6e5b",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 3000);
    return () => clearInterval(timerRef.current);
  }, []);

  const s = SLIDES[current];

  return (
    <div className="relative h-[75vh] md:h-[92vh] overflow-hidden ">
      {/* Background */}
      {SLIDES.map((sl, i) => (
        <div
          key={sl.id}
          className={`cursor-pointer absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img src={sl.bg} alt="" className="w-full h-full object-cover" />
          <div className="cursor-pointer absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className=" relative z-20 h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-xl">
          <span
            className="block text-[15px] font-black tracking-[0.3em] mb-4 uppercase"
            style={{ color: s.accent }}
          >
            {s.label}
          </span>
          <h1 className="text-white font-black text-5xl md:text-7xl leading-[1.1] mb-6 whitespace-pre-line drop-shadow-2xl">
            {s.title}
          </h1>
          <p className="text-white/80 text-md md:text-lg mb-10 leading-relaxed max-w-md">
            {s.sub}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(s.ctaPath)}
              className="cursor-pointer px-8 py-4 bg-white  font-black text-sm tracking-widest rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              {s.cta} <ArrowIcon fontSize="small" />
            </button>
            <button className="cursor-pointer px-8 py-4 border-2 border-white/60 text-white font-black text-sm tracking-widest rounded-xl hover:bg-white/10 transition-all">
              VIEW LOOKBOOK
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="cursor-pointer absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all hidden md:block"
      >
        <PrevIcon />
      </button>
      <button
        onClick={next}
        className="cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all hidden md:block"
      >
        <NextIcon />
      </button>

      {/* Dots */}
      <div className="cursor-pointer absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`cursor-pointer h-2 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-white" : "w-2 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Brand Story ── */
function BrandStory() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="relative overflow-hidden rounded-[40px] aspect-[4/5] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1000"
                alt="Brand Story"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            <div className="absolute -bottom-8 -right-8 text-white p-8 rounded-3xl max-w-[220px] shadow-2xl hidden md:block transform transition-transform duration-500 hover:-translate-y-2">
              <h3 className="text-4xl font-black mb-1">12+</h3>
              <p className="text-[10px] font-black opacity-80 tracking-[0.2em] uppercase leading-tight">
                YEARS OF UNCOMPROMISED CRAFTSMANSHIP
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <span className="font-black text-[11px] tracking-[0.3em] mb-4 uppercase">
              OUR STORY
            </span>
            <h2 className="text-5xl font-black mb-8 leading-[1.1] font-serif text-gray-900">
              Crafted with Passion, <br />
              Worn with Pride
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              A R T. Gallery was born from a simple belief: that quality and
              style should never be mutually exclusive. Founded in 2013, we set
              out to bridge
              the gap between luxury craftsmanship and everyday accessibility.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Every piece in our collection is meticulously designed and sourced
              from ethical artisans across the globe. We don't just sell
              clothes; we curate experiences that empower you to express your
              unique identity.
            </p>
            <button className="px-10 py-4 border-2   font-black text-sm tracking-widest rounded-xl hover:bg-[#07122b] hover:text-white transition-all duration-300 uppercase">
              LEARN MORE ABOUT US
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ── */
const REVIEWS = [
  {
    id: 1,
    name: "Raafat Kamel",
    role: "GIS Developer",
    text: "The attention to detail in every piece is remarkable. A R T. Gallery has truly redefined modern luxury for me.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sadas",
  },
  {
    id: 2,
    name: "Fadwa Mahmoud",
    role: "Full Stack Developer",
    text: "Minimalism at its finest. Their collection perfectly balances form and function without compromising on style.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
  {
    id: 3,
    name: "Bassem Hosni",
    role: "Military Officer",
    text: "I've been a loyal customer for years. The quality of the fabrics and the timeless designs are unmatched.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=elenaas",
  },
];

function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className=" font-black text-[11px] tracking-[0.3em] mb-4 uppercase">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl font-black font-serif text-gray-900">
            What Our Clients Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((r) => (
            <div
              key={r.id}
              className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <QuoteIcon className="text-gray-100 text-6xl mb-6  transition-colors" />
              <p className="text-gray-600 text-lg italic mb-8 leading-relaxed">
                "{r.text}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-black text-sm text-gray-900">{r.name}</h4>
                  <p className="text-xs text-gray-400 font-bold">{r.role}</p>
                </div>
                <Rating
                  value={r.rating}
                  readOnly
                  size="small"
                  sx={{ color: "#FBBF24" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Partner Brands ── */
const BRANDS = [
  "ZARA",
  "H&M",
  "NIKE",
  "ADIDAS",
  "GUCCI",
  "PRADA",
  "VERSACE",
  "DIOR",
  "CHANEL",
  "HERMES",
  "BALENCIAGA",
  "OFF-WHITE",
];

function PartnerBrands() {
  return (
    <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <span className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">
          PARTNER BRANDS
        </span>
      </div>
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={i}
              className="mx-12 text-xl font-black text-gray-200 hover:text-[#070d1c] transition-colors cursor-default tracking-widest"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Newsletter ── */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validate = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = () => {
    if (!validate(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section className="py-24 ">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="text-gray-500 font-black text-[11px] tracking-[0.3em] mb-4 uppercase">
          STAY IN THE LOOP
        </span>
        <h2 className="text-4xl font-black text-gray-900   md:text-5xl mb-6 font-serif">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-500  text-lg mb-12 ">
          Get exclusive offers, early access to new collections, and style
          inspiration delivered to your inbox.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 text-green-400">
            <CheckIcon fontSize="large" />
            <span className="text-xl text-gray-500 font-black">
              You're subscribed! Welcome to the circle. ✨
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className={`border-1 w-full px-6 py-4 rounded-xl bg-white text-gray-900 font-bold ${error ? "border-2 border-red-500" : ""}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />
              {error && (
                <p className="absolute -bottom-6 left-0 text-red-400 text-[10px] font-bold">
                  {error}
                </p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="px-10 py-4 bg-white border-2 font-black text-sm tracking-widest rounded-xl hover:bg-gray-100 transition-all"
            >
              SUBSCRIBE
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Main Home ── */
export default function Home() {
  const { products, loading } = useFetchProducts();
  const navigate = useNavigate();
  const featured = products?.slice(0, 8) || [];

  return (
    <main className="bg-white">
      <HeroCarousel />

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="relative h-[420px] rounded-[32px] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
                alt="Couture"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/80 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-white text-3xl font-black mb-2">Couture</h3>
                <Link
                  to="/shop?category=womens-clothing"
                  className="text-white/80 font-black text-[10px] tracking-widest border-b border-white/30 w-fit pb-1 hover:text-white transition-colors"
                >
                  DISCOVER →
                </Link>
              </div>
            </div>
            <div className="bg-gray-50 p-10 rounded-[32px] border border-gray-100">
              <h3 className="text-xl font-black mb-2 text-gray-900">
                Accessories
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                The finishing touches for a modern wardrobe.
              </p>
              <Link
                to="/shop?category=accessories"
                className=" font-black text-xs tracking-widest border-b-2 pb-1"
              >
                SHOP NOW →
              </Link>
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="relative h-full min-h-[420px] rounded-[32px] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&q=80&w=1600"
                alt="Menswear"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/80 to-transparent p-12 flex flex-col justify-end">
                <span className="text-white/60 font-black text-[10px] tracking-[0.3em] mb-2 uppercase">
                  NEW ARRIVALS
                </span>
                <h3 className="text-white text-5xl font-black mb-4 font-serif">
                  The Modern <br /> Gentleman
                </h3>
                <Link
                  to="/shop?category=mens-clothing"
                  className="px-8 py-4 bg-white  font-black text-xs tracking-widest rounded-xl w-fit hover:bg-gray-100 transition-all"
                >
                  EXPLORE COLLECTION
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className=" font-black text-[11px] tracking-[0.3em] mb-4 uppercase block">
                CURATED SELECTION
              </span>
              <h2 className="text-4xl font-black font-serif text-gray-900">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/shop"
              className=" font-black text-xs tracking-widest border-b-2 pb-1 hidden sm:block"
            >
              VIEW ALL PRODUCTS →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex flex-col gap-4">
                      <div className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                  ))
              : featured.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
          </div>
        </div>
      </section>

      <BrandStory />
      <Testimonials />
      <PartnerBrands />
      <Newsletter />
      <Footer />
    </main>
  );
}
