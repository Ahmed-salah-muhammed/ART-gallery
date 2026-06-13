import { GoogleLogin } from "@react-oauth/google";
import { Facebook as FacebookIcon, Google as GoogleIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { facebookLogin, isFacebookConfigured } from "../config/facebook";

const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

export default function SocialAuthButtons({ onAuthed }) {
  const { loginWithGoogle, loginWithFacebook } = useAuth();
  const toast = useToast();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      toast(`Welcome, ${user.firstName}! 👋`, "success");
      onAuthed?.(user);
    } catch (err) {
      toast(err.data?.message || err.message || "Google sign-in failed", "error");
    }
  };

  const handleFacebook = async () => {
    if (!isFacebookConfigured()) {
      toast(
        "Facebook login isn't configured yet — add VITE_FACEBOOK_APP_ID.",
        "info"
      );
      return;
    }
    try {
      const { accessToken, userID } = await facebookLogin();
      const user = await loginWithFacebook(accessToken, userID);
      toast(`Welcome, ${user.firstName}! 👋`, "success");
      onAuthed?.(user);
    } catch (err) {
      toast(err.message || "Facebook sign-in failed", "error");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Divider */}
      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <div className="flex flex-col gap-3">
        {/* Google */}
        {googleConfigured ? (
          <div className="flex justify-center [&>div]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast("Google sign-in failed", "error")}
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
              shape="pill"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              toast(
                "Google login isn't configured yet — add VITE_GOOGLE_CLIENT_ID.",
                "info"
              )
            }
            className="w-full py-3.5 border border-gray-200 rounded-full font-black text-xs tracking-widest text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <GoogleIcon sx={{ fontSize: 18 }} /> CONTINUE WITH GOOGLE
          </button>
        )}

        {/* Facebook */}
        <button
          type="button"
          onClick={handleFacebook}
          className="w-full py-3.5 rounded-full font-black text-xs tracking-widest text-white transition-all flex items-center justify-center gap-3"
          style={{ backgroundColor: "#1877F2" }}
        >
          <FacebookIcon sx={{ fontSize: 18 }} /> CONTINUE WITH FACEBOOK
        </button>
      </div>
    </div>
  );
}
