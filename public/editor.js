  // Fallback: Directly wire up left/right panel toggle buttons if global click handler fails
  document.querySelectorAll('.pf-panel-toggle--left').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof togglePanel === 'function') togglePanel('left');
    });
  });
  document.querySelectorAll('.pf-panel-toggle--right').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof togglePanel === 'function') togglePanel('right');
    });
  });
/* Gildia Editor (Canva/Kittl-style shell)
 * - Plain HTML/CSS/JS (no framework)
 * - Document model + selection + drag/resize + snapping + layers + undo/redo
 */

(() => {
    // Separate state for each panel
    let isLeftPanelOpen = true;
    let isRightPanelOpen = false;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const appRoot = $('[data-app="pf-editor"]');
  if (!appRoot) return;
  // Restore UI state (zoom, panels, etc.) before rendering
  loadUI();

  // =========================
  // Backend URL config
  // =========================
  const DEFAULT_PROD_BACKEND =
    "https://gildia.uz";
  function getApiBaseUrl() {
    if (window.API_BASE_URL) return window.API_BASE_URL;
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return "http://localhost:4000";
    return DEFAULT_PROD_BACKEND;
  }
  const API_BASE_URL = getApiBaseUrl();

  // =========================
  // DOM
  // =========================
  const stage = $('[data-stage]');
  const stageWrap = $('[data-stage-wrap]');
  const viewport = $('[data-viewport]');
  const rulerX = $('[data-ruler="x"]');
  const rulerY = $('[data-ruler="y"]');
  const guidelinesRoot = $('[data-guidelines]');
  const artboardGrid = $('[data-artboard-grid]');
  const unitSelects = $$('[data-unit-select]');
  const floatingToolbar = $('[data-toolbar]');
  const floatingHandle = $('[data-toolbar-handle]');
  const artboardWidthInput = $('[data-artboard-size="w"]');
  const artboardHeightInput = $('[data-artboard-size="h"]');
  const artboardOverlay = $('[data-artboard-overlay]');
  const artboardBox = $('.pf-artboard-box', artboardOverlay);
  const artboardHandles = $$('[data-artboard-handle]', artboardOverlay);

  const leftAside = $('.pf-left');
  const rightAside = $('.pf-right');
  const rightLauncher = $('[data-role="right-launcher"]');

  const zoomReadout = $('[data-zoom-readout]');
  const leftTitle = $('[data-left-title]');
  const rightTitle = $('[data-right-title]');

  const layersRoot = $('[data-layers]');
  const selectionOverlay = $('[data-selection]');
  const selectionBox = $('.pf-selection__box', selectionOverlay);
  const guidesRoot = $('[data-guides]');
  const guideV = $('[data-guide="v"]', guidesRoot);
  const guideH = $('[data-guide="h"]', guidesRoot);

  const propsForm = $('[data-props]');
  const accountPanel = $('[data-right-section="account"]');
  const templatesPanel = $('[data-right-section="templates"]');
    // Right panel tab switching (Inspector/Template)
    $$('.pf-right__rail .pf-rail-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        // Remove active from all right rail buttons
        $$('.pf-right__rail .pf-rail-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        // Hide all right panel sections
        $$('.pf-right-shell [data-right-section]').forEach(sec => sec.hidden = true);
        // Show the selected section
        const tab = btn.getAttribute('data-right-tab');
        if (tab === 'inspector') {
          propsForm.hidden = false;
          accountPanel.hidden = true;
          templatesPanel.hidden = true;
          rightTitle.textContent = 'Properties';
          $('[data-right-kicker]').textContent = 'Inspector';
        } else if (tab === 'templates') {
          propsForm.hidden = true;
          accountPanel.hidden = true;
          templatesPanel.hidden = false;
          rightTitle.textContent = 'Templates';
          $('[data-right-kicker]').textContent = 'Templates';
        }
      });
    });
  const contextMenu = $('[data-context-menu]');
  const upgradeModal = $('[data-upgrade-modal]');
  const upgradeModalCloseBtn = $('[data-upgrade-modal-close]');
  const fontFamilySelect = propsForm?.querySelector('[data-prop="fontFamily"]');
  const fontWeightSelect = propsForm?.querySelector('[data-prop="fontWeight"]');
  const leftStylePanel = $('[data-left-style]');
  const leftFontFamilySelect = leftStylePanel?.querySelector('[data-left-prop="fontFamily"]');
  const leftFontWeightSelect = leftStylePanel?.querySelector('[data-left-prop="fontWeight"]');
  const emptyState = $('[data-empty-state]');
  const docTitleInput = $('.pf-title__input');
  const docStatus = $('.pf-title__status');
  const docStatusWrap = $('.pf-doc-status');
  const themeToggle = $('input[data-action="theme:toggle"]');

  // =========================
  // Typography catalog (Google Fonts)
  // =========================
  // Curated, popular, free Google Fonts. (We keep this list small-but-good for UX.)
  // The loader supports adding more fonts later without changing the rest of the editor.
  const FONT_CATALOG = [
    { label: "Manrope", value: "'Manrope', sans-serif", slug: "Manrope", weights: ["400", "500", "600", "700", "800"] },
    { label: "Inter", value: "'Inter', sans-serif", slug: "Inter", weights: ["400", "500", "600", "700"] },
    { label: "Space Grotesk", value: "'Space Grotesk', sans-serif", slug: "Space+Grotesk", weights: ["400", "500", "600", "700"] },
    { label: "Poppins", value: "'Poppins', sans-serif", slug: "Poppins", weights: ["400", "500", "600", "700"] },
    { label: "Montserrat", value: "'Montserrat', sans-serif", slug: "Montserrat", weights: ["400", "500", "600", "700", "800"] },
    { label: "Nunito", value: "'Nunito', sans-serif", slug: "Nunito", weights: ["400", "500", "600", "700", "800"] },
    { label: "Raleway", value: "'Raleway', sans-serif", slug: "Raleway", weights: ["400", "500", "600", "700", "800"] },
    { label: "Source Sans 3", value: "'Source Sans 3', sans-serif", slug: "Source+Sans+3", weights: ["400", "500", "600", "700"] },
    { label: "Oswald", value: "'Oswald', sans-serif", slug: "Oswald", weights: ["400", "500", "600", "700"] },
    { label: "Bebas Neue", value: "'Bebas Neue', sans-serif", slug: "Bebas+Neue", weights: ["400"] },
    { label: "Playfair Display", value: "'Playfair Display', serif", slug: "Playfair+Display", weights: ["400", "500", "600", "700"] },
    { label: "Merriweather", value: "'Merriweather', serif", slug: "Merriweather", weights: ["400", "700"] },
    { label: "Lora", value: "'Lora', serif", slug: "Lora", weights: ["400", "500", "600", "700"] },
    { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif", slug: "Cormorant+Garamond", weights: ["400", "500", "600", "700"] },
    { label: "Libre Baskerville", value: "'Libre Baskerville', serif", slug: "Libre+Baskerville", weights: ["400", "700"] },
    { label: "DM Serif Display", value: "'DM Serif Display', serif", slug: "DM+Serif+Display", weights: ["400"] },
  ];
  const fontRegistry = new Map(FONT_CATALOG.map((font) => [font.value, font]));
  const loadedFontFamilies = new Set();

  // =========================
  // Utilities
  // =========================
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
  const nowId = () => Math.random().toString(36).slice(2, 10);

  function setSavedUI(saved) {
    if (!docStatus) return;
    docStatus.textContent = saved ? "Saved" : "Unsaved";
    docStatus.dataset.status = saved ? "saved" : "unsaved";
    if (docStatusWrap) docStatusWrap.dataset.state = saved ? "saved" : "unsaved";
  }

  function px(n) {
    return `${Math.round(n * 100) / 100}px`;
  }

  function getPointerPosInStage(e) {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / view.zoom;
    const y = (e.clientY - r.top) / view.zoom;
    return { x, y };
  }

  const THEME_KEY = "pf-editor:theme:v1";
  function applyTheme(isDark) {
    document.body.classList.toggle("pf-theme-dark", isDark);
    if (themeToggle) themeToggle.checked = isDark;
    try {
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch {
      // ignore
    }
  }

  function loadTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark") applyTheme(true);
      else if (stored === "light") applyTheme(false);
    } catch {
      // ignore
    }
  }

  // =========================
  // Upgrade modal (isolated)
  // =========================
  const UPGRADE_MODAL_ANIM_MS = 170;
  let upgradeModalLastFocus = null;
  let upgradeModalCloseTimer = 0;

  function openUpgradeModal() {
    if (!upgradeModal) return;
    window.clearTimeout(upgradeModalCloseTimer);
    upgradeModalLastFocus = document.activeElement;
    upgradeModal.hidden = false;
    upgradeModal.dataset.open = "false";
    requestAnimationFrame(() => {
      if (!upgradeModal) return;
      upgradeModal.dataset.open = "true";
      upgradeModalCloseBtn?.focus?.();
    });
  }

  function closeUpgradeModal() {
    if (!upgradeModal || upgradeModal.hidden) return;
    upgradeModal.dataset.open = "false";
    window.clearTimeout(upgradeModalCloseTimer);
    upgradeModalCloseTimer = window.setTimeout(() => {
      if (!upgradeModal) return;
      upgradeModal.hidden = true;
      const toFocus = upgradeModalLastFocus;
      upgradeModalLastFocus = null;
      toFocus?.focus?.();
    }, UPGRADE_MODAL_ANIM_MS);
  }

  // Keep font loading centralized so we only inject Google Fonts stylesheets once.
  function ensureFontLoaded(fontValue) {
    if (!fontValue) return;
    if (loadedFontFamilies.has(fontValue)) return;
    const font = fontRegistry.get(fontValue);
    if (!font) return;
    const weights = font.weights?.join(";") || "400";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.slug}:wght@${weights}&display=swap`;
    document.head.appendChild(link);
    loadedFontFamilies.add(fontValue);
  }

  function populateFontControls() {
    const selects = [fontFamilySelect, leftFontFamilySelect].filter(Boolean);
    if (!selects.length) return;
    selects.forEach((select) => {
      if (select.dataset.ready === "true") return;
      select.innerHTML = "";
      FONT_CATALOG.forEach((font) => {
        const opt = document.createElement("option");
        opt.value = font.value;
        opt.textContent = font.label;
        select.appendChild(opt);
        ensureFontLoaded(font.value);
      });
      select.dataset.ready = "true";
    });
  }

  function syncFontWeightOptions(fontValue, preferredWeight) {
    const selects = [fontWeightSelect, leftFontWeightSelect].filter(Boolean);
    if (!selects.length) return;
    const font = fontRegistry.get(fontValue);
    const weights = font?.weights ?? ["300", "400", "500", "600", "700"];
    selects.forEach((select) => {
      const nextValue = preferredWeight || select.value || weights[0];
      select.innerHTML = "";
      weights.forEach((weight) => {
        const opt = document.createElement("option");
        opt.value = weight;
        opt.textContent = weight;
        select.appendChild(opt);
      });
      if (!weights.includes(nextValue) && nextValue) {
        const custom = document.createElement("option");
        custom.value = nextValue;
        custom.textContent = nextValue;
        select.appendChild(custom);
      }
      select.value = nextValue || weights[0];
    });
  }

  function preloadDocumentFonts(doc) {
    if (!doc) return;
    doc.elements
      .filter((el) => el.type === "text")
      .forEach((el) => ensureFontLoaded(el.style?.fontFamily));
  }

  // =========================
  // Document model
  // =========================
  const STORAGE_KEY = "pf-editor:doc:v1";
  const UI_KEY = "pf-editor:ui:v1";

  function getDefaultA4SizePx(orientation = "landscape") {
    const a4Wmm = 210;
    const a4Hmm = 297;
    const w = orientation === "portrait" ? a4Wmm : a4Hmm;
    const h = orientation === "portrait" ? a4Hmm : a4Wmm;
    return { w: w * MM_TO_PX, h: h * MM_TO_PX };
  }

  function getTemplateTokens(templateKey) {
    const key = String(templateKey || "t1");
    const base = {
      key,
      paper: "#ffffff",
      baseStroke: "rgba(15,23,42,0.12)",
      borderOuter: "rgba(15,23,42,0.14)",
      borderInner: "rgba(15,23,42,0.10)",
      accent: "#0b1f3a",
      accent2: "#7a102b",
      accent3: "#ea580c",
      accentSoft: "rgba(11,31,58,0.12)",
      accent2Soft: "rgba(122,16,43,0.10)",
      accent3Soft: "rgba(234,88,12,0.10)",
      text: "#0f172a",
      textStrong: "#0b1220",
      muted: "rgba(15,23,42,0.66)",
      subtle: "rgba(15,23,42,0.16)",
      line: "rgba(15,23,42,0.28)",
      watermark: "rgba(15,23,42,0.06)",
      titleColor: "rgba(15,23,42,0.92)",
      bodyColor: "rgba(15,23,42,0.80)",
      shadowColor: "rgba(15,23,42,0.10)",
      sealStroke: "#7a102b",
      sealFill: "rgba(122,16,43,0.12)",
      titleFont: "'Space Grotesk', sans-serif",
      nameFont: "'Cormorant Garamond', serif",
      bodyFont: "'Libre Baskerville', serif",
      capFont: "'Space Grotesk', sans-serif",
      classicFont: "'Playfair Display', serif",
    };

    switch (key) {
      // 1) Classic Elegant: serif title, navy/burgundy.
      case "t1":
        return {
          ...base,
          paper: "#fbf6ee",
          baseStroke: "rgba(11,31,58,0.22)",
          borderOuter: "rgba(122,16,43,0.32)",
          borderInner: "rgba(11,31,58,0.18)",
          accent: "#0b1f3a",
          accent2: "#7a102b",
          accentSoft: "rgba(11,31,58,0.12)",
          accent2Soft: "rgba(122,16,43,0.10)",
          sealStroke: "#7a102b",
          sealFill: "rgba(122,16,43,0.10)",
          titleFont: base.classicFont,
          nameFont: "'Cormorant Garamond', serif",
        };

      // 2) Modern Minimal: clean sans, dark+light high contrast.
      case "t2":
        return {
          ...base,
          paper: "#ffffff",
          accent: "#0f172a",
          accent2: "#1d4ed8",
          accentSoft: "rgba(15,23,42,0.10)",
          accent2Soft: "rgba(29,78,216,0.12)",
          borderOuter: "rgba(15,23,42,0.18)",
          borderInner: "rgba(15,23,42,0.10)",
          sealStroke: "#1d4ed8",
          sealFill: "rgba(29,78,216,0.12)",
          titleFont: "'Space Grotesk', sans-serif",
          nameFont: "'Space Grotesk', sans-serif",
          bodyFont: "'Space Grotesk', sans-serif",
        };

      // 3) Premium Luxury: charcoal + gold, high contrast.
      case "t3":
        return {
          ...base,
          paper: "#0b0f17",
          baseStroke: "rgba(212,175,55,0.70)",
          borderOuter: "rgba(212,175,55,0.85)",
          borderInner: "rgba(212,175,55,0.45)",
          accent: "#d4af37",
          accent2: "#b8860b",
          accentSoft: "rgba(212,175,55,0.16)",
          accent2Soft: "rgba(184,134,11,0.14)",
          text: "#f8fafc",
          textStrong: "#ffffff",
          muted: "rgba(248,250,252,0.70)",
          subtle: "rgba(248,250,252,0.18)",
          line: "rgba(212,175,55,0.60)",
          watermark: "rgba(212,175,55,0.08)",
          titleColor: "rgba(248,250,252,0.96)",
          bodyColor: "rgba(248,250,252,0.78)",
          shadowColor: "rgba(0,0,0,0.35)",
          sealStroke: "#d4af37",
          sealFill: "rgba(212,175,55,0.10)",
          titleFont: "'Space Grotesk', sans-serif",
          nameFont: "'Cormorant Garamond', serif",
          bodyFont: "'Libre Baskerville', serif",
        };

      // 4) Academic/Diploma: deep blue + forest green structure.
      case "t4":
        return {
          ...base,
          paper: "#f8fafc",
          accent: "#1e3a8a",
          accent2: "#14532d",
          accentSoft: "rgba(30,58,138,0.12)",
          accent2Soft: "rgba(20,83,45,0.10)",
          borderOuter: "rgba(30,58,138,0.28)",
          borderInner: "rgba(20,83,45,0.16)",
          sealStroke: "#14532d",
          sealFill: "rgba(20,83,45,0.10)",
          titleFont: base.classicFont,
        };

      // 5) Creative Geometric: teal/purple/orange rhythm.
      case "t5":
        return {
          ...base,
          paper: "#ffffff",
          accent: "#0f766e",
          accent2: "#6d28d9",
          accent3: "#ea580c",
          accentSoft: "rgba(15,118,110,0.14)",
          accent2Soft: "rgba(109,40,217,0.12)",
          accent3Soft: "rgba(234,88,12,0.12)",
          borderOuter: "rgba(15,23,42,0.18)",
          borderInner: "rgba(15,23,42,0.10)",
          sealStroke: "#6d28d9",
          sealFill: "rgba(109,40,217,0.12)",
          titleFont: "'Space Grotesk', sans-serif",
          nameFont: "'Cormorant Garamond', serif",
        };

      // 6) Corporate Professional: dark neutral + subtle accent.
      case "t6":
        return {
          ...base,
          paper: "#ffffff",
          accent: "#111827",
          accent2: "#0ea5e9",
          accentSoft: "rgba(17,24,39,0.10)",
          accent2Soft: "rgba(14,165,233,0.12)",
          borderOuter: "rgba(17,24,39,0.18)",
          borderInner: "rgba(17,24,39,0.10)",
          sealStroke: "#0ea5e9",
          sealFill: "rgba(14,165,233,0.12)",
          titleFont: "'Space Grotesk', sans-serif",
          nameFont: "'Space Grotesk', sans-serif",
        };
      default:
        return base;
    }
  }

  function collectTextById(doc) {
    const out = {};
    if (!doc?.elements) return out;
    doc.elements.forEach((el) => {
      if (el?.type === "text" && el.id) out[el.id] = el.text ?? "";
    });
    return out;
  }

  function buildCertificateTemplateElements(tokens, textById = {}) {
    const t = (id, fallback) => {
      const v = textById[id];
      return (typeof v === "string" && v.length) ? v : fallback;
    };

    // A4 landscape frame.
    // Fill the full stage to avoid any extra "blank strip" margins around the event asset.
    const stageSize = getDefaultA4SizePx("landscape");
    const baseX = 0;
    const baseY = 0;
    const baseW = stageSize.w;
    const baseH = stageSize.h;

    // Inner safe padding (keeps content away from edges).
    const pad = 34;
    const innerX = baseX + pad;
    const innerY = baseY + pad;
    const innerW = baseW - pad * 2;
    const innerH = baseH - pad * 2;

    const contentX = baseX + 110;
    const contentW = baseW - 220;
    const titleY = baseY + 88;
    const ruleY = baseY + 142;
    const nameY = baseY + 176;
    const bodyY = baseY + 254;
    const infoY = baseY + 470;
    const sigLineY = baseY + 606;
    const sigTextY = sigLineY + 8;
    const sigRoleY = sigLineY + 30;

    const els = [
      {
        id: "certBase",
        name: "Event asset base",
        type: "rect",
        x: baseX,
        y: baseY,
        w: baseW,
        h: baseH,
        lockRatio: true,
        style: {
          fill: tokens.paper,
          stroke: tokens.baseStroke,
          strokeWidth: 1,
          strokeStyle: "solid",
          shadowOn: false,
        },
      },
      {
        id: "title",
        name: "Title",
        type: "text",
        text: t("title", "EVENT PASS"),
        x: contentX,
        y: titleY,
        w: contentW,
        h: 44,
        style: {
          fontFamily: tokens.titleFont,
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: 5,
          color: tokens.titleColor || tokens.textStrong || tokens.text,
          textAlign: "center",
        },
      },
      {
        id: "titleRule",
        name: "Divider (title)",
        type: "line",
        x: baseX + 260,
        y: ruleY,
        w: baseW - 520,
        h: 1,
        style: { color: tokens.subtle },
      },
      {
        id: "name",
        name: "Recipient name",
        type: "text",
        text: t("name", "Name Surname"),
        x: contentX,
        y: nameY,
        w: contentW,
        h: 56,
        style: {
          fontFamily: tokens.nameFont,
          fontSize: 46,
          fontWeight: 600,
          letterSpacing: 0,
          color: tokens.textStrong || tokens.text,
          textAlign: "center",
          lineHeight: 1.05,
        },
      },
      {
        id: "body",
        name: "Body text",
        type: "text",
        text: t(
          "body",
          "For conference attendees, speakers, sponsors, and staff who deserve polished event credentials."
        ),
        x: contentX + 40,
        y: bodyY,
        w: contentW - 80,
        h: 140,
        style: {
          fontFamily: tokens.bodyFont,
          fontSize: 16,
          fontWeight: 400,
          letterSpacing: 0,
          color: tokens.bodyColor || tokens.text,
          textAlign: "center",
          lineHeight: 1.55,
        },
      },
      {
        id: "certId",
        name: "Event asset ID",
        type: "text",
        text: t("certId", ""),
        x: contentX,
        y: infoY,
        w: 300,
        h: 22,
        style: {
          fontFamily: tokens.capFont,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.6,
          color: tokens.muted,
          textAlign: "left",
        },
      },
      {
        id: "issuer",
        name: "Issuer",
        type: "text",
        text: t("issuer", ""),
        x: baseX + baseW / 2 - 180,
        y: infoY,
        w: 360,
        h: 22,
        style: {
          fontFamily: tokens.capFont,
          fontSize: 12,
          fontWeight: 750,
          letterSpacing: 0.8,
          color: tokens.muted,
          textAlign: "center",
        },
      },
      {
        id: "sigLine",
        name: "Signature line (1)",
        type: "line",
        x: contentX,
        y: sigLineY,
        w: 320,
        h: 2,
        style: { color: tokens.line || "rgba(15,23,42,0.25)" },
      },
      {
        id: "dateLine",
        name: "Signature line (2)",
        type: "line",
        x: baseX + baseW - contentX - 320,
        y: sigLineY,
        w: 320,
        h: 2,
        style: { color: tokens.line || "rgba(15,23,42,0.25)" },
      },
      {
        id: "signature",
        name: "Signer name (1)",
        type: "text",
        text: t("signature", "Alex Johnson"),
        x: contentX,
        y: sigTextY,
        w: 320,
        h: 20,
        style: {
          fontFamily: tokens.capFont,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.4,
          color: tokens.textStrong || tokens.text,
          textAlign: "center",
        },
      },
      {
        id: "signatureRole",
        name: "Signer role (1)",
        type: "text",
        text: t("signatureRole", "Director"),
        x: contentX,
        y: sigRoleY,
        w: 320,
        h: 18,
        style: {
          fontFamily: tokens.capFont,
          fontSize: 11,
          fontWeight: 650,
          letterSpacing: 0.8,
          color: tokens.muted,
          textAlign: "center",
        },
      },
      {
        id: "signature2Name",
        name: "Signer name (2)",
        type: "text",
        text: t("signature2Name", "Maria Stone"),
        x: baseX + baseW - contentX - 320,
        y: sigTextY,
        w: 320,
        h: 20,
        style: {
          fontFamily: tokens.capFont,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.4,
          color: tokens.textStrong || tokens.text,
          textAlign: "center",
        },
      },
      {
        id: "signature2Role",
        name: "Signer role (2)",
        type: "text",
        text: t("signature2Role", "Instructor"),
        x: baseX + baseW - contentX - 320,
        y: sigRoleY,
        w: 320,
        h: 18,
        style: {
          fontFamily: tokens.capFont,
          fontSize: 11,
          fontWeight: 650,
          letterSpacing: 0.8,
          color: tokens.muted,
          textAlign: "center",
        },
      },
    ];

    const insertBeforeId = (beforeId, el) => {
      const idx = els.findIndex((e) => e.id === beforeId);
      if (idx >= 0) els.splice(idx, 0, el);
      else els.push(el);
    };

    const byId = (id) => els.find((e) => e.id === id);
    const alignLeft = (ids, x, w) => {
      ids.forEach((id) => {
        const el = byId(id);
        if (!el) return;
        el.x = x;
        el.w = w;
        el.style = el.style || {};
        el.style.textAlign = "left";
      });
    };
    const setSignatureColumns = (leftX, rightX) => {
      ["sigLine", "signature", "signatureRole"].forEach((id) => {
        const el = byId(id);
        if (el) el.x = leftX;
      });
      ["dateLine", "signature2Name", "signature2Role"].forEach((id) => {
        const el = byId(id);
        if (el) el.x = rightX;
      });
    };

    // Template-specific minimal adjustments (keep all objects editable).
    if (tokens.key === "t1") {
      insertBeforeId("title", {
        id: "frameOuter",
        name: "Frame",
        type: "rect",
        x: innerX,
        y: innerY,
        w: innerW,
        h: innerH,
        lockRatio: true,
        style: {
          fill: "rgba(255,255,255,0)",
          stroke: tokens.accent,
          strokeWidth: 2,
          strokeStyle: "solid",
        },
      });
      insertBeforeId("title", {
        id: "accentTop",
        name: "Accent (top)",
        type: "rect",
        x: innerX + 24,
        y: innerY + 18,
        w: innerW - 48,
        h: 4,
        style: { fill: tokens.accent2, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      insertBeforeId("title", {
        id: "accentBottom",
        name: "Accent (bottom)",
        type: "rect",
        x: innerX + 24,
        y: innerY + innerH - 22,
        w: innerW - 48,
        h: 4,
        style: { fill: tokens.accent, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      const rule = byId("titleRule");
      if (rule?.style) rule.style.color = tokens.borderOuter;
    }

    if (tokens.key === "t2") {
      // Modern Minimal: left alignment, sharp accents.
      const leftX = innerX + 40;
      const leftW = innerW - 80;
      alignLeft(["title", "name", "body"], leftX, leftW);
      const title = byId("title");
      if (title?.style) {
        title.style.letterSpacing = 3;
        title.style.fontWeight = 900;
      }
      const rule = byId("titleRule");
      if (rule) {
        rule.x = leftX;
        rule.w = 220;
      }
      insertBeforeId("title", {
        id: "accentLeft",
        name: "Accent (left)",
        type: "rect",
        x: innerX,
        y: innerY,
        w: 10,
        h: innerH,
        style: { fill: tokens.accent2, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      insertBeforeId("title", {
        id: "accentBlock",
        name: "Accent (block)",
        type: "rect",
        x: innerX + innerW - 90,
        y: innerY + 22,
        w: 70,
        h: 6,
        style: { fill: tokens.accent, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      const certId = byId("certId");
      const issuer = byId("issuer");
      if (certId) {
        certId.x = leftX;
        certId.y = infoY;
        certId.w = leftW;
        certId.style.textAlign = "left";
      }
      if (issuer) {
        issuer.x = leftX;
        issuer.y = infoY + 20;
        issuer.w = leftW;
        issuer.style.textAlign = "left";
      }
      setSignatureColumns(leftX, leftX + leftW - 320);
    }

    if (tokens.key === "t3") {
      // Premium Luxury: dark base + gold accents.
      const base = byId("certBase");
      if (base?.style) {
        base.style.stroke = tokens.accent;
        base.style.strokeWidth = 2;
      }
      insertBeforeId("title", {
        id: "accentTop",
        name: "Accent (top)",
        type: "rect",
        x: innerX + 30,
        y: innerY + 16,
        w: innerW - 60,
        h: 4,
        style: { fill: tokens.accent2, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      insertBeforeId("title", {
        id: "accentBottom",
        name: "Accent (bottom)",
        type: "rect",
        x: innerX + 30,
        y: innerY + innerH - 20,
        w: innerW - 60,
        h: 4,
        style: { fill: tokens.accent, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      const rule = byId("titleRule");
      if (rule?.style) rule.style.color = tokens.line;
      const title = byId("title");
      if (title?.style) title.style.fontSize = 38;
      const name = byId("name");
      if (name?.style) name.style.fontSize = 48;
    }

    if (tokens.key === "t4") {
      // Academic Diploma: structured grid cues.
      insertBeforeId("title", {
        id: "headerRule",
        name: "Header line",
        type: "line",
        x: innerX + 24,
        y: innerY + 18,
        w: innerW - 48,
        h: 1,
        style: { color: tokens.accent },
      });
      insertBeforeId("signature", {
        id: "footerRule",
        name: "Footer line",
        type: "line",
        x: innerX + 24,
        y: innerY + innerH - 26,
        w: innerW - 48,
        h: 1,
        style: { color: tokens.accent2 },
      });
      const rule = byId("titleRule");
      if (rule?.style) rule.style.color = tokens.accent2;
      const title = byId("title");
      if (title?.style) title.style.letterSpacing = 4;
    }

    if (tokens.key === "t5") {
      // Creative Geometric: bold accent blocks.
      insertBeforeId("title", {
        id: "geoBlock1",
        name: "Geo block (tl)",
        type: "rect",
        x: innerX,
        y: innerY,
        w: 46,
        h: 46,
        style: { fill: tokens.accent2, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      insertBeforeId("title", {
        id: "geoBlock2",
        name: "Geo block (tl-2)",
        type: "rect",
        x: innerX + 20,
        y: innerY + 20,
        w: 30,
        h: 30,
        style: { fill: tokens.accent3, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      insertBeforeId("signature", {
        id: "geoBlock3",
        name: "Geo block (br)",
        type: "rect",
        x: innerX + innerW - 46,
        y: innerY + innerH - 46,
        w: 46,
        h: 46,
        style: { fill: tokens.accent, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      const rule = byId("titleRule");
      if (rule) {
        rule.h = 2;
        rule.style = rule.style || {};
        rule.style.color = tokens.accent3;
      }
    }

    if (tokens.key === "t6") {
      // Corporate: clean sections + subtle accent.
      const leftX = innerX + 48;
      const leftW = innerW - 96;
      alignLeft(["title", "name", "body"], leftX, leftW);
      const title = byId("title");
      if (title?.style) {
        title.style.letterSpacing = 2;
        title.style.fontWeight = 800;
      }
      const rule = byId("titleRule");
      if (rule) {
        rule.x = leftX;
        rule.w = 240;
      }
      insertBeforeId("title", {
        id: "accentLeft",
        name: "Accent (left)",
        type: "rect",
        x: innerX + 18,
        y: innerY + 20,
        w: 6,
        h: innerH - 40,
        style: { fill: tokens.accent2, stroke: "rgba(255,255,255,0)", strokeWidth: 0, strokeStyle: "solid" },
      });
      insertBeforeId("sigLine", {
        id: "sectionRule",
        name: "Section divider",
        type: "line",
        x: leftX,
        y: infoY - 12,
        w: leftW,
        h: 1,
        style: { color: tokens.subtle },
      });
      const certId = byId("certId");
      const issuer = byId("issuer");
      if (certId) {
        certId.x = leftX;
        certId.y = infoY;
        certId.w = leftW;
        certId.style.textAlign = "left";
      }
      if (issuer) {
        issuer.x = leftX;
        issuer.y = infoY + 20;
        issuer.w = leftW;
        issuer.style.textAlign = "left";
      }
      setSignatureColumns(leftX, leftX + leftW - 320);
    }

    return els;
  }

  function applyTemplatePresetToDoc(doc, templateKey) {
    if (!doc) return;
    const key = String(templateKey || "t1");
    const tokens = getTemplateTokens(key);
    const textById = collectTextById(doc);
    doc.page = doc.page || {};
    doc.page.orientation = "landscape";
    doc.page.sizePx = getDefaultA4SizePx("landscape");
    doc.page.offset = { x: 0, y: 0 };
    doc.page.background = key;
    doc.meta = doc.meta || { title: "Untitled event design", version: 2 };
    doc.meta.version = Math.max(Number(doc.meta.version || 1), 2);
    doc.elements = buildCertificateTemplateElements(tokens, textById);
    preloadDocumentFonts(doc);
    
    // Document'ni normalize qilish - layoutlar to'g'ri ishlashi uchun
    normalizeDoc(doc);
  }

  function createInitialDoc() {
    // A4 at 96dpi (landscape default)
    return {
      meta: {
        title: "Untitled event design",
        version: 2,
      },
      page: {
        orientation: "landscape",
        background: null,
        locked: false,
        sizePx: getDefaultA4SizePx("landscape"),
        offset: { x: 0, y: 0 },
      },
      elements: [],
    };
  }

  function ensureDocElement(doc, el) {
    if (!doc?.elements) return;
    const exists = doc.elements.some((e) => e.id === el.id);
    if (!exists) doc.elements.push(el);
  }

  function migrateDocToV2(doc) {
    if (!doc) return;
    if (!doc.meta) doc.meta = { title: "Untitled certificate", version: 1 };
    const v = Number(doc.meta.version || 1);
    if (v >= 2) return;

    // Add only missing elements; keep user content intact.
    const key = doc.page?.background || "t1";
    const tokens = getTemplateTokens(key);
    const defaults = buildCertificateTemplateElements(tokens, collectTextById(doc));
    defaults.forEach((el) => ensureDocElement(doc, el));
    doc.meta.version = 2;
  }

  function sanitizeDocPlaceholders(doc) {
    if (!doc || !Array.isArray(doc.elements)) return false;
    let changed = false;

    // Remove legacy placeholders that may still exist in saved docs.
    doc.elements.forEach((el) => {
      if (!el || el.type !== "text" || typeof el.text !== "string") return;
      const before = el.text;
      let next = before;
      next = next.replace(/#000001/g, "");
      next = next.replace(/\bPROFLY\b/gi, "");
      next = next.replace(/\bCERTIFYPRO\b/gi, "");
      // Remove legacy labels (keep user-entered values).
      next = next.replace(/^\s*ID\s*:\s*/i, "");
      next = next.replace(/^\s*ISSUED\s+BY\s*:\s*/i, "");
      // keep spacing tidy
      next = next.replace(/\s{2,}/g, " ").trimEnd();
      if (next !== before) {
        el.text = next;
        changed = true;
      }
    });

    return changed;
  }

  function loadDoc() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.page || !Array.isArray(parsed.elements)) return null;
      sanitizeDocPlaceholders(parsed);
      return parsed;
    } catch {
      return null;
    }
  }

  function saveDoc(doc) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      setSavedUI(true);
    } catch {
      // ignore
    }
  }

  // =========================
  // View state (zoom, tool, panels)
  // =========================
  const view = {
    zoom: 1,
    tool: "select", // select | hand
    leftCollapsed: false, // Dastlab panel ochiq bo'lishi kerak
    rightCollapsed: true,
    unit: "px",
    resizing: null, // {side, startX, startW}
    toolbarPos: { x: 24, y: 24 },
    gridOffset: { x: 0, y: 0 }, // Grid offset for dragging
  };

  function loadUI() {
    try {
      const raw = localStorage.getItem(UI_KEY);
      if (!raw) return;
      const ui = JSON.parse(raw);
      if (ui && typeof ui.zoom === "number") view.zoom = clamp(ui.zoom, 0.25, 3);
      if (ui && typeof ui.leftCollapsed === "boolean") view.leftCollapsed = ui.leftCollapsed;
      if (ui && typeof ui.rightCollapsed === "boolean") view.rightCollapsed = ui.rightCollapsed;
      if (ui && typeof ui.unit === "string") view.unit = ui.unit;
      if (ui && ui.toolbarPos && Number.isFinite(ui.toolbarPos.x) && Number.isFinite(ui.toolbarPos.y)) {
        view.toolbarPos = { x: ui.toolbarPos.x, y: ui.toolbarPos.y };
      }
      if (ui && ui.gridOffset && Number.isFinite(ui.gridOffset.x) && Number.isFinite(ui.gridOffset.y)) {
        view.gridOffset = { x: ui.gridOffset.x, y: ui.gridOffset.y };
      }
    } catch {
      // ignore
    }
  }

  function saveUI() {
    try {
      localStorage.setItem(
        UI_KEY,
        JSON.stringify({
          zoom: view.zoom,
          leftCollapsed: view.leftCollapsed,
          rightCollapsed: view.rightCollapsed,
          unit: view.unit,
          toolbarPos: view.toolbarPos,
          gridOffset: view.gridOffset,
        })
      );
    } catch {
      // ignore
    }
  }
  function applyToolbarPosition() {
    if (!floatingToolbar) return;
    floatingToolbar.style.left = `${Math.round(view.toolbarPos.x)}px`;
    floatingToolbar.style.top = `${Math.round(view.toolbarPos.y)}px`;
  }

  const ACCORDION_KEY = "pf-editor:accordions:v1";
  function loadAccordionState() {
    try {
      const raw = localStorage.getItem(ACCORDION_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch {
      return {};
    }
  }

  function saveAccordionState(next) {
    try {
      localStorage.setItem(ACCORDION_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function applyZoom() {
    stage.style.transform = `scale(${view.zoom})`;
    viewport?.style.setProperty("--pf-zoom", String(view.zoom));
    viewport?.style.setProperty("--pf-inv-zoom", String(1 / (view.zoom || 1)));
    if (zoomReadout) zoomReadout.textContent = `${Math.round(view.zoom * 100)}%`;
    saveUI();
    refreshSelectionOverlay();
    renderRulers();
  }

  function hideContextMenu() {
    if (!contextMenu) return;
    contextMenu.hidden = true;
    contextMenu.style.left = "";
    contextMenu.style.top = "";
    contextMenu.dataset.id = "";
  }

  function showContextMenu(x, y, nodeId) {
    if (!contextMenu) return;
    contextMenu.hidden = false;
    contextMenu.dataset.id = nodeId;
    const pad = 8;
    const w = contextMenu.offsetWidth || 180;
    const h = contextMenu.offsetHeight || 120;
    const left = Math.min(x, window.innerWidth - w - pad);
    const top = Math.min(y, window.innerHeight - h - pad);
    contextMenu.style.left = `${Math.max(pad, left)}px`;
    contextMenu.style.top = `${Math.max(pad, top)}px`;
  }

  function centerStageInViewport() {
    if (!viewport || !stage) return;
    const vpRect = viewport.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const stageCenterX = (stageRect.left - vpRect.left) + viewport.scrollLeft + stageRect.width / 2;
    const stageCenterY = (stageRect.top - vpRect.top) + viewport.scrollTop + stageRect.height / 2;
    const targetCenterX = window.innerWidth / 2 - vpRect.left;
    const targetCenterY = window.innerHeight / 2 - vpRect.top;
    viewport.scrollLeft = Math.max(0, stageCenterX - targetCenterX);
    viewport.scrollTop = Math.max(0, stageCenterY - targetCenterY);
    renderRulers();
  }

  function fitToScreen() {
    // Fit stage into viewport with padding
    const padding = 60;
    // Wait for DOM/layout to be ready
    setTimeout(() => {
      const vp = viewport.getBoundingClientRect();
      const { w: stageW, h: stageH } = getStageSize();
      const zx = (vp.width - padding) / stageW;
      const zy = (vp.height - padding) / stageH;
      view.zoom = clamp(Math.min(zx, zy), 0.25, 3);
      state.doc.page.offset = { x: 0, y: 0 };
      applyZoom();
      applyArtboardOffset();
      // Center after zoom
      setTimeout(() => {
        centerStageInViewport();
      }, 50);
    }, 0);
  }

  function getStageSize() {
    const size = state.doc.page?.sizePx;
    if (size && size.w && size.h) return { w: size.w, h: size.h };
    return getDefaultA4SizePx(state.doc.page?.orientation || "landscape");
  }

  const MM_TO_PX = 96 / 25.4;
  const IN_TO_PX = 96;

  function pxToUnit(valuePx, unit = view.unit) {
    if (unit === "mm") return valuePx / MM_TO_PX;
    if (unit === "in") return valuePx / IN_TO_PX;
    return valuePx;
  }

  function unitToPx(value, unit = view.unit) {
    const v = Number(value || 0);
    if (unit === "mm") return v * MM_TO_PX;
    if (unit === "in") return v * IN_TO_PX;
    return v;
  }

  function formatUnit(valuePx, unit = view.unit) {
    const v = pxToUnit(valuePx, unit);
    if (unit === "px") return Math.round(v);
    return Math.round(v * 10) / 10;
  }

  function renderRulers() {
    if (!rulerX || !rulerY || !viewport || !stage) return;
    const vpRect = viewport.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const offsetX = stageRect.left - vpRect.left;
    const offsetY = stageRect.top - vpRect.top;
    const step =
      view.unit === "mm"
        ? unitToPx(10, "mm")
        : view.unit === "in"
          ? unitToPx(0.5, "in")
          : 100;
    const labelEvery = view.unit === "px" ? 2 : 5;

    rulerX.innerHTML = "";
    rulerY.innerHTML = "";

    // Apply grid offset (for dragging)
    const gridOffsetX = offsetX + (view.gridOffset?.x || 0);
    const gridOffsetY = offsetY + (view.gridOffset?.y || 0);

    viewport.style.setProperty("--pf-grid-offset-x", `${Math.round(gridOffsetX)}px`);
    viewport.style.setProperty("--pf-grid-offset-y", `${Math.round(gridOffsetY)}px`);

    // Keep rulers pinned to the viewport edges while scrolling.
    const sl = Math.round(viewport.scrollLeft || 0);
    const st = Math.round(viewport.scrollTop || 0);
    viewport.style.setProperty("--pf-vp-scroll-x", `${sl}px`);
    viewport.style.setProperty("--pf-vp-scroll-y", `${st}px`);

    // When the left panel overlays the canvas, CSS exposes its width via --pf-ruler-left.
    // Use it to keep tick math aligned to the top ruler's left edge.
    const rulerLeftRaw = getComputedStyle(viewport).getPropertyValue("--pf-ruler-left").trim();
    const rulerLeftPx = rulerLeftRaw.endsWith("px") ? Number(rulerLeftRaw.replace("px", "")) : Number(rulerLeftRaw) || 0;
    const localOffsetX = offsetX - rulerLeftPx;

    // Ruler box positioning is handled by CSS using --pf-vp-scroll-x/y and --pf-ruler-left.

    const worldStartX = (0 - offsetX) / view.zoom;
    const worldEndX = worldStartX + vpRect.width / view.zoom;
    const startX = Math.floor(worldStartX / step) - 1;
    const endX = Math.ceil(worldEndX / step) + 1;
    for (let i = startX; i <= endX; i++) {
      const worldX = i * step;
      const x = localOffsetX + worldX * view.zoom;
      const tick = document.createElement("div");
      tick.className = "pf-ruler-tick";
      tick.style.left = `${Math.round(x)}px`;
      rulerX.appendChild(tick);

      if (i % labelEvery === 0) {
        const label = document.createElement("div");
        label.className = "pf-ruler-label";
        label.style.left = `${Math.round(x + 2)}px`;
        label.style.top = "2px";
        label.textContent = formatUnit(worldX);
        rulerX.appendChild(label);
      }
    }

    const worldStartY = (0 - offsetY) / view.zoom;
    const worldEndY = worldStartY + vpRect.height / view.zoom;
    const startY = Math.floor(worldStartY / step) - 1;
    const endY = Math.ceil(worldEndY / step) + 1;
    for (let i = startY; i <= endY; i++) {
      const worldY = i * step;
      const y = offsetY + worldY * view.zoom;
      const tick = document.createElement("div");
      tick.className = "pf-ruler-tick";
      tick.style.top = `${Math.round(y)}px`;
      rulerY.appendChild(tick);

      if (i % labelEvery === 0) {
        const label = document.createElement("div");
        label.className = "pf-ruler-label";
        label.style.top = `${Math.round(y + 2)}px`;
        label.style.left = "2px";
        label.textContent = formatUnit(worldY);
        rulerY.appendChild(label);
      }
    }
  }

  function setTool(tool) {
    view.tool = tool;
    $$('[data-tool]').forEach((b) =>
      b.classList.toggle("is-active", b.dataset.tool === tool)
    );
    stage.style.cursor = tool === "hand" ? "grab" : "default";
    if (viewport) viewport.style.cursor = tool === "hand" ? "grab" : "default";
    if (tool === "hand") {
      console.log("Hand tool activated");
    }
  }

  // =========================
  // History (undo/redo) - Enhanced with UndoRedoManager
  // =========================
  const historyManager = new UndoRedoManager({
    maxHistorySize: 100,
    debounceMs: 300
  });

  // Update UI when history changes
  historyManager.on('change', () => {
    updateUndoRedoButtons();
  });

  // Wrapper for backward compatibility with existing code
  const history = {
    markBefore(label) {
      historyManager.markBefore(label, state.doc);
    },
    commit() {
      if (historyManager.commit(state.doc)) {
        setSavedUI(false);
      }
    },
    discard() {
      historyManager.discard();
    },
    undo() {
      const prev = historyManager.undo();
      if (prev) {
        state.doc = prev;
        renderAll();
        setSavedUI(false);
      }
    },
    redo() {
      const next = historyManager.redo();
      if (next) {
        state.doc = next;
        renderAll();
        setSavedUI(false);
      }
    },
    canUndo: () => historyManager.canUndo(),
    canRedo: () => historyManager.canRedo(),
  };

  // =========================
  // Editor state
  // =========================
  function normalizeDoc(doc) {
    if (!doc.page) doc.page = { orientation: "landscape", background: "t1" };
    if (!doc.page.orientation) doc.page.orientation = "landscape";
    if (!doc.page.background) doc.page.background = "t1";
    if (!doc.page.sizePx) doc.page.sizePx = getDefaultA4SizePx(doc.page.orientation);
    if (typeof doc.page.locked !== "boolean") doc.page.locked = false;
    if (!doc.page.offset) doc.page.offset = { x: 0, y: 0 };
  }

  const LEGACY_LAYOUT_IDS = new Set([
      // Prior, more decorative template elements
      "watermark",
      "borderinner",
      "accenttop2",
      "accentbottom",
      "nameunderline",
      "course",
      "courserule",
      "detailsrule",
      "certidlabel",
      "issuerlabel",
      "datelabel",
      "signaturelabel1",
      "signaturelabel2",
      "footerrule",
      "footertext",
      // Template-specific old accents
      "cornertlh",
      "cornertlv",
      "cornertrh",
      "cornertrv",
      "cornerblh",
      "cornerblv",
      "cornerbrh",
      "cornerbrv",
      "classicfinerule",
      "minbar",
      "luxsideleft",
      "luxsideright",
      "luxfooterblock",
      "acadheaderblock",
      "acaddividerv1",
      "acaddividerv2",
      "geodiag",
      "geocorner1",
      "geocorner2",
      "geotitleline",
      "corpheader",
      "corpunderline",
      // Legacy seal parts
      "sealinner",
      "sealtext",
      // Old copy
      "subtitle",
      "presentedto",
      "metaleft",
      "metaright",
    ]);

  function isLegacyLayoutElement(el) {
    const id = String(el?.id || "").toLowerCase();
    if (LEGACY_LAYOUT_IDS.has(id)) return true;
    const name = String(el?.name || "").toLowerCase();
    if (name.includes("placeholder") || name.includes("default layout")) return true;
    if (id.includes("placeholder") || id.includes("defaultlayout")) return true;
    return false;
  }

  function stripLegacyLayoutElements(doc) {
    const els = Array.isArray(doc?.elements) ? doc.elements : [];
    if (!els.length) return false;
    const filtered = els.filter((el) => !isLegacyLayoutElement(el));
    if (filtered.length === els.length) return false;
    doc.elements = filtered;
    return true;
  }

  function hasLegacyLayoutRemnants(doc) {
    const els = Array.isArray(doc?.elements) ? doc.elements : [];
    return els.some((el) => isLegacyLayoutElement(el));
  }

  function ensureCleanInitialTemplate(doc) {
    if (!doc) return;
    const hadLegacy = hasLegacyLayoutRemnants(doc);
    stripLegacyLayoutElements(doc);
    const els = Array.isArray(doc.elements) ? doc.elements : [];
    const isEmpty = els.length === 0;

    // Safe rule:
    // - If empty, insert Template 1.
    // - If legacy remnants exist, replace layout with Template 1 (no duplicates).
    if (isEmpty || hadLegacy) {
      applyTemplatePresetToDoc(doc, "t1");
    }
  }

  const state = {
    doc: loadDoc() || createInitialDoc(),
    selectionId: null,
    hoverId: null,
    drag: null, // {id, start, origin, mode}
    snap: { x: null, y: null },
    editingId: null,
    editingBeforeDoc: null,
    pendingDrag: null, // {id, pointerId, startClient, startStage, origin, wasSelected, isText}
    artboardSelected: false,
    artboardDrag: null, // {handle, start, startSize}
    artboardMove: null, // {pointerId, startClient, startOffset, moved}
    artboardMovePrimed: false,
    guidelines: [],
    guideDrag: null,
    gridDrag: null, // {pointerId, startClient, startOffset}
    rightMode: "props",
  };
  normalizeDoc(state.doc);
  migrateDocToV2(state.doc);
  // If the user has an older cached doc, strip placeholders and persist.
  if (sanitizeDocPlaceholders(state.doc)) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.doc));
    } catch {
      // ignore
    }
  }
  ensureCleanInitialTemplate(state.doc);

  // ensure title visible
  if (docTitleInput) docTitleInput.value = state.doc.meta?.title || "Untitled event design";
  setSavedUI(true);
  populateFontControls();
  preloadDocumentFonts(state.doc);
  // Do not call fitToScreen on reload, just restore zoom from view.zoom
  applyZoom();

  // =========================
  // Rendering
  // =========================
  function applyPage() {
    const portrait = state.doc.page.orientation === "portrait";
    stage.classList.toggle("is-portrait", portrait);

    const hasLayout = Array.isArray(state.doc.elements) && state.doc.elements.length > 0;
    stage.classList.toggle("is-empty", !hasLayout);

    const { w, h } = getStageSize();
    stage.style.width = px(w);
    stage.style.height = px(h);

    // Keep orientation controls in sync with document state (important after undo/redo).
    const activeAction = portrait ? "page:portrait" : "page:landscape";
    $$('[data-action="page:portrait"], [data-action="page:landscape"]').forEach((btn) => {
      const isActive = btn.dataset.action === activeAction;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Canvas/page backgrounds: keep solid (no gradients). Templates carry color via editable shapes.
    stage.style.background = hasLayout ? "#ffffff" : "transparent";
    stageWrap.style.background = "transparent";
  }

  function applyArtboardOffset() {
    if (!stageWrap) return;
    const { x, y } = state.doc.page.offset || { x: 0, y: 0 };
    stageWrap.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }

  function clampArtboardOffset(next) {
    // Allow artboard to move freely, no clamping
    return {
      x: next.x,
      y: next.y,
    };
  }

  function ensureNodeEl(id) {
    let el = stage.querySelector(`.pf-node[data-id="${id}"]`);
    if (el) return el;
    el = document.createElement("div");
    el.className = "pf-node";
    el.dataset.id = id;
    stage.appendChild(el);
    return el;
  }

  function removeOrphanNodeEls() {
    const ids = new Set(state.doc.elements.map((e) => e.id));
    $$(".pf-node", stage).forEach((el) => {
      if (!ids.has(el.dataset.id)) el.remove();
    });
  }

  function renderNode(node, zIndex = 1) {
    const el = ensureNodeEl(node.id);
    el.dataset.type = node.type;
    el.dataset.locked = node.locked ? "true" : "false";
    el.style.left = px(node.x);
    el.style.top = px(node.y);
    el.style.width = px(Math.max(2, node.w));
    el.style.height = px(Math.max(2, node.h));
    el.style.zIndex = String(zIndex);
    el.classList.toggle("is-selected", state.selectionId === node.id);
    el.classList.toggle("is-hover", state.hoverId === node.id && state.selectionId !== node.id);
    el.style.display = node.hidden ? "none" : "block";

    const s = node.style || {};
    const rotate = Number(s.rotate || 0);
    const scale = Number(s.scale || 100) / 100;
    const flipX = s.flipX ? -1 : 1;
    const flipY = s.flipY ? -1 : 1;
    const skew = Number(s.skew || 0);
    const opacity = Number(s.opacity ?? 100) / 100;
    const shadowOn = s.shadowOn === true || s.shadowOn === "true";
    const shadowX = Number(s.shadowX || 0);
    const shadowY = Number(s.shadowY || 0);
    const shadowBlur = Number(s.shadowBlur || 0);
    const shadowColor = s.shadowColor || "rgba(15,23,42,0.25)";

    el.style.opacity = String(clamp(opacity, 0, 1));
    el.style.transformOrigin = "center center";
    el.style.transform = `rotate(${rotate}deg) skew(${skew}deg) scale(${scale * flipX}, ${scale * flipY})`;
    el.style.boxShadow = shadowOn ? `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}` : "none";

    if (node.type === "text") {
      el.textContent = node.text || "";
      el.style.fontFamily = s.fontFamily || "'Space Grotesk', sans-serif";
      el.style.fontSize = px(s.fontSize ?? 14);
      el.style.fontWeight = String(s.fontWeight ?? 400);
      el.style.letterSpacing = px(s.letterSpacing ?? 0);
      el.style.color = s.color || "#111827";
      el.style.textAlign = s.textAlign || "left";
      el.style.lineHeight = s.lineHeight ? String(s.lineHeight) : "1.25";
      el.style.display = "block";
      el.style.background = "transparent";
      el.style.border = "none";
    } else if (node.type === "rect") {
      el.textContent = "";
      el.style.background = s.fill || "rgba(37, 99, 235, 0.08)";
      el.style.border = `${s.strokeWidth ?? 1}px ${s.strokeStyle || "solid"} ${s.stroke || "rgba(37,99,235,0.25)"}`;
      el.style.borderRadius = "0";
      el.style.clipPath = "none";
    } else if (node.type === "ellipse") {
      el.textContent = "";
      el.style.background = s.fill || "rgba(37, 99, 235, 0.08)";
      el.style.border = `${s.strokeWidth ?? 1}px ${s.strokeStyle || "solid"} ${s.stroke || "rgba(37,99,235,0.25)"}`;
      el.style.borderRadius = "999px";
      el.style.clipPath = "none";
    } else if (node.type === "triangle") {
      el.textContent = "";
      el.style.background = s.fill || "rgba(37, 99, 235, 0.08)";
      el.style.border = `${s.strokeWidth ?? 1}px ${s.strokeStyle || "solid"} ${s.stroke || "rgba(37,99,235,0.25)"}`;
      el.style.borderRadius = "0";
      el.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
    } else if (node.type === "line") {
      el.textContent = "";
      el.style.background = s.stroke || s.color || "rgba(15,23,42,0.2)";
      el.style.border = "none";
      el.style.height = px(Math.max(1, node.h));
    } else if (node.type === "image") {
      el.textContent = "";
      let img = $("img", el);
      if (!img) {
        img = document.createElement("img");
        el.appendChild(img);
      }
      img.alt = node.name || "Image";
      img.src = node.src || "";
      img.style.filter = s.filter || "none";
    }
  }

  function renderLayers() {
    if (!layersRoot) return;
    layersRoot.innerHTML = "";

    // topmost should be last; list from top to bottom feels natural
    const nodes = [...state.doc.elements].slice().reverse();
    for (const node of nodes) {
      const row = document.createElement("div");
      row.className = "pf-layer";
      row.dataset.id = node.id;
      row.classList.toggle("is-selected", state.selectionId === node.id);

      const left = document.createElement("div");
      left.style.minWidth = "0";

      const name = document.createElement("div");
      name.className = "pf-layer__name";
      name.textContent = node.name || node.id;

      const meta = document.createElement("div");
      meta.className = "pf-layer__meta";
      meta.textContent = node.type;

      left.appendChild(name);
      left.appendChild(meta);

      row.appendChild(left);
      layersRoot.appendChild(row);
    }
  }

  function renderProps() {
    if (!propsForm || !emptyState) return;
    if (state.artboardSelected) {
      emptyState.hidden = false;
      emptyState.textContent = "Artboard selected. Use the top controls to adjust size or lock.";
      propsForm.hidden = true;
      if (rightTitle) rightTitle.textContent = "Artboard";
      if (leftStylePanel) {
        leftStylePanel.querySelectorAll("[data-left-prop]").forEach((el) => {
          el.disabled = true;
        });
      }
      return;
    }
    const node = getSelectedNode();
    if (!node) {
      emptyState.hidden = false;
      emptyState.textContent = "Select an element to edit its style. Double-click text to edit inline.";
      propsForm.hidden = true;
      if (rightTitle) rightTitle.textContent = "Properties";
      if (leftStylePanel) {
        leftStylePanel.querySelectorAll("[data-left-prop]").forEach((el) => {
          el.disabled = true;
        });
      }
      return;
    }

    emptyState.hidden = true;
    propsForm.hidden = false;
    if (leftStylePanel) {
      leftStylePanel.querySelectorAll("[data-left-prop]").forEach((el) => {
        el.disabled = false;
      });
    }
    if (rightTitle) rightTitle.textContent = node.name || "Properties";

    const kind = node.type === "text" ? "text" : node.type === "image" ? "image" : "shape";
    const objectTypeLabel = propsForm.querySelector("[data-object-type]");
    if (objectTypeLabel) {
      objectTypeLabel.textContent =
        node.type === "text"
          ? "Text"
          : node.type === "image"
            ? "Image"
            : node.type === "rect"
              ? "Rectangle"
              : "Shape";
    }

    propsForm.querySelectorAll("[data-for]").forEach((section) => {
      const list = section.dataset.for.split(" ");
      section.hidden = !list.includes(kind);
    });

    // Fill inputs
    const setVal = (key, val) => {
      const els = propsForm.querySelectorAll(`[data-prop="${key}"]`);
      if (!els.length) return;
      els.forEach((el) => {
        if (el.type === "checkbox") el.checked = Boolean(val);
        else if (el.type === "color") el.value = val || "#111827";
        else el.value = String(val ?? "");
      });
    };
    const setLeftVal = (key, val) => {
      if (!leftStylePanel) return;
      const els = leftStylePanel.querySelectorAll(`[data-left-prop="${key}"]`);
      if (!els.length) return;
      els.forEach((el) => {
        if (el.type === "checkbox") el.checked = Boolean(val);
        else if (el.type === "color") el.value = val || "#111827";
        else el.value = String(val ?? "");
      });
    };

    const isText = node.type === "text";
    const nodeFont = node.style?.fontFamily || FONT_CATALOG[0]?.value || "'Inter', sans-serif";
    if (isText) {
      populateFontControls();
      syncFontWeightOptions(nodeFont, String(node.style?.fontWeight ?? "400"));
    }
    if (fontFamilySelect && nodeFont && !fontRegistry.has(nodeFont)) {
      const exists = Array.from(fontFamilySelect.options).some((opt) => opt.value === nodeFont);
      if (!exists) {
        const fallbackOption = document.createElement("option");
        fallbackOption.value = nodeFont;
        fallbackOption.textContent = nodeFont.replace(/['"]/g, "");
        fontFamilySelect.appendChild(fallbackOption);
      }
    }

    setVal("name", node.name || "Layer");
    setVal("locked", node.locked || false);
    setVal("hidden", node.hidden || false);
    setVal("fontFamily", nodeFont);
    setVal("fontSize", node.style?.fontSize ?? 14);
    setVal("fontWeight", String(node.style?.fontWeight ?? "400"));
    setVal("lineHeight", node.style?.lineHeight ?? 1.25);
    setVal("letterSpacing", node.style?.letterSpacing ?? 0);
    setVal("color", node.style?.color || "#111827");
    setVal("fill", node.style?.fill || "#ffffff");
    setVal("stroke", node.style?.stroke || "#111827");
    setVal("strokeWidth", node.style?.strokeWidth ?? 1);
    setVal("strokeStyle", node.style?.strokeStyle || "solid");
    setVal("opacity", node.style?.opacity ?? 100);
    setVal("rotate", node.style?.rotate ?? 0);
    setVal("skew", node.style?.skew ?? 0);
    setVal("scale", node.style?.scale ?? 100);
    setVal("lockRatio", node.lockRatio || false);
    setVal("filter", node.style?.filter || "none");
    setVal("shadowOn", node.style?.shadowOn || false);
    setVal("shadowX", node.style?.shadowX ?? 0);
    setVal("shadowY", node.style?.shadowY ?? 0);
    setVal("shadowBlur", node.style?.shadowBlur ?? 0);
    setVal("shadowColor", node.style?.shadowColor || "#000000");
    setVal("x", Math.round(node.x));
    setVal("y", Math.round(node.y));
    setVal("w", Math.round(node.w));
    setVal("h", Math.round(node.h));

    setLeftVal("fontFamily", nodeFont);
    setLeftVal("fontSize", node.style?.fontSize ?? 14);
    setLeftVal("fontWeight", String(node.style?.fontWeight ?? "400"));
    setLeftVal("color", node.style?.color || "#111827");
    setLeftVal("fill", node.style?.fill || "#ffffff");
    setLeftVal("stroke", node.style?.stroke || "#111827");
    setLeftVal("strokeWidth", node.style?.strokeWidth ?? 1);
    setLeftVal("opacity", node.style?.opacity ?? 100);

    // Disable text controls for non-text nodes
    propsForm.querySelectorAll('[data-prop="fontFamily"],[data-prop="fontSize"],[data-prop="fontWeight"],[data-prop="lineHeight"],[data-prop="letterSpacing"],[data-prop="color"]').forEach((el) => {
      el.disabled = !isText;
    });
    if (leftStylePanel) {
      leftStylePanel.querySelectorAll('[data-left-prop="fontFamily"],[data-left-prop="fontSize"],[data-left-prop="fontWeight"],[data-left-prop="color"]').forEach((el) => {
        el.disabled = !isText;
      });
    }
  }

  function renderAll() {
    preloadDocumentFonts(state.doc);
    applyPage();
    applyArtboardOffset();
    removeOrphanNodeEls();
    for (let i = 0; i < state.doc.elements.length; i++) {
      renderNode(state.doc.elements[i], i + 1);
    }
    renderGuidelines();
    renderLayers();
    renderProps();
    renderRightMode();
    renderArtboardOverlay();
    renderArtboardControls();
    applyZoom(); // also refresh selection
    refreshSelectionOverlay();
    setLeftUIFromDoc();
  }
  function renderRightMode() {
    if (accountPanel) accountPanel.hidden = state.rightMode !== "account";
    if (propsForm) propsForm.hidden = state.rightMode === "account";
    if (emptyState && state.rightMode === "account") emptyState.hidden = true;
  }

  function renderGuidelines() {
    if (!guidelinesRoot) return;
    guidelinesRoot.innerHTML = "";
    for (const guide of state.guidelines) {
      const line = document.createElement("div");
      line.className = `pf-guideline pf-guideline--${guide.axis}`;
      line.dataset.guideId = guide.id;
      if (guide.axis === "x") {
        line.style.left = px(guide.pos);
        line.style.top = 0;
        line.style.bottom = 0;
      } else {
        line.style.top = px(guide.pos);
        line.style.left = 0;
        line.style.right = 0;
      }
      line.style.cursor = guide.axis === "x" ? "ew-resize" : "ns-resize";
      line.tabIndex = 0;
      line.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.guideDrag = { id: guide.id, axis: guide.axis, pointerId: e.pointerId };
        line.setPointerCapture?.(e.pointerId);
      });
      line.addEventListener("pointermove", (e) => {
        if (!state.guideDrag || state.guideDrag.id !== guide.id) return;
        const p = getPointerPosInStage(e);
        let pos = guide.axis === "x" ? p.x : p.y;
        guide.pos = pos;
        renderGuidelines();
      });
      line.addEventListener("pointerup", (e) => {
        if (!state.guideDrag || state.guideDrag.id !== guide.id) return;
        const { w, h } = getStageSize();
        let out = false;
        if (guide.axis === "x") {
          out = guide.pos < -24 || guide.pos > w + 24;
        } else {
          out = guide.pos < -24 || guide.pos > h + 24;
        }
        if (out) {
          // Remove guideline
          state.guidelines = state.guidelines.filter((g) => g.id !== guide.id);
        }
        state.guideDrag = null;
        renderGuidelines();
      });
      guidelinesRoot.appendChild(line);
    }
  }

  function getA4Ratio() {
    return state.doc.page.orientation === "portrait" ? 210 / 297 : 297 / 210;
  }

  function setArtboardSizePx(nextW, nextH, { scaleContents = true } = {}) {
    const { w: prevW, h: prevH } = getStageSize();
    const ratio = getA4Ratio();
    const minShort = 360;
    const maxShort = 2200;
    const minW = state.doc.page.orientation === "portrait" ? minShort : minShort * ratio;
    const minH = state.doc.page.orientation === "portrait" ? minShort * ratio : minShort;
    const maxW = state.doc.page.orientation === "portrait" ? maxShort : maxShort * ratio;
    const maxH = state.doc.page.orientation === "portrait" ? maxShort * ratio : maxShort;

    let w = clamp(nextW, minW, maxW);
    let h = clamp(nextH, minH, maxH);

    // enforce strict A4 ratio
    if (Math.abs(w / h - ratio) > 0.001) {
      if (Math.abs(w - prevW) >= Math.abs(h - prevH)) h = w / ratio;
      else w = h * ratio;
    }

    if (scaleContents) {
      const sx = w / prevW;
      const sy = h / prevH;
      state.doc.elements.forEach((el) => {
        el.x *= sx;
        el.y *= sy;
        el.w *= sx;
        el.h *= sy;
      });
    }

    state.doc.page.sizePx = { w, h };
  }

  function renderArtboardOverlay() {
    if (!artboardOverlay) return;
    const isOn = state.artboardSelected;
    artboardOverlay.classList.toggle("is-on", isOn);
    artboardOverlay.classList.toggle("is-locked", state.doc.page.locked);
    artboardOverlay.setAttribute("aria-hidden", (!isOn).toString());
    if (!isOn) return;

    const { w, h } = getStageSize();
    const corners = {
      nw: { x: 0, y: 0 },
      ne: { x: w, y: 0 },
      se: { x: w, y: h },
      sw: { x: 0, y: h },
    };
    artboardHandles.forEach((handle) => {
      const k = handle.dataset.artboardHandle;
      const p = corners[k];
      if (!p) return;
      handle.style.left = px(p.x - 6);
      handle.style.top = px(p.y - 6);
    });
    if (artboardBox) artboardBox.style.borderRadius = "18px";
  }

  function renderArtboardControls() {
    if (artboardWidthInput) artboardWidthInput.value = String(formatUnit(getStageSize().w));
    if (artboardHeightInput) artboardHeightInput.value = String(formatUnit(getStageSize().h));
    if (unitSelects.length) unitSelects.forEach((sel) => (sel.value = view.unit));
    const lockBtn = document.querySelector('[data-action="artboard:toggleLock"]');
    if (artboardWidthInput) artboardWidthInput.disabled = state.doc.page.locked;
    if (artboardHeightInput) artboardHeightInput.disabled = state.doc.page.locked;
    if (lockBtn) {
      lockBtn.setAttribute("aria-pressed", state.doc.page.locked ? "true" : "false");
      lockBtn.title = state.doc.page.locked ? "Unlock artboard" : "Lock artboard";
    }
  }

  // =========================
  // Selection overlay
  // =========================
  function refreshSelectionOverlay() {
    if (!selectionOverlay || !selectionBox) return;
    if (state.artboardSelected) {
      selectionOverlay.style.display = "none";
      return;
    }
    const node = getSelectedNode();
    if (!node) {
      selectionOverlay.style.display = "none";
      return;
    }
    selectionOverlay.style.display = "block";
    selectionOverlay.setAttribute("aria-hidden", "false");
    // Position overlay box in stage coordinates
    selectionBox.style.left = px(node.x);
    selectionBox.style.top = px(node.y);
    selectionBox.style.width = px(node.w);
    selectionBox.style.height = px(node.h);

    const centerLineV = $('.pf-selection__line--v', selectionOverlay);
    const centerLineH = $('.pf-selection__line--h', selectionOverlay);
    if (centerLineV) centerLineV.style.left = px(node.x + node.w / 2);
    if (centerLineH) centerLineH.style.top = px(node.y + node.h / 2);

    // Handles positions
    const handles = $$("[data-handle]", selectionOverlay);
    const cx = node.x + node.w / 2;
    const cy = node.y + node.h / 2;
    const pos = {
      nw: { x: node.x, y: node.y },
      n: { x: cx, y: node.y },
      ne: { x: node.x + node.w, y: node.y },
      e: { x: node.x + node.w, y: cy },
      se: { x: node.x + node.w, y: node.y + node.h },
      s: { x: cx, y: node.y + node.h },
      sw: { x: node.x, y: node.y + node.h },
      w: { x: node.x, y: cy },
    };
    for (const h of handles) {
      const k = h.dataset.handle;
      if (k === "rotate") {
        h.style.left = px(cx - 7);
        h.style.top = px(node.y - 32);
        continue;
      }
      const p = pos[k];
      h.style.left = px(p.x - 5);
      h.style.top = px(p.y - 5);
    }
  }

  // =========================
  // Helpers to access nodes
  // =========================
  function getNode(id) {
    return state.doc.elements.find((n) => n.id === id) || null;
  }

  function duplicateNode(node) {
    const copy = deepClone(node);
    copy.id = `${node.type}_${nowId()}`;
    copy.name = `${node.name || node.type} copy`;
    copy.x += 16;
    copy.y += 16;
    state.doc.elements.push(copy);
    return copy.id;
  }

  function getSelectedNode() {
    if (!state.selectionId) return null;
    return getNode(state.selectionId);
  }

  function select(id) {
    const node = getNode(id);
    if (!node || node.hidden) return;
    state.artboardMovePrimed = false;
    state.rightMode = "props";
    state.artboardSelected = false;
    state.selectionId = id;
    for (let i = 0; i < state.doc.elements.length; i++) {
      renderNode(state.doc.elements[i], i + 1);
    }
    renderLayers();
    renderProps();
    renderRightMode();
    refreshSelectionOverlay();
    openPanel("right");
  }

  function clearSelection() {
    if (state.editingId) stopTextEdit({ commit: true });
    state.selectionId = null;
    state.artboardSelected = false;
    state.artboardMovePrimed = false;
    state.rightMode = "props";
    for (let i = 0; i < state.doc.elements.length; i++) {
      renderNode(state.doc.elements[i], i + 1);
    }
    renderLayers();
    renderProps();
    renderRightMode();
    refreshSelectionOverlay();
    closePanel("right");
  }

  function selectArtboard() {
    if (state.editingId) stopTextEdit({ commit: true });
    state.selectionId = null;
    state.artboardSelected = true;
    state.rightMode = "props";
    renderLayers();
    renderProps();
    renderRightMode();
    refreshSelectionOverlay();
    renderArtboardOverlay();
    // Strict rule: layout/artboard is not an editable object. Keep properties panel closed.
    closePanel("right");
  }

  function startTextEdit(id) {
    const node = getNode(id);
    if (!node || node.type !== "text") return;
    if (state.editingId === id) return;
    if (state.editingId) stopTextEdit({ commit: true });

    select(id);
    state.editingId = id;
    state.editingBeforeDoc = deepClone(state.doc);
    history.markBefore("textEdit");

    const el = stage.querySelector(`.pf-node[data-id="${id}"]`);
    if (!el) return;

    el.classList.add("is-editing");
    el.contentEditable = "true";
    el.spellcheck = false;
    el.setAttribute("role", "textbox");
    el.setAttribute("aria-multiline", "true");

    if (selectionOverlay) selectionOverlay.style.display = "none";
    clearSnapGuides();

    el.focus();
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } catch {
      // ignore
    }
  }

  function stopTextEdit({ commit }) {
    const id = state.editingId;
    if (!id) return;
    const el = stage.querySelector(`.pf-node[data-id="${id}"]`);
    const node = getNode(id);

    if (el) {
      el.classList.remove("is-editing");
      el.contentEditable = "false";
      el.removeAttribute("role");
      el.removeAttribute("aria-multiline");
    }

    if (!commit && state.editingBeforeDoc) {
      state.doc = state.editingBeforeDoc;
      history.discard();
      state.editingBeforeDoc = null;
      state.editingId = null;
      renderAll();
      return;
    }

    if (node && el) {
      const text = (el.innerText || "").replace(/\r\n/g, "\n");
      node.text = text;
      // auto-grow height so typing feels "live"
      const nextH = Math.max(20, el.scrollHeight);
      node.h = Math.max(node.h, nextH);
    }

    state.editingBeforeDoc = null;
    state.editingId = null;

    history.commit();
    // Text o'zgarishlarini localStorage'ga saqlash
    saveDoc(state.doc);
    renderAll();
    if (id) select(id);
  }

  // =========================
  // Left panel tabs
  // =========================
  function setLeftTab(tab, options = {}) {
    const shouldOpen = options.openPanel ?? true;
    if (shouldOpen) openPanel("left");
    const titles = {
        add: "Add",
      home: "Home",
      arrange: "Arrange",
      style: "Style",
      text: "Text",
      illustrations: "Illustrations",
      images: "Images",
      upload: "Upload",
      ai: "AI",
      layers: "Layers",
      templates: "Templates",
      learn: "Learn",
      help: "Help",
      save: "Save",
    };
    if (leftTitle) leftTitle.textContent = titles[tab] || "Panel";
    $$("[data-left-tab]").forEach((b) => {
      const active = b.dataset.leftTab === tab;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    $$("[data-left-view]").forEach((p) => {
      const active = p.dataset.leftView === tab;
      p.hidden = !active;
      p.classList.toggle("is-active", active);
    });
  }

  function setLeftUIFromDoc() {
    // nothing for now
  }

  // =========================
  // Snapping (Enhanced with GridSnapManager)
  // =========================
  const SNAP_PX = 6;
  const GRID_STEP = 10; // Configurable grid size (default 10px for finer control)

  function getRulerStep() {
    return view.unit === "mm"
      ? unitToPx(10, "mm")
      : view.unit === "in"
        ? unitToPx(0.5, "in")
        : 100;
  }

  function isGridOn() {
    return stage && !stage.classList.contains("pf-grid-off");
  }

  // Initialize GridSnapManager
  let gridSnapManager = null;
  if (typeof GridSnapManager !== 'undefined') {
    gridSnapManager = new GridSnapManager({
      gridSize: GRID_STEP,
      snapThreshold: SNAP_PX,
      enabled: true,
      showGrid: isGridOn(),
      showSnapIndicators: true,
      guidelineSnapEnabled: true,
      guidelineThreshold: SNAP_PX,
      objectSnapEnabled: true,
      objectSnapThreshold: SNAP_PX,
      onSnap: (data) => {
        // Visual feedback for snap
        if (data.x !== null || data.y !== null) {
          // Snap indicators are handled by GridSnapManager
        }
      },
      onUnsnap: () => {
        // Hide snap indicators
      }
    });

    // Create snap indicators in viewport
    if (viewport) {
      gridSnapManager.createSnapIndicators(viewport);
    }
  }

  // Legacy functions for backward compatibility
  function snapToGridValue(value) {
    if (gridSnapManager) {
      return gridSnapManager.snapToGrid(value);
    }
    return Math.round(value / GRID_STEP) * GRID_STEP;
  }

  function snapRectToGrid(rect) {
    if (!isGridOn()) return rect;
    if (gridSnapManager) {
      const snapped = gridSnapManager.snapPointToGrid({ x: rect.x, y: rect.y });
      return {
        x: snapped.x,
        y: snapped.y,
        w: Math.max(2, rect.w),
        h: Math.max(2, rect.h),
      };
    }
    return {
      x: snapToGridValue(rect.x),
      y: snapToGridValue(rect.y),
      w: Math.max(2, snapToGridValue(rect.w)),
      h: Math.max(2, snapToGridValue(rect.h)),
    };
  }

  function computeSnapCandidates(movingId) {
    const { w: pageW, h: pageH } = getStageSize();
    const xs = new Set([0, pageW / 2, pageW]);
    const ys = new Set([0, pageH / 2, pageH]);

    // Grid snap candidates (Corel-like precision)
    if (isGridOn()) {
      for (let x = 0; x <= pageW; x += GRID_STEP) xs.add(x);
      for (let y = 0; y <= pageH; y += GRID_STEP) ys.add(y);
    }

    // Ruler snap candidates
    const rulerStep = getRulerStep();
    for (let x = 0; x <= pageW; x += rulerStep) xs.add(x);
    for (let y = 0; y <= pageH; y += rulerStep) ys.add(y);

    for (const n of state.doc.elements) {
      if (n.id === movingId) continue;
      xs.add(n.x);
      xs.add(n.x + n.w / 2);
      xs.add(n.x + n.w);
      ys.add(n.y);
      ys.add(n.y + n.h / 2);
      ys.add(n.y + n.h);
    }
    return { xs: Array.from(xs), ys: Array.from(ys), pageW, pageH };
  }

  function snapRect(id, rect) {
    // Use GridSnapManager if available
    if (gridSnapManager) {
      // Update guidelines from state
      const guidelines = (state.guidelines || []).map(g => ({
        id: g.id,
        axis: g.axis,
        position: g.pos
      }));
      gridSnapManager.guidelines = guidelines;

      // Update objects list for object-to-object snapping
      const objects = state.doc.elements
        .filter(n => n.id !== id)
        .map(n => ({ id: n.id, x: n.x, y: n.y, w: n.w, h: n.h }));
      gridSnapManager.updateObjects(objects);

      // Get the moving object
      const movingObject = getNode(id);

      // Apply snap with GridSnapManager
      const snapResult = gridSnapManager.snapRect(rect, movingObject);

      // Update visual snap indicators
      gridSnapManager.updateSnapIndicators(snapResult);

      // Update state and guides
      state.snap.x = snapResult.snapX;
      state.snap.y = snapResult.snapY;
      guideV.classList.toggle("is-on", snapResult.snapX !== null);
      guideH.classList.toggle("is-on", snapResult.snapY !== null);
      if (snapResult.snapX !== null) guideV.style.left = px(snapResult.snapX);
      if (snapResult.snapY !== null) guideH.style.top = px(snapResult.snapY);

      return {
        x: snapResult.x,
        y: snapResult.y,
        w: snapResult.w,
        h: snapResult.h,
      };
    }

    // Fallback to legacy snapping
    const { xs, ys } = computeSnapCandidates(id);
    const edgesX = [rect.x, rect.x + rect.w / 2, rect.x + rect.w];
    const edgesY = [rect.y, rect.y + rect.h / 2, rect.y + rect.h];

    const threshold = SNAP_PX / (view.zoom || 1);

    let snapX = null;
    let snapY = null;
    let dxBest = 0;
    let dyBest = 0;

    // find closest match for any edge/center
    for (const x of xs) {
      for (const ex of edgesX) {
        const d = x - ex;
        if (Math.abs(d) <= threshold && (snapX === null || Math.abs(d) < Math.abs(dxBest))) {
          snapX = x;
          dxBest = d;
        }
      }
    }
    for (const y of ys) {
      for (const ey of edgesY) {
        const d = y - ey;
        if (Math.abs(d) <= threshold && (snapY === null || Math.abs(d) < Math.abs(dyBest))) {
          snapY = y;
          dyBest = d;
        }
      }
    }

    state.snap.x = snapX;
    state.snap.y = snapY;
    guideV.classList.toggle("is-on", snapX !== null);
    guideH.classList.toggle("is-on", snapY !== null);
    if (snapX !== null) guideV.style.left = px(snapX);
    if (snapY !== null) guideH.style.top = px(snapY);

    return {
      x: rect.x + (snapX !== null ? dxBest : 0),
      y: rect.y + (snapY !== null ? dyBest : 0),
      w: rect.w,
      h: rect.h,
    };
  }

  function clearSnapGuides() {
    state.snap.x = null;
    state.snap.y = null;
    guideV.classList.remove("is-on");
    guideH.classList.remove("is-on");
    if (gridSnapManager) {
      gridSnapManager.hideSnapIndicators();
    }
  }

  // =========================
  // Drag & resize
  // =========================
  function startDrag(e, id) {
    const node = getNode(id);
    if (!node || node.locked || node.hidden) return;
    history.markBefore("move");
    const p = getPointerPosInStage(e);
    state.drag = {
      id,
      mode: "move",
      start: p,
      origin: { x: node.x, y: node.y, w: node.w, h: node.h },
      handle: null,
    };
    stage.setPointerCapture?.(e.pointerId);
  }

  function startResize(e, handle) {
    const node = getSelectedNode();
    if (!node || node.locked || node.hidden) return;
    history.markBefore("resize");
    const p = getPointerPosInStage(e);

    const s = node.style || {};
    const rotateDeg = Number(s.rotate || 0);
    const skewDeg = Number(s.skew || 0);
    const rotateRad = (rotateDeg * Math.PI) / 180;
    const cx = node.x + node.w / 2;
    const cy = node.y + node.h / 2;
    const hw = node.w / 2;
    const hh = node.h / 2;
    const handleToLocal = {
      nw: { x: -hw, y: -hh },
      n: { x: 0, y: -hh },
      ne: { x: hw, y: -hh },
      e: { x: hw, y: 0 },
      se: { x: hw, y: hh },
      s: { x: 0, y: hh },
      sw: { x: -hw, y: hh },
      w: { x: -hw, y: 0 },
    };
    const opposite = {
      nw: "se",
      n: "s",
      ne: "sw",
      e: "w",
      se: "nw",
      s: "n",
      sw: "ne",
      w: "e",
    };

    const startLocal = handleToLocal[handle] || { x: hw, y: hh };
    const anchorLocal = handleToLocal[opposite[handle] || "nw"] || { x: -hw, y: -hh };
    state.drag = {
      id: node.id,
      mode: "resize",
      handle,
      start: p,
      origin: { x: node.x, y: node.y, w: node.w, h: node.h },
      rotateRad,
      skewDeg,
      originCenter: { x: cx, y: cy },
      startLocal,
      anchorLocal,
    };
    stage.setPointerCapture?.(e.pointerId);
  }

  function startRotate(e) {
    const node = getSelectedNode();
    if (!node || node.locked || node.hidden) return;
    history.markBefore("rotate");
    const p = getPointerPosInStage(e);
    const cx = node.x + node.w / 2;
    const cy = node.y + node.h / 2;
    const startAngle = Math.atan2(p.y - cy, p.x - cx);
    const baseRotate = Number(node.style?.rotate || 0);
    state.drag = {
      id: node.id,
      mode: "rotate",
      start: p,
      center: { x: cx, y: cy },
      startAngle,
      baseRotate,
    };
    stage.setPointerCapture?.(e.pointerId);
  }

  function startArtboardResize(e, handle) {
    if (state.doc.page.locked) return;
    history.markBefore("artboard:resize");
    state.artboardDrag = {
      handle,
      start: getPointerPosInStage(e),
      startSize: getStageSize(),
    };
    stage.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (state.gridDrag) {
      const dx = e.clientX - state.gridDrag.startClient.x;
      const dy = e.clientY - state.gridDrag.startClient.y;
      view.gridOffset = {
        x: state.gridDrag.startOffset.x + dx,
        y: state.gridDrag.startOffset.y + dy,
      };
      renderRulers();
      saveUI();
      return;
    }
    if (state.artboardMove) {
      const dx = e.clientX - state.artboardMove.startClient.x;
      const dy = e.clientY - state.artboardMove.startClient.y;
      const dist = Math.hypot(dx, dy);
      const DRAG_THRESHOLD = 3;
      if (!state.artboardMove.moved && dist < DRAG_THRESHOLD) return;
      state.artboardMove.moved = true;
      const nextOffset = {
        x: state.artboardMove.startOffset.x + dx,
        y: state.artboardMove.startOffset.y + dy,
      };
      state.doc.page.offset = clampArtboardOffset(nextOffset);
      applyArtboardOffset();
      renderRulers();
      return;
    }
    if (state.artboardDrag) {
      const { handle, start, startSize } = state.artboardDrag;
      const p = getPointerPosInStage(e);
      const dx = p.x - start.x;
      const dy = p.y - start.y;
      const ratio = getA4Ratio();

      const signX = handle.includes("w") ? -1 : 1;
      const signY = handle.includes("n") ? -1 : 1;
      const useWidth = Math.abs(dx) >= Math.abs(dy);

      let nextW = startSize.w;
      let nextH = startSize.h;
      if (useWidth) {
        nextW = startSize.w + signX * dx;
        nextH = nextW / ratio;
      } else {
        nextH = startSize.h + signY * dy;
        nextW = nextH * ratio;
      }

      setArtboardSizePx(nextW, nextH, { scaleContents: true });
      applyPage();
      for (let i = 0; i < state.doc.elements.length; i++) {
        renderNode(state.doc.elements[i], i + 1);
      }
      renderGuidelines();
      renderArtboardOverlay();
      renderArtboardControls();
      refreshSelectionOverlay();
      renderRulers();
      return;
    }
    // Pending click -> convert to drag only after a small threshold (Figma-like).
    if (!state.drag && state.pendingDrag) {
      const dx = e.clientX - state.pendingDrag.startClient.x;
      const dy = e.clientY - state.pendingDrag.startClient.y;
      const dist = Math.hypot(dx, dy);
      const DRAG_THRESHOLD = 3;
      if (dist >= DRAG_THRESHOLD) {
        const node = getNode(state.pendingDrag.id);
        if (node && !node.locked && !node.hidden) {
          history.markBefore("move");
          state.drag = {
            id: state.pendingDrag.id,
            mode: "move",
            start: state.pendingDrag.startStage,
            origin: state.pendingDrag.origin,
            handle: null,
          };
        }
        state.pendingDrag = null;
      } else {
        return;
      }
    }

    if (!state.drag) return;
    const node = getNode(state.drag.id);
    if (!node) return;

    const p = getPointerPosInStage(e);
    const dx = p.x - state.drag.start.x;
    const dy = p.y - state.drag.start.y;

    if (state.drag.mode === "move") {
      const rect = {
        x: state.drag.origin.x + dx,
        y: state.drag.origin.y + dy,
        w: state.drag.origin.w,
        h: state.drag.origin.h,
      };
      if (e.shiftKey) {
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        if (adx > ady) rect.y = state.drag.origin.y;
        else rect.x = state.drag.origin.x;
      }
      // Use GridSnapManager for enhanced snapping (grid + guidelines + object-to-object)
      const snapped = snapRect(node.id, rect);
      node.x = snapped.x;
      node.y = snapped.y;
    } else if (state.drag.mode === "resize") {
      const h = state.drag.handle;
      let { x, y, w, h: hh } = state.drag.origin;
      const minW = node.type === "line" ? 20 : 30;
      const minH = node.type === "line" ? 2 : 20;

      const rotateRad = Number(state.drag.rotateRad || 0);
      const skewDeg = Number(state.drag.skewDeg || 0);
      const canRotResize = Math.abs(rotateRad) > 1e-4 && Math.abs(skewDeg) < 1e-4;
      if (canRotResize) {
        const pNow = getPointerPosInStage(e);
        const dxW = pNow.x - state.drag.start.x;
        const dyW = pNow.y - state.drag.start.y;
        const cos = Math.cos(-rotateRad);
        const sin = Math.sin(-rotateRad);
        const dxL = dxW * cos - dyW * sin;
        const dyL = dxW * sin + dyW * cos;

        const origin = state.drag.origin;
        const originCenter = state.drag.originCenter || { x: origin.x + origin.w / 2, y: origin.y + origin.h / 2 };
        const hw0 = origin.w / 2;
        const hh0 = origin.h / 2;
        const startLocal = state.drag.startLocal || { x: hw0, y: hh0 };
        let anchorLocal = state.drag.anchorLocal || { x: -hw0, y: -hh0 };

        if (e.ctrlKey) anchorLocal = { x: -startLocal.x, y: -startLocal.y };

        const nextMoving = { x: startLocal.x, y: startLocal.y };
        if (h.includes("e") || h.includes("w")) nextMoving.x = startLocal.x + dxL;
        if (h.includes("n") || h.includes("s")) nextMoving.y = startLocal.y + dyL;
        if (h === "n" || h === "s") nextMoving.x = 0;
        if (h === "e" || h === "w") nextMoving.y = 0;

        if (node.lockRatio || e.shiftKey) {
          const ratio = origin.w / origin.h;
          const dw = Math.abs(nextMoving.x - anchorLocal.x);
          const dh = Math.abs(nextMoving.y - anchorLocal.y);
          if (dw >= dh) {
            const sy = nextMoving.y >= anchorLocal.y ? 1 : -1;
            const target = Math.max(minH, dw / ratio);
            nextMoving.y = anchorLocal.y + sy * target;
          } else {
            const sx = nextMoving.x >= anchorLocal.x ? 1 : -1;
            const target = Math.max(minW, dh * ratio);
            nextMoving.x = anchorLocal.x + sx * target;
          }
        }

        const nextW = Math.max(minW, Math.abs(nextMoving.x - anchorLocal.x));
        const nextH = Math.max(minH, Math.abs(nextMoving.y - anchorLocal.y));
        const sx = nextMoving.x >= anchorLocal.x ? 1 : -1;
        const sy = nextMoving.y >= anchorLocal.y ? 1 : -1;
        const movingFixed = { x: anchorLocal.x + sx * nextW, y: anchorLocal.y + sy * nextH };

        const centerLocal = { x: (anchorLocal.x + movingFixed.x) / 2, y: (anchorLocal.y + movingFixed.y) / 2 };
        const cosW = Math.cos(rotateRad);
        const sinW = Math.sin(rotateRad);
        const centerWorld = {
          x: originCenter.x + centerLocal.x * cosW - centerLocal.y * sinW,
          y: originCenter.y + centerLocal.x * sinW + centerLocal.y * cosW,
        };

        const rect = snapRect(node.id, {
          x: centerWorld.x - nextW / 2,
          y: centerWorld.y - nextH / 2,
          w: nextW,
          h: nextH,
        });
        // GridSnapManager already handles grid snap in snapRect
        node.x = rect.x;
        node.y = rect.y;
        node.w = rect.w;
        node.h = rect.h;
      } else {

      const applyW = (nw) => (w = Math.max(minW, nw));
      const applyH = (nh) => (hh = Math.max(minH, nh));

      if (h.includes("e")) applyW(state.drag.origin.w + dx);
      if (h.includes("s")) applyH(state.drag.origin.h + dy);
      if (h.includes("w")) {
        const nw = state.drag.origin.w - dx;
        const nx = state.drag.origin.x + dx;
        if (nw >= minW) {
          w = nw;
          x = nx;
        }
      }
      if (h.includes("n")) {
        const nh = state.drag.origin.h - dy;
        const ny = state.drag.origin.y + dy;
        if (nh >= minH) {
          hh = nh;
          y = ny;
        }
      }

      if (node.lockRatio || e.shiftKey) {
        const ratio = state.drag.origin.w / state.drag.origin.h;
        const dw = Math.abs(w - state.drag.origin.w);
        const dh = Math.abs(hh - state.drag.origin.h);
        if (dw >= dh) {
          hh = Math.max(minH, w / ratio);
        } else {
          w = Math.max(minW, hh * ratio);
        }

        if (h.includes("w")) {
          x = state.drag.origin.x + (state.drag.origin.w - w);
        }
        if (h.includes("n")) {
          y = state.drag.origin.y + (state.drag.origin.h - hh);
        }
      }
      if (e.ctrlKey) {
        x = state.drag.origin.x + (state.drag.origin.w - w) / 2;
        y = state.drag.origin.y + (state.drag.origin.h - hh) / 2;
      }
      const rect = snapRect(node.id, { x, y, w, h: hh });
      // GridSnapManager already handles grid snap in snapRect
      node.x = rect.x;
      node.y = rect.y;
      node.w = rect.w;
      node.h = rect.h;
      }
    } else if (state.drag.mode === "rotate") {
      const angle = Math.atan2(p.y - state.drag.center.y, p.x - state.drag.center.x);
      const delta = angle - state.drag.startAngle;
      let next = state.drag.baseRotate + (delta * 180) / Math.PI;
      if (e.shiftKey) next = Math.round(next / 15) * 15;
      node.style.rotate = Math.round(next * 100) / 100;
    }

    renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
    refreshSelectionOverlay();
    renderLayers();
    renderProps();
  }

  function endPointer(e) {
    if (state.gridDrag) {
      viewport?.releasePointerCapture?.(e.pointerId);
      viewport.style.cursor = "";
      state.gridDrag = null;
      return;
    }
    if (state.artboardMove) {
      stage.releasePointerCapture?.(e.pointerId);
      const moved = state.artboardMove.moved;
      state.artboardMove = null;
      if (moved) {
        history.commit();
        saveDoc(state.doc);
      } else {
        history.discard();
      }
      selectArtboard();
      return;
    }
    if (state.artboardDrag) {
      stage.releasePointerCapture?.(e.pointerId);
      state.artboardDrag = null;
      history.commit();
      saveDoc(state.doc);
      renderAll();
      return;
    }
    if (state.drag) {
      stage.releasePointerCapture?.(e.pointerId);
      state.drag = null;
      clearSnapGuides();
      history.commit();
      saveDoc(state.doc);
      return;
    }

    // Click without drag: allow "click selected text to edit" (no extra panel).
    if (state.pendingDrag && state.pendingDrag.pointerId === e.pointerId) {
      stage.releasePointerCapture?.(e.pointerId);
      const { id, wasSelected, isText } = state.pendingDrag;
      state.pendingDrag = null;
      if (wasSelected && isText) startTextEdit(id);
    }
  }

  // =========================
  // Actions (add, delete, arrange)
  // =========================
  function addText(preset) {
    history.markBefore("add:text");
    const id = `t_${nowId()}`;
    const base = {
      id,
      type: "text",
      text: "New text",
      x: 200,
      y: 200,
      w: 520,
      h: 40,
      guidelines: [],
      guideDrag: null,
      style: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 18,
        fontWeight: 500,
        letterSpacing: 0,
        color: "#111827",
        textAlign: "left",
      },
    };
    if (preset === "title") {
      base.name = "Title";
      base.text = "Title";
      base.style.fontSize = 34;
      base.style.fontWeight = 700;
      base.style.textAlign = "center";
      base.style.letterSpacing = 2;
      base.w = 760;
      base.x = 180;
    } else if (preset === "subtitle") {
      base.name = "Subtitle";
      base.text = "Subtitle";
      base.style.fontSize = 18;
      base.style.color = "#6b7280";
      base.style.textAlign = "center";
      base.w = 640;
      base.x = 240;
    } else if (preset === "body") {
      base.name = "Body text";
      base.text = "Body text";
      base.style.fontSize = 15;
      base.style.fontWeight = 400;
      base.w = 680;
      base.h = 90;
      base.style.textAlign = "center";
    } else {
      base.name = "Text";
    }
    ensureFontLoaded(base.style.fontFamily);
    state.doc.elements.push(base);
    history.commit();
    saveDoc(state.doc);
    renderAll();
    select(id);
    startTextEdit(id);
  }

  function addRect() {
    history.markBefore("add:rect");
    const id = `r_${nowId()}`;
    state.doc.elements.push({
      id,
      name: "Rectangle",
      type: "rect",
      x: 220,
      y: 220,
      w: 240,
      h: 120,
      style: {
        fill: "rgba(37, 99, 235, 0.08)",
        stroke: "rgba(37, 99, 235, 0.25)",
      },
    });
    history.commit();
    renderAll();
    select(id);
  }

  function addLine() {
    history.markBefore("add:line");
    const id = `l_${nowId()}`;
    state.doc.elements.push({
      id,
      name: "Line",
      type: "line",
      x: 260,
      y: 260,
      w: 320,
      h: 2,
      style: { color: "rgba(15,23,42,0.25)" },
    });
    history.commit();
    saveDoc(state.doc);
    renderAll();
    select(id);
  }

  function addCircle() {
    history.markBefore("add:circle");
    const id = `c_${nowId()}`;
    state.doc.elements.push({
      id,
      name: "Circle",
      type: "ellipse",
      x: 240,
      y: 240,
      w: 140,
      h: 140,
      lockRatio: true,
      style: {
        fill: "rgba(37, 99, 235, 0.08)",
        stroke: "rgba(37, 99, 235, 0.3)",
        strokeWidth: 1,
      },
    });
    history.commit();
    saveDoc(state.doc);
    renderAll();
    select(id);
  }

  function addTriangle() {
    history.markBefore("add:triangle");
    const id = `tri_${nowId()}`;
    state.doc.elements.push({
      id,
      name: "Triangle",
      type: "triangle",
      x: 260,
      y: 240,
      w: 160,
      h: 140,
      style: {
        fill: "rgba(37, 99, 235, 0.1)",
        stroke: "rgba(37, 99, 235, 0.35)",
        strokeWidth: 1,
      },
    });
    history.commit();
    saveDoc(state.doc);
    renderAll();
    select(id);
  }

  function addImagePlaceholder() {
    history.markBefore("add:imagePlaceholder");
    const frameId = `ph_${nowId()}`;
    const textId = `pht_${nowId()}`;
    const x = 220;
    const y = 220;
    const w = 320;
    const h = 200;
    state.doc.elements.push(
      {
        id: frameId,
        name: "Image placeholder",
        type: "rect",
        x,
        y,
        w,
        h,
        style: {
          fill: "rgba(148,163,184,0.08)",
          stroke: "rgba(148,163,184,0.5)",
          strokeWidth: 1,
          strokeStyle: "dashed",
        },
      },
      {
        id: textId,
        name: "Placeholder label",
        type: "text",
        text: "Image",
        x,
        y: y + h / 2 - 12,
        w,
        h: 24,
        style: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 1,
          color: "#64748b",
          textAlign: "center",
        },
      }
    );
    history.commit();
    renderAll();
    select(frameId);
  }

  function addSealIcon() {
    history.markBefore("add:sealIcon");
    const outerId = `seal_${nowId()}`;
    const innerId = `seal_inner_${nowId()}`;
    const x = 260;
    const y = 220;
    const size = 120;
    state.doc.elements.push(
      {
        id: outerId,
        name: "Certificate seal",
        type: "ellipse",
        x,
        y,
        w: size,
        h: size,
        lockRatio: true,
        style: {
          fill: "rgba(15,23,42,0.06)",
          stroke: "rgba(15,23,42,0.45)",
          strokeWidth: 1,
        },
      },
      {
        id: innerId,
        name: "Seal ring",
        type: "ellipse",
        x: x + 14,
        y: y + 14,
        w: size - 28,
        h: size - 28,
        lockRatio: true,
        style: {
          fill: "rgba(255,255,255,0)",
          stroke: "rgba(15,23,42,0.45)",
          strokeWidth: 1,
        },
      }
    );
    history.commit();
    renderAll();
    select(outerId);
  }

  async function addImageFromFile(file) {
    history.markBefore("add:image");
    const id = `img_${nowId()}`;
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });
    state.doc.elements.push({
      id,
      name: file.name || "Image",
      type: "image",
      src: url,
      x: 240,
      y: 240,
      w: 320,
      h: 200,
      style: {},
    });
    history.commit();
    renderAll();
    select(id);
  }

  async function replaceSelectedImage(file) {
    const node = getSelectedNode();
    if (!node || node.type !== "image") return;
    history.markBefore("replace:image");
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });
    node.src = url;
    history.commit();
    renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
  }

  function deleteSelected() {
    const node = getSelectedNode();
    if (!node) return;
    history.markBefore("delete");
    state.doc.elements = state.doc.elements.filter((n) => n.id !== node.id);
    state.selectionId = null;
    history.commit();
    saveDoc(state.doc);
    renderAll();
  }

  function moveLayer(id, dir) {
    const idx = state.doc.elements.findIndex((n) => n.id === id);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= state.doc.elements.length) return;
    history.markBefore("arrange");
    const arr = state.doc.elements;
    const [item] = arr.splice(idx, 1);
    arr.splice(next, 0, item);
    history.commit();
    saveDoc(state.doc);
    renderAll();
    select(id);
  }

  function alignSelected(where) {
    const node = getSelectedNode();
    if (!node) return;
    const { w: pageW, h: pageH } = getStageSize();

    history.markBefore("align");
    if (where === "left") node.x = 40;
    if (where === "center") node.x = Math.round(pageW / 2 - node.w / 2);
    if (where === "right") node.x = Math.round(pageW - node.w - 40);
    if (where === "top") node.y = 40;
    if (where === "middle") node.y = Math.round(pageH / 2 - node.h / 2);
    if (where === "bottom") node.y = Math.round(pageH - node.h - 40);
    history.commit();
    saveDoc(state.doc);

    renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
    renderLayers();
    renderProps();
    refreshSelectionOverlay();
  }

  function applyPanelState() {
    if (leftAside) {
      leftAside.classList.toggle("is-collapsed", !isLeftPanelOpen);
      leftAside.setAttribute("aria-expanded", isLeftPanelOpen.toString());
    }
    if (rightAside) {
      rightAside.classList.toggle("is-collapsed", !isRightPanelOpen);
      rightAside.setAttribute("aria-expanded", isRightPanelOpen.toString());
    }
    if (rightLauncher) {
      rightLauncher.setAttribute("aria-expanded", isRightPanelOpen.toString());
      rightLauncher.classList.toggle("is-active", isRightPanelOpen);
    }
    renderRulers();
  }

  function setPanelVisibility(side, shouldOpen) {
    function animateRulersDuringPanelTransition(durationMs = 280) {
      if (!viewport?.classList.contains("pf-ruler-on")) return;
      const start = performance.now();
      const tick = () => {
        renderRulers();
        if (performance.now() - start < durationMs) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    }

    if (side === "left") {
      isLeftPanelOpen = !!shouldOpen;
      applyPanelState();
      if (typeof saveUI === 'function') saveUI();
      animateRulersDuringPanelTransition();
      requestAnimationFrame(() => fitToScreen());
    } else if (side === "right") {
      isRightPanelOpen = !!shouldOpen;
      applyPanelState();
      if (typeof saveUI === 'function') saveUI();
      animateRulersDuringPanelTransition();
      if (!isRightPanelOpen) {
        state.rightMode = "props";
        if (typeof renderRightMode === 'function') renderRightMode();
        if (typeof renderProps === 'function') renderProps();
      }
    }
  }

  function openPanel(side) {
    setPanelVisibility(side, true);
  }

  function closePanel(side) {
    setPanelVisibility(side, false);
  }

  function togglePanel(side) {
    if (side === "left") {
      setPanelVisibility("left", !isLeftPanelOpen);
    } else if (side === "right") {
      setPanelVisibility("right", !isRightPanelOpen);
    }
  }

  function toggleUiButton(button, { onLabel, offLabel } = {}) {
    if (!button) return false;
    const isPressed = button.getAttribute("aria-pressed") === "true";
    const next = !isPressed;
    button.setAttribute("aria-pressed", next ? "true" : "false");
    if (onLabel && offLabel) button.textContent = next ? onLabel : offLabel;
    return next;
  }

  const actionHandlers = {
    "history:undo": () => history.undo(),
    "history:redo": () => history.redo(),
    "file:new": () => {
      if (!confirm("Create a new document? Unsaved changes will be lost.")) return;
      state.doc = createInitialDoc();
      normalizeDoc(state.doc);
      // Do not call fitToScreen or change zoom on restart
      renderAll();
      setSavedUI(false);
    },
    "file:import": () => {
      document.querySelector("[data-file-import]")?.click();
    },
    "file:share": async () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}`;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareUrl);
          alert("Share link copied.");
        } else {
          prompt("Copy share link:", shareUrl);
        }
      } catch {
        prompt("Copy share link:", shareUrl);
      }
    },
    "view:zoomIn": () => {
      view.zoom = clamp(view.zoom + 0.1, 0.25, 3);
      applyZoom();
    },
    "view:zoomOut": () => {
      view.zoom = clamp(view.zoom - 0.1, 0.25, 3);
      applyZoom();
    },
    "view:zoom100": () => {
      view.zoom = 1;
      applyZoom();
    },
    "view:zoom70": () => {
      view.zoom = 0.7;
      applyZoom();
    },
    "view:fit": () => {
      fitToScreen();
    },
    "view:gridToggle": (el) => {
      const enabled = toggleUiButton(el);
      // Only show grid when button is active
      if (enabled) {
        stage?.classList.remove("pf-grid-off");
        viewport?.classList.add("pf-grid-on");
      } else {
        stage?.classList.add("pf-grid-off");
        viewport?.classList.remove("pf-grid-on");
      }
      renderRulers();
    },
    "view:rulerToggle": (el) => {
      const enabled = toggleUiButton(el);
      viewport?.classList.toggle("pf-ruler-on", enabled);
      renderRulers();
    },
    "file:showExportModal": () => {
      showExportModal();
    },
    "file:exportPdf": async () => {
      saveDoc(state.doc);
      await exportPdf();
    },
    "file:exportPng": async () => {
      saveDoc(state.doc);
      await exportPng();
    },
    "file:exportJpg": async () => {
      saveDoc(state.doc);
      await exportJpg();
    },
    "file:exportSvg": async () => {
      saveDoc(state.doc);
      await exportSvg();
    },
    "file:saveDoc": () => {
      saveDoc(state.doc);
      setSavedUI(true);
    },
    "page:landscape": () => {
      history.markBefore("orientation");
      const { w, h } = getStageSize();
      state.doc.page.orientation = "landscape";
      setArtboardSizePx(Math.max(w, h), Math.min(w, h), { scaleContents: true });
      history.commit();
      renderAll();
    },
    "page:portrait": () => {
      history.markBefore("orientation");
      const { w, h } = getStageSize();
      state.doc.page.orientation = "portrait";
      setArtboardSizePx(Math.min(w, h), Math.max(w, h), { scaleContents: true });
      history.commit();
      renderAll();
    },
    "artboard:toggleLock": () => {
      history.markBefore("artboard:lock");
      state.doc.page.locked = !state.doc.page.locked;
      history.commit();
      renderArtboardOverlay();
      renderArtboardControls();
    },
    "add:text": (el) => addText(el?.dataset?.preset),
    "add:rect": () => addRect(),
    "add:line": () => addLine(),
    "add:circle": () => addCircle(),
    "add:triangle": () => addTriangle(),
    "add:imagePlaceholder": () => addImagePlaceholder(),
    "add:sealIcon": () => addSealIcon(),
    "node:delete": () => deleteSelected(),
    "node:duplicate": () => {
      const node = getSelectedNode();
      if (!node) return;
      history.markBefore("duplicate");
      const newId = duplicateNode(node);
      history.commit();
      renderAll();
      select(newId);
    },
    "node:lock": () => {
      const node = getSelectedNode();
      if (!node) return;
      history.markBefore("lock");
      node.locked = !node.locked;
      history.commit();
      renderAll();
      renderProps();
    },
    "align:left": () => alignSelected("left"),
    "align:center": () => alignSelected("center"),
    "align:right": () => alignSelected("right"),
    "align:top": () => alignSelected("top"),
    "align:middle": () => alignSelected("middle"),
    "align:bottom": () => alignSelected("bottom"),
    "distribute:h": () => {
      // Placeholder for future multi-select distribution
    },
    "distribute:v": () => {
      // Placeholder for future multi-select distribution
    },
    "layer:forward": () => {
      if (state.selectionId) moveLayer(state.selectionId, +1);
    },
    "layer:backward": () => {
      if (state.selectionId) moveLayer(state.selectionId, -1);
    },
    "text:alignLeft": () => setTextAlign("left"),
    "text:alignCenter": () => setTextAlign("center"),
    "text:alignRight": () => setTextAlign("right"),
    "transform:reset": () => {
      const node = getSelectedNode();
      if (!node) return;
      history.markBefore("transform");
      node.style.rotate = 0;
      node.style.skew = 0;
      node.style.scale = 100;
      node.style.flipX = false;
      node.style.flipY = false;
      history.commit();
      renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
      renderProps();
      refreshSelectionOverlay();
    },
    "left:collapse": () => closePanel("left"),
    "left:toggle": () => togglePanel("left"),
    "right:collapse": () => closePanel("right"),
    "right:toggle": () => togglePanel("right"),
    "right:avatar": () => {
      state.rightMode = "account";
      openPanel("right");
      renderRightMode();
    },
    "billing:upgrade": () => {
      openUpgradeModal();
    },
    "upgradeModal:close": () => closeUpgradeModal(),
    // Library integrations
    "lib:stripe": () => {
      alert("Stripe.js Integration\n\nInitialize Stripe payment processing:\n\nconst stripe = await StripeManager.init('pk_test_...');\n\nSee console for more details.");
      console.log("Stripe.js Manager:", window.StripeManager);
    },
    "lib:pdfLib": () => {
      alert("PDF-lib Integration\n\nCreate and manipulate PDFs:\n\nconst pdf = await PDFLibManager.createPDF();\nawait PDFLibManager.addPage(pdf);\nawait PDFLibManager.downloadPDF(pdf, 'document.pdf');\n\nSee console for more details.");
      console.log("PDF-lib Manager:", window.PDFLibManager);
    },
    "lib:signature": async () => {
      if (typeof window.SignatureCanvasManager === 'undefined') {
        alert("Signature Canvas library is loading...");
        return;
      }
      try {
        const Component = await window.SignatureCanvasManager.init();
        alert("React Signature Canvas Integration\n\nCreate signature pad:\n\nconst sigRef = React.useRef();\nconst sig = await SignatureCanvasManager.createSignatureCanvas({}, sigRef);\n\nSee console for more details.");
        console.log("Signature Canvas Manager:", window.SignatureCanvasManager);
      } catch (err) {
        alert("Error loading Signature Canvas: " + err.message);
      }
    },
    "lib:qrcode": async () => {
      if (typeof window.QRCodeReactManager === 'undefined') {
        alert("QRCode library is loading...");
        return;
      }
      try {
        await window.QRCodeReactManager.init();
        alert("QRCode.react Integration\n\nGenerate QR codes:\n\nconst qr = await QRCodeReactManager.createQRCode({ value: 'https://example.com', size: 128 }, 'svg');\n\nSee console for more details.");
        console.log("QRCode React Manager:", window.QRCodeReactManager);
      } catch (err) {
        alert("Error loading QRCode: " + err.message);
      }
    },
    "lib:svgjs": () => {
      if (typeof window.SVGJSManager === 'undefined') {
        alert("SVG.js library is not loaded.");
        return;
      }
      alert("SVG.js Integration\n\nCreate and manipulate SVG:\n\nconst drawing = SVGJSManager.createSVG('#container', { width: 800, height: 600 });\nconst rect = SVGJSManager.createRect(drawing, { x: 50, y: 50, width: 100, height: 100 });\n\nSee console for more details.");
      console.log("SVG.js Manager:", window.SVGJSManager);
    },
    "lib:dropzone": () => {
      if (typeof window.ReactDropzoneManager === 'undefined') {
        alert("React Dropzone library is not loaded.");
        return;
      }
      alert("React Dropzone Integration\n\nUse the useDropzone hook or Dropzone component:\n\nconst { getRootProps, getInputProps } = useDropzone({ onDrop });\n\nSee console for more details.");
      console.log("React Dropzone Manager:", window.ReactDropzoneManager);
    },
    "lib:csv": () => {
      if (typeof window.Papa === 'undefined') {
        alert("PapaParse library is not loaded.");
        return;
      }
      alert("PapaParse Integration\n\nParse CSV files:\n\nPapa.parse(file, {\n  header: true,\n  complete: (results) => console.log(results.data)\n});\n\nSee console for more details.");
      console.log("PapaParse:", window.Papa);
    },
    "lib:excel": () => {
      if (typeof window.XLSX === 'undefined') {
        alert("SheetJS library is not loaded.");
        return;
      }
      alert("SheetJS Integration\n\nRead/Write Excel files:\n\nconst workbook = XLSX.read(data, { type: 'binary' });\nconst sheet = workbook.Sheets[workbook.SheetNames[0]];\nconst json = XLSX.utils.sheet_to_json(sheet);\n\nSee console for more details.");
      console.log("SheetJS (XLSX):", window.XLSX);
    },
    "lib:zip": () => {
      if (typeof window.JSZip === 'undefined') {
        alert("JSZip library is not loaded.");
        return;
      }
      alert("JSZip Integration\n\nCreate/Read ZIP files:\n\nconst zip = new JSZip();\nzip.file('hello.txt', 'Hello World');\nconst blob = await zip.generateAsync({ type: 'blob' });\n\nSee console for more details.");
      console.log("JSZip:", window.JSZip);
    },
    "lib:word": async () => {
      if (typeof window.MammothManager === 'undefined') {
        alert("Mammoth.js library is loading...");
        return;
      }
      try {
        await window.MammothManager.init();
        alert("Mammoth.js Integration\n\nConvert Word to HTML:\n\nconst result = await MammothManager.convertToHtml(file);\nconsole.log(result.value); // HTML string\n\nSee console for more details.");
        console.log("Mammoth Manager:", window.MammothManager);
      } catch (err) {
        alert("Error loading Mammoth.js: " + err.message);
      }
    },
  };

  // =========================
  // Export PDF (legacy backend payload)
  // =========================
  function getTextById(id, fallback = "") {
    const n = getNode(id);
    if (!n || n.type !== "text") return fallback;
    return (n.text || "").trim() || fallback;
  }

  function getTextStyleById(id, fallback = {}) {
    const n = getNode(id);
    if (!n || n.type !== "text") return fallback;
    const s = n.style || {};
    return {
      fontFamily: s.fontFamily || "",
      fontSize: Number(s.fontSize || 14),
      color: s.color || "#111827",
      fontWeight: String(s.fontWeight || "400"),
      letterSpacing: Number(s.letterSpacing || 0),
      align: s.textAlign || "center",
    };
  }

  async function exportPdf() {
    try {
      console.log('PDF export funksiyasi chaqirildi');
      console.log('Document elements:', state.doc.elements?.length || 0);
      
      const payload = {
        title: getTextById("title", "CERTIFICATE"),
        subtitle: getTextById("subtitle", "of participation"),
        name: getTextById("name", "Name Surname"),
        body: getTextById("body", ""),
        signatureLabel: getTextById("signature", "Signature"),

        orientation: state.doc.page.orientation || "landscape",
        // Backend A4 o'lchamlarini o'zi hisoblaydi
        titleStyle: getTextStyleById("title"),
        subStyle: getTextStyleById("subtitle"),
        nameStyle: getTextStyleById("name"),
        bodyStyle: getTextStyleById("body"),
      };

      console.log('PDF export - Payload:', JSON.stringify(payload, null, 2));
      console.log('PDF export - API URL:', `${API_BASE_URL}/api/generate-pdf`);

      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/generate-pdf`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/pdf"
          },
          body: JSON.stringify(payload),
        });
      } catch (fetchError) {
        // CORS yoki network xatoliklari
        if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('CORS')) {
          throw new Error('CORS xatoligi: Backend server CORS headerlarini qo\'shmagan. Iltimos, backend sozlamalarini tekshiring yoki backend administratoriga murojaat qiling.');
        }
        throw fetchError;
      }
      
      console.log('PDF export - Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Noma'lum xatolik");
        console.error('PDF export xatosi:', response.status, errorText);
        throw new Error(`PDF yaratishda xatolik (${response.status}): ${errorText.substring(0, 200)}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log('PDF export - Content-Type:', contentType);
      
      if (!contentType || !contentType.includes('application/pdf')) {
        const text = await response.text();
        console.error('PDF export - Not a PDF response:', text.substring(0, 200));
        throw new Error('Server PDF o\'rniga boshqa format qaytardi');
      }
      
      const blob = await response.blob();
      
      if (!blob || blob.size === 0) {
        throw new Error('PDF fayli bo\'sh yoki yaratilmadi');
      }
      
      console.log('PDF export - Blob size:', blob.size, 'bytes');
      
      const url = URL.createObjectURL(blob);
      const random = Math.floor(100000 + Math.random() * 900000);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Gildia_EventAsset_${random}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      
      console.log('PDF export - Muvaffaqiyatli yuklab olindi');
    } catch (error) {
      console.error('PDF export xatosi:', error);
      
      let errorMessage = error.message;
      
      // CORS xatoligini aniqlash
      if (errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch')) {
        errorMessage = 'CORS xatoligi: Backend server frontend\'dan so\'rovlarni qabul qilish uchun sozlash kerak.\n\n' +
          'Muammo: Backend server CORS headerlarini qo\'shmagan.\n\n' +
          'Yechim: Backend kodida quyidagi headerlarni qo\'shing:\n' +
          'Access-Control-Allow-Origin: *\n' +
          'Access-Control-Allow-Methods: POST, GET, OPTIONS\n' +
          'Access-Control-Allow-Headers: Content-Type';
      }
      
      alert('PDF export qilishda xatolik yuz berdi:\n\n' + errorMessage + '\n\nIltimos, console\'ni tekshiring (F12) batafsil ma\'lumot uchun.');
    }
  }

  // PNG export funksiyasi
  async function exportPng(scale = 2) {
    if (typeof html2canvas === 'undefined') {
      alert('html2canvas kutubxonasi yuklanmagan. Iltimos, sahifani yangilang.');
      return;
    }

    try {
      if (!stage) {
        throw new Error('Stage elementi topilmadi');
      }

      const { w: stageW, h: stageH } = getStageSize();

      // Stage elementini canvas'ga aylantirish
      const canvas = await html2canvas(stage, {
        backgroundColor: '#ffffff',
        scale: scale, // Parametr orqali scale
        useCORS: true,
        logging: false,
        width: stageW,
        height: stageH,
        windowWidth: stageW,
        windowHeight: stageH,
      });

      // Canvas'dan blob yaratish
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('PNG yaratishda xatolik');
        }
        const url = URL.createObjectURL(blob);
        const random = Math.floor(100000 + Math.random() * 900000);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Gildia_EventAsset_${random}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('PNG export xatosi:', error);
      alert('PNG export qilishda xatolik yuz berdi: ' + error.message);
    }
  }

  // JPG export funksiyasi
  async function exportJpg(quality = 0.92, scale = 2) {
    if (typeof html2canvas === 'undefined') {
      alert('html2canvas kutubxonasi yuklanmagan. Iltimos, sahifani yangilang.');
      return;
    }

    try {
      if (!stage) {
        throw new Error('Stage elementi topilmadi');
      }

      const { w: stageW, h: stageH } = getStageSize();

      // Stage elementini canvas'ga aylantirish
      const canvas = await html2canvas(stage, {
        backgroundColor: '#ffffff',
        scale: scale, // Parametr orqali scale
        useCORS: true,
        logging: false,
        width: stageW,
        height: stageH,
        windowWidth: stageW,
        windowHeight: stageH,
      });

      // Canvas'dan blob yaratish (JPG formatida)
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('JPG yaratishda xatolik');
        }
        const url = URL.createObjectURL(blob);
        const random = Math.floor(100000 + Math.random() * 900000);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Gildia_EventAsset_${random}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, 'image/jpeg', quality);
    } catch (error) {
      console.error('JPG export xatosi:', error);
      alert('JPG export qilishda xatolik yuz berdi: ' + error.message);
    }
  }

  // SVG export funksiyasi
  async function exportSvg() {
    try {
      if (!stage) {
        throw new Error('Stage elementi topilmadi');
      }

      // Stage o'lchamlari (A4 formatida)
      const { w: stageWidth, h: stageHeight } = getStageSize();

      // SVG elementini yaratish (A4 nisbatini saqlash)
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', stageWidth.toString());
      svg.setAttribute('height', stageHeight.toString());
      svg.setAttribute('viewBox', `0 0 ${stageWidth} ${stageHeight}`);
      // A4 formatini saqlash uchun preserveAspectRatio qo'shish
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      // Background
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('width', '100%');
      bg.setAttribute('height', '100%');
      bg.setAttribute('fill', '#ffffff');
      svg.appendChild(bg);

      // Barcha elementlarni SVG'ga konvertatsiya qilish
      const elements = state.doc.elements || [];
      for (const node of elements) {
        if (node.hidden) continue;

        if (node.type === 'text') {
          const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          textEl.setAttribute('x', node.x.toString());
          textEl.setAttribute('y', (node.y + (node.style?.fontSize || 14)).toString());
          textEl.setAttribute('font-family', node.style?.fontFamily || 'Arial, sans-serif');
          textEl.setAttribute('font-size', (node.style?.fontSize || 14).toString());
          textEl.setAttribute('font-weight', node.style?.fontWeight || '400');
          textEl.setAttribute('fill', node.style?.color || '#000000');
          textEl.setAttribute('opacity', ((node.style?.opacity || 100) / 100).toString());
          
          if (node.style?.textAlign) {
            textEl.setAttribute('text-anchor', 
              node.style.textAlign === 'center' ? 'middle' : 
              node.style.textAlign === 'right' ? 'end' : 'start');
          }

          if (node.style?.rotate) {
            textEl.setAttribute('transform', `rotate(${node.style.rotate} ${node.x} ${node.y})`);
          }

          textEl.textContent = node.text || '';
          svg.appendChild(textEl);
        } else if (node.type === 'shape') {
          const shapeType = node.shapeType || 'rect';
          let shapeEl;

          if (shapeType === 'rect' || shapeType === 'rectangle') {
            shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shapeEl.setAttribute('x', node.x.toString());
            shapeEl.setAttribute('y', node.y.toString());
            shapeEl.setAttribute('width', node.w.toString());
            shapeEl.setAttribute('height', node.h.toString());
          } else if (shapeType === 'circle') {
            shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const radius = Math.min(node.w, node.h) / 2;
            shapeEl.setAttribute('cx', (node.x + node.w / 2).toString());
            shapeEl.setAttribute('cy', (node.y + node.h / 2).toString());
            shapeEl.setAttribute('r', radius.toString());
          } else if (shapeType === 'ellipse') {
            shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            shapeEl.setAttribute('cx', (node.x + node.w / 2).toString());
            shapeEl.setAttribute('cy', (node.y + node.h / 2).toString());
            shapeEl.setAttribute('rx', (node.w / 2).toString());
            shapeEl.setAttribute('ry', (node.h / 2).toString());
          }

          if (shapeEl) {
            shapeEl.setAttribute('fill', node.style?.fill || '#ffffff');
            shapeEl.setAttribute('stroke', node.style?.stroke || '#000000');
            shapeEl.setAttribute('stroke-width', (node.style?.strokeWidth || 1).toString());
            shapeEl.setAttribute('opacity', ((node.style?.opacity || 100) / 100).toString());

            if (node.style?.rotate) {
              const centerX = node.x + node.w / 2;
              const centerY = node.y + node.h / 2;
              shapeEl.setAttribute('transform', `rotate(${node.style.rotate} ${centerX} ${centerY})`);
            }

            svg.appendChild(shapeEl);
          }
        } else if (node.type === 'image' && node.imageUrl) {
          const imageEl = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          imageEl.setAttribute('href', node.imageUrl);
          imageEl.setAttribute('x', node.x.toString());
          imageEl.setAttribute('y', node.y.toString());
          imageEl.setAttribute('width', node.w.toString());
          imageEl.setAttribute('height', node.h.toString());
          imageEl.setAttribute('opacity', ((node.style?.opacity || 100) / 100).toString());

          if (node.style?.rotate) {
            const centerX = node.x + node.w / 2;
            const centerY = node.y + node.h / 2;
            imageEl.setAttribute('transform', `rotate(${node.style.rotate} ${centerX} ${centerY})`);
          }

          svg.appendChild(imageEl);
        }
      }

      // SVG'ni string'ga aylantirish
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const random = Math.floor(100000 + Math.random() * 900000);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Gildia_${random}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('SVG export xatosi:', error);
      alert('SVG export qilishda xatolik yuz berdi: ' + error.message);
    }
  }

  // Export Modal funksiyalari
  let currentExportFormat = 'pdf';
  let currentExportParams = {
    png: { scale: 2 },
    jpg: { quality: 92, scale: 2 },
    svg: {},
    pdf: {}
  };

  function showExportModal() {
    const modal = document.querySelector('[data-export-modal]');
    if (!modal) return;
    
    // Default formatni PDF qilish
    currentExportFormat = 'pdf';
    
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Format tanlash - avval barcha listenerlarni olib tashlash
    const formatBtns = modal.querySelectorAll('[data-format]');
    formatBtns.forEach(btn => {
      // Eski listenerlarni olib tashlash
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Yangi listenerlarni qo'shish
    const newFormatBtns = modal.querySelectorAll('[data-format]');
    newFormatBtns.forEach(btn => {
      btn.addEventListener('click', handleFormatSelect);
    });
    
    // Parametrlar o'zgarishi
    const sliders = modal.querySelectorAll('[data-param]');
    sliders.forEach(slider => {
      slider.removeEventListener('input', handleParamChange);
      slider.addEventListener('input', handleParamChange);
    });
    
    // Submit button
    const submitBtn = modal.querySelector('[data-export-submit]');
    if (submitBtn) {
      // Eski event listenerlarni olib tashlash
      const newSubmitBtn = submitBtn.cloneNode(true);
      submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
      
      // Yangi event listener qo'shish
      const newBtn = modal.querySelector('[data-export-submit]');
      newBtn.addEventListener('click', handleExportSubmit);
    }
    
    // Close buttons
    const closeBtns = modal.querySelectorAll('[data-export-modal-close]');
    closeBtns.forEach(btn => {
      btn.onclick = closeExportModal;
    });
    
    // Backdrop click
    const backdrop = modal.querySelector('.pf-export-modal__backdrop');
    if (backdrop) {
      backdrop.onclick = closeExportModal;
    }
    
    // ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeExportModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    updateExportModalUI();
  }

  function closeExportModal() {
    const modal = document.querySelector('[data-export-modal]');
    if (!modal) return;
    
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Event listenerlarni tozalash
    const formatBtns = modal.querySelectorAll('[data-format]');
    formatBtns.forEach(btn => {
      btn.removeEventListener('click', handleFormatSelect);
    });
    
    const sliders = modal.querySelectorAll('[data-param]');
    sliders.forEach(slider => {
      slider.removeEventListener('input', handleParamChange);
    });
  }

  function handleFormatSelect(e) {
    e.preventDefault();
    e.stopPropagation();
    const btn = e.currentTarget;
    const format = btn.getAttribute('data-format');
    if (!format) return;
    
    console.log('Format tanlandi:', format);
    currentExportFormat = format;
    updateExportModalUI();
  }

  function handleParamChange(e) {
    const param = e.target.getAttribute('data-param');
    const value = parseFloat(e.target.value);
    
    if (param === 'png-scale') {
      currentExportParams.png.scale = value;
      const valueEl = document.querySelector(`[data-param-value="${param}"]`);
      if (valueEl) valueEl.textContent = `${value}x`;
    } else if (param === 'jpg-quality') {
      currentExportParams.jpg.quality = value;
      const valueEl = document.querySelector(`[data-param-value="${param}"]`);
      if (valueEl) valueEl.textContent = `${Math.round(value)}%`;
    } else if (param === 'jpg-scale') {
      currentExportParams.jpg.scale = value;
      const valueEl = document.querySelector(`[data-param-value="${param}"]`);
      if (valueEl) valueEl.textContent = `${value}x`;
    }
  }

  function updateExportModalUI() {
    // Format buttonlarini yangilash
    const formatBtns = document.querySelectorAll('[data-format]');
    formatBtns.forEach(btn => {
      const format = btn.getAttribute('data-format');
      const isActive = format === currentExportFormat;
      btn.setAttribute('aria-pressed', isActive);
      btn.classList.toggle('is-active', isActive);
    });
    
    // Parametr guruhlarini ko'rsatish/yashirish
    const paramGroups = document.querySelectorAll('[data-param-group]');
    paramGroups.forEach(group => {
      const format = group.getAttribute('data-param-group');
      group.hidden = format !== currentExportFormat;
    });
    
    // Parametr qiymatlarini yangilash
    if (currentExportFormat === 'png') {
      const scaleSlider = document.querySelector('[data-param="png-scale"]');
      const scaleValue = document.querySelector('[data-param-value="png-scale"]');
      if (scaleSlider) {
        scaleSlider.value = currentExportParams.png.scale;
        if (scaleValue) scaleValue.textContent = `${currentExportParams.png.scale}x`;
      }
    } else if (currentExportFormat === 'jpg') {
      const qualitySlider = document.querySelector('[data-param="jpg-quality"]');
      const qualityValue = document.querySelector('[data-param-value="jpg-quality"]');
      if (qualitySlider) {
        qualitySlider.value = currentExportParams.jpg.quality;
        if (qualityValue) qualityValue.textContent = `${Math.round(currentExportParams.jpg.quality)}%`;
      }
      const scaleSlider = document.querySelector('[data-param="jpg-scale"]');
      const scaleValue = document.querySelector('[data-param-value="jpg-scale"]');
      if (scaleSlider) {
        scaleSlider.value = currentExportParams.jpg.scale;
        if (scaleValue) scaleValue.textContent = `${currentExportParams.jpg.scale}x`;
      }
    }
  }

  async function handleExportSubmit(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const modal = document.querySelector('[data-export-modal]');
    if (!modal || modal.hidden) return;
    
    // Formatni tekshirish
    const activeFormatBtn = modal.querySelector('[data-format].is-active, [data-format][aria-pressed="true"]');
    if (activeFormatBtn) {
      const format = activeFormatBtn.getAttribute('data-format');
      if (format) {
        currentExportFormat = format;
      }
    }
    
    console.log('Export format:', currentExportFormat);
    
    saveDoc(state.doc);
    closeExportModal();
    
    try {
      if (currentExportFormat === 'pdf') {
        console.log('PDF export boshlanmoqda...');
        await exportPdf();
      } else if (currentExportFormat === 'png') {
        await exportPng(currentExportParams.png.scale);
      } else if (currentExportFormat === 'jpg') {
        await exportJpg(currentExportParams.jpg.quality / 100, currentExportParams.jpg.scale);
      } else if (currentExportFormat === 'svg') {
        await exportSvg();
      } else {
        throw new Error('Noma\'lum export format: ' + currentExportFormat);
      }
    } catch (error) {
      console.error('Export xatosi:', error);
      alert('Export qilishda xatolik yuz berdi: ' + error.message);
    }
  }

  // =========================
  // Properties binding
  // =========================
  function setProp(key, value) {
    const node = getSelectedNode();
    if (!node) return;
    if (state.editingId) return;

    if (key === "name") node.name = value || "Layer";
    else if (key === "locked") node.locked = value === true || value === "true" || value === "on";
    else if (key === "hidden") node.hidden = value === true || value === "true" || value === "on";
    else if (key === "fontFamily" && node.type === "text") {
      node.style.fontFamily = value;
      ensureFontLoaded(value);
    }
    else if (key === "fontSize" && node.type === "text") node.style.fontSize = clamp(Number(value || 14), 6, 200);
    else if (key === "fontWeight" && node.type === "text") node.style.fontWeight = String(value || "400");
    else if (key === "lineHeight" && node.type === "text") node.style.lineHeight = Number(value || 1.25);
    else if (key === "letterSpacing" && node.type === "text") node.style.letterSpacing = Number(value || 0);
    else if (key === "color" && node.type === "text") node.style.color = value || "#111827";
    else if (key === "fill" && node.type !== "text") node.style.fill = value || "#ffffff";
    else if (key === "stroke" && node.type !== "text") node.style.stroke = value || "#111827";
    else if (key === "strokeWidth" && node.type !== "text") node.style.strokeWidth = Number(value || 1);
    else if (key === "strokeStyle" && node.type !== "text") node.style.strokeStyle = value || "solid";
    else if (key === "lockRatio") node.lockRatio = Boolean(value);
    else if (key === "opacity") node.style.opacity = clamp(Number(value || 100), 0, 100);
    else if (key === "rotate") node.style.rotate = Number(value || 0);
    else if (key === "skew") node.style.skew = Number(value || 0);
    else if (key === "scale") node.style.scale = clamp(Number(value || 100), 10, 400);
    else if (key === "filter" && node.type === "image") node.style.filter = value || "none";
    else if (key === "shadowOn") node.style.shadowOn = value === true || value === "true" || value === "on";
    else if (key === "shadowX") node.style.shadowX = Number(value || 0);
    else if (key === "shadowY") node.style.shadowY = Number(value || 0);
    else if (key === "shadowBlur") node.style.shadowBlur = Number(value || 0);
    else if (key === "shadowColor") node.style.shadowColor = value || "#000000";
    else if (key === "x") node.x = Number(value || 0);
    else if (key === "y") node.y = Number(value || 0);
    else if (key === "w") {
      const nextW = Math.max(2, Number(value || 2));
      if (node.lockRatio) node.h = Math.max(2, Math.round(node.h * (nextW / node.w)));
      node.w = nextW;
    }
    else if (key === "h") {
      const nextH = Math.max(2, Number(value || 2));
      if (node.lockRatio) node.w = Math.max(2, Math.round(node.w * (nextH / node.h)));
      node.h = nextH;
    }

    if (key === "hidden" && node.hidden && state.selectionId === node.id) {
      clearSelection();
      return;
    }

    renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
    renderLayers();
    renderProps();
    refreshSelectionOverlay();
    
    // O'zgarishlarni avtomatik saqlash
    saveDoc(state.doc);
  }

  function setTextAlign(align) {
    const node = getSelectedNode();
    if (!node || node.type !== "text") return;
    history.markBefore("align");
    node.style.textAlign = align;
    history.commit();
    saveDoc(state.doc);
    renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
    renderProps();
  }

  // =========================
  // Global event wiring
  // =========================
  // Hover + select on canvas
  stage.addEventListener("pointermove", (e) => {
    if (state.drag) return;
    const nodeEl = e.target.closest?.(".pf-node");
    const id = nodeEl?.dataset?.id || null;
    if (id === state.hoverId) return;
    state.hoverId = id;
    for (let i = 0; i < state.doc.elements.length; i++) renderNode(state.doc.elements[i], i + 1);
  });

  stage.addEventListener("pointerleave", () => {
    if (state.drag) return;
    state.hoverId = null;
    for (let i = 0; i < state.doc.elements.length; i++) renderNode(state.doc.elements[i], i + 1);
  });

  stage.addEventListener("pointerdown", (e) => {
    if (state.editingId) {
      const insideEdited = e.target.closest?.(`.pf-node[data-id="${state.editingId}"]`);
      if (!insideEdited) stopTextEdit({ commit: true });
      return;
    }
    const handle = e.target.closest?.("[data-handle]")?.dataset?.handle;
    if (handle) {
      e.preventDefault();
      if (handle === "rotate") startRotate(e);
      else startResize(e, handle);
      return;
    }
    const nodeEl = e.target.closest?.(".pf-node");
    if (view.tool === "hand") return; // pan handled below
    if (!nodeEl) {
      if (e.target.closest?.("[data-stage]")) {
        // Grid drag: Alt+Click or Ctrl+Click on empty stage area
        if ((e.altKey || e.ctrlKey) && e.button === 0 && isGridOn()) {
          e.preventDefault();
          state.gridDrag = {
            pointerId: e.pointerId,
            startClient: { x: e.clientX, y: e.clientY },
            startOffset: { ...(view.gridOffset || { x: 0, y: 0 }) },
          };
          viewport?.setPointerCapture?.(e.pointerId);
          viewport.style.cursor = "grabbing";
          return;
        }
        e.preventDefault();
        selectArtboard();
        if (!state.doc.page.locked && e.button === 0) {
          history.markBefore("artboard:move");
          state.artboardMove = {
            pointerId: e.pointerId,
            startClient: { x: e.clientX, y: e.clientY },
            startOffset: { ...(state.doc.page.offset || { x: 0, y: 0 }) },
            moved: false,
          };
          stage.setPointerCapture?.(e.pointerId);
        }
        return;
      }
      if (e.target.closest?.("[data-stage]")) selectArtboard();
      else clearSelection();
      return;
    }
    const id = nodeEl.dataset.id;
    const node = id ? getNode(id) : null;
    if (!node || node.hidden || node.locked) return;
    hideContextMenu();
    const wasSelected = !!id && state.selectionId === id;
    if (id) select(id);

    // Defer drag until user actually moves (prevents messy history + enables click-to-edit).
    if (e.button === 0 && id && node) {
      e.preventDefault();
      if (e.altKey) {
        history.markBefore("duplicate");
        const newId = duplicateNode(node);
        history.commit();
        select(newId);
      }
      state.pendingDrag = {
        id: state.selectionId || id,
        pointerId: e.pointerId,
        startClient: { x: e.clientX, y: e.clientY },
        startStage: getPointerPosInStage(e),
        origin: { x: getNode(state.selectionId || id).x, y: getNode(state.selectionId || id).y, w: getNode(state.selectionId || id).w, h: getNode(state.selectionId || id).h },
        wasSelected,
        isText: getNode(state.selectionId || id).type === "text",
      };
      stage.setPointerCapture?.(e.pointerId);
    }
  });

  // Double-click to edit text inline
  stage.addEventListener("dblclick", (e) => {
    const nodeEl = e.target.closest?.(".pf-node");
    const id = nodeEl?.dataset?.id;
    const node = id ? getNode(id) : null;
    if (node && node.type === "text") {
      e.preventDefault();
      startTextEdit(id);
    }
  });

  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", endPointer);
  stage.addEventListener("pointercancel", (e) => {
    state.pendingDrag = null;
    endPointer(e);
  });

  artboardHandles.forEach((handle) => {
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      selectArtboard();
      startArtboardResize(e, handle.dataset.artboardHandle || "se");
    });
  });

  // Hand tool panning (space or tool)
  let pan = null; // {startX, startY, sl, st}
  viewport.addEventListener("pointerdown", (e) => {
    const isHandle = e.target.closest?.("[data-handle]");
    const isNode = e.target.closest?.(".pf-node");
    const isRuler = e.target.closest?.(".pf-ruler");
    const isEmpty = !isHandle && !isNode && !isRuler;
    // Grid drag: Alt+Click or Ctrl+Click on empty viewport area
    if ((e.altKey || e.ctrlKey) && e.button === 0 && isEmpty && isGridOn()) {
      e.preventDefault();
      state.gridDrag = {
        pointerId: e.pointerId,
        startClient: { x: e.clientX, y: e.clientY },
        startOffset: { ...(view.gridOffset || { x: 0, y: 0 }) },
      };
      viewport.setPointerCapture?.(e.pointerId);
      viewport.style.cursor = "grabbing";
      return;
    }
    // Left mouse: normal artboard move
    if (e.button === 0 && view.tool !== "hand" && isEmpty) {
      e.preventDefault();
      selectArtboard();
      if (!state.doc.page.locked) {
        history.markBefore("artboard:move");
        state.artboardMove = {
          pointerId: e.pointerId,
          startClient: { x: e.clientX, y: e.clientY },
          startOffset: { ...(state.doc.page.offset || { x: 0, y: 0 }) },
          moved: false,
        };
        viewport.setPointerCapture?.(e.pointerId);
      }
      return;
    }
    // Middle mouse or hand tool: pan
    const shouldPan = view.tool === "hand" || e.button === 1;
    if (shouldPan) {
      console.log("Pan start: tool=", view.tool, "button=", e.button);
    }
    // Right mouse: normal move tool (select and drag)
    if (e.button === 2 && isEmpty) {
      e.preventDefault();
      selectArtboard();
      if (!state.doc.page.locked) {
        history.markBefore("artboard:move");
        state.artboardMove = {
          pointerId: e.pointerId,
          startClient: { x: e.clientX, y: e.clientY },
          startOffset: { ...(state.doc.page.offset || { x: 0, y: 0 }) },
          moved: false,
        };
        viewport.setPointerCapture?.(e.pointerId);
      }
      return;
    }
    if (!shouldPan) return;
    viewport.setPointerCapture?.(e.pointerId);
    viewport.style.cursor = "grabbing";
    e.preventDefault();
    pan = { startX: e.clientX, startY: e.clientY, sl: viewport.scrollLeft, st: viewport.scrollTop };
  });
  viewport.addEventListener("pointermove", (e) => {
    if (state.gridDrag) {
      onPointerMove(e);
      return;
    }
    if (state.artboardMove && !pan) {
      onPointerMove(e);
      return;
    }
    if (!pan) return;
    const dx = e.clientX - pan.startX;
    const dy = e.clientY - pan.startY;
    viewport.scrollLeft = pan.sl - dx;
    viewport.scrollTop = pan.st - dy;
  });
  viewport.addEventListener("pointerup", (e) => {
    if (state.gridDrag) {
      viewport.releasePointerCapture?.(e.pointerId);
      endPointer(e);
      return;
    }
    if (state.artboardMove && !pan) {
      viewport.releasePointerCapture?.(e.pointerId);
      endPointer(e);
      return;
    }
    if (!pan) return;
    viewport.releasePointerCapture?.(e.pointerId);
    viewport.style.cursor = "grab";
    pan = null;
  });
  viewport.addEventListener("click", (e) => {
    const onStage = e.target.closest?.("[data-stage]");
    const onNode = e.target.closest?.(".pf-node");
    const onHandle = e.target.closest?.("[data-handle],[data-artboard-handle]");
    const onRuler = e.target.closest?.(".pf-ruler");
    if (!onStage && !onNode && !onHandle && !onRuler) {
      clearSelection();
      closePanel("right");
    }
  });
  stage.addEventListener("contextmenu", (e) => {
    // Right mouse: normal move tool (no hand pan)
    const nodeEl = e.target.closest?.(".pf-node");
    if (!nodeEl && e.target.closest?.("[data-stage]")) {
      e.preventDefault();
      // Simulate pointerdown for move tool
      const evt = new PointerEvent("pointerdown", {
        pointerId: e.pointerId,
        clientX: e.clientX,
        clientY: e.clientY,
        button: 2
      });
      viewport.dispatchEvent(evt);
      return;
    }
    if (!nodeEl) {
      hideContextMenu();
      return;
    }
    e.preventDefault();
    const id = nodeEl.dataset.id;
    if (id) {
      select(id);
      showContextMenu(e.clientX, e.clientY, id);
    }
  });

  viewport.addEventListener("contextmenu", (e) => {
    const onNode = e.target.closest?.(".pf-node");
    if (!onNode) {
      e.preventDefault();
      hideContextMenu();
    }
  });

  document.addEventListener("click", (e) => {
    if (!contextMenu || contextMenu.hidden) return;
    const inside = e.target.closest?.("[data-context-menu]");
    if (!inside) hideContextMenu();
  });

  // Modal: close on outside click + Esc (safe, isolated)
  upgradeModal?.addEventListener("click", (e) => {
    if (e.target === upgradeModal) closeUpgradeModal();
  });
  document.addEventListener(
    "keydown",
    (e) => {
      if (!upgradeModal || upgradeModal.hidden) return;

      // Block editor shortcuts while modal is open.
      if (e.key !== "Tab") {
        e.stopPropagation();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        closeUpgradeModal();
      }
    },
    true
  );

  contextMenu?.addEventListener("click", (e) => {
    const action = e.target.closest?.("[data-context-action]")?.dataset?.contextAction;
    if (!action) return;
    const id = contextMenu.dataset.id;
    const node = id ? getNode(id) : null;
    if (!node) return;
    if (action === "duplicate") {
      history.markBefore("duplicate");
      const newId = duplicateNode(node);
      history.commit();
      renderAll();
      select(newId);
    }
    if (action === "lock") {
      history.markBefore("lock");
      node.locked = !node.locked;
      history.commit();
      renderAll();
      select(node.id);
    }
    if (action === "delete") {
      deleteSelected();
    }
    hideContextMenu();
  });
  viewport.addEventListener("scroll", () => {
    renderRulers();
  });

  function clampGuidePos(axis, pos) {
    const { w, h } = getStageSize();
    if (axis === "x") return clamp(pos, 0, w);
    return clamp(pos, 0, h);
  }

  function startGuideDrag(axis, e) {
    if (!viewport?.classList.contains("pf-ruler-on")) return;
    const id = `g_${nowId()}`;
    const p = getPointerPosInStage(e);
    const pos = clampGuidePos(axis, axis === "x" ? p.x : p.y);
    state.guidelines.push({ id, axis, pos });
    state.guideDrag = { id, axis };
    renderGuidelines();
  }

  function updateGuideDrag(e) {
    if (!state.guideDrag) return;
    const guide = state.guidelines.find((g) => g.id === state.guideDrag.id);
    if (!guide) return;
    const p = getPointerPosInStage(e);
    guide.pos = clampGuidePos(guide.axis, guide.axis === "x" ? p.x : p.y);
    renderGuidelines();
  }

  function endGuideDrag() {
    if (!state.guideDrag) return;
    state.guideDrag = null;
  }

  rulerX?.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    startGuideDrag("x", e);
  });
  rulerY?.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    startGuideDrag("y", e);
  });

  viewport.addEventListener("pointermove", (e) => {
    if (state.guideDrag) updateGuideDrag(e);
  });
  viewport.addEventListener("pointerup", () => endGuideDrag());

  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      const step = 0.08;
      view.zoom = clamp(view.zoom - delta * step, 0.25, 3);
      applyZoom();
    },
    { passive: false }
  );

  // Layers click
  layersRoot?.addEventListener("click", (e) => {
    const row = e.target.closest?.(".pf-layer");
    if (!row) return;
    select(row.dataset.id);
    setLeftTab("layers");
  });

  // Left tabs
  $$('[data-left-tab]').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const tab = b.dataset.leftTab;
      setLeftTab(tab, { openPanel: true });
    });
  });

  // Templates
  $('[data-templates]')?.addEventListener("click", (e) => {
    const btn = e.target.closest?.("[data-template]");
    if (!btn) return;
    history.markBefore("template");
    applyTemplatePresetToDoc(state.doc, btn.dataset.template);
    normalizeDoc(state.doc);
    clearSelection();
    history.commit();
    saveDoc(state.doc);
    renderAll();
  });

  // Templates search (minimal + fast)
  const templateSearchInput = document.querySelector("[data-template-search]");
  function applyTemplateSearch() {
    if (!templateSearchInput) return;
    const q = (templateSearchInput.value || "").trim().toLowerCase();
    const items = document.querySelectorAll(".pf-template-mini");
    items.forEach((el) => {
      const name = (el.getAttribute("data-template-name") || "").toLowerCase();
      const key = (el.getAttribute("data-template") || "").toLowerCase();
      const ok = !q || name.includes(q) || key.includes(q);
      el.toggleAttribute("hidden", !ok);
    });
  }
  templateSearchInput?.addEventListener("input", applyTemplateSearch);

  // Templates panel
  const templatesList = document.querySelector("[data-templates-list]");
  const templatesSearch = document.querySelector("[data-templates-search]");
  const templatesFilterButtons = Array.from(document.querySelectorAll("[data-template-filter]"));
  
  if (templatesList) {
    let activeTemplateFilter = "all";

    const mainTemplates = [
      {
        id: "t1",
        title: "Classic Elegant",
        thumbClass: "tpl-thumb-1",
        templateKey: "t1",
        category: "certificate",
        type: "Certificate",
        badge: "Formal",
        tags: "classic elegant serif navy burgundy certificate",
      },
      {
        id: "t2",
        title: "Modern Minimal",
        thumbClass: "tpl-thumb-2",
        templateKey: "t2",
        category: "certificate",
        type: "Certificate",
        badge: "Clean",
        tags: "modern minimal clean sans dark blue certificate",
      },
      {
        id: "t3",
        title: "Premium Luxury",
        thumbClass: "tpl-thumb-3",
        templateKey: "t3",
        category: "premium",
        type: "Certificate",
        badge: "Premium",
        tags: "premium luxury gold charcoal dark certificate",
      },
      {
        id: "t4",
        title: "Academic / Diploma",
        thumbClass: "tpl-thumb-4",
        templateKey: "t4",
        category: "certificate",
        type: "Diploma",
        badge: "Academic",
        tags: "academic diploma blue green",
      },
      {
        id: "t5",
        title: "Creative Geometric",
        thumbClass: "tpl-thumb-5",
        templateKey: "t5",
        category: "event",
        type: "Poster",
        badge: "Creative",
        tags: "creative geometric teal purple orange event poster",
      },
      {
        id: "t6",
        title: "Corporate Professional",
        thumbClass: "tpl-thumb-6",
        templateKey: "t6",
        category: "event",
        type: "Badge",
        badge: "Corporate",
        tags: "corporate professional dark neutral blue event badge",
      },
      {
        id: "t7",
        title: "Speaker Pass",
        thumbClass: "tpl-thumb-7",
        templateKey: "t2",
        category: "event",
        type: "Badge",
        badge: "Event",
        tags: "speaker pass badge conference event",
      },
      {
        id: "t8",
        title: "Award Night",
        thumbClass: "tpl-thumb-8",
        templateKey: "t3",
        category: "premium",
        type: "Certificate",
        badge: "Premium",
        tags: "award night premium certificate ceremony",
      },
      {
        id: "t9",
        title: "Workshop Completion",
        thumbClass: "tpl-thumb-9",
        templateKey: "t4",
        category: "certificate",
        type: "Certificate",
        badge: "Workshop",
        tags: "workshop completion certificate training",
      },
      {
        id: "t10",
        title: "Conference Invite",
        thumbClass: "tpl-thumb-10",
        templateKey: "t5",
        category: "event",
        type: "Invitation",
        badge: "Invite",
        tags: "conference invitation event invite",
      },
    ];

    function normalize(s) {
      return String(s || "").toLowerCase().trim();
    }

    function matchesTemplate(t, query, category) {
      const q = normalize(query);
      const title = normalize(t.title);
      const tags = normalize(t.tags);
      const categoryOk = category === "all" || t.category === category;
      const searchOk = !q || `${title} ${tags} ${normalize(t.type)} ${normalize(t.badge)}`.includes(q);
      return categoryOk && searchOk;
    }

    function renderTemplates(query = "", category = activeTemplateFilter) {
      if (!templatesList) return;
      const filtered = mainTemplates.filter(t => matchesTemplate(t, query, category));
      
      templatesList.innerHTML = filtered.length ? filtered.map(t => `
        <article class="pf-template-card" data-template-key="${t.templateKey}" data-template-id="${t.id}">
          <div class="pf-template-thumb ${t.thumbClass}">
            <span class="pf-template-watermark" aria-hidden="true">CERTIFICATE</span>
          </div>
          <div class="pf-template-body">
            <span class="pf-template-badge">${t.badge}</span>
            <h3 class="pf-template-title">${t.title}</h3>
            <p class="pf-template-meta">${t.type} · editable · print-ready</p>
            <div class="pf-template-actions">
              <button type="button" class="pf-action-item" data-action="template:use" data-template="${t.templateKey}">
                <span class="pf-action-item__icon" aria-hidden="true"><svg class="pf-i"><use href="#pf-i-add" /></svg></span>
                Use template
              </button>
            </div>
          </div>
        </article>
      `).join('') : `
        <div class="pf-template-empty">
          <strong>No templates found</strong>
          <span>Try a different category or search term.</span>
        </div>
      `;

      // Template tanlash event listenerlar
      templatesList.querySelectorAll('[data-action="template:use"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const templateKey = btn.dataset.template;
          if (templateKey) {
            history.markBefore("template");
            applyTemplatePresetToDoc(state.doc, templateKey);
            normalizeDoc(state.doc);
            clearSelection();
            history.commit();
            saveDoc(state.doc);
            renderAll();
            // Home paneliga o'tish
            setLeftTab("home", { openPanel: true });
          }
        });
      });
    }

    templatesFilterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        activeTemplateFilter = btn.dataset.templateFilter || "all";
        templatesFilterButtons.forEach(item => {
          item.classList.toggle("is-active", item === btn);
        });
        renderTemplates(templatesSearch?.value || "", activeTemplateFilter);
      });
    });

    // Initial render
    renderTemplates();

    // Search functionality
    if (templatesSearch) {
      templatesSearch.addEventListener("input", (e) => {
        const query = e.target.value || "";
        renderTemplates(query, activeTemplateFilter);
      });
    }
  }

  function handleActionError(err) {
    console.error(err);
    alert("Something went wrong. Please try again (check console for details).");
  }

  async function invokeAction(action, actionEl) {
    const handler = actionHandlers[action];
    if (!handler) return;
    await handler(actionEl);
  }

  document.addEventListener("click", (e) => {
    // Panel toggle buttonlar uchun universal event
    // SVG ichidagi elementlarga bosilganda ham button topilishi uchun
    let panelToggle = e.target.closest?.(
      ".pf-panel-toggle, .pf-rail-btn[data-action='left:toggle'], .pf-rail-btn[data-action='right:toggle']"
    );
    
    // Agar SVG ichidagi elementga bosilgan bo'lsa, parent buttonni topish
    if (!panelToggle) {
      // SVG, path, use yoki boshqa SVG ichidagi elementlar
      let element = e.target;
      while (element && element !== document.body) {
        // Button elementini topish
        if (element.classList) {
          if (element.classList.contains('pf-panel-toggle') || 
              (element.classList.contains('pf-rail-btn') && element.dataset?.action && 
               (element.dataset.action === 'left:toggle' || element.dataset.action === 'right:toggle'))) {
            panelToggle = element;
            break;
          }
        }
        element = element.parentElement;
      }
    }
    
    if (panelToggle) {
      const action = panelToggle.dataset?.action;
      if (action && (action === "left:toggle" || action === "right:toggle")) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        invokeAction(action, panelToggle).catch(handleActionError);
        return;
      }
    }

    const actionEl = e.target.closest?.("[data-action]");
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    if (!action) return;
    if (actionEl.tagName === "INPUT" && (actionEl.type === "file" || actionEl.type === "checkbox" || actionEl.type === "radio")) return;
    e.preventDefault();
    invokeAction(action, actionEl).catch(handleActionError);
  }, true); // capture phase'da ishlash uchun


  // File upload
  document.addEventListener("change", async (e) => {
    const input = e.target.closest?.('input[type="file"][data-action]');
    if (!input) return;
    const action = input.dataset.action;
    if (!action) return;
    const file = input.files?.[0];
    if (!file) return;
    try {
      if (action === "add:image") await addImageFromFile(file);
      if (action === "image:replace") await replaceSelectedImage(file);
      input.value = "";
    } catch (err) {
      console.error(err);
      alert("Could not process image.");
    }
  });

  unitSelects.forEach((sel) => {
    sel.addEventListener("change", () => {
      view.unit = sel.value;
      unitSelects.forEach((s) => (s.value = view.unit));
      saveUI();
      renderRulers();
      renderArtboardControls();
    });
  });

  themeToggle?.addEventListener("change", (e) => {
    const isDark = e.target.checked;
    applyTheme(isDark);
  });

  // Tool buttons
  $$("[data-tool]").forEach((b) => {
    b.addEventListener("click", () => setTool(b.dataset.tool));
  });

  // Drag & drop image import (Add panel)
  const dragDropZone = document.querySelector('.pf-dragdrop-zone[data-dragdrop-image]');
  if (dragDropZone) {
    dragDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dragDropZone.classList.add('is-dragover');
    });
    dragDropZone.addEventListener('dragleave', (e) => {
      dragDropZone.classList.remove('is-dragover');
    });
    dragDropZone.addEventListener('drop', async (e) => {
      e.preventDefault();
      dragDropZone.classList.remove('is-dragover');
      const files = e.dataTransfer.files;
      if (!files || !files.length) return;
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please drop an image file.');
        return;
      }
      try {
        await addImageFromFile(file);
      } catch (err) {
        alert('Could not import image: ' + err.message);
      }
    });
  }

  // Properties inputs (group into sane undo steps)
  let propEditActive = false;
  let propEditTimer = null;
  function schedulePropCommit() {
    clearTimeout(propEditTimer);
    propEditTimer = setTimeout(() => {
      history.commit();
      propEditActive = false;
    }, 500);
  }

  propsForm?.addEventListener("input", (e) => {
    const el = e.target.closest?.("[data-prop]");
    if (!el) return;
    if (!propEditActive) {
      history.markBefore("prop");
      propEditActive = true;
    }
    const key = el.dataset.prop;
    const value = el.type === "checkbox" ? el.checked : el.value;
    setProp(key, value);
    schedulePropCommit();
  });

  // Left style quick controls (sync with properties)
  let leftPropEditActive = false;
  let leftPropEditTimer = null;
  function scheduleLeftPropCommit() {
    clearTimeout(leftPropEditTimer);
    leftPropEditTimer = setTimeout(() => {
      history.commit();
      leftPropEditActive = false;
    }, 500);
  }
  leftStylePanel?.addEventListener("input", (e) => {
    const el = e.target.closest?.("[data-left-prop]");
    if (!el) return;
    if (!leftPropEditActive) {
      history.markBefore("prop");
      leftPropEditActive = true;
    }
    const key = el.dataset.leftProp;
    const value = el.type === "checkbox" ? el.checked : el.value;
    setProp(key, value);
    scheduleLeftPropCommit();
  });
  leftStylePanel?.addEventListener(
    "blur",
    () => {
      if (!leftPropEditActive) return;
      clearTimeout(leftPropEditTimer);
      history.commit();
      leftPropEditActive = false;
    },
    true
  );

  propsForm?.addEventListener(
    "blur",
    () => {
      if (!propEditActive) return;
      clearTimeout(propEditTimer);
      history.commit();
      propEditActive = false;
    },
    true
  );

  // Artboard size inputs (A4 ratio preserved)
  let artboardEditActive = false;
  let artboardEditTimer = null;
  function scheduleArtboardCommit() {
    clearTimeout(artboardEditTimer);
    artboardEditTimer = setTimeout(() => {
      history.commit();
      artboardEditActive = false;
    }, 500);
  }

  function applyArtboardInput(which, value) {
    if (state.doc.page.locked) return;
    if (!artboardEditActive) {
      history.markBefore("artboard:size");
      artboardEditActive = true;
    }
    const ratio = getA4Ratio();
    const next = unitToPx(value, view.unit);
    let w = getStageSize().w;
    let h = getStageSize().h;
    if (which === "w") {
      w = Math.max(10, next);
      h = w / ratio;
    } else {
      h = Math.max(10, next);
      w = h * ratio;
    }
    setArtboardSizePx(w, h, { scaleContents: true });
    applyPage();
    for (let i = 0; i < state.doc.elements.length; i++) {
      renderNode(state.doc.elements[i], i + 1);
    }
    renderGuidelines();
    renderArtboardOverlay();
    renderArtboardControls();
    refreshSelectionOverlay();
    renderRulers();
    scheduleArtboardCommit();
  }

  artboardWidthInput?.addEventListener("input", (e) => {
    applyArtboardInput("w", e.target.value);
  });
  artboardHeightInput?.addEventListener("input", (e) => {
    applyArtboardInput("h", e.target.value);
  });

  const accordionState = loadAccordionState();
  propsForm?.querySelectorAll("details[data-accordion-id]").forEach((panel) => {
    const key = panel.dataset.accordionId;
    if (key && typeof accordionState[key] === "boolean") {
      panel.open = accordionState[key];
    }
    panel.addEventListener("toggle", () => {
      if (!key) return;
      accordionState[key] = panel.open;
      saveAccordionState(accordionState);
    });
  });

  propsForm?.addEventListener("click", (e) => {
    const btn = e.target.closest?.("[data-prop-toggle]");
    if (!btn) return;
    const node = getSelectedNode();
    if (!node) return;
    const key = btn.dataset.propToggle;
    history.markBefore("toggle");
    node.style[key] = !node.style[key];
    history.commit();
    renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
    renderProps();
  });

  // Document title autosave (group into one undo step per pause)
  let titleEditActive = false;
  let titleEditTimer = null;
  docTitleInput?.addEventListener("input", () => {
    if (!titleEditActive) {
      history.markBefore("title");
      titleEditActive = true;
    }
    state.doc.meta = state.doc.meta || {};
    state.doc.meta.title = docTitleInput.value;
    setSavedUI(false);
    clearTimeout(titleEditTimer);
    titleEditTimer = setTimeout(() => {
      history.commit();
      titleEditActive = false;
    }, 650);
  });

  // Keyboard shortcuts
  let spaceOverrideTool = null;
  window.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const mod = isMac ? e.metaKey : e.ctrlKey;
    const key = e.key.toLowerCase();
    const tag = (document.activeElement?.tagName || "").toLowerCase();
    const isTypingTarget = ["input", "textarea", "select"].includes(tag) || document.activeElement?.isContentEditable;

    if (state.editingId) {
      if (e.key === "Escape") {
        e.preventDefault();
        stopTextEdit({ commit: false });
        return;
      }
      if (mod && key === "s") {
        e.preventDefault();
        stopTextEdit({ commit: true });
        saveDoc(state.doc);
        setSavedUI(true);
        return;
      }
      if (mod && e.key === "Enter") {
        e.preventDefault();
        stopTextEdit({ commit: true });
      }
      return;
    }

    if (mod && key === "s") {
      e.preventDefault();
      saveDoc(state.doc);
      setSavedUI(true);
      return;
    }

    // Space = temporary hand tool
    if (e.code === "Space" && !e.repeat && !isTypingTarget) {
      if (spaceOverrideTool === null) spaceOverrideTool = view.tool;
      if (view.tool !== "hand") setTool("hand");
      e.preventDefault();
      return;
    }

    if (mod && key === "z") {
      e.preventDefault();
      if (e.shiftKey) history.redo();
      else history.undo();
      return;
    }
    if (mod && key === "y") {
      e.preventDefault();
      history.redo();
      return;
    }

    if (mod && (key === "=" || key === "+")) {
      e.preventDefault();
      view.zoom = clamp(view.zoom + 0.1, 0.25, 3);
      applyZoom();
      return;
    }
    if (mod && key === "-") {
      e.preventDefault();
      view.zoom = clamp(view.zoom - 0.1, 0.25, 3);
      applyZoom();
      return;
    }
    if (mod && key === "0") {
      e.preventDefault();
      fitToScreen();
      return;
    }
    if (mod && key === "1") {
      e.preventDefault();
      view.zoom = 1;
      applyZoom();
      return;
    }

    if (key === "escape") {
      clearSelection();
      return;
    }

    if (e.key === "Enter") {
      const node = getSelectedNode();
      if (node && node.type === "text") {
        e.preventDefault();
        startTextEdit(node.id);
        return;
      }
    }
    if (key === "delete" || key === "backspace") {
      if (isTypingTarget) return;
      deleteSelected();
      return;
    }

    // Nudge selection
    if (["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(e.key.toLowerCase())) {
      if (isTypingTarget) return;
      const node = getSelectedNode();
      if (!node) return;
      history.markBefore("nudge");
      const step = e.shiftKey ? 10 : 1;
      if (e.key === "ArrowLeft") node.x -= step;
      if (e.key === "ArrowRight") node.x += step;
      if (e.key === "ArrowUp") node.y -= step;
      if (e.key === "ArrowDown") node.y += step;
      history.commit();
      renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
      renderLayers();
      renderProps();
      refreshSelectionOverlay();
      e.preventDefault();
    }

    // Undo/Redo shortcuts (Ctrl+Z / Ctrl+Shift+Z or Ctrl+Y)
    const isCtrl = e.ctrlKey || e.metaKey;
    if (isCtrl && !e.shiftKey && key === "z") {
      e.preventDefault();
      history.undo();
      return;
    }
    if (isCtrl && ((e.shiftKey && key === "z") || (!e.shiftKey && key === "y"))) {
      e.preventDefault();
      history.redo();
      return;
    }
    
    // Quick tool shortcuts
    if (isTypingTarget) return;
    if (key === "v") setTool("select");
    if (key === "p") document.querySelector('[data-action="page:portrait"]')?.click();
    if (key === "l") document.querySelector('[data-action="page:landscape"]')?.click();
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "Space" && spaceOverrideTool !== null) {
      e.preventDefault();
      setTool(spaceOverrideTool);
      spaceOverrideTool = null;
    }
  });

  // Resizable panels
  function getCssVarNum(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const n = Number(v.replace("px", ""));
    return Number.isFinite(n) ? n : fallback;
  }

  $$("[data-resizer]").forEach((rz) => {
    rz.addEventListener("pointerdown", (e) => {
      const side = rz.dataset.resizer;
      view.resizing = {
        side,
        startX: e.clientX,
        startLeft: getCssVarNum("--pf-left-w", 320),
        startRight: getCssVarNum("--pf-right-panel-w", 320),
      };
      document.body.style.cursor = "col-resize";
      rz.setPointerCapture?.(e.pointerId);
    });
    rz.addEventListener("pointermove", (e) => {
      if (!view.resizing) return;
      const dx = e.clientX - view.resizing.startX;
      if (view.resizing.side === "left") {
        const next = clamp(view.resizing.startLeft + dx, 220, 520);
        document.documentElement.style.setProperty("--pf-left-w", `${next}px`);
        renderRulers();
      } else {
        const next = clamp(view.resizing.startRight - dx, 240, 520);
        document.documentElement.style.setProperty("--pf-right-panel-w", `${next}px`);
      }
      saveUI();
    });
    rz.addEventListener("pointerup", (e) => {
      if (!view.resizing) return;
      rz.releasePointerCapture?.(e.pointerId);
      view.resizing = null;
      document.body.style.cursor = "";
    });
  });

  // =========================
  // Expose editor state and functions globally for React components
  // =========================
  window.editorState = state;
  window.editorSelect = select;
  window.editorReorderLayers = (newOrder) => {
    // Reorder layers based on new order array
    const newElements = [];
    for (const id of newOrder) {
      const node = getNode(id);
      if (node) newElements.push(node);
    }
    // Add any remaining elements that weren't in the new order
    for (const node of state.doc.elements) {
      if (!newOrder.includes(node.id)) {
        newElements.push(node);
      }
    }
    history.markBefore("layer:reorder");
    state.doc.elements = newElements;
    history.commit();
    renderAll();
  };
  window.editorToggleLayerVisibility = (id) => {
    const node = getNode(id);
    if (!node) return;
    history.markBefore("layer:visibility");
    node.hidden = !node.hidden;
    if (node.hidden && state.selectionId === id) {
      clearSelection();
    }
    history.commit();
    renderAll();
  };
  window.editorToggleLayerLock = (id) => {
    const node = getNode(id);
    if (!node) return;
    history.markBefore("layer:lock");
    node.locked = !node.locked;
    history.commit();
    renderAll();
  };

  // Dispatch custom events for React components
  const originalRenderLayers = renderLayers;
  renderLayers = function() {
    originalRenderLayers();
    document.dispatchEvent(new CustomEvent('editor:layersChanged'));
  };

  const originalSelect = select;
  select = function(id) {
    originalSelect(id);
    document.dispatchEvent(new CustomEvent('editor:selectionChanged'));
  };

  const originalClearSelection = clearSelection;
  clearSelection = function() {
    originalClearSelection();
    document.dispatchEvent(new CustomEvent('editor:selectionChanged'));
  };

  // =========================
  // Init
  // =========================
  loadUI();
  loadTheme();
  // Restore canvas to default centered position on load.
  state.doc.page.offset = { x: 0, y: 0 };
  applyPanelState();
  

  // Panel toggle buttonlarni to'g'ridan-to'g'ri event listener bilan bog'lash
  function setupPanelToggleButtons() {
    const leftToggleButtons = document.querySelectorAll('[data-action="left:toggle"]');
    const rightToggleButtons = document.querySelectorAll('[data-action="right:toggle"]');

    leftToggleButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (typeof togglePanel === 'function') togglePanel('left');
      }, { capture: true, once: false });
    });

    rightToggleButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (typeof togglePanel === 'function') togglePanel('right');
      }, { capture: true, once: false });
    });
  }

  // DOM yuklangandan keyin buttonlarni setup qilish
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupPanelToggleButtons, 100);
  });
  
  setTool("select");
  if (document.querySelector("[data-left-tab]")) {
    setLeftTab("home", { openPanel: false });
  }
  renderAll();
  // Do not call fitToScreen automatically on load

  applyToolbarPosition();
  if (unitSelects.length) unitSelects.forEach((sel) => (sel.value = view.unit));
  
  // Initialize undo/redo buttons
  updateUndoRedoButtons();
  
  // Initialize Hammer.js gestures integration
  if (typeof window.EditorGestures !== 'undefined') {
    window.EditorGestures.init();
    
    // Listen to gesture events
    stage.addEventListener('gesture:select', (e) => {
      if (e.detail && e.detail.id) {
        select(e.detail.id);
      }
    });
    
    stage.addEventListener('gesture:doubletap', (e) => {
      if (e.detail && e.detail.id) {
        const node = getNode(e.detail.id);
        if (node && node.type === 'text') {
          startTextEdit(e.detail.id);
        }
      }
    });
    
    stage.addEventListener('gesture:panstart', (e) => {
      if (e.detail && e.detail.id) {
        const node = getNode(e.detail.id);
        if (node && !node.locked && !node.hidden) {
          history.markBefore('move');
          state.drag = {
            id: e.detail.id,
            mode: 'move',
            start: getPointerPosInStage(e.detail.originalEvent),
            origin: { x: node.x, y: node.y, w: node.w, h: node.h },
            handle: null,
          };
        }
      }
    });
    
    stage.addEventListener('gesture:panmove', (e) => {
      if (state.drag && e.detail) {
        const p = getPointerPosInStage(e.detail.originalEvent);
        const dx = p.x - state.drag.start.x;
        const dy = p.y - state.drag.start.y;
        const node = getNode(state.drag.id);
        if (node) {
          node.x = state.drag.origin.x + dx;
          node.y = state.drag.origin.y + dy;
          renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
          refreshSelectionOverlay();
        }
      }
    });
    
    stage.addEventListener('gesture:panend', (e) => {
      if (state.drag) {
        history.commit();
        state.drag = null;
        renderAll();
      }
    });
    
    stage.addEventListener('gesture:rotatemove', (e) => {
      if (e.detail && e.detail.id) {
        const node = getNode(e.detail.id);
        if (node && !node.locked) {
          if (!state.drag || state.drag.mode !== 'rotate') {
            history.markBefore('rotate');
            const cx = node.x + node.w / 2;
            const cy = node.y + node.h / 2;
            state.drag = {
              id: node.id,
              mode: 'rotate',
              start: { x: cx, y: cy },
              center: { x: cx, y: cy },
              startAngle: 0,
              baseRotate: Number(node.style?.rotate || 0),
            };
          }
          const deltaAngle = e.detail.deltaRotation || 0;
          node.style.rotate = (state.drag.baseRotate + deltaAngle) % 360;
          renderNode(node, state.doc.elements.findIndex((n) => n.id === node.id) + 1);
          refreshSelectionOverlay();
        }
      }
    });
    
    stage.addEventListener('gesture:rotateend', (e) => {
      if (state.drag && state.drag.mode === 'rotate') {
        history.commit();
        state.drag = null;
        renderAll();
      }
    });
    
    // Viewport pinch zoom
    if (viewport) {
      viewport.addEventListener('gesture:pinch', (e) => {
        if (e.detail) {
          view.zoom = clamp(e.detail.zoom, 0.25, 3);
          applyZoom();
        }
      });
    }
  }

  const gridToggle = document.querySelector('[data-action="view:gridToggle"]');
  if (gridToggle) {
    const gridEnabled = gridToggle.getAttribute("aria-pressed") !== "false";
    stage?.classList.toggle("pf-grid-off", !gridEnabled);
    viewport?.classList.toggle("pf-grid-on", gridEnabled);
  }
  const rulerToggle = document.querySelector('[data-action="view:rulerToggle"]');
  if (rulerToggle && rulerToggle.getAttribute("aria-pressed") === "true") {
    viewport?.classList.add("pf-ruler-on");
  } else {
    viewport?.classList.remove("pf-ruler-on");
  }

  // Do not call fitToScreen on resize

  // auto-save on unload
  window.addEventListener("beforeunload", () => {
    saveDoc(state.doc);
    saveUI();
  });

  // Floating toolbar drag
  if (floatingToolbar && floatingHandle) {
    let tbDrag = null;
    floatingHandle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const rect = floatingToolbar.getBoundingClientRect();
      tbDrag = {
        startX: e.clientX,
        startY: e.clientY,
        originX: rect.left,
        originY: rect.top,
      };
      floatingHandle.setPointerCapture?.(e.pointerId);
    });
    floatingHandle.addEventListener("pointermove", (e) => {
      if (!tbDrag) return;
      const dx = e.clientX - tbDrag.startX;
      const dy = e.clientY - tbDrag.startY;
      view.toolbarPos = {
        x: Math.max(8, tbDrag.originX + dx),
        y: Math.max(8, tbDrag.originY + dy),
      };
      applyToolbarPosition();
      saveUI();
    });
    floatingHandle.addEventListener("pointerup", (e) => {
      if (!tbDrag) return;
      floatingHandle.releasePointerCapture?.(e.pointerId);
      tbDrag = null;
    });
  }

  // auto-save on a small debounce
  let saveTimer = null;
  const origCommit = history.commit.bind(history);
  history.commit = function() {
    origCommit();
    clearTimeout(saveTimer);
    // Text editing yoki muhim o'zgarishlar uchun darhol saqlash
    if (state && state.editingId) {
      saveDoc(state.doc);
    } else {
      // Boshqa o'zgarishlar uchun debounce qilish
      saveTimer = setTimeout(() => {
        if (state && state.doc) {
          saveDoc(state.doc);
        }
      }, 300);
    }
  };
})();

