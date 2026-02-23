import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthHeader from "../components/auth/AuthHeader";
import AuthFooter from "../components/auth/AuthFooter";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await login(email, password);

      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-subtle min-h-screen flex flex-col antialiased">
      <AuthHeader />
      <main className="flex-1 grid grid-cols-12 items-center px-6 py-12">
        <div className="col-start-1 col-span-12 md:col-start-4 md:col-span-6 lg:col-start-5 lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-50 rounded-2xl text-navy mb-6 border border-slate-100">
                <span className="material-symbols-outlined text-3xl font-light">
                  account_balance_wallet
                </span>
              </div>
              <h2 className="text-2xl font-bold text-navy tracking-tight">
                Login to Fundify
              </h2>
              <p className="text-slate-500 mt-2.5 text-sm leading-relaxed">
                Secure access to your professional financial insights.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">
                  error
                </span>
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label
                  className="text-[13px] font-bold text-navy uppercase tracking-wider"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-accent/20 focus:border-emerald-accent outline-none transition-all text-navy placeholder:text-slate-400"
                    id="email"
                    type="email"
                    placeholder="name@work.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="text-[13px] font-bold text-navy uppercase tracking-wider"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    className="text-xs font-semibold text-emerald-accent hover-emerald-underline transition-all"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <input
                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-accent/20 focus:border-emerald-accent outline-none transition-all text-navy placeholder:text-slate-400"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  className="w-4 h-4 text-emerald-accent border-slate-300 rounded focus:ring-emerald-accent focus:ring-offset-0 transition-colors"
                  id="remember"
                  type="checkbox"
                />
                <label
                  className="ml-2 text-sm text-slate-600 font-medium cursor-pointer"
                  htmlFor="remember"
                >
                  Remember this device
                </label>
              </div>
              <button
                className={`w-full text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all mt-2 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-navy hover:bg-slate-800 active:scale-[0.99]"
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Logging in..." : "Login"}</span>
                {!isSubmitting && (
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                )}
              </button>
            </form>
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">
                  or
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2.5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-navy text-sm font-semibold">
                <img
                  alt="Google"
                  className="w-4 h-4"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnR6TjOlxlXOKUKYE4FjKm41YU1_6E-X4hUxl4V0br2F9cKjPwXdacugI-iojPAZijHyhuqpxB86zj_-Ub_OyGSr75CMWG-dZQ33t9z83RSwKo1eNirOSg-O69EY7jk0mxNmI1x5tRyOuygjTbx_Jtaa3BoWHNh5_xbAaTIvK0DEBrXRXl4nu-ULKqpcd09bRH8W5eydede5KVZ55iIZPsKNxox6L2DBrutHT5_uySG5pQizhg66y-R9Cv7ECPrO3x06w5as4Vtyk"
                />
                Google
              </button>
              <button className="flex items-center justify-center gap-2.5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-navy text-sm font-semibold">
                <span className="material-symbols-outlined text-[20px]">
                  ios
                </span>
                Apple
              </button>
            </div>
          </div>
          <p className="text-center mt-10 text-slate-500 text-sm font-medium">
            New to Fundify?
            <Link
              className="text-navy font-bold hover-emerald-underline ml-1"
              to="/signup"
            >
              Create an account
            </Link>
          </p>
          <div className="mt-16 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-slate-400">
              <span className="material-symbols-outlined text-base">
                lock_person
              </span>
              SSL Encrypted
            </div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-slate-400">
              <span className="material-symbols-outlined text-base">
                verified_user
              </span>
              SIPC &amp; FINRA
            </div>
          </div>
        </div>
      </main>
      <AuthFooter />
    </div>
  );
}

export default Login;
