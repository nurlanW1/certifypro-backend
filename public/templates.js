// Templates page interactions: filter, search, preview modal, load-more paging
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const filters = $$(".tpl-filter");
  const search = $("[data-search]");
  const searchBtn = $(".tpl-search-btn");
  const grid = $("[data-templates-grid]");
  const loadMoreBtn = $("[data-load-more]");
  const countEl = $("[data-template-count]");
  const sortSelect = $("[data-sort]");
  const clearBtn = $("[data-clear]");
  const emptyState = $("[data-empty]");
  const toolbar = $(".tpl-toolbar");

  const modal = $("[data-modal]");
  const modalTitle = $("[data-modal-title]");
  const modalSubtitle = $("[data-modal-subtitle]");
  const modalUse = $("[data-modal-use]");
  const modalPaper = $(".tpl-preview__paper");

  const PAGE_SIZE = 10;
  const TOTAL = 60;

  let activeFilter = "all";
  let query = "";
  let visibleLimit = PAGE_SIZE;
  let sortMode = "popular";

  function normalize(s) {
    return String(s || "").toLowerCase().trim();
  }

  function makeTemplates() {
    const categories = [
      "invitation",
      "certificate",
      "badge",
      "flyer",
      "program",
      "agenda",
      "speaker-card",
      "sponsor-banner",
      "rollup",
      "social-post",
      "event-package",
    ];
    const nameByCat = {
      invitation: "Invitation",
      certificate: "Event Badge",
      badge: "Pass",
      flyer: "Flyer",
      program: "Program",
      agenda: "Agenda",
      "speaker-card": "Speaker Card",
      "sponsor-banner": "Sponsor Banner",
      rollup: "Roll-up Banner",
      "social-post": "Social Post",
      "event-package": "Event Package",
    };

    // Pick 5 deterministic "random" premium indices
    const premiumIdx = new Set([2, 7, 18, 33, 51]);

    return Array.from({ length: TOTAL }, (_, i) => {
      const idx = i + 1;
      const category = categories[i % categories.length];
      const thumb = ((i % 10) + 1); // 1..10
      const title = `${nameByCat[category]} Template ${String(idx).padStart(2, "0")}`;
      const tags = `${category} a4 event asset clean modern template ${idx}`;

      // Keep editor query within 1..10 so the editor route doesn't break
      const editorT = thumb;

      return {
        id: idx,
        title,
        category,
        categoryLabel: nameByCat[category],
        tags,
        thumbClass: `tpl-thumb-${thumb}`,
        previewClass: `tpl-thumb-${thumb}`,
        editorHref: `editor.html?t=${editorT}`,
        premium: premiumIdx.has(i),
      };
    });
  }

  const templates = makeTemplates();

  // Keep navbar height in CSS var (used for layout in templates page)
  function syncNavHeight() {
    const nav = $(".nav");
    if (!nav) return;
    const h = Math.ceil(nav.getBoundingClientRect().height || 0);
    document.documentElement.style.setProperty("--tpl-nav-h", `${Math.max(h, 56)}px`);
  }

  function matchesTemplate(t) {
    const cat = normalize(t.category);
    const title = normalize(t.title);
    const tags = normalize(t.tags);
    const q = normalize(query);
    const filterOk = activeFilter === "all" ? true : cat === activeFilter;
    const queryOk = !q ? true : `${title} ${tags} ${cat}`.includes(q);
    return filterOk && queryOk;
  }

  function getFiltered() {
    const filtered = templates.filter(matchesTemplate);
    if (sortMode === "az") {
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortMode === "premium") {
      return filtered.sort((a, b) => Number(b.premium) - Number(a.premium) || a.id - b.id);
    }
    return filtered.sort((a, b) => a.id - b.id);
  }

  function crownHtml() {
    return `
      <span class="tpl-premium" aria-label="Premium template" title="Premium">
        <svg class="tpl-premium-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7l3.6 5L12 7l4.4 5L20 7l-1.6 12H5.6L4 7z"></path>
        </svg>
      </span>`;
  }

  function cardHtml(t) {
    return `
      <article class="tpl-card" data-category="${t.category}" data-title="${t.title}" data-tags="${t.tags}">
        ${t.premium ? crownHtml() : ""}
        <div class="tpl-thumb ${t.thumbClass}">
          <span class="tpl-thumb-watermark" aria-hidden="true">CERTIFICATE</span>
        </div>
        <div class="tpl-card-body">
          <h3 class="tpl-card-title">${t.title}</h3>
          <p class="tpl-card-text">${t.categoryLabel} · A4 certificate · Editable</p>
          <div class="tpl-actions">
            <a href="${t.editorHref}" class="btn btn-primary tpl-btn-sm">Use template</a>
            <button type="button" class="tpl-btn-ghost tpl-btn-sm" data-action="preview" data-preview="${t.previewClass}">Preview</button>
          </div>
        </div>
      </article>
    `;
  }

  function render() {
    if (!grid) return;
    const filtered = getFiltered();
    const slice = filtered.slice(0, visibleLimit);
    grid.innerHTML = slice.map(cardHtml).join("");

    // Load more visibility
    if (loadMoreBtn) {
      loadMoreBtn.hidden = slice.length >= filtered.length;
    }
    if (countEl) {
      countEl.textContent = `${filtered.length} template${filtered.length === 1 ? "" : "s"}`;
    }
    if (emptyState) {
      emptyState.hidden = filtered.length > 0;
    }
  }

  function setActiveFilter(next) {
    activeFilter = next;
    visibleLimit = PAGE_SIZE;
    filters.forEach((b) => {
      const on = b.dataset.filter === next;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    render();
  }

  function openModal({ title, subtitle, previewClass, useHref }) {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (modalTitle) modalTitle.textContent = title || "Template preview";
    if (modalSubtitle) modalSubtitle.textContent = subtitle || "Press Esc to close.";
    if (modalUse) modalUse.href = useHref || "editor.html";

    if (modalPaper) {
      // reset preview class
      modalPaper.className = "tpl-preview__paper";
      if (previewClass) modalPaper.classList.add(previewClass);
    }

    const close = modal.querySelector("[data-modal-close]");
    close?.focus?.();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Filters
  filters.forEach((b) => b.addEventListener("click", () => setActiveFilter(b.dataset.filter)));

  // Search
  search?.addEventListener("input", () => {
    query = search.value || "";
    visibleLimit = PAGE_SIZE;
    render();
  });

  // Search button: focus input (no placeholder)
  searchBtn?.addEventListener("click", () => search?.focus?.());

  sortSelect?.addEventListener("change", () => {
    sortMode = sortSelect.value || "popular";
    visibleLimit = PAGE_SIZE;
    render();
  });

  clearBtn?.addEventListener("click", () => {
    query = "";
    activeFilter = "all";
    visibleLimit = PAGE_SIZE;
    sortMode = "popular";
    if (search) search.value = "";
    if (sortSelect) sortSelect.value = "popular";
    filters.forEach((b) => {
      const on = b.dataset.filter === "all";
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    render();
  });

  // Load more
  loadMoreBtn?.addEventListener("click", () => {
    visibleLimit += PAGE_SIZE;
    render();
  });

  // Preview + modal close (delegated)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest?.('[data-action="preview"]');
    if (btn) {
      const card = btn.closest(".tpl-card");
      const useLink = card?.querySelector?.('a[href*="editor.html"]');
      openModal({
        title: card?.dataset?.title || "Template preview",
        subtitle: "Preview the layout, then open it in the editor.",
        previewClass: btn.dataset.preview || "",
        useHref: useLink?.getAttribute?.("href") || "editor.html",
      });
      return;
    }

    if (modal && !modal.hidden) {
      const close = e.target.closest?.("[data-modal-close]");
      if (close) closeModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) {
      e.preventDefault();
      closeModal();
    }
  });

  // Init
  syncNavHeight();
  window.addEventListener("resize", syncNavHeight, { passive: true });

  render();
})();

