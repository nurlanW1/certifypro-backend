document.addEventListener("DOMContentLoaded", () => {
  // ====== ELEMENTLAR ======
  const templatesPanel = document.querySelector(".templates-panel");
  const propertiesPanel = document.querySelector(".properties-panel");
  const templateToggles = document.querySelectorAll(".js-toggle-templates");
  const propToggle = document.querySelector(".js-toggle-properties");

  const canvasEl = document.querySelector(".js-canvas");
  const canvasScroll = document.querySelector(".js-canvas-scroll");

  const zoomLabelTop = document.querySelector(".js-zoom-value");
  const zoomLabelBottom = document.querySelector(".js-zoom-value-bottom");
  const zoomMinus = document.querySelector(".js-zoom-minus");
  const zoomPlus = document.querySelector(".js-zoom-plus");

  const orientationBtns = document.querySelectorAll(".js-orientation-btn");
  const handBtn = document.querySelector(".js-hand-toggle");

  const templateThumbs = document.querySelectorAll(".template-thumb");

  // Text elements on canvas
  const titleEl = document.querySelector(".js-cert-title");
  const subEl = document.querySelector(".js-cert-sub");
  const nameEl = document.querySelector(".js-cert-name");
  const bodyEl = document.querySelector(".js-cert-body");
  const sigEl = document.querySelector(".js-footer-signature");
  const dateEl = document.querySelector(".js-footer-date");

  // Inputs
  const inputTitle = document.querySelector(".js-input-title");
  const inputSub = document.querySelector(".js-input-subtitle");
  const inputName = document.querySelector(".js-input-name");
  const inputBody = document.querySelector(".js-input-body");
  const inputSig = document.querySelector(".js-input-signature");
  const inputDate = document.querySelector(".js-input-date");

  // Font controls
  const fontTitleFamily = document.querySelector(".js-font-title-family");
  const fontTitleSize = document.querySelector(".js-font-title-size");
  const fontTitleColor = document.querySelector(".js-font-title-color");
  const fontTitleWeight = document.querySelector(".js-font-title-weight");
  const fontTitleLetter = document.querySelector(".js-font-title-letter");
  const titleAlignBtns = document.querySelectorAll(".js-title-align");

  const fontSubFamily = document.querySelector(".js-font-sub-family");
  const fontSubSize = document.querySelector(".js-font-sub-size");
  const fontSubColor = document.querySelector(".js-font-sub-color");

  const fontNameFamily = document.querySelector(".js-font-name-family");
  const fontNameSize = document.querySelector(".js-font-name-size");
  const fontNameColor = document.querySelector(".js-font-name-color");

  const fontBodyFamily = document.querySelector(".js-font-body-family");
  const fontBodySize = document.querySelector(".js-font-body-size");
  const fontBodyColor = document.querySelector(".js-font-body-color");

  // ====== PANEL TOGGLES ======
  templateToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      templatesPanel.classList.toggle("is-collapsed");
    });
  });

  if (propToggle) {
    propToggle.addEventListener("click", () => {
      propertiesPanel.classList.toggle("is-collapsed");
    });
  }

  // ====== ZOOM ======
  let zoom = 1;

  function applyZoom() {
    if (canvasEl) {
      canvasEl.style.transform = `scale(${zoom})`;
    }
    const value = Math.round(zoom * 100) + "%";
    if (zoomLabelTop) zoomLabelTop.textContent = value;
    if (zoomLabelBottom) zoomLabelBottom.textContent = value;
  }

  if (zoomMinus && zoomPlus) {
    zoomMinus.addEventListener("click", () => {
      zoom = Math.max(0.25, zoom - 0.1);
      applyZoom();
    });

    zoomPlus.addEventListener("click", () => {
      zoom = Math.min(3, zoom + 0.1);
      applyZoom();
    });
  }

  applyZoom();

  // ====== ORIENTATION (LANDSCAPE / PORTRAIT) ======
  orientationBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.orientation;
      orientationBtns.forEach((b) => b.classList.remove("chip-toggle-active"));
      btn.classList.add("chip-toggle-active");

      if (!canvasEl) return;

      if (mode === "portrait") {
        canvasEl.classList.add("is-portrait");
        canvasEl.classList.remove("is-landscape");
      } else {
        canvasEl.classList.add("is-landscape");
        canvasEl.classList.remove("is-portrait");
      }
    });
  });

  // ====== HAND / PAN MODE ======
  let isHandMode = false;
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let scrollLeft = 0;
  let scrollTop = 0;

  if (handBtn && canvasScroll) {
    handBtn.addEventListener("click", () => {
      isHandMode = !isHandMode;
      handBtn.classList.toggle("chip-toggle-active", isHandMode);
      canvasScroll.style.cursor = isHandMode ? "grab" : "default";
    });

    canvasScroll.addEventListener("mousedown", (e) => {
      if (!isHandMode) return;
      isPanning = true;
      canvasScroll.style.cursor = "grabbing";
      startX = e.clientX;
      startY = e.clientY;
      scrollLeft = canvasScroll.scrollLeft;
      scrollTop = canvasScroll.scrollTop;
    });

    window.addEventListener("mouseup", () => {
      isPanning = false;
      if (isHandMode) canvasScroll.style.cursor = "grab";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isPanning) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      canvasScroll.scrollLeft = scrollLeft - dx;
      canvasScroll.scrollTop = scrollTop - dy;
    });
  }

  // ====== TEMPLATES → BACKGROUND ======
  const bgMap = {
    t1: "linear-gradient(135deg,#f5f3ff,#dbeafe)",
    t2: "linear-gradient(135deg,#fef3c7,#fee2e2)",
    t3: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
    t4: "linear-gradient(135deg,#e0f2fe,#e5e7eb)",
    t5: "linear-gradient(135deg,#fef9c3,#fee2e2)",
    t6: "linear-gradient(135deg,#dcfce7,#e0f2fe)",
    t7: "linear-gradient(135deg,#fee2e2,#e0f2fe)",
    t8: "linear-gradient(135deg,#fce7f3,#ede9fe)",
    t9: "linear-gradient(135deg,#ecfccb,#fef9c3)",
    t10: "linear-gradient(135deg,#e0f2fe,#fce7f3)",
  };

  templateThumbs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.bg;
      const bg = bgMap[key];
      if (bg && canvasEl) {
        canvasEl.style.backgroundImage = bg;
      }
    });
  });

  // ====== TEXT MIRRORING ======
  function bindTextarea(textarea, element) {
    if (!textarea || !element) return;
    textarea.addEventListener("input", () => {
      element.textContent = textarea.value;
    });
  }

  bindTextarea(inputTitle, titleEl);
  bindTextarea(inputSub, subEl);
  bindTextarea(inputName, nameEl);
  bindTextarea(inputBody, bodyEl);

  if (inputSig && sigEl) {
    inputSig.addEventListener("input", () => {
      sigEl.textContent = inputSig.value;
    });
  }
  if (inputDate && dateEl) {
    inputDate.addEventListener("input", () => {
      dateEl.textContent = inputDate.value;
    });
  }

  // ====== FONT HELPERS ======
  function bindFontControls(opts) {
    const { el, familySelect, sizeInput, colorInput, weightSelect, letterInput } = opts;
    if (!el) return;

    if (familySelect) {
      familySelect.addEventListener("change", () => {
        el.style.fontFamily = familySelect.value;
      });
      el.style.fontFamily = familySelect.value;
    }

    if (sizeInput) {
      const apply = () => {
        const v = parseFloat(sizeInput.value) || 14;
        el.style.fontSize = v + "px";
      };
      sizeInput.addEventListener("input", apply);
      apply();
    }

    if (colorInput) {
      const apply = () => {
        el.style.color = colorInput.value;
      };
      colorInput.addEventListener("input", apply);
      apply();
    }

    if (weightSelect) {
      const apply = () => {
        el.style.fontWeight = weightSelect.value;
      };
      weightSelect.addEventListener("change", apply);
      apply();
    }

    if (letterInput) {
      const apply = () => {
        const v = parseFloat(letterInput.value) || 0;
        el.style.letterSpacing = v + "px";
      };
      letterInput.addEventListener("input", apply);
      apply();
    }
  }

  bindFontControls({
    el: titleEl,
    familySelect: fontTitleFamily,
    sizeInput: fontTitleSize,
    colorInput: fontTitleColor,
    weightSelect: fontTitleWeight,
    letterInput: fontTitleLetter,
  });

  bindFontControls({
    el: subEl,
    familySelect: fontSubFamily,
    sizeInput: fontSubSize,
    colorInput: fontSubColor,
  });

  bindFontControls({
    el: nameEl,
    familySelect: fontNameFamily,
    sizeInput: fontNameSize,
    colorInput: fontNameColor,
  });

  bindFontControls({
    el: bodyEl,
    familySelect: fontBodyFamily,
    sizeInput: fontBodySize,
    colorInput: fontBodyColor,
  });

  // TITLE align
  titleAlignBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const align = btn.dataset.align;
      if (titleEl) {
        titleEl.style.textAlign = align;
      }

      titleAlignBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });
});

