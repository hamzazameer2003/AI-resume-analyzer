const Resume = require("../models/resume.model");

async function overview(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const resumes = await Resume.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return res.json({
    user: userId,
    resumes: resumes.map((r) => ({
      id: r._id.toString(),
      jobTitle: r.jobTitle,
      atsScore: r.atsScore,
    })),
  });
}

module.exports = { overview };
