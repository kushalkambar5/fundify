import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthSimpleHeader from "../components/auth/AuthSimpleHeader";
import { verifyEmail } from "../services/authServices";

function Signup1({ onNext }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Intentionally mapping to verifyEmail service which handles pre-registration OTPs
      await verifyEmail(email);
      // Pass the email and password up to parent / next component if needed
      // We will pass both in onNext so Signup can store both
      onNext(email, password);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send verification code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-display antialiased">
      <AuthSimpleHeader />

      <main className="flex-1 flex items-center justify-center px-4 pb-24">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 px-1">
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Step 1 of 3
                </span>
                <h3 className="text-sm font-semibold text-slate-700">
                  Identity Verification
                </h3>
              </div>
              <span className="text-xs font-medium text-emerald-600">
                33% Complete
              </span>
            </div>
            <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-sm shadow-emerald-200"
                style={{ width: "33.33%" }}
              ></div>
            </div>
          </div>

          <div className="bg-white border border-emerald-100 rounded-2xl p-10 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Enter Your Email
              </h2>
              <p className="text-slate-500 text-[15px] leading-relaxed">
                Please provide your primary email address. We'll send a secure
                verification code to continue.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  error
                </span>
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label
                  className="block text-[13px] font-bold text-slate-700 mb-2"
                  htmlFor="email"
                >
                  Work or Personal Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      mail
                    </span>
                  </div>
                  <input
                    className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${
                      error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-emerald-400 focus:bg-white focus:ring-emerald-100"
                    } rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 transition-all text-sm outline-none`}
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-[13px] font-bold text-slate-700 mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${
                      error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-emerald-400 focus:bg-white focus:ring-emerald-100"
                    } rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 transition-all text-sm outline-none`}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Passwords must be at least 6 characters long.
                </p>
              </div>

              <div>
                <label
                  className="block text-[13px] font-bold text-slate-700 mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      lock_reset
                    </span>
                  </div>
                  <input
                    className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${
                      error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-emerald-400 focus:bg-white focus:ring-emerald-100"
                    } rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 transition-all text-sm outline-none`}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              <button
                className={`w-full text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 group ${
                  !isValidEmail(email) ||
                  !isValidPassword(password) ||
                  password !== confirmPassword ||
                  loading
                    ? "bg-emerald-300 shadow-none cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 btn-hover-animate"
                }`}
                type="submit"
                disabled={
                  !isValidEmail(email) ||
                  !isValidPassword(password) ||
                  password !== confirmPassword ||
                  loading
                }
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <span className="material-symbols-outlined text-[20px] btn-icon-animate">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-emerald-50 text-center">
              <p className="text-sm font-medium text-slate-500">
                Already have an account?
                <Link
                  to="/login"
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors ml-1.5"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-5">
            <div className="flex items-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  verified_user
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  AES-256 Encryption
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  security
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  ISO 27001 Certified
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed max-w-[320px]">
              By proceeding, you agree to our{" "}
              <Link
                to="/terms-and-conditions"
                className="underline decoration-slate-300 hover:text-emerald-600 transition-colors font-bold"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="underline decoration-slate-300 hover:text-emerald-600 transition-colors font-bold"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full h-1 bg-emerald-100 border-b-4 border-emerald-500"></div>
    </div>
  );
}

export default Signup1;