// ================== HERO NAME TYPING ANIMATION ==================
(function () {
  const nameEl = document.querySelector(".hero-preview .cert-name");
  if (!nameEl) return;

  const names = [
    "Nurlan Rahmonqulov",
    "Ruslan Ermuhammedov",
    "XusanDev",
    "Akbarali Pro",
  ];

  let nameIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const current = names[nameIndex];

    if (!isDeleting) {
      nameEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        setTimeout(() => (isDeleting = true), 1000);
      }
    } else {
      nameEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        nameIndex = (nameIndex + 1) % names.length;
      }
    }

    const typingSpeed = isDeleting ? 60 : 80;
    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();
})();

// ===== Helper: matnni olish =====
function getText(selector, fallback = "") {
  const el = document.querySelector(selector);
  if (!el) return fallback;
  return (el.textContent || "").trim() || fallback;
}

// ================== API CONFIG (Railway + Local) ==================
const DEFAULT_PROD_BACKEND = "https://graceful-courage-production.up.railway.app";
// ↑ agar sizning backend domen boshqa bo'lsa, shu joyni almashtiring.

function getApiBaseUrl() {
  // 1) HTML ichida window.API_BASE_URL berilgan bo‘lsa — shuni olamiz
  if (window.API_BASE_URL) return window.API_BASE_URL;

  // 2) local bo‘lsa — localhost
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:4000";
  }

  // 3) production default
  return DEFAULT_PROD_BACKEND;
}

