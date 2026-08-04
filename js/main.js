/* =========================================================================
   MAIN.JS  —  لۆجیکی گشتی ماڵپەڕ (General site logic)
   =========================================================================
   ئەم فایلە بەرپرسیارە لە: پیشاندانی کارتی بەرهەمەکان، فلتەرکردن، گەڕان،
   مێنیوی مۆبایل، دووگمەی "گەڕانەوە بۆ سەرەوە"، و ئێفێکتەکانی سکرۆڵ.

   This file handles: rendering product cards, category/search filtering,
   the mobile menu, the back-to-top button, and scroll effects.
   ========================================================================= */

// -------------------------------------------------------------------------
// نیشانەی سکرۆڵ / Keep scroll position on refresh
// -------------------------------------------------------------------------
// بە بنەڕەت وێبگەڕ هەوڵ دەدات شوێنی سکرۆڵ لە کاتی ڕیفرێش کردندا هەڵبگرێت، بەڵام
// لەبەر ئەوەی کارتی بەرهەمەکان بە JavaScript دروست دەکرێن (دوای بارکردنی پەڕە)،
// لە سەرەتادا پەڕەکە زۆر کورتە و وێبگەڕ ناتوانێت بگەڕێتەوە بۆ شوێنە ڕاستەقینەکە.
// لێرەدا بە دەستی شوێنی سکرۆڵ هەڵدەگرین و دوای دروستکردنی کارتەکان دەیگەڕێنینەوە.
//
// Browsers try to restore scroll position on refresh by default, but since
// the product cards are built with JavaScript after the page loads, the
// page is too short at first for that to work. So we save the scroll
// position ourselves and restore it manually once the content is rendered.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const SCROLL_KEY = "scrollPos:" + location.pathname;

function saveScrollPosition() {
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
}

let scrollSaveTimer = null;
window.addEventListener("scroll", () => {
  clearTimeout(scrollSaveTimer);
  scrollSaveTimer = setTimeout(saveScrollPosition, 150);
});
window.addEventListener("beforeunload", saveScrollPosition);

function restoreScrollPosition() {
  const savedY = sessionStorage.getItem(SCROLL_KEY);
  if (savedY === null) return;
  const targetY = parseInt(savedY, 10);
  if (!targetY) return;
  // دووجار frame چاوەڕوان دەکەین بۆ ئەوەی دڵنیابین کارتەکان و وێنەکان
  // بۆشاییان لە پەڕەکە گرتووە پێش سکرۆڵکردن.
  // Wait two frames to make sure the rendered cards/images have already
  // taken up their space in the layout before we scroll.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, targetY);
    });
  });
}

// -------------------------------------------------------------------------
// یاریدەدەرەکان / Helpers
// -------------------------------------------------------------------------

function formatPrice(num) {
  return num.toLocaleString("en-US") + " " + STORE_CONFIG.currencyLabel;
}

function getCategoryLabel(key) {
  const cat = STORE_CONFIG.categories.find(c => c.key === key);
  return cat ? cat.label : key;
}

