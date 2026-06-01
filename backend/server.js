// server.js
const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const { render } = require("@react-email/render");
const React = require("react");
const Queue = require("bull");
const Redis = require("ioredis");
const pdfHelpers = require("./pdf-helpers");
const paymentService = require("./payments/payment.service");
const {
  PORT,
  HOST,
  FRONTEND_URL,
  APP_URL,
  BACKEND_URL,
  CORS_ORIGIN,
  EXTRA_CORS_ORIGINS,
  REDIS: redisConfig,
} = require("./config");

const app = express();
const platformModules = [
  { id: "templates", name: "Template Marketplace", status: "active" },
  { id: "editor", name: "Design Editor", status: "active" },
  { id: "bulk", name: "Bulk Automation", status: "active" },
  { id: "qr", name: "QR System", status: "active" },
  { id: "assets", name: "Asset Management", status: "active" },
  { id: "export", name: "Export Pipeline", status: "active" },
  { id: "team", name: "Team Collaboration", status: "planned" },
  { id: "payments", name: "Payment Integrations", status: "active" },
];

const workspaces = [
  {
    id: "ws_ai_forum_2026",
    name: "Tashkent International AI Forum 2026",
    organization: "Forum Directorate",
    members: 8,
    templates: 42,
    generatedAssets: 780,
  },
];

/**
 * 1) JSON limit (katta data yuborilsa yiqilmasin)
 */
app.use(express.json({ limit: "10mb" }));

// Redirect www subdomain to root domain for canonical requests
app.use((req, res, next) => {
  const host = String(req.headers.host || "").toLowerCase();
  if (host.startsWith("www.gildia.uz")) {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    return res.redirect(301, `${protocol}://gildia.uz${req.originalUrl}`);
  }
  next();
});

/**
 * 2) CORS — local + prod uchun yumshoqroq (cors paketi bilan)
 */
const allowedOrigins = [
  FRONTEND_URL,
  CORS_ORIGIN,
  ...EXTRA_CORS_ORIGINS,
  "https://gildia.uz",
  "https://www.gildia.uz",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
  "http://127.0.0.1:5503",
  "http://127.0.0.1:5504",
  "http://127.0.0.1:5505",
  "http://localhost:5500",
  "http://localhost:5501",
  "http://localhost:5502",
  "http://localhost:5503",
  "http://localhost:5504",
  "http://localhost:5505",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  /^http:\/\/127\.0\.0\.1:\d+$/,  // Barcha localhost portlari
  /^http:\/\/localhost:\d+$/,     // Barcha localhost portlari
  /\.vercel\.app$/,               // Vercel preview / production
].filter(Boolean);


app.use(cors({
  origin: function (origin, callback) {
    // Origin yo'q bo'lsa (masalan, Postman yoki boshqa tool'dan)
    if (!origin) return callback(null, true);
    
    // Ruxsat etilgan originlar ro'yxatida bor-yo'qligini tekshirish
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    // Development uchun barcha localhost originlarini ruxsat berish
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    
    if (isAllowed || isLocalhost) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["Content-Type", "Content-Disposition"]
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
  res.send("Gildia backend is running ✅");
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "gildia-backend",
    env: process.env.NODE_ENV || "development",
  });
});

app.get("/api/platform/overview", (req, res) => {
  res.json({
    name: "Gildia.uz",
    type: "Conference & Event Design Automation Platform",
    value: "All-in-one event identity and production ecosystem",
    modules: platformModules,
  });
});

app.get("/api/workspaces", (req, res) => {
  res.json({ ok: true, items: workspaces });
});

/** In-memory draft store — replace with DB when auth/users are wired */
const draftStore = new Map();

app.post("/api/drafts/design", (req, res) => {
  const { scope, data } = req.body || {};
  if (!scope || !data) {
    return res.status(400).json({ ok: false, message: "scope and data required" });
  }
  draftStore.set(`design:${scope}`, { data, savedAt: new Date().toISOString() });
  res.json({ ok: true, source: "server", scope });
});

app.get("/api/drafts/design/:scope", (req, res) => {
  const entry = draftStore.get(`design:${req.params.scope}`);
  if (!entry) return res.status(404).json({ ok: false, message: "not found" });
  res.json({ ok: true, data: entry.data, savedAt: entry.savedAt });
});

app.delete("/api/drafts/design/:scope", (req, res) => {
  draftStore.delete(`design:${req.params.scope}`);
  res.json({ ok: true });
});

