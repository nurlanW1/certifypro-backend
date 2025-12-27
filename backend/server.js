// server.js
const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const { PORT, FRONTEND_URL } = require("./config");

const app = express();

/**
 * 1) JSON limit (katta data yuborilsa yiqilmasin)
 */
app.use(express.json({ limit: "1mb" }));


/**
 * 2) CORS — local + prod uchun yumshoqroq
 */
const allowedOrigins = [
  FRONTEND_URL,           // .env / Railway dan: https://profly.uz
  "https://profly.uz",    // qo‘shimcha kafolat uchun
  "http://profly.uz",     // agar http orqali ham kirsa
  "http://127.0.0.1:5500",
  "http://localhost:5500",
].filter(Boolean);


app.use(cors({
  origin: [
    "https://profly.uz",
    "http://profly.uz",
    FRONTEND_URL,
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.options("*", cors());


/**
 * Fonts papkasi
 */
const FONTS_DIR = path.join(__dirname, "fonts");

// Helper: CSS family → PDF font nomi
function mapCssToFont(cssFamily, defaultFont) {
  if (!cssFamily) return defaultFont;
  const f = String(cssFamily).toLowerCase();

  if (f.includes("alex")) return "AlexBrush";
  if (f.includes("poppins"))
    return defaultFont && defaultFont.startsWith("Poppins")
      ? defaultFont
      : "PoppinsRegular";
  if (f.includes("times")) return "TimesNew";
  if (f.includes("georgia")) return "TimesNew";

  return defaultFont;
}

// Helper: Poppins weight → font
function pickPoppinsByWeight(weight) {
  const w = parseInt(weight || "400", 10);
  if (w >= 500) return "PoppinsMedium";
  return "PoppinsRegular";
}

/**
 * Healthcheck routelar
 */
app.get("/", (req, res) => {
  res.send("CertifyPro backend is running ✅");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "certifypro-backend" });
});

/**
 * Fontlarni xavfsiz register qilish
 */
function safeRegisterFont(doc, fontName, filePath) {
  try {
    if (fs.existsSync(filePath)) {
      doc.registerFont(fontName, filePath);
      return true;
    } else {
      console.warn("[WARN] Font not found:", filePath);
      return false;
    }
  } catch (e) {
    console.warn("[WARN] Font register failed:", fontName, e);
    return false;
  }
}

// ====== PDF YARATISH ENDPOINTI ======
app.post("/api/generate-pdf", (req, res) => {
  try {
    const {
      title = "CERTIFICATE",
      subtitle = "of participation",
      name = "Name Surname",
      body =
        "This is to certify that the person above has successfully completed the course.",
      signatureLabel = "Signature",
      dateLabel = "Date",
      orientation = "landscape",

      // front-enddan keladigan style obyektlar
      titleStyle = {},
      subStyle = {},
      nameStyle = {},
      bodyStyle = {},
    } = req.body || {};

    const doc = new PDFDocument({
      size: "A4",
      layout: orientation === "portrait" ? "portrait" : "landscape",
      margins: { top: 0, left: 0, right: 0, bottom: 0 },
    });

    // Client uzilsa — PDF ni yopamiz
    res.on("close", () => {
      try {
        doc.end();
      } catch (_) {}
    });

    // Fontlar
    safeRegisterFont(
      doc,
      "PoppinsRegular",
      path.join(FONTS_DIR, "Poppins-Regular.ttf")
    );
    safeRegisterFont(
      doc,
      "PoppinsMedium",
      path.join(FONTS_DIR, "Poppins-Medium.ttf")
    );
    safeRegisterFont(doc, "TimesNew", path.join(FONTS_DIR, "TimesNewRoman.ttf"));
    safeRegisterFont(
      doc,
      "AlexBrush",
      path.join(FONTS_DIR, "AlexBrush-Regular.ttf")
    );

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

    // ====== BACKGROUND ======
    const bgColor = "#d1fae5";
    doc.rect(0, 0, pageWidth, pageHeight).fill(bgColor);

    // ====== CARD ======
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

    const contentX = cardX + 60;
    const contentW = cardW - 120;

    // ====== TITLE ======
    const titleFontName = mapCssToFont(
      titleStyle.fontFamily,
      pickPoppinsByWeight(titleStyle.fontWeight || "500")
    );
    const titleFontSize = Number(titleStyle.fontSize) || 24;
    const titleColor = titleStyle.color || "#111827";
    const titleLetterSpacing = Number(titleStyle.letterSpacing) || 0;
    const titleAlign = titleStyle.align || "center";

    doc
      .font(titleFontName || "Helvetica")
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
      .font(subFontName || "Helvetica")
      .fontSize(subFontSize)
      .fillColor(subColor)
      .text(subtitle, { width: contentW, align: subAlign });

    // ====== NAME ======
    const nameFontName = mapCssToFont(nameStyle.fontFamily, "TimesNew");
    const nameFontSize = Number(nameStyle.fontSize) || 24;
    const nameColor = nameStyle.color || "#8b3b3b";
    const nameAlign = nameStyle.align || "center";

    doc
      .moveDown(2)
      .font(nameFontName || "Times-Roman")
      .fontSize(nameFontSize)
      .fillColor(nameColor)
      .text(name, { width: contentW, align: nameAlign });

    // ====== BODY ======
    const bodyFontName = mapCssToFont(bodyStyle.fontFamily, "PoppinsRegular");
    const bodyFontSize = Number(bodyStyle.fontSize) || 12;
    const bodyColor = bodyStyle.color || "#374151";
    const bodyAlign = bodyStyle.align || "center";

    doc
      .moveDown(1.2)
      .font(bodyFontName || "Helvetica")
      .fontSize(bodyFontSize)
      .fillColor(bodyColor)
      .text(body, { width: contentW, align: bodyAlign });

    // ====== FOOTER ======
    const footerY = cardY + cardH - 90;
    const lineWidth = 200;
    const footerGap = 120;
    const centerX = pageWidth / 2;

    const sigLineX = centerX - lineWidth - footerGap / 2;
    const dateLineX = centerX + footerGap / 2;

    // Signature line
    doc.save().rect(sigLineX, footerY, lineWidth, 1).fill("#4b5563").restore();
    doc
      .font("PoppinsRegular" || "Helvetica")
      .fontSize(9)
      .fillColor("#6b7280")
      .text(signatureLabel, sigLineX, footerY + 6, {
        width: lineWidth,
        align: "center",
      });

    // Date line
    doc.save().rect(dateLineX, footerY, lineWidth, 1).fill("#4b5563").restore();
    doc
      .font("PoppinsRegular" || "Helvetica")
      .fontSize(9)
      .fillColor("#6b7280")
      .text(dateLabel, dateLineX, footerY + 6, {
        width: lineWidth,
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "PDF generation failed", details: String(err) });
    }
  }
});

// DEBUG ROUTE
app.all("/api/debug", (req, res) => {
  res.json({
    ok: true,
    method: req.method,
    url: req.originalUrl,
  });
});

// ⬇️ faqat BITTA app.listen – boshqa joyda const PORT yo‘q
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
