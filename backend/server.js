const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const path = require("path");
const { PORT, FRONTEND_URL } = require("./config");

const app = express();

// CORS – faqat sizning frontingizdan ruxsat beramiz
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

// JSON body o‘qish (body-parser o‘rniga)
app.use(express.json());

// Fonts papkasi
const FONTS_DIR = path.join(__dirname, "fonts");

// Yordamchi: CSS family → PDF font nomi
function mapCssToFont(cssFamily, defaultFont) {
  if (!cssFamily) return defaultFont;
  const f = cssFamily.toLowerCase();

  if (f.includes("alex")) return "AlexBrush";
  if (f.includes("poppins"))
    return defaultFont.startsWith("Poppins") ? defaultFont : "PoppinsRegular";
  if (f.includes("times")) return "TimesNew";
  if (f.includes("georgia")) return "TimesNew";

  return defaultFont;
}

// Yordamchi: Poppins uchun weight → qaysi font
function pickPoppinsByWeight(weight) {
  const w = parseInt(weight || "400", 10);
  if (w >= 500) return "PoppinsMedium";
  return "PoppinsRegular";
}

// Soddaroq healthcheck (Railway uchun foydali)
app.get("/", (req, res) => {
  res.send("CertifyPro backend is running ✅");
});

// ====== PDF YARATISH ENDPOINTI ======
app.post("/api/generate-pdf", (req, res) => {
  try {
    const {
      title = "CERTIFICATE",
      subtitle = "of participation",
      name = "Name Surname",
      body = "This is to certify that the person above has successfully completed the course.",
      signatureLabel = "Signature",
      dateLabel = "Date",
      orientation = "landscape",

      // front-enddan keladigan style obyektlar
      titleStyle = {},
      subStyle = {},
      nameStyle = {},
      bodyStyle = {},
    } = req.body || {};

    // A4, layout orientatsiya bo‘yicha
    const doc = new PDFDocument({
      size: "A4",
      layout: orientation === "portrait" ? "portrait" : "landscape",
      margins: { top: 0, left: 0, right: 0, bottom: 0 },
    });

    // custom fontlarni register qilish
    doc.registerFont(
      "PoppinsRegular",
      path.join(FONTS_DIR, "Poppins-Regular.ttf")
    );
    doc.registerFont(
      "PoppinsMedium",
      path.join(FONTS_DIR, "Poppins-Medium.ttf")
    );
    doc.registerFont("TimesNew", path.join(FONTS_DIR, "TimesNewRoman.ttf"));
    doc.registerFont(
      "AlexBrush",
      path.join(FONTS_DIR, "AlexBrush-Regular.ttf")
    );

    // random fayl nomi: CertifyPro_123456.pdf
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const filename = `CertifyPro_${randomSuffix}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // ====== TASHQI FON ======
    const bgColor = "#d1fae5"; // pastel yashil
    doc.rect(0, 0, pageWidth, pageHeight).fill(bgColor);

    // ====== ICHKI OQ "KARTA" ======
    const cardMargin = 32;
    const cardRadius = 16;

    const cardX = cardMargin;
    const cardY = cardMargin;
    const cardW = pageWidth - cardMargin * 2;
    const cardH = pageHeight - cardMargin * 2;

    doc
      .save()
      .roundedRect(cardX, cardY, cardW, cardH, cardRadius)
      .fillAndStroke("#ffffff", "#d1d5db")
      .restore();

    // matnlar uchun ishchi maydon
    const contentX = cardX + 60;
    const contentW = cardW - 120;

    // ====== TITLE ("CERTIFICATE") ======
    const titleFontName = mapCssToFont(
      titleStyle.fontFamily,
      pickPoppinsByWeight(titleStyle.fontWeight || "500")
    );
    const titleFontSize = Number(titleStyle.fontSize) || 24;
    const titleColor = titleStyle.color || "#111827";
    const titleLetterSpacing = Number(titleStyle.letterSpacing) || 0;
    const titleAlign = titleStyle.align || "center";

    doc
      .font(titleFontName)
      .fontSize(titleFontSize)
      .fillColor(titleColor)
      .text(title, contentX, cardY + 40, {
        width: contentW,
        align: titleAlign,
        characterSpacing: titleLetterSpacing,
      });

    // ====== SUBTITLE ======
    const subFontName = mapCssToFont(subStyle.fontFamily, "PoppinsRegular");
    const subFontSize = Number(subStyle.fontSize) || 14;
    const subColor = subStyle.color || "#6b7280";
    const subAlign = subStyle.align || "center";

    doc
      .moveDown(0.5)
      .font(subFontName)
      .fontSize(subFontSize)
      .fillColor(subColor)
      .text(subtitle, {
        width: contentW,
        align: subAlign,
      });

    // ====== NAME ======
    const nameFontName = mapCssToFont(nameStyle.fontFamily, "TimesNew");
    const nameFontSize = Number(nameStyle.fontSize) || 24;
    const nameColor = nameStyle.color || "#8b3b3b";
    const nameAlign = nameStyle.align || "center";

    doc
      .moveDown(2)
      .font(nameFontName)
      .fontSize(nameFontSize)
      .fillColor(nameColor)
      .text(name, {
        width: contentW,
        align: nameAlign,
      });

    // ====== BODY TEXT ======
    const bodyFontName = mapCssToFont(bodyStyle.fontFamily, "PoppinsRegular");
    const bodyFontSize = Number(bodyStyle.fontSize) || 12;
    const bodyColor = bodyStyle.color || "#374151";
    const bodyAlign = bodyStyle.align || "center";

    doc
      .moveDown(1.2)
      .font(bodyFontName)
      .fontSize(bodyFontSize)
      .fillColor(bodyColor)
      .text(body, {
        width: contentW,
        align: bodyAlign,
      });

    // ====== FOOTER: SIGNATURE / DATE ======
    const footerY = cardY + cardH - 90;
    const lineWidth = 200;
    const footerGap = 120;
    const centerX = pageWidth / 2;

    const sigLineX = centerX - lineWidth - footerGap / 2;
    const dateLineX = centerX + footerGap / 2;

    // Signature line
    doc
      .save()
      .rect(sigLineX, footerY, lineWidth, 1)
      .fill("#4b5563")
      .restore();

    doc
      .font("PoppinsRegular")
      .fontSize(9)
      .fillColor("#6b7280")
      .text(signatureLabel, sigLineX, footerY + 6, {
        width: lineWidth,
        align: "center",
      });

    // Date line
    doc
      .save()
      .rect(dateLineX, footerY, lineWidth, 1)
      .fill("#4b5563")
      .restore();

    doc
      .font("PoppinsRegular")
      .fontSize(9)
      .fillColor("#6b7280")
      .text(dateLabel, dateLineX, footerY + 6, {
        width: lineWidth,
        align: "center",
      });

    // ====== PDF yakun ======
    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "PDF generation failed" });
    }
  }
});

// 🔥 DEBUG ROUTE
app.all("/api/debug", (req, res) => {
  res.json({
    ok: true,
    method: req.method,
    url: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