// دروستکردنی HTML بۆ یەک کارتی بەرهەم / Build the HTML for one product card
function buildProductCard(product) {
  const defaultGrams = STORE_CONFIG.defaultWeightGrams;
  const defaultOpt = STORE_CONFIG.weightOptions.find(o => o.grams === defaultGrams)
    || STORE_CONFIG.weightOptions[STORE_CONFIG.weightOptions.length - 1];

  const weightButtons = STORE_CONFIG.weightOptions.map(opt => `
    <button type="button" class="weight-btn${opt.grams === defaultOpt.grams ? " active" : ""}" data-weight="${opt.grams}" onclick="selectCardWeight(this, ${opt.grams})">${opt.shortLabel}</button>
  `).join("");

  return `
    <article class="product-card${product.bestSeller ? " is-best-seller" : ""}" data-category="${product.category}" data-name="${product.name}" data-product-id="${product.id}" data-selected-weight="${defaultOpt.grams}">
      <div class="product-card-image" data-open-quickview="${product.id}" role="button" tabindex="0" aria-label="بینینی وردەکاری ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" width="600" height="600">
        <span class="product-card-tag">${getCategoryLabel(product.category)}</span>
        ${product.bestSeller ? `<span class="best-seller-ribbon">⭐ زۆرترین فرۆشراو</span>` : ""}
      </div>
      <div class="product-card-body">
        <h3 class="product-card-name" data-open-quickview="${product.id}" role="button" tabindex="0">${product.name}</h3>
        ${product.description ? `<p class="product-card-desc">${product.description}</p>` : ""}
        <div class="weight-selector" role="group" aria-label="هەڵبژاردنی کێش">
          ${weightButtons}
        </div>
        <div class="product-card-footer">
          <div class="product-card-price">
            <span class="price-value">${formatPrice(computeWeightPrice(product.price, defaultOpt.grams))}</span>
            <span class="price-unit">/ ${defaultOpt.label}</span>
          </div>
          <button class="btn btn-add" onclick="addProductToCart(this, ${product.id})">
            <span>زیادکردن</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

// -------------------------------------------------------------------------
// هەڵبژاردنی کێش لەسەر کارتی بەرهەم / Weight selection on a product card
// -------------------------------------------------------------------------
// هەر کارتێک بە شێوەیەکی سەربەخۆ هەڵبژاردنی کێشی خۆی هەڵدەگرێت (لە
// data-selected-weight)، بۆیە ئەگەر هەمان بەرهەم لە چەند بەشێکی پەڕەکەدا
// دەربکەوێت (وەک تایبەت + زۆرترین فرۆشراو)، هەریەکە جیاواز کار دەکات.
//
// Each card independently tracks its own selected weight (in
// data-selected-weight), so if the same product appears in more than one
// section of the page (e.g. Featured + Best Sellers), each instance works
// independently.
function selectCardWeight(btnEl, grams) {
  const card = btnEl.closest(".product-card");
  if (!card) return;

  card.dataset.selectedWeight = grams;
  card.querySelectorAll(".weight-btn").forEach(b => {
    b.classList.toggle("active", Number(b.dataset.weight) === grams);
  });

  const productId = Number(card.dataset.productId);
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const opt = STORE_CONFIG.weightOptions.find(o => o.grams === grams);
  const priceEl = card.querySelector(".price-value");
  const unitEl = card.querySelector(".price-unit");
  if (priceEl) priceEl.textContent = formatPrice(computeWeightPrice(product.price, grams));
  if (unitEl && opt) unitEl.textContent = "/ " + opt.label;
}

// زیادکردنی بەرهەم بۆ سەبەتە بەپێی کێشی هەڵبژێردراو لەسەر هەمان کارت
// Add a product to the cart, using whatever weight is selected on that
// specific card instance.
function addProductToCart(btnEl, productId) {
  const card = btnEl.closest(".product-card");
  const grams = card ? Number(card.dataset.selectedWeight) : STORE_CONFIG.defaultWeightGrams;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  Cart.add(product, grams);
}

// -------------------------------------------------------------------------
// پێشاندان لەسەر پەڕەی سەرەکی (Home page rendering)
// -------------------------------------------------------------------------
function renderHomeSections() {
  const featuredGrid = document.getElementById("featuredGrid");
  const bestSellerGrid = document.getElementById("bestSellerGrid");
  const categoryGrid = document.getElementById("categoryGrid");

  if (featuredGrid) {
    const featured = PRODUCTS.filter(p => p.featured).slice(0, 8);
    featuredGrid.innerHTML = featured.map(buildProductCard).join("");
  }

  if (bestSellerGrid) {
    const bestSellers = PRODUCTS.filter(p => p.bestSeller).slice(0, 8);
    bestSellerGrid.innerHTML = bestSellers.map(buildProductCard).join("");
  }

  if (categoryGrid) {
    categoryGrid.innerHTML = STORE_CONFIG.categories.map(cat => `
      <a href="berhemakan.html?cat=${cat.key}" class="category-card">
        <span class="category-icon">${cat.icon}</span>
        <span class="category-label">${cat.label}</span>
      </a>
    `).join("");
  }
}

// -------------------------------------------------------------------------
// پێشاندان لەسەر پەڕەی بەرهەمەکان (Products page rendering + filters)
// -------------------------------------------------------------------------
let activeCategory = "all";
let activeSearch = "";

// دروستکردنی کارتی سکێلێتۆن / Build placeholder skeleton cards, shown
// briefly while the grid re-renders after a filter or search change —
// a small, deliberate transition so results don't just snap/flicker.
function buildSkeletonCards(count) {
  return Array.from({ length: count }).map(() => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-img skeleton-shimmer"></div>
      <div class="skeleton-line skeleton-shimmer"></div>
      <div class="skeleton-line skeleton-shimmer short"></div>
    </div>
  `).join("");
}

