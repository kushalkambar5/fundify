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
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
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
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              66%
            </p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-accent h-full w-2/3 transition-all duration-500"></div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
              <span className="material-symbols-outlined text-3xl text-navy dark:text-white">
                forward_to_inbox
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Verify Your Email
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-semibold text-slate-900 dark:text-slate-200">
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
                  className={`w-full aspect-square text-center text-2xl font-bold rounded-lg border-2 ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 dark:border-slate-700 focus:border-emerald-accent focus:ring-emerald-accent/10"
                  } bg-transparent focus:ring-4 transition-all text-slate-900 dark:text-white outline-none`}
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
                className={`w-full text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 ${
                  !isOtpComplete || loading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-navy hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
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
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          0:{timer.toString().padStart(2, "0")}
                        </span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="font-bold text-navy dark:text-slate-200 hover:text-emerald-accent underline underline-offset-4"
                      >
                        Resend code now
                      </button>
                    )}
                  </span>
                </div>
                <button
                  className="text-sm font-semibold text-navy dark:text-slate-300 hover:underline underline-offset-4 flex items-center gap-1"
                  type="button"
                  onClick={() => window.location.reload()} // Simplified back behavior for now
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
          <div className="flex items-center justify-center gap-4 text-slate-400 dark:text-slate-600 mb-4">
            <span className="material-symbols-outlined text-4xl">
              verified_user
            </span>
            <span className="material-symbols-outlined text-4xl">lock</span>
            <span className="material-symbols-outlined text-4xl">shield</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
            Bank-grade 256-bit encryption
          </p>
        </div>
      </main>

      <AuthSimpleFooter />
    </div>
  );
}

export default Signup2;
