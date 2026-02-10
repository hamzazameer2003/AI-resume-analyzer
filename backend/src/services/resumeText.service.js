const path = require("path");
const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

async function extractFromPdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text || "";
}

async function extractFromDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || "";
}

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") return extractFromPdf(filePath);
  if (ext === ".docx") return extractFromDocx(filePath);
  if (ext === ".doc") {
    // mammoth doesn't support .doc; return empty for now
    return "";
  }
  return "";
}

module.exports = { extractTextFromFile };
