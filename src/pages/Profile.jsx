import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, Button, Tab, Tabs, TextField, CircularProgress } from "@mui/material";
import {
  CheckCircle as CheckIcon,
  LocalShipping as ShipIcon,
  Inventory as BoxIcon,
  EmojiEvents as DeliveredIcon,
  ReceiptLong as ReceiptIcon,
  Map as MapIcon,
  MyLocation as LiveIcon,
  Route as RouteIcon,
  AccessTime as EtaIcon,
  Straighten as DistIcon,
  PhotoCamera as CameraIcon,
  ShoppingBagOutlined as BagIcon,
} from "@mui/icons-material";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
} from "../services/api";
import { fileToCompressedDataUrl } from "../utils/image";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";

// ── Leaflet icon fix ───────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STORE_COORDS = [29.962696, 31.2769423]; // Nosej — Central Maadi
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

// ── Custom icons ──────────────────────────────────────────────────────────
const storeIcon = L.divIcon({
  className: "",
  html: `<div style="width:40px;height:40px;border-radius:50% 50% 50% 0;background:#131b2e;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.4);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;">
           <span style="transform:rotate(45deg);font-size:18px;line-height:1;">🏪</span>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -44],
});

const buildUserIcon = (isLive) =>
  L.divIcon({
    className: "",
    html: `<div style="position:relative;width:28px;height:28px;">
           ${isLive ? `<div style="position:absolute;inset:0;border-radius:50%;background:rgba(42,20,180,0.25);animation:ping 1.4s cubic-bezier(0,0,0.2,1) infinite;"></div>` : ""}
           <div style="position:absolute;inset:4px;border-radius:50%;background:#2a14b4;border:3px solid white;box-shadow:0 2px 8px rgba(42,20,180,0.5);"></div>
         </div>
         <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0;}}</style>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });

// ── OSRM street routing ───────────────────────────────────────────────────
async function fetchStreetRoute(from, to) {
  const url = `${OSRM_URL}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("OSRM failed");
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) throw new Error("No route");
  const { distance, duration } = data.routes[0];
  const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [
    lat,
    lng,
  ]);
  return { coords, distance, duration };
}

// ── Order Tracker ─────────────────────────────────────────────────────────
const ORDER_STEPS = [
  {
    label: "Order Placed",
    icon: <ReceiptIcon />,
    desc: "Mar 20, 2025 · 09:14 AM",
  },
  { label: "Processing", icon: <BoxIcon />, desc: "Mar 20, 2025 · 02:30 PM" },
  { label: "Shipped", icon: <ShipIcon />, desc: "Mar 21, 2025 · 11:00 AM" },
  {
    label: "Delivered",
    icon: <DeliveredIcon />,
    desc: "Expected Mar 25, 2025",
  },
];

function OrderTracker({ activeStep = 2 }) {
  return (
    <div>
      <h3
        className="text-xl font-black mb-8"
        style={{ color: "var(--color-on-surface)" }}
      >
        Order #ATL-20250320
      </h3>
      <div className="relative mb-12">
        <div
          className="absolute top-[22px] left-[12.5%] right-[12.5%] h-1 rounded-full z-0"
          style={{ backgroundColor: "var(--color-outline-variant)" }}
        />
        <div
          className="absolute top-[22px] left-[12.5%] h-1 rounded-full z-10 transition-all duration-1000"
          style={{ width: `${(activeStep / (ORDER_STEPS.length - 1)) * 75}%` }}
        />
        <div className="grid grid-cols-4 relative z-20">
          {ORDER_STEPS.map((step, i) => {
            const done = i <= activeStep;
            const active = i === activeStep;
            return (
              <div
                key={step.label}
                className="flex flex-col items-center gap-4"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500
                  ${done ? "bg-[#131b2e] text-white" : "text-gray-300"} ${active ? "ring-4 ring-[#131b2e]/20" : ""}`}
                  style={{
                    backgroundColor: done
                      ? "#131b2e"
                      : "var(--color-surface-container-highest)",
                  }}
                >
                  {done ? <CheckIcon sx={{ fontSize: 20 }} /> : step.icon}
                </div>
                <div className="text-center">
                  <p
                    className={`text-[10px] font-black uppercase tracking-wider mb-1 ${done ? "" : ""}`}
                    style={{
                      color: done ? "" : "var(--color-on-surface-variant)",
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="text-[9px] font-bold hidden sm:block"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <span className="inline-block px-3 py-1  text-white text-[10px] font-black rounded-md uppercase tracking-widest">
        In Transit — On Time
      </span>
    </div>
  );
}

