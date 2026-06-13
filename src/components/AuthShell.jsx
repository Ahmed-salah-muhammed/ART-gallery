import { Link } from "react-router-dom";
import Logo from "./Logo";

/**
 * Shared centered-card layout for the auth pages (forgot/reset/verify),
 * matching the Login screen's aesthetic.
 */
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-blue-50/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full bg-indigo-50/30 blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-16 z-10">
        <Link to="/" className="mb-12 text-gray-900">
          <Logo size={40} wordClassName="text-2xl" />
        </Link>

        <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-gray-50">
          <h2 className="text-2xl font-black text-gray-900 mb-2">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mb-8 font-bold">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