app.post("/api/drafts/event", (req, res) => {
  const { eventId, setup, builder, ui, updatedAt } = req.body || {};
  if (!eventId) {
    return res.status(400).json({ ok: false, message: "eventId required" });
  }
  draftStore.set(`event:${eventId}`, {
    setup,
    builder,
    ui,
    updatedAt: updatedAt || new Date().toISOString(),
  });
  res.json({ ok: true, source: "server", eventId });
});

app.get("/api/drafts/event/:eventId", (req, res) => {
  const entry = draftStore.get(`event:${req.params.eventId}`);
  if (!entry) return res.status(404).json({ ok: false, message: "not found" });
  res.json({ ok: true, data: entry });
});

app.delete("/api/drafts/event/:eventId", (req, res) => {
  draftStore.delete(`event:${req.params.eventId}`);
  res.json({ ok: true });
});

/** In-memory upload store — replace with object storage when persistence is wired */
const uploadStore = new Map();

app.post("/api/uploads/assets", (req, res) => {
  const asset = req.body;
  if (!asset || !asset.name) {
    return res.status(400).json({ ok: false, message: "asset with name required" });
  }
  const id = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  uploadStore.set(id, { ...asset, id, savedAt: new Date().toISOString() });
  res.json({ ok: true, id, source: "server" });
});

app.get("/api/uploads/assets", (req, res) => {
  const kind = req.query.kind;
  let items = Array.from(uploadStore.values());
  if (kind) items = items.filter((a) => a.kind === kind);
  res.json({ ok: true, items });
});

app.delete("/api/uploads/assets/:id", (req, res) => {
  uploadStore.delete(req.params.id);
  res.json({ ok: true });
});

app.get("/api/templates/catalog", (req, res) => {
  res.json({
    ok: true,
    categories: [
      "Certificates",
      "Invitations",
      "Event badges",
      "Flyers",
      "Roll-up banners",
      "Conference programs",
      "Speaker cards",
      "Press-wall banners",
      "Tickets",
      "ID cards",
    ],
    types: ["free", "premium"],
  });
});

