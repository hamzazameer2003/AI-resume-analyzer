const PDFDocument = require("pdfkit");

function generateResumePdf(data) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(22).text(data.fullName || "Resume", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`${data.email || ""} | ${data.phone || ""}`);
    doc.moveDown();

    if (data.summary) {
      doc.fontSize(14).text("Summary");
      doc.fontSize(11).text(data.summary);
      doc.moveDown();
    }

    if (data.experienceLevel === "experienced" && data.experience) {
      doc.fontSize(14).text("Experience");
      doc.fontSize(11).text(JSON.stringify(data.experience, null, 2));
      doc.moveDown();
    }

    if (data.experienceLevel === "fresher" && data.projects) {
      doc.fontSize(14).text("Projects");
      doc.fontSize(11).text(JSON.stringify(data.projects, null, 2));
      doc.moveDown();
    }

    if (data.skills) {
      doc.fontSize(14).text("Skills");
      doc.fontSize(11).text(Array.isArray(data.skills) ? data.skills.join(", ") : String(data.skills));
      doc.moveDown();
    }

    doc.end();
  });
}

module.exports = { generateResumePdf };
