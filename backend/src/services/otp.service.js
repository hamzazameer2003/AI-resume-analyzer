const { Resend } = require("resend");
const Otp = require("../models/otp.model");

const resend = new Resend(process.env.RESEND_API_KEY || "");

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email) {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await Otp.findOneAndUpdate(
    { email },
    { code: otp, expiresAt, verified: false },
    { upsert: true, new: true }
  );

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return { sent: false, otp }; // fallback for local dev
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });

  return { sent: true };
}

async function verifyOtpCode(email, otp) {
  const entry = await Otp.findOne({ email });
  if (!entry) return false;
  if (entry.expiresAt.getTime() < Date.now()) return false;
  if (entry.code !== otp) return false;
  entry.verified = true;
  await entry.save();
  return true;
}

module.exports = { sendOtpEmail, verifyOtpCode };