app.post("/api/payments/create", async (req, res) => {
  try {
    const { userId, planId, productId, provider, amount, description } = req.body;
    const result = await paymentService.createOrder({
      userId,
      planId,
      productId,
      provider,
      amount,
      description,
    });

    res.json({ success: true, payment: result.paymentDetails, order: result.order });
  } catch (error) {
    console.error("Payment create error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post("/api/payments/webhook/:provider", async (req, res) => {
  try {
    const providerName = req.params.provider;
    const providerModule = paymentService.getProvider(providerName);
    if (!providerModule) {
      return res.status(404).json({ error: "Payment provider not supported" });
    }

    const result = providerModule.verifyCallback({ body: req.body, headers: req.headers });
    const orderId = req.body.orderId || req.body.invoiceId;
    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId in webhook payload" });
    }

    const order = await paymentService.updateOrderStatus(orderId, result.status, {
      providerTransactionId: result.providerTransactionId,
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Payment webhook error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/api/payments/:orderId", async (req, res) => {
  try {
    const order = await paymentService.getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error("Payment lookup error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
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
      dateLabel = "",
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
    const filename = `Gildia_${randomSuffix}.pdf`;

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

    const hasDate = String(dateLabel || "").trim().length > 0;
    const sigLineX = hasDate ? centerX - lineWidth - footerGap / 2 : centerX - lineWidth / 2;
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

    // Date line (optional)
    if (hasDate) {
      doc.save().rect(dateLineX, footerY, lineWidth, 1).fill("#4b5563").restore();
      doc
        .font("PoppinsRegular" || "Helvetica")
        .fontSize(9)
        .fillColor("#6b7280")
        .text(dateLabel, dateLineX, footerY + 6, {
          width: lineWidth,
          align: "center",
        });
    }

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

// ====== REACT EMAIL - EMAIL TEMPLATE YARATISH ======
/**
 * Email template yaratish funksiyasi
 * React Email komponentlaridan foydalanadi
 */
function createEmailTemplate({ recipientName, certificateId, certificateTitle, downloadLink }) {
  const { 
    Html, 
    Head, 
    Body, 
    Container, 
    Section, 
    Heading, 
    Text, 
    Button, 
    Hr,
    Link 
  } = require("@react-email/components");

  return React.createElement(Html, {},
    React.createElement(Head, {}),
    React.createElement(Body, { style: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', padding: '20px' } },
      React.createElement(Container, { style: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' } },
        React.createElement(Heading, { style: { color: '#2563eb', fontSize: '24px', marginBottom: '20px' } }, 
          'Certificate Ready!'
        ),
        React.createElement(Text, { style: { fontSize: '16px', color: '#374151', lineHeight: '1.6' } },
          `Dear ${recipientName},`
        ),
        React.createElement(Text, { style: { fontSize: '16px', color: '#374151', lineHeight: '1.6', marginTop: '16px' } },
          `Your certificate "${certificateTitle}" has been successfully generated.`
        ),
        React.createElement(Text, { style: { fontSize: '14px', color: '#6b7280', marginTop: '16px' } },
          `Certificate ID: ${certificateId}`
        ),
        React.createElement(Section, { style: { textAlign: 'center', margin: '32px 0' } },
          React.createElement(Button, {
            href: downloadLink,
            style: {
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: '600'
            }
          }, 'Download Certificate')
        ),
        React.createElement(Hr, { style: { borderColor: '#e5e7eb', margin: '32px 0' } }),
        React.createElement(Text, { style: { fontSize: '12px', color: '#9ca3af', textAlign: 'center' } },
          'This is an automated message from Gildia Certificate Platform.'
        )
      )
    )
  );
}

// ====== EMAIL HTML RENDER ENDPOINT ======
app.post("/api/render-email", async (req, res) => {
  try {
    const {
      recipientName = "User",
      certificateId = "CERT-001",
      certificateTitle = "Certificate of Completion",
      downloadLink = "#"
    } = req.body || {};

    const emailTemplate = createEmailTemplate({
      recipientName,
      certificateId,
      certificateTitle,
      downloadLink
    });

    const emailHtml = await render(emailTemplate);

    res.json({
      success: true,
      html: emailHtml
    });
  } catch (err) {
    console.error("Email render error:", err);
    res.status(500).json({
      error: "Email rendering failed",
      details: String(err)
    });
  }
});

// ====== BULL QUEUE SETUP ======
const isQueueEnabled = Boolean(redisConfig);
let redisClient = null;

if (isQueueEnabled) {
  redisClient = new Redis(redisConfig);

  redisClient.on("connect", () => {
    console.log("✅ Redis connected for Bull queues");
  });

  redisClient.on("error", (err) => {
    console.warn("⚠️ Redis connection error:", err.message);
    console.warn("⚠️ Queue functionality may be limited without Redis");
  });
} else {
  console.log("Redis is not configured; Bull queue endpoints are disabled");
}

app.get("/api/health/ready", (req, res) => {
  const redisOk = !redisClient || redisClient.status === "ready" || redisClient.status === "connect";
  res.status(redisOk ? 200 : 503).json({
    ok: redisOk,
    redis: redisClient ? redisClient.status : "disabled",
  });
});

// ====== QUEUE DEFINITIONS ======
/**
 * PDF Generation Queue
 * Certificate PDF larni background da generate qilish uchun
 */
const pdfQueue = isQueueEnabled ? new Queue("pdf-generation", {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // 1 hour
      count: 100,
    },
    removeOnFail: {
      age: 86400, // 24 hours
    },
  },
}) : null;

/**
 * Email Queue
 * Email yuborish uchun queue
 */
const emailQueue = isQueueEnabled ? new Queue("email-sending", {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600,
      count: 100,
    },
  },
}) : null;

// ====== QUEUE PROCESSORS ======
/**
 * PDF Generation Processor
 * Background da PDF generate qiladi
 */
if (isQueueEnabled) {
pdfQueue.process(async (job) => {
  const { certificateData, options } = job.data;
  
  try {
    console.log(`📄 Processing PDF generation job ${job.id}`);
    job.progress(10);
    
    // Bu yerda PDF generation logikasi bo'ladi
    // Hozircha demo uchun
    await new Promise((resolve) => setTimeout(resolve, 1000));
    job.progress(100);
    
    return {
      success: true,
      jobId: job.id,
      message: "PDF generated successfully",
    };
  } catch (error) {
    console.error(`❌ PDF generation failed for job ${job.id}:`, error);
    throw error;
  }
});

/**
 * Email Sending Processor
 * Background da email yuboradi
 */
emailQueue.process(async (job) => {
  const { recipientEmail, emailData } = job.data;
  
  try {
    console.log(`📧 Processing email job ${job.id} to ${recipientEmail}`);
    job.progress(50);
    
    // Bu yerda email sending logikasi bo'ladi
    // Hozircha demo uchun
    await new Promise((resolve) => setTimeout(resolve, 500));
    job.progress(100);
    
    return {
      success: true,
      jobId: job.id,
      recipientEmail,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error(`❌ Email sending failed for job ${job.id}:`, error);
    throw error;
  }
});

// ====== QUEUE EVENT LISTENERS ======
pdfQueue.on("completed", (job, result) => {
  console.log(`✅ PDF job ${job.id} completed:`, result);
});

pdfQueue.on("failed", (job, err) => {
  console.error(`❌ PDF job ${job.id} failed:`, err.message);
});

emailQueue.on("completed", (job, result) => {
  console.log(`✅ Email job ${job.id} completed:`, result);
});

emailQueue.on("failed", (job, err) => {
  console.error(`❌ Email job ${job.id} failed:`, err.message);
});
}

function queueUnavailable(res) {
  return res.status(503).json({
    error: "Queue service is disabled",
    message: "Configure REDIS_URL or REDIS_HOST to enable background jobs",
  });
}

function getQueueByName(queueName) {
  if (queueName === "pdf") return pdfQueue;
  if (queueName === "email") return emailQueue;
  return null;
}

// ====== QUEUE API ENDPOINTS ======
/**
 * Add PDF generation job to queue
 */
app.post("/api/queue/pdf", async (req, res) => {
  try {
    if (!pdfQueue) return queueUnavailable(res);

    const { certificateData, options } = req.body;

    const job = await pdfQueue.add(
      "generate-pdf",
      { certificateData, options },
      {
        priority: options?.priority || 0,
        delay: options?.delay || 0,
      }
    );

    res.json({
      success: true,
      jobId: job.id,
      message: "PDF generation job added to queue",
    });
  } catch (err) {
    console.error("Queue error:", err);
    res.status(500).json({
      error: "Failed to add job to queue",
      details: String(err),
    });
  }
});

/**
 * Add email sending job to queue
 */
app.post("/api/queue/email", async (req, res) => {
  try {
    if (!emailQueue) return queueUnavailable(res);

    const { recipientEmail, emailData, options } = req.body;

    const job = await emailQueue.add(
      "send-email",
      { recipientEmail, emailData },
      {
        priority: options?.priority || 0,
        delay: options?.delay || 0,
      }
    );

    res.json({
      success: true,
      jobId: job.id,
      message: "Email job added to queue",
    });
  } catch (err) {
    console.error("Queue error:", err);
    res.status(500).json({
      error: "Failed to add job to queue",
      details: String(err),
    });
  }
});

/**
 * Get job status
 */
app.get("/api/queue/job/:queueName/:jobId", async (req, res) => {
  try {
    const { queueName, jobId } = req.params;
    const queue = getQueueByName(queueName);
    if (!queue) return queueUnavailable(res);

    const job = await queue.getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const state = await job.getState();
    const progress = job.progress();

    res.json({
      jobId: job.id,
      state,
      progress,
      data: job.data,
      result: job.returnvalue,
      failedReason: job.failedReason,
    });
  } catch (err) {
    console.error("Get job error:", err);
    res.status(500).json({
      error: "Failed to get job status",
      details: String(err),
    });
  }
});

/**
 * Get queue statistics
 */
app.get("/api/queue/stats/:queueName", async (req, res) => {
  try {
    const { queueName } = req.params;
    const queue = getQueueByName(queueName);
    if (!queue) return queueUnavailable(res);

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    res.json({
      queue: queueName,
      waiting,
      active,
      completed,
      failed,
      delayed,
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({
      error: "Failed to get queue stats",
      details: String(err),
    });
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

// ====== PDF-LIB ENDPOINT (Create PDF using pdf-lib) ======
app.post("/api/generate-pdf-lib", async (req, res) => {
  try {
    const { pages, content } = req.body || {};
    
    const pdfBytes = await pdfHelpers.createPDFWithPDFLib({
      pages: pages || [{ width: 595, height: 842 }],
      content: content || []
    });

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const filename = `Gildia_${randomSuffix}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("[ERROR] PDF-lib generation failed:", error);
    res.status(500).json({ error: "PDF generation failed", message: error.message });
  }
});

// ====== SVG TO PDF ENDPOINT (Convert SVG to PDF using svg-to-pdfkit) ======
app.post("/api/svg-to-pdf", async (req, res) => {
  try {
    const { svgContent, size = "A4", layout = "portrait", svgOptions = {} } = req.body || {};
    
    if (!svgContent) {
      return res.status(400).json({ error: "SVG content is required" });
    }

    const pdfBuffer = await pdfHelpers.createPDFWithSVG({
      size,
      layout,
      svgContent,
      svgOptions
    });

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const filename = `Gildia_SVG_${randomSuffix}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("[ERROR] SVG to PDF conversion failed:", error);
    res.status(500).json({ error: "SVG to PDF conversion failed", message: error.message });
  }
});

// ====== MERGE PDFs ENDPOINT (Merge multiple PDFs using pdf-lib) ======
app.post("/api/merge-pdfs", async (req, res) => {
  try {
    const { pdfs } = req.body || {}; // Array of base64 encoded PDFs
    
    if (!pdfs || !Array.isArray(pdfs) || pdfs.length === 0) {
      return res.status(400).json({ error: "PDFs array is required" });
    }

    // Convert base64 to Uint8Array
    const pdfBytesArray = pdfs.map(base64 => {
      const buffer = Buffer.from(base64, 'base64');
      return new Uint8Array(buffer);
    });

    const mergedPdfBytes = await pdfHelpers.mergePDFs(pdfBytesArray);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const filename = `Gildia_Merged_${randomSuffix}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    console.error("[ERROR] PDF merge failed:", error);
    res.status(500).json({ error: "PDF merge failed", message: error.message });
  }
});

// ====== EXTRACT PAGES ENDPOINT (Extract pages from PDF using pdf-lib) ======
app.post("/api/extract-pages", async (req, res) => {
  try {
    const { pdfBase64, pageIndices } = req.body || {};
    
    if (!pdfBase64) {
      return res.status(400).json({ error: "PDF base64 is required" });
    }
    
    if (!pageIndices || !Array.isArray(pageIndices)) {
      return res.status(400).json({ error: "Page indices array is required" });
    }

    // Convert base64 to Uint8Array
    const buffer = Buffer.from(pdfBase64, 'base64');
    const pdfBytes = new Uint8Array(buffer);

    const extractedPdfBytes = await pdfHelpers.extractPDFPages(pdfBytes, pageIndices);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const filename = `Gildia_Extracted_${randomSuffix}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(extractedPdfBytes));
  } catch (error) {
    console.error("[ERROR] PDF page extraction failed:", error);
    res.status(500).json({ error: "PDF page extraction failed", message: error.message });
  }
});

/**
 * Legacy static frontend (HTML/CSS/JS editor, templates, etc.)
 * Served after API routes so /api/* keeps priority.
 * Enables NEXT_PUBLIC_LEGACY_EDITOR_URL=http://localhost:4000/editor.html during migration.
 */
const PUBLIC_DIR = path.join(__dirname, "..", "public");
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
  console.log(`📁 Serving legacy static assets from ${PUBLIC_DIR}`);
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing queues");
  try {
    if (pdfQueue) await pdfQueue.close();
    if (emailQueue) await emailQueue.close();
    if (redisClient && (redisClient.status === "ready" || redisClient.status === "connect")) {
      await redisClient.quit();
    }
  } catch (err) {
    console.warn("Shutdown warning:", err.message);
  }
  process.exit(0);
});

/**
 * Gildia core API (TypeScript) — events, designs, templates, uploads, auth
 */
try {
  const { registerGildiaCoreApi, registerGildiaErrorHandler } = require("./dist/register");
  registerGildiaCoreApi(app);
  registerGildiaErrorHandler(app);
} catch (err) {
  console.warn(
    "[gildia] Core API not loaded — run `npm run build` in backend/:",
    err.message
  );
}

app.listen(PORT, HOST, () => {
  console.log(`Gildia backend listening on ${HOST}:${PORT}`);
  console.log(`   FRONTEND_URL=${FRONTEND_URL}`);
  console.log(`   BACKEND_URL=${BACKEND_URL}`);
  console.log(isQueueEnabled
    ? `📋 Bull queues initialized (Redis: ${typeof redisConfig === "string" ? "URL" : redisConfig.host})`
    : "📋 Bull queues disabled (Redis is not configured)");
});