function renderProductsPage() {
  const grid = document.getElementById("productsGrid");
  const emptyState = document.getElementById("productsEmptyState");
  if (!grid) return;

  let list = PRODUCTS.slice();

  if (activeCategory !== "all") {
    list = list.filter(p => p.category === activeCategory);
  }
  if (activeSearch.trim() !== "") {
    const q = activeSearch.trim().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }

  grid.innerHTML = list.map(buildProductCard).join("");
  if (emptyState) emptyState.style.display = list.length === 0 ? "block" : "none";
}

// وەک ئێفێکتێکی نەرم پێش پیشاندانی ئەنجامی نوێ (فلتەر/گەڕان)
// A gentle skeleton flash before showing new filter/search results
let renderTransitionTimer = null;
function renderProductsPageWithTransition() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  clearTimeout(renderTransitionTimer);
  grid.innerHTML = buildSkeletonCards(6);
  renderTransitionTimer = setTimeout(renderProductsPage, 180);
}

function buildCategoryFilters() {
  const wrap = document.getElementById("categoryFilters");
  if (!wrap) return;

  const allBtn = `<button class="filter-chip active" data-cat="all">هەموو</button>`;
  const chips = STORE_CONFIG.categories.map(cat =>
    `<button class="filter-chip" data-cat="${cat.key}">${cat.icon} ${cat.label}</button>`
  ).join("");

  wrap.innerHTML = allBtn + chips;

  wrap.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      wrap.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.dataset.cat;
      renderProductsPageWithTransition();
    });
  });

  // ئەگەر پۆل لە بەستەری URL هاتبوو (لە پەڕەی سەرەکی کلیک کرابوو)
  // If a category came from the URL (clicked from the home page)
  const params = new URLSearchParams(window.location.search);
  const catFromUrl = params.get("cat");
  if (catFromUrl && STORE_CONFIG.categories.some(c => c.key === catFromUrl)) {
    activeCategory = catFromUrl;
    wrap.querySelectorAll(".filter-chip").forEach(c => {
      c.classList.toggle("active", c.dataset.cat === catFromUrl);
    });
  }
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  let debounceTimer = null;
  input.addEventListener("input", () => {
    activeSearch = input.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderProductsPageWithTransition, 150);
  });
}

