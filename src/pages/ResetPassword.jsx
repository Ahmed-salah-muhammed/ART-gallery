import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AuthShell from "../components/AuthShell";

export default function ResetPassword() {
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await resetPassword(token, form.password, form.confirm);
      toast("Password reset! You're signed in. ✨", "success");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err.data?.message || "Reset link is invalid or expired";
      setErrors((p) => ({ ...p, confirm: msg }));
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const passField = (field, label, autoComplete) => (
    <div>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      <TextField
        fullWidth
        type={showPass ? "text" : "password"}
        placeholder="••••••••"
        value={form[field]}
        onChange={set(field)}
        error={!!errors[field]}
        helperText={errors[field]}
        autoComplete={autoComplete}
        variant="outlined"
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon
                sx={{ fontSize: 18, color: errors[field] ? "#ef4444" : "#9ca3af" }}
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
  );

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you don't use elsewhere."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {passField("password", "NEW PASSWORD", "new-password")}
        {passField("confirm", "CONFIRM PASSWORD", "new-password")}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#131b2e] text-white font-black text-sm tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "RESET PASSWORD"
          )}
        </button>

        <Link
          to="/login"
          className="text-center text-[10px] font-black text-gray-400 hover:text-[#131b2e] uppercase tracking-widest"
        >
          Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}
