/**
 * Generates a cryptographically simple numeric OTP.
 * @param {number} length - Number of digits (default: 6)
 * @returns {{ otp: string, otpExpire: Date }} OTP string and expiry (10 min from now)
 */
const generateOtp = (length = 6) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return { otp, otpExpire };
};

export default generateOtp;
