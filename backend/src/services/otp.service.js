const sgMail = require("@sendgrid/mail");
const Otp = require("../models/otp.model");

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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

  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    return { sent: false, otp }; // fallback for local dev
  }

  await sgMail.send({
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
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
