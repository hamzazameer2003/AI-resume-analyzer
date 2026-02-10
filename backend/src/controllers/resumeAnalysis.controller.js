const { analyzeResume } = require("../services/ai.service");
const { extractTextFromFile } = require("../services/resumeText.service");
const path = require("path");
const Resume = require("../models/resume.model");

async function analyze(req, res) {
  const { jobTitle } = req.body || {};
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body?.fileUrl;

  if (!jobTitle || !fileUrl) {
    return res.status(400).json({ message: "jobTitle and fileUrl are required" });
  }

  let resumeText = "";
  if (req.file) {
    const filePath = path.join(__dirname, "../../uploads", req.file.filename);
    resumeText = await extractTextFromFile(filePath);
  }

  const result = await analyzeResume({ jobTitle, fileUrl, resumeText });

  const userId = req.user?.sub;
  if (userId) {
    await Resume.create({
      userId,
      fileUrl,
      jobTitle,
      atsScore: typeof result.atsScore === "number" ? result.atsScore : undefined,
      analysis: result,
    });
  }

  return res.json(result);
}

module.exports = { analyze };