// -------------------------------------------------------------------------
// دیاریکردنی بەستەری چالاک / Auto-detect the active nav link
// -------------------------------------------------------------------------
// لە جیاتی نووسینی class="active" بە دەست لەناو هەر پەڕەیەکدا (کە زۆر ئاسانە
// لەبیر بکرێت یان هەڵە تێدا بێت)، لێرەدا خۆکارانە دەستنیشان دەکرێت کام بەستەر
// دەبێت "چالاک" پیشان بدرێت، بۆ هەم مێنیوی سەرەکی و هەم مێنیوی مۆبایل.
//
// Instead of hardcoding class="active" by hand on each page (easy to forget
// or get out of sync), this automatically figures out which nav link should
// be marked active, for both the desktop nav and the mobile menu.
function setActiveNavLink() {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(link => {
    const href = link.getAttribute("href");
    // بەستەرەکانی وەک index.html#why بەشێکی پەڕەکەن، نەک پەڕەیەکی جیاواز،
    // بۆیە هەرگیز نابێت وەک "چالاک" نیشانە بکرێن.
    // Links like index.html#why point to a section of a page, not a
    // distinct page, so they should never be marked "active".
    if (href.includes("#")) return;
    const linkPage = href.split("/").pop();
    link.classList.toggle("active", linkPage === currentPage);
  });
}

// -------------------------------------------------------------------------
// مێنیوی مۆبایل / Mobile menu
// -------------------------------------------------------------------------
function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// -------------------------------------------------------------------------
// دووگمەی گەڕانەوە بۆ سەرەوە / Back to top button
// -------------------------------------------------------------------------
function setupBackToTop() {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// -------------------------------------------------------------------------
// نازکردنی هێدەر لەکاتی سکرۆڵ / Shrink header on scroll
// -------------------------------------------------------------------------
function setupHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// -------------------------------------------------------------------------
// ئێفێکتی دەرکەوتن لەکاتی سکرۆڵ / Scroll reveal animation
// -------------------------------------------------------------------------
function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
}

// -------------------------------------------------------------------------
// خشتەی داخستنی درۆوەری سەبەتە بە کلیک لەسەر پەردە / Close drawer via overlay
// -------------------------------------------------------------------------
function setupCartDrawerEvents() {
  const openBtns = document.querySelectorAll(".open-cart-btn");
  const closeBtn = document.getElementById("closeCartBtn");
  const overlay = document.getElementById("cartOverlay");
  const sendBtn = document.getElementById("sendOrderBtn");

  openBtns.forEach(btn => btn.addEventListener("click", () => Cart.toggleDrawer(true)));
  if (closeBtn) closeBtn.addEventListener("click", () => Cart.toggleDrawer(false));
  if (overlay) overlay.addEventListener("click", () => Cart.toggleDrawer(false));
  if (sendBtn) sendBtn.addEventListener("click", () => Cart.sendOrder());

  // داخستنی درۆوەر بە کلیکی Escape / Close the drawer with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const drawer = document.getElementById("cartDrawer");
    if (drawer && drawer.classList.contains("open")) Cart.toggleDrawer(false);
    const menu = document.getElementById("mobileMenu");
    const toggle = document.getElementById("menuToggle");
    if (menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
      if (toggle) { toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    }
  });
}

// -------------------------------------------------------------------------
// دۆخی تاریک/ڕووناک / Dark mode toggle
// -------------------------------------------------------------------------
// دۆخەکە زوو لە <head>ی هەر پەڕەیەکدا دادەنرێت (پێش بارکردنی CSS) بۆ ئەوەی
// چرپەیەکی ڕووناک لە پەڕەی تاریکدا نەبینرێت. لێرەدا تەنها دووگمەکە کار
// پێدەکرێت.
// The theme itself is set early in each page's <head> (before CSS loads)
// to avoid a flash of the wrong theme. This just wires up the button.
function setupThemeToggle() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ئەگەر localStorage بەردەست نەبوو / storage unavailable */ }
    btn.setAttribute("aria-pressed", String(!isDark));
  });
  btn.setAttribute("aria-pressed", String(document.documentElement.getAttribute("data-theme") === "dark"));
}

// -------------------------------------------------------------------------
// دانانی ناوی فرۆشگا لە هەموو شوێنێک لە config.js وە / Apply the store name
// from config.js everywhere it's shown, instead of it being hardcoded
// separately in three places (which is how it drifted out of sync before).
// -------------------------------------------------------------------------
function applyStoreName() {
  document.querySelectorAll("#navStoreName, #footerStoreName, #copyrightStoreName").forEach(el => {
    el.textContent = STORE_CONFIG.storeName;
  });
}

