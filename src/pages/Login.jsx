import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  MarkEmailReadOutlined as InboxIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AuthShell from "../components/AuthShell";
import SocialAuthButtons from "../components/SocialAuthButtons";

export default function Login() {
  const { login, register, resendVerification } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [registeredEmail, setRegisteredEmail] = useState(null); // post-signup panel
  const [unverified, setUnverified] = useState(null); // { email } on 403

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  // Register expects firstName + lastName; the form collects a single name.
  const splitName = (full) => {
    const parts = full.trim().split(/\s+/);
    return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
  };

  const validate = () => {
    const e = {};
    if (mode === "register") {
      const { firstName, lastName } = splitName(form.name);
      if (!form.name.trim()) e.name = "Full name is required";
      else if (!lastName || firstName.length < 2 || lastName.length < 2)
        e.name = "Enter first and last name (2+ letters each)";
      if (form.phone && !/^[+\d][\d\s()-]{6,}$/.test(form.phone))
        e.phone = "Enter a valid phone number";
    }
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (mode === "register" && form.password.length < 8)
      e.password = "At least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUnverified(null);
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === "login") {
        const user = await login(form.email, form.password);
        toast(`Welcome back, ${user?.firstName || user?.email}! 👋`, "success");
        navigate(from, { replace: true });
      } else {
        const { firstName, lastName } = splitName(form.name);
        await register({
          firstName,
          lastName,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
          passwordConfirm: form.password,
        });
        // Strict verification — show the "check your inbox" panel.
        setRegisteredEmail(form.email);
      }
    } catch (err) {
      const message = err.data?.message || err.message || "Something went wrong";
      // Unverified local account trying to log in.
      if (err.data?.needsVerification) {
        setUnverified({ email: err.data.email || form.email });
      } else {
        setErrors((prev) => ({ ...prev, password: message }));
      }
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (email) => {
    try {
      await resendVerification(email);
      toast("Verification email sent — check your inbox.", "success");
    } catch {
      toast("Could not resend. Try again later.", "error");
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setErrors({});
    setUnverified(null);
    setForm({ name: "", email: "", phone: "", password: "" });
  };

  // ── Post-signup: check-your-inbox panel ──────────────────────────────────
  if (registeredEmail) {
    return (
      <AuthShell
        title="Verify your email"
        subtitle={`We sent a verification link to ${registeredEmail}. Click it to activate your account, then sign in.`}
      >
        <div className="flex flex-col items-center text-center gap-6 py-2">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <InboxIcon sx={{ fontSize: 32, color: "#3a5594" }} />
          </div>
          <p className="text-xs font-bold text-gray-500">
            Didn't receive it? Check spam, or resend below.
          </p>
          <button
            onClick={() => handleResend(registeredEmail)}
            className="w-full py-3.5 border border-gray-200 rounded-xl font-black text-xs tracking-widest text-gray-700 hover:bg-gray-50 transition-all"
          >
            RESEND VERIFICATION EMAIL
          </button>
          <button
            onClick={() => {
              setRegisteredEmail(null);
              setMode("login");
            }}
            className="w-full py-4 bg-[#131b2e] text-white font-black text-sm tracking-widest rounded-xl hover:bg-black transition-all"
          >
            BACK TO SIGN IN
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={mode === "login" ? "Welcome back" : "Create account"}
      subtitle={
        mode === "login"
          ? "Sign in to access your gallery and orders."
          : "Join A R T. Gallery. Get early access and exclusive drops."
      }
    >
      {/* Unverified banner */}
      {unverified && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="text-xs font-bold text-amber-800 mb-2">
            ⚠ Your email isn't verified yet. Please confirm it to sign in.
          </p>
          <button
            onClick={() => handleResend(unverified.email)}
            className="text-[10px] font-black text-amber-900 underline uppercase tracking-widest"
          >
            Resend verification email
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {mode === "register" && (
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              FULL NAME
            </label>
            <TextField
              fullWidth
              placeholder="Ahmed Salah"
              value={form.name}
              onChange={set("name")}
              error={!!errors.name}
              helperText={errors.name}
              autoComplete="name"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            EMAIL ADDRESS
          </label>
          <TextField
            fullWidth
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={set("email")}
            error={!!errors.email}
            helperText={errors.email}
            autoComplete="email"
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon
                    sx={{ fontSize: 18, color: errors.email ? "#ef4444" : "#9ca3af" }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {mode === "register" && (
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              PHONE <span className="text-gray-300">(optional)</span>
            </label>
            <TextField
              fullWidth
              type="tel"
              placeholder="+20 100 000 0000"
              value={form.phone}
              onChange={set("phone")}
              error={!!errors.phone}
              helperText={errors.phone}
              autoComplete="tel"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon
                      sx={{ fontSize: 18, color: errors.phone ? "#ef4444" : "#9ca3af" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              PASSWORD
            </label>
            {mode === "login" && (
              <Link
                to="/forgot-password"
                className="text-[10px] font-black text-[#3a5594] hover:underline uppercase tracking-widest"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <TextField
            fullWidth
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={set("password")}
            error={!!errors.password}
            helperText={errors.password}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon
                    sx={{ fontSize: 18, color: errors.password ? "#ef4444" : "#9ca3af" }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPass((s) => !s)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPass ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#131b2e] text-white font-black text-sm tracking-widest rounded-xl hover:bg-black transition-all mt-2 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : mode === "login" ? (
            "SIGN IN"
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>
      </form>

      <SocialAuthButtons onAuthed={() => navigate(from, { replace: true })} />

      <div className="text-center mt-8">
        <p className="text-xs font-bold text-gray-500">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-black text-[#131b2e] hover:underline"
          >
            {mode === "login" ? "Sign up now" : "Sign in here"}
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