// ── Live GIS Tracking Map ─────────────────────────────────────────────────
function GISTrackingMap() {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const routeLayer = useRef(null);
  const userMarker = useRef(null);
  const watchId = useRef(null);
  const storeMarker = useRef(null);

  const [status, setStatus] = useState("idle"); // idle|requesting|live|error|denied
  const [distance, setDistance] = useState(null); // km
  const [duration, setDuration] = useState(null); // min
  const [accuracy, setAccuracy] = useState(null); // metres
  const [updateTime, setUpdateTime] = useState(null);

  // Init map once
  useEffect(() => {
    if (mapInst.current) return;

    mapInst.current = L.map(mapRef.current, {
      center: STORE_COORDS,
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapInst.current);

    storeMarker.current = L.marker(STORE_COORDS, { icon: storeIcon })
      .addTo(mapInst.current)
      .bindPopup(
        `<div style="font-family:Inter,sans-serif;min-width:150px;">
        <strong style="font-size:13px;">🏪 A R T. Gallery Store</strong><br/>
        <span style="font-size:11px;color:#666;">Central Maadi, Cairo</span>
      </div>`,
      )
      .openPopup();

    return () => {
      mapInst.current?.remove();
      mapInst.current = null;
    };
  }, []);

  // Stop watching on unmount
  useEffect(() => {
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const updateRoute = useCallback(async (lat, lng, acc) => {
    setAccuracy(Math.round(acc));
    setUpdateTime(
      new Date().toLocaleTimeString("en-EG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );

    // Move or create user marker
    if (userMarker.current) {
      userMarker.current.setLatLng([lat, lng]);
    } else {
      userMarker.current = L.marker([lat, lng], { icon: buildUserIcon(true) })
        .addTo(mapInst.current)
        .bindPopup(
          '<span style="font-size:12px;font-family:Inter,sans-serif;font-weight:700;">📍 Your Location</span>',
        );
    }

    // Fetch & redraw street route
    try {
      const {
        coords,
        distance: d,
        duration: dur,
      } = await fetchStreetRoute([lat, lng], STORE_COORDS);

      if (routeLayer.current) mapInst.current.removeLayer(routeLayer.current);

      // Gradient-style route: draw shadow then main line
      L.polyline(coords, { color: "#ffffff", weight: 7, opacity: 0.6 }).addTo(
        mapInst.current,
      );
      routeLayer.current = L.polyline(coords, {
        color: "#2a14b4",
        weight: 5,
        opacity: 0.9,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(mapInst.current);

      // Animated dashed progress overlay
      L.polyline(coords.slice(0, Math.ceil(coords.length * 0.6)), {
        color: "",
        weight: 3,
        opacity: 0.5,
        dashArray: "8, 6",
      }).addTo(mapInst.current);

      setDistance((d / 1000).toFixed(1));
      setDuration(Math.ceil(dur / 60));

      mapInst.current.fitBounds(routeLayer.current.getBounds(), {
        padding: [50, 50],
      });
    } catch {
      // Fallback straight line
      if (routeLayer.current) mapInst.current.removeLayer(routeLayer.current);
      routeLayer.current = L.polyline([[lat, lng], STORE_COORDS], {
        color: "#2a14b4",
        weight: 4,
        opacity: 0.6,
        dashArray: "10, 8",
      }).addTo(mapInst.current);
      mapInst.current.fitBounds(routeLayer.current.getBounds(), {
        padding: [50, 50],
      });
    }
  }, []);

  const startLiveTracking = () => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("requesting");

    watchId.current = navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude, accuracy } }) => {
        setStatus("live");
        updateRoute(latitude, longitude, accuracy);
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 },
    );
  };

  const stopTracking = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setStatus("idle");
    setDistance(null);
    setDuration(null);
    setAccuracy(null);
    setUpdateTime(null);
    if (userMarker.current) {
      mapInst.current?.removeLayer(userMarker.current);
      userMarker.current = null;
    }
    if (routeLayer.current) {
      mapInst.current?.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }
    if (mapInst.current) mapInst.current.setView(STORE_COORDS, 14);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <MapIcon sx={{ color: "var(--color-primary)" }} />
        <h3
          className="text-xl font-black"
          style={{ color: "var(--color-on-surface)" }}
        >
          Live Order Map
        </h3>
        <span
          className="px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-widest border"
          style={{
            color: status === "live" ? "#16a34a" : "var(--color-primary)",
            borderColor: status === "live" ? "#16a34a" : "var(--color-primary)",
            backgroundColor: status === "live" ? "#f0fdf4" : "transparent",
          }}
        >
          {status === "live" ? "🟢 LIVE" : "GIS Feature"}
        </span>
      </div>

      <p
        className="text-sm leading-relaxed mb-6"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        Real-time street-routing from your location to the A R T. Gallery store in Maadi.
        Position updates automatically every 5 seconds.
      </p>

      {/* Map */}
      <div
        className="rounded-3xl overflow-hidden border-2  shadow-xl relative"
        style={{ height: 420 }}
      >
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />

        {/* Info overlay */}
        <div
          className="absolute bottom-4 left-4 right-4 backdrop-blur-md rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3 border z-[1000]"
          style={{
            backgroundColor:
              "rgba(var(--color-surface-rgb, 250,248,255), 0.92)",
            borderColor: "var(--color-outline-variant)",
            background: "rgba(250,248,255,0.92)",
          }}
        >
          {/* Legend */}
          <div className="flex gap-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm " />
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Store
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2a14b4]" />
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                You
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 rounded bg-[#2a14b4]" />
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Route
              </span>
            </div>
          </div>

          {/* Stats */}
          {status === "live" && distance && (
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
                <DistIcon sx={{ fontSize: 14, color: "#2563eb" }} />
                <span className="text-[11px] font-black text-blue-700">
                  {distance} km
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 px-3 py-1.5 rounded-xl">
                <EtaIcon sx={{ fontSize: 14, color: "#16a34a" }} />
                <span className="text-[11px] font-black text-green-700">
                  {duration} min
                </span>
              </div>
              {accuracy && (
                <div className="hidden sm:flex items-center gap-1.5 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl">
                  <LiveIcon sx={{ fontSize: 14, color: "#7c3aed" }} />
                  <span className="text-[11px] font-black text-purple-700">
                    ±{accuracy}m
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live pulse badge */}
        {status === "live" && (
          <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black tracking-widest">
              LIVE TRACKING
            </span>
          </div>
        )}
      </div>

      {/* Last update */}
      {updateTime && (
        <p
          className="text-[10px] font-bold mt-2 text-right"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Last updated: {updateTime}
        </p>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-3 mt-5">
        {status !== "live" ? (
          <button
            onClick={startLiveTracking}
            disabled={status === "requesting"}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: "black", color: "white" }}
          >
            {status === "requesting" ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Acquiring Location…
              </>
            ) : (
              <>
                <LiveIcon sx={{ fontSize: 16 }} />
                Start Live Tracking
              </>
            )}
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all border-2 border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Stop Tracking
          </button>
        )}

        {status === "denied" && (
          <p className="text-[11px] font-bold text-center bg-red-50 border border-red-100 text-red-500 rounded-xl px-3 py-2">
            Location access denied — please enable it in your browser settings.
          </p>
        )}

        <p
          className="text-[10px] font-bold text-center"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          🌍 Road-based routing via OSRM · Built by Ahmed Salah — GIS Analyst &
          Full-Stack Developer
        </p>
      </div>
    </div>
  );
}

// ── Account Settings Tab ──────────────────────────────────────────────────
function AccountTab() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [photo, setPhoto] = useState(user?.profilePhoto || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;
    getUserProfile()
      .then((p) => {
        if (!active || !p) return;
        setForm({
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          phone: p.phone || "",
          street: p.address?.street || "",
          city: p.address?.city || "",
          state: p.address?.state || "",
          zipCode: p.address?.zipCode || "",
          country: p.address?.country || "",
        });
        setPhoto(p.profilePhoto || null);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.value }));

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      const updated = await updateUserProfile({ profilePhoto: dataUrl });
      const next = updated?.profilePhoto || dataUrl;
      setPhoto(next);
      updateUser({ profilePhoto: next });
      toast("Profile photo updated ✨", "success");
    } catch (err) {
      toast(err.data?.message || err.message || "Could not update photo", "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateUserProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
      });
      updateUser({
        firstName: updated?.firstName,
        lastName: updated?.lastName,
        fullName: updated?.fullName,
        phone: updated?.phone,
      });
      toast("Profile saved successfully", "success");
    } catch (err) {
      toast(err.data?.message || err.message || "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress sx={{ color: "#131b2e" }} />
      </div>
    );
  }

  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "12px" } };

  return (
    <div
      className="p-8 sm:p-10 rounded-[32px] border"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-outline-variant)",
      }}
    >
      {/* Photo */}
      <div className="flex items-center gap-6 mb-10">
        <div className="relative">
          <Avatar
            src={photo || undefined}
            sx={{ width: 88, height: 88, fontSize: 32, fontWeight: 900, bgcolor: "#131b2e" }}
          >
            {(form.firstName || user?.email)?.[0]?.toUpperCase()}
          </Avatar>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#131b2e] text-white flex items-center justify-center shadow-lg hover:bg-black transition-all disabled:opacity-60"
            title="Change photo"
          >
            {uploading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <CameraIcon sx={{ fontSize: 18 }} />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhoto}
          />
        </div>
        <div>
          <h3 className="text-lg font-black" style={{ color: "var(--color-on-surface)" }}>
            Profile photo
          </h3>
          <p className="text-xs font-bold" style={{ color: "var(--color-on-surface-variant)" }}>
            JPG or PNG. Square images look best.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField label="First Name" value={form.firstName} onChange={set("firstName")} variant="outlined" sx={fieldSx} />
        <TextField label="Last Name" value={form.lastName} onChange={set("lastName")} variant="outlined" sx={fieldSx} />
        <TextField label="Email" value={user?.email || ""} disabled variant="outlined" sx={fieldSx} />
        <TextField label="Phone" type="tel" placeholder="+20 100 000 0000" value={form.phone} onChange={set("phone")} variant="outlined" sx={fieldSx} />
        <div className="md:col-span-2">
          <TextField fullWidth label="Street Address" value={form.street} onChange={set("street")} variant="outlined" sx={fieldSx} />
        </div>
        <TextField label="City" value={form.city} onChange={set("city")} variant="outlined" sx={fieldSx} />
        <TextField label="State / Province" value={form.state} onChange={set("state")} variant="outlined" sx={fieldSx} />
        <TextField label="ZIP / Postcode" value={form.zipCode} onChange={set("zipCode")} variant="outlined" sx={fieldSx} />
        <TextField label="Country" value={form.country} onChange={set("country")} variant="outlined" sx={fieldSx} />
        <div className="md:col-span-2 flex justify-end mt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-10 py-3.5 bg-[#131b2e] text-white font-black text-xs tracking-widest rounded-xl hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50 uppercase"
          >
            {saving ? <CircularProgress size={16} color="inherit" /> : null}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  delivered: "bg-green-50 text-green-600",
  shipped: "bg-blue-50 text-blue-600",
  confirmed: "bg-indigo-50 text-indigo-600",
  pending: "bg-amber-50 text-amber-600",
  cancelled: "bg-red-50 text-red-600",
};