// -------------------------------------------------------------------------
// پرسیارە دووبارەکان / FAQ accordion
// -------------------------------------------------------------------------
function renderFaq() {
  const list = document.getElementById("faqList");
  if (!list) return;
  list.innerHTML = STORE_CONFIG.faq.map((item, i) => `
    <div class="faq-item">
      <button type="button" class="faq-question" id="faqQ${i}" aria-expanded="false" aria-controls="faqA${i}">
        <span>${item.q}</span>
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-answer" id="faqA${i}" role="region" aria-labelledby="faqQ${i}" hidden>
        <p>${item.a}</p>
      </div>
    </div>
  `).join("");
}

function setupFaqAccordion() {
  const list = document.getElementById("faqList");
  if (!list) return;
  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".faq-question");
    if (!btn) return;
    const answer = document.getElementById(btn.getAttribute("aria-controls"));
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!isOpen));
    btn.closest(".faq-item").classList.toggle("open", !isOpen);
    if (answer) answer.hidden = isOpen;
  });
}

// -------------------------------------------------------------------------
// بەشداربوونی نامەکان / Newsletter signup
// -------------------------------------------------------------------------
// لەبەر ئەوەی ماڵپەڕەکە هیچ سێرڤەرێکی باکئێندی نییە، بەشداربوونەکە وەک
// پەیامێکی واتساپ دەنێردرێت بۆ خاوەنی فرۆشگا — هەمان شێوازی داواکاریەکان.
// Since this static site has no backend, a signup is sent as a WhatsApp
// message to the store owner — the same pattern used for orders.
function setupNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  const note = document.getElementById("newsletterNote");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const phoneInput = document.getElementById("newsletterPhone");
    const phone = phoneInput.value.trim().slice(0, 20);
    if (!phone) return;
    const message = encodeURIComponent(`سڵاو، دەمەوێت بەشداری لیستی هەواڵی بەرهەمی نوێ و داشکاندنەکان بم.\nژمارەی واتساپم: ${phone}`);
    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${message}`, "_blank", "noopener");
    if (note) note.textContent = "سوپاس! تەنها پەیامەکەت بنێرە بۆ واتساپ بۆ تەواوکردنی بەشداربوون.";
    form.reset();
  });
}

// -------------------------------------------------------------------------
// مۆدالی بینینی خێرا / Product quick-view modal (with related products)
// -------------------------------------------------------------------------
function buildProductModalContent(product) {
  const defaultGrams = STORE_CONFIG.defaultWeightGrams;
  const defaultOpt = STORE_CONFIG.weightOptions.find(o => o.grams === defaultGrams)
    || STORE_CONFIG.weightOptions[STORE_CONFIG.weightOptions.length - 1];

  const weightButtons = STORE_CONFIG.weightOptions.map(opt => `
    <button type="button" class="weight-btn${opt.grams === defaultOpt.grams ? " active" : ""}" data-weight="${opt.grams}" onclick="selectModalWeight(this, ${opt.grams}, ${product.id})">${opt.shortLabel}</button>
  `).join("");
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  const relatedHtml = related.length ? `
    <div class="product-modal-related">
      <h3>بەرهەمی هاوشێوە</h3>
      <div class="related-products-row">
        ${related.map(r => `
          <button type="button" class="related-product-card" onclick="openProductModal(${r.id})">
            <img src="${r.image}" alt="${r.name}" loading="lazy">
            <span class="rp-name">${r.name}</span>
            <span class="rp-price">${formatPrice(r.price)} / کگ</span>
          </button>
        `).join("")}
      </div>
    </div>
  ` : "";

  return `
    <div class="product-modal-grid">
      <div class="product-modal-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-modal-body">
        <h2 id="productModalTitle">${product.name}</h2>
        ${product.description ? `<p class="product-card-desc">${product.description}</p>` : ""}
        <div class="weight-selector" role="group" aria-label="هەڵبژاردنی کێش" data-modal-weight-group data-selected-weight="${defaultOpt.grams}">${weightButtons}</div>
        <div class="product-card-footer" style="margin-top:16px;">
          <div class="product-card-price">
            <span class="price-value" data-modal-price>${formatPrice(computeWeightPrice(product.price, defaultOpt.grams))}</span>
            <span class="price-unit" data-modal-unit>/ ${defaultOpt.label}</span>
          </div>
          <button class="btn btn-add" onclick="addProductToCartFromModal(${product.id})">
            <span>زیادکردن</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
      ${relatedHtml}
    </div>
  `;
}

// هەڵبژاردنی کێش لەناو مۆدالدا / Weight selection inside the quick-view modal
function selectModalWeight(btnEl, grams, productId) {
  const group = btnEl.closest("[data-modal-weight-group]");
  if (!group) return;
  group.dataset.selectedWeight = grams;
  group.querySelectorAll(".weight-btn").forEach(b => {
    b.classList.toggle("active", Number(b.dataset.weight) === grams);
  });
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const opt = STORE_CONFIG.weightOptions.find(o => o.grams === grams);
  const body = group.closest(".product-modal-body");
  const priceEl = body?.querySelector("[data-modal-price]");
  const unitEl = body?.querySelector("[data-modal-unit]");
  if (priceEl) priceEl.textContent = formatPrice(computeWeightPrice(product.price, grams));
  if (unitEl && opt) unitEl.textContent = "/ " + opt.label;
}

function addProductToCartFromModal(productId) {
  const group = document.querySelector("[data-modal-weight-group]");
  const grams = group ? Number(group.dataset.selectedWeight) : STORE_CONFIG.defaultWeightGrams;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  Cart.add(product, grams);
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const overlay = document.getElementById("productModalOverlay");
  const modal = document.getElementById("productModal");
  const content = document.getElementById("productModalContent");
  if (!product || !overlay || !modal || !content) return;

  content.innerHTML = buildProductModalContent(product);
  overlay.classList.add("open");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("productModalClose")?.focus();
}

function closeProductModal() {
  const overlay = document.getElementById("productModalOverlay");
  const modal = document.getElementById("productModal");
  if (!overlay || !modal) return;
  overlay.classList.remove("open");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupProductModal() {
  const overlay = document.getElementById("productModalOverlay");
  const closeBtn = document.getElementById("productModalClose");
  if (!overlay) return;

  // گوێگرتنی هەڵگیراو لەسەر بەلگە، چونکە کارتەکان بە دینامیکی دروست دەبن
  // Delegated listener on the document, since cards are rendered dynamically
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-quickview]");
    if (trigger) openProductModal(Number(trigger.dataset.openQuickview));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const trigger = e.target.closest("[data-open-quickview]");
    if (trigger) { e.preventDefault(); openProductModal(Number(trigger.dataset.openQuickview)); }
  });

  overlay.addEventListener("click", closeProductModal);
  if (closeBtn) closeBtn.addEventListener("click", closeProductModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProductModal();
  });
}

// -------------------------------------------------------------------------
// دەستپێکردنی گشتی / Init everything once the page has loaded
// -------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  applyStoreName();
  renderFaq();
  setActiveNavLink();
  renderHomeSections();
  buildCategoryFilters();
  renderProductsPage();
  setupSearch();
  setupMobileMenu();
  setupBackToTop();
  setupHeaderScroll();
  setupScrollReveal();
  setupCartDrawerEvents();
  setupProductModal();
  setupThemeToggle();
  setupFaqAccordion();
  setupNewsletterForm();
  restoreScrollPosition();

  // شاردنەوەی لۆدینگ سکرین / Hide the loading screen once ready
  const loader = document.getElementById("pageLoader");
  if (loader) {
    setTimeout(() => loader.classList.add("hidden"), 400);
  }
});