const API_BASE_URL = getApiBaseUrl();

// ================== EDITORDAN PDF YUKLASH ==================
const editorDownloadBtn = document.getElementById("editorDownloadBtn");

if (editorDownloadBtn) {
  editorDownloadBtn.addEventListener("click", async () => {
    try {
      // 1) Canvas orientatsiyasi (.js-canvas = .certificate-page)
      const canvasEl =
        document.querySelector(".js-canvas") ||
        document.querySelector(".certificate-page");

      const orientation =
        canvasEl && canvasEl.classList.contains("is-portrait")
          ? "portrait"
          : "landscape";

      // 2) Canvasdagi matnlar
      const payload = {
        title: getText(".js-cert-title", "CERTIFICATE"),
        subtitle: getText(".js-cert-sub", "of participation"),
        name: getText(".js-cert-name", "Name Surname"),
        body: getText(".js-cert-body", ""),
        signatureLabel: getText(".js-footer-signature", "Signature"),
        dateLabel: getText(".js-footer-date", "Date"),
        orientation,
        titleStyle: {},
        subStyle: {},
        nameStyle: {},
        bodyStyle: {},
      };

      // ===== TITLE STYLE =====
      const titleEl = document.querySelector(".js-cert-title");
      const titleComputed = titleEl ? window.getComputedStyle(titleEl) : null;

      const titleFamilySelect = document.querySelector(".js-font-title-family");
      const titleSizeInput = document.querySelector(".js-font-title-size");
      const titleColorInput = document.querySelector(".js-font-title-color");
      const titleWeightSelect = document.querySelector(".js-font-title-weight");
      const titleLetterInput = document.querySelector(".js-font-title-letter");

      payload.titleStyle = {
        fontFamily: titleFamilySelect ? titleFamilySelect.value : "",
        fontSize: titleSizeInput ? parseFloat(titleSizeInput.value) || 24 : 24,
        color: titleColorInput ? titleColorInput.value || "#111827" : "#111827",
        fontWeight: titleWeightSelect ? titleWeightSelect.value || "500" : "500",
        letterSpacing: titleLetterInput ? parseFloat(titleLetterInput.value) || 0 : 0,
        align: titleComputed ? titleComputed.textAlign || "center" : "center",
      };

      // ===== SUBTITLE STYLE =====
      const subEl = document.querySelector(".js-cert-sub");
      const subComputed = subEl ? window.getComputedStyle(subEl) : null;

      const subFamilySelect = document.querySelector(".js-font-sub-family");
      const subSizeInput = document.querySelector(".js-font-sub-size");
      const subColorInput = document.querySelector(".js-font-sub-color");

      payload.subStyle = {
        fontFamily: subFamilySelect ? subFamilySelect.value : "",
        fontSize: subSizeInput ? parseFloat(subSizeInput.value) || 14 : 14,
        color: subColorInput ? subColorInput.value || "#666666" : "#666666",
        align: subComputed ? subComputed.textAlign || "center" : "center",
      };

      // ===== NAME STYLE =====
      const nameEl = document.querySelector(".js-cert-name");
      const nameComputed = nameEl ? window.getComputedStyle(nameEl) : null;

      const nameFamilySelect = document.querySelector(".js-font-name-family");
      const nameSizeInput = document.querySelector(".js-font-name-size");
      const nameColorInput = document.querySelector(".js-font-name-color");

      payload.nameStyle = {
        fontFamily: nameFamilySelect ? nameFamilySelect.value : "",
        fontSize: nameSizeInput ? parseFloat(nameSizeInput.value) || 28 : 28,
        color: nameColorInput ? nameColorInput.value || "#000000" : "#000000",
        align: nameComputed ? nameComputed.textAlign || "center" : "center",
      };

      // ===== BODY STYLE =====
      const bodyEl = document.querySelector(".js-cert-body");
      const bodyComputed = bodyEl ? window.getComputedStyle(bodyEl) : null;

      const bodyFamilySelect = document.querySelector(".js-font-body-family");
      const bodySizeInput = document.querySelector(".js-font-body-size");
      const bodyColorInput = document.querySelector(".js-font-body-color");

      payload.bodyStyle = {
        fontFamily: bodyFamilySelect ? bodyFamilySelect.value : "",
        fontSize: bodySizeInput ? parseFloat(bodySizeInput.value) || 14 : 14,
        color: bodyColorInput ? bodyColorInput.value || "#333333" : "#333333",
        align: bodyComputed ? bodyComputed.textAlign || "center" : "center",
      };

      console.log("PDF payload:", payload);
      console.log("API_BASE_URL:", API_BASE_URL);

      // ✅ Backendga jo‘natamiz (local yoki Railway)
     const API = window.API_BASE_URL || "http://localhost:4000";

const response = await fetch(`${API}/api/generate-pdf`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});


      if (!response.ok) {
        const t = await response.text().catch(() => "");
        throw new Error("Server error: " + response.status + " " + t);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const random = Math.floor(100000 + Math.random() * 900000);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CertifyPro_${random}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("PDF yaratishda xatolik bo‘ldi (konsolni ko‘ring).");
    }
  });
}
