import React, { useState, useEffect, useRef } from "react";
import AuthSupportHeader from "../components/auth/AuthSupportHeader";
import AuthSimpleFooter from "../components/auth/AuthSimpleFooter";
import { verifyOtp, verifyEmail } from "../services/authServices";

function Signup2({ onNext, email }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (value && isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take just the last character in case they type quickly
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (error) setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6).trim();

    // Check if pasted content is only numbers
    if (!/^\d+$/.test(pastedData)) return;

    const pastedArray = pastedData.split("");
    const newOtp = [...otp];

    pastedArray.forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });

    setOtp(newOtp);
    if (error) setError("");

    const focusIndex = Math.min(pastedArray.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  const handleResendOtp = async () => {
    if (timer > 0 || loading) return;
    setError("");
    try {
      // Calling verifyEmail to resend the code (pre-registration)
      await verifyEmail(email);
      setTimer(30);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!isOtpComplete || loading) return;

    setError("");
    setLoading(true);

    try {
      const otpString = otp.join("");
      await verifyOtp(email, otpString);
      onNext();
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired verification code.",
      );
      // Clear inputs completely on error to force re-entry
      setOtp(Array(6).fill(""));
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-white text-slate-900 min-h-screen flex flex-col">
      <AuthSupportHeader />

      <main className="flex flex-col items-center justify-center px-4 py-12 md:py-24 flex-grow">
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Registration
              </span>
              <p className="text-sm font-medium text-slate-500">Step 2 of 3</p>
            </div>
            <p className="text-sm font-bold text-emerald-600">66%</p>
          </div>
          <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-2/3 transition-all duration-500 shadow-sm shadow-emerald-200"></div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-emerald-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4 shadow-sm">
              <span className="material-symbols-outlined text-3xl text-emerald-600">
                forward_to_inbox
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-semibold text-emerald-700">
                {email || "your email"}
              </span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2 text-left">
              <span className="material-symbols-outlined text-[18px]">
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleVerifyOtp}>
            <div className="flex justify-between gap-2 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  autoFocus={index === 0}
                  className={`w-full aspect-square text-center text-2xl font-bold rounded-xl border-2 ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
                  } bg-slate-50 focus:bg-white focus:ring-2 transition-all text-slate-900 outline-none`}
                  maxLength="1"
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                />
              ))}
            </div>

            <div className="space-y-4">
              <button
                className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                  !isOtpComplete || loading
                    ? "bg-emerald-300 shadow-none cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5 shadow-emerald-200"
                }`}
                type="submit"
                disabled={!isOtpComplete || loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <span className="material-symbols-outlined text-lg">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-sm">
                    schedule
                  </span>
                  <span>
                    {timer > 0 ? (
                      <>
                        Resend code in{" "}
                        <span className="font-mono font-bold text-emerald-600">
                          0:{timer.toString().padStart(2, "0")}
                        </span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                      >
                        Resend code now
                      </button>
                    )}
                  </span>
                </div>
                <button
                  className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>
                  Change email
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center max-w-sm">
          <div className="flex items-center justify-center gap-4 text-emerald-200 mb-4">
            <span className="material-symbols-outlined text-4xl">
              verified_user
            </span>
            <span className="material-symbols-outlined text-4xl">lock</span>
            <span className="material-symbols-outlined text-4xl">shield</span>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
            Bank-grade 256-bit encryption
          </p>
        </div>
      </main>

      <AuthSimpleFooter />
    </div>
  );
}

export default Signup2;
