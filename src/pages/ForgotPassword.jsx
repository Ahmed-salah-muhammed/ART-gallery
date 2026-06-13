import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  EmailOutlined as EmailIcon,
  MarkEmailReadOutlined as SentIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AuthShell from "../components/AuthShell";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setSent(true);
      toast(res?.message || "Reset link sent — check your inbox.", "success");
    } catch (err) {
      toast(err.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`If an account exists for ${email}, we've sent a password reset link. It expires in 10 minutes.`}
      >
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <SentIcon sx={{ fontSize: 32, color: "#3a5594" }} />
          </div>
          <p className="text-xs font-bold text-gray-500">
            Didn't get it? Check your spam folder, or{" "}
            <button
              onClick={() => setSent(false)}
              className="font-black text-[#131b2e] hover:underline"
            >
              try another email
            </button>
            .
          </p>
          <Link
            to="/login"
            className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#131b2e] uppercase tracking-widest"
          >
            <BackIcon sx={{ fontSize: 14 }} /> Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter the email tied to your account and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            EMAIL ADDRESS
          </label>
          <TextField
            fullWidth
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
            autoComplete="email"
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon
                    sx={{ fontSize: 18, color: error ? "#ef4444" : "#9ca3af" }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#131b2e] text-white font-black text-sm tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "SEND RESET LINK"
          )}
        </button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#131b2e] uppercase tracking-widest"
        >
          <BackIcon sx={{ fontSize: 14 }} /> Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}
