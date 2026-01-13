const bcrypt = require("bcrypt");

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP string
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP using bcrypt
 * @param {string} otp - The OTP to hash
 * @returns {Promise<string>} Hashed OTP
 */
const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

/**
 * Verify OTP against hash
 * @param {string} otp - The OTP to verify
 * @param {string} otpHash - The hashed OTP to compare against
 * @returns {Promise<boolean>} True if OTP matches, false otherwise
 */
const verifyOTPHash = async (otp, otpHash) => {
  return await bcrypt.compare(otp, otpHash);
};

/**
 * Get OTP expiration date (5 minutes from now)
 * @returns {Date} Expiration date
 */
const getOTPExpiration = () => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);
  return expiresAt;
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTPHash,
  getOTPExpiration,
};

