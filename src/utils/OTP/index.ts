/**
 * @param length default is 5
 * @returns OTP of length and expiry time in ms
 */

export function generateOTP({
  length = 5,
  expiryTime = 60 * 60 * 1000,
}: { length?: number; expiryTime?: number } = {}) {
  const characters = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const otpExpiry = new Date(Date.now() + expiryTime);
  return { otp, otpExpiry };
}
