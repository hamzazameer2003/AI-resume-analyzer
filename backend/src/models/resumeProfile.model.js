const mongoose = require("mongoose");

const ResumeProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    experienceLevel: { type: String, enum: ["experienced", "fresher"], required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    summary: { type: String },
    experience: { type: String },
    projects: { type: String },
    skills: { type: String },
    aiRewrite: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeProfile", ResumeProfileSchema);
