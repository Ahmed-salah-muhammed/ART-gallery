import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { TextField, CircularProgress } from "@mui/material";
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AuthShell from "../components/AuthShell";

export default function VerifyEmail() {
  const { token } = useParams();
  const { verifyEmail, resendVerification } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode's double-invoke in dev (token is single-use).
    if (ran.current) return;
    ran.current = true;

    verifyEmail(token)
      .then((user) => {
        setStatus("success");
        toast(`Email verified — welcome, ${user.firstName}! ✨`, "success");
        setTimeout(() => navigate("/", { replace: true }), 2200);
      })
      .catch(() => setStatus("error"));
    // Intentionally only depends on `token` — the ref guard above plus this
    // narrow dependency keep verification a single, idempotent call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(resendEmail)) {
      toast("Enter a valid email", "error");
      return;
    }
    setResending(true);
    try {
      await resendVerification(resendEmail);
      toast("If that account needs verification, a new link is on its way.", "success");
    } catch {
      toast("Could not resend. Try again later.", "error");
    } finally {
      setResending(false);
    }
  };

  if (status === "verifying") {
    return (
      <AuthShell title="Verifying your email" subtitle="One moment while we confirm your link…">
        <div className="flex justify-center py-8">
          <CircularProgress sx={{ color: "#131b2e" }} />
        </div>
      </AuthShell>
    );
  }

  if (status === "success") {
    return (
      <AuthShell title="You're all set!" subtitle="Your email is verified and you're signed in.">
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <SuccessIcon sx={{ fontSize: 36, color: "#16a34a" }} />
          </div>
          <p className="text-xs font-bold text-gray-500">
            Redirecting you to the storefront…
          </p>
          <Link
            to="/"
            className="w-full py-4 bg-[#131b2e] text-white font-black text-sm tracking-widest rounded-xl hover:bg-black transition-all text-center"
          >
            START SHOPPING
          </Link>
        </div>
      </AuthShell>
    );
  }

  // error
  return (
    <AuthShell
      title="Link expired or invalid"
      subtitle="This verification link is no longer valid. Enter your email to get a fresh one."
    >
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <ErrorIcon sx={{ fontSize: 36, color: "#dc2626" }} />
        </div>

        <form onSubmit={handleResend} className="w-full flex flex-col gap-4">
          <TextField
            fullWidth
            type="email"
            placeholder="name@example.com"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <button
            type="submit"
            disabled={resending}
            className="w-full py-4 bg-[#131b2e] text-white font-black text-sm tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {resending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "RESEND VERIFICATION"
            )}
          </button>
        </form>

        <Link
          to="/login"
          className="text-[10px] font-black text-gray-400 hover:text-[#131b2e] uppercase tracking-widest"
        >
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}