function OrdersTab({ orders, loading, onTrack }) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress sx={{ color: "#131b2e" }} />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-20">
        <BagIcon sx={{ fontSize: 64, color: "var(--color-outline-variant)" }} />
        <h3 className="text-xl font-black mt-4 mb-2" style={{ color: "var(--color-on-surface)" }}>
          No orders yet
        </h3>
        <p className="text-sm mb-8" style={{ color: "var(--color-on-surface-variant)" }}>
          When you place an order, it'll show up here.
        </p>
        <a
          href="/shop"
          className="px-8 py-3 bg-[#131b2e] text-white font-black text-xs tracking-widest rounded-xl hover:bg-black transition-all uppercase"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const status = (order.status || "pending").toLowerCase();
        const date = new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return (
          <div
            key={order._id}
            className="p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-shadow hover:shadow-md"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-outline-variant)",
            }}
          >
            <div>
              <h4 className="font-black mb-1" style={{ color: "var(--color-on-surface)" }}>
                #{String(order._id).slice(-8).toUpperCase()}
              </h4>
              <p className="text-xs font-bold" style={{ color: "var(--color-on-surface-variant)" }}>
                {date} · {order.items?.length || 0} item
                {(order.items?.length || 0) === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xl font-black" style={{ color: "var(--color-on-surface)" }}>
                ${Number(order.totalPrice || 0).toFixed(2)}
              </span>
              <span
                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}
              >
                {status}
              </span>
              <button
                onClick={onTrack}
                className="text-[10px] font-black hover:underline tracking-widest uppercase"
                style={{ color: "var(--color-primary)" }}
              >
                TRACK
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────
export default function Profile() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const { wishlist } = useWishlist();
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let active = true;
    getUserOrders()
      .then((data) => active && setOrders(data || []))
      .catch(() => {})
      .finally(() => active && setLoadingOrders(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Header band */}
      <div
        className="py-16"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h1
            className="text-5xl font-black mb-4 font-serif"
            style={{ color: "var(--color-on-surface)" }}
          >
            My Profile
          </h1>
          <Breadcrumbs />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div
              className="rounded-[32px] border p-10 text-center"
              style={{
                backgroundColor: "var(--color-surface-container-low)",
                borderColor: "var(--color-outline-variant)",
              }}
            >
              <Avatar
                src={user?.profilePhoto || undefined}
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: "#131b2e",
                  fontWeight: 900,
                  mx: "auto",
                  mb: 3,
                }}
              >
                {(user?.fullName || user?.firstName || user?.name)?.[0]?.toUpperCase() ||
                  "A"}
              </Avatar>
              <h2
                className="text-xl font-black mb-1"
                style={{ color: "var(--color-on-surface)" }}
              >
                {user?.fullName || user?.firstName || user?.name}
              </h2>
              <p
                className="text-sm mb-8"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {user?.email}
              </p>

              <hr
                style={{
                  borderColor: "var(--color-outline-variant)",
                  marginBottom: "2rem",
                }}
              />

              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { label: "Cart", value: totalCount },
                  { label: "Wishlist", value: wishlist.length },
                  { label: "Orders", value: orders.length },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <span className="block text-xl font-black">{s.value}</span>
                    <span
                      className="text-[9px] font-black uppercase tracking-widest"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={logout}
                className="cursor-pointer w-full py-3 border-2 border-red-100 text-red-600 font-black text-[10px] tracking-widest rounded-xl hover:bg-red-50 transition-all uppercase"
              >
                SIGN OUT
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-9">
            <div
              className="mb-10 border-b"
              style={{ borderColor: "var(--color-outline-variant)" }}
            >
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    color: "var(--color-on-surface-variant)",
                    "&.Mui-selected": { color: "var(--color-on-surface)" },
                  },
                  "& .MuiTabs-indicator": { bgcolor: "#131b2e" },
                }}
              >
                <Tab label="Account" />
                <Tab label="Order History" />
                <Tab label="Track Order" />
                <Tab label="Live Map" />
              </Tabs>
            </div>

            {/* ── Tab 0: Account ── */}
            {tab === 0 && <AccountTab />}

            {/* ── Tab 1: Orders ── */}
            {tab === 1 && (
              <OrdersTab
                orders={orders}
                loading={loadingOrders}
                onTrack={() => setTab(2)}
              />
            )}

            {/* ── Tab 2: Order Tracker ── */}
            {tab === 2 && (
              <div
                className="p-10 rounded-[32px] border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-outline-variant)",
                }}
              >
                <OrderTracker activeStep={2} />
              </div>
            )}

            {/* ── Tab 3: Live Map ── */}
            {tab === 3 && (
              <div
                className="p-8 rounded-[32px] border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-outline-variant)",
                }}
              >
                <GISTrackingMap />
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
