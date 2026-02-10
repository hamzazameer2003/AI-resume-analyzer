const Resume = require("../models/resume.model");
const { generateWithFallback, parseJsonResponse } = require("../services/ai.service");

async function suggestions(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const latest = await Resume.findOne({ userId }).sort({ createdAt: -1 }).lean();
  if (!latest) {
    return res.json({ suggestions: [] });
  }

  const prompt = `Based on this resume analysis and target job, suggest 5 suitable career roles. Return ONLY JSON: { \"suggestions\": [\"...\"] }.\nAnalysis: ${JSON.stringify(
    latest.analysis || {}
  )}\nTarget: ${latest.jobTitle || \"\"}`;\n
  try {
    const text = await generateWithFallback(prompt);
    const parsed = parseJsonResponse(text);
    if (parsed?.suggestions) {
      return res.json({ suggestions: parsed.suggestions });
    }
    return res.json({ suggestions: [] });
  } catch (err) {
    return res.json({ suggestions: [] });
  }
}

module.exports = { suggestions };
