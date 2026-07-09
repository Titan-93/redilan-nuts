/* =========================================================================
   CART.JS  —  سیستەمی لیستی داواکاری (Order List / Cart system)
   =========================================================================
   ئەم فایلە کار لەگەڵ "لیستی داواکاری" دەکات: زیادکردن، سڕینەوە، گۆڕینی
   ژمارە، هەڵگرتنی داتا لە مرۆر (localStorage)، و دروستکردنی نامەی واتساپ.

   This file manages the "Order List": adding items, removing them,
   changing quantities, saving the cart in the browser (localStorage),
   and building the final WhatsApp message.

   پێویست ناکات هیچ شتێک لێرە بگۆڕیت.
   You should not need to edit anything in this file.
   ========================================================================= */

const CART_STORAGE_KEY = "nutsStoreCart";

const Cart = {

  items: [], // { id, name, price, qty }

  // بارکردنی سەبەتە لە localStorage / Load cart from localStorage
  load() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      this.items = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.items = [];
    }
  },

  // هەڵگرتنی سەبەتە / Save cart to localStorage
  save() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    this.updateBadge();
  },

  // زیادکردنی بەرهەم / Add a product to the cart
  add(product) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    }
    this.save();
    this.renderDrawer();
    this.pulseCartIcon();
  },

  // زیادکردنی دانە / Increase quantity
  increase(id) {
    const item = this.items.find(i => i.id === id);
    if (item) item.qty += 1;
    this.save();
    this.renderDrawer();
  },

  // کەمکردنەوەی دانە / Decrease quantity (removes item if it hits 0)
  decrease(id) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.qty -= 1;
      if (item.qty <= 0) {
        this.items = this.items.filter(i => i.id !== id);
      }
    }
    this.save();
    this.renderDrawer();
  },

  // سڕینەوەی تەواوی بەرهەم / Remove item completely
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    this.renderDrawer();
  },

  // ڕقاندنی هەموو سەبەتە / Clear entire cart
  clear() {
    this.items = [];
    this.save();
    this.renderDrawer();
  },

  // کۆی گشتی دانەکان (بۆ نیشاندان لەسەر ئایکۆن) / Total item count for badge
  totalCount() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  // کۆی گشتی نرخ / Total price
  totalPrice() {
    return this.items.reduce((sum, i) => sum + (i.qty * i.price), 0);
  },

  // نیشاندانی ژمارە لەسەر ئایکۆنی سەبەتە / Update the little badge number
  updateBadge() {
    const badge = document.querySelectorAll(".cart-badge");
    badge.forEach(b => {
      const count = this.totalCount();
      b.textContent = count;
      b.style.display = count > 0 ? "flex" : "none";
    });
  },

  // ئانیمەیشنی بچووک کاتێک بەرهەمێک زیاد دەکرێت / Small bounce animation
  pulseCartIcon() {
    const icons = document.querySelectorAll(".floating-cart-btn, .nav-cart-btn");
    icons.forEach(icon => {
      icon.classList.remove("pulse");
      void icon.offsetWidth; // ری‌سێت‌ی ئانیمەیشن / restart animation
      icon.classList.add("pulse");
    });
  },

  // دروستکردنی ڕستەی هەر دانەیەک / Format a number with thousands separators
  formatPrice(num) {
    return num.toLocaleString("en-US") + " " + STORE_CONFIG.currencyLabel;
  },

  /* -----------------------------------------------------------------------
     دروستکردنی HTML ی ناوەوەی درۆوەری سەبەتە (Cart drawer contents)
     ----------------------------------------------------------------------- */
  renderDrawer() {
    const listEl = document.getElementById("cartItemsList");
    const totalEl = document.getElementById("cartTotalPrice");
    const emptyEl = document.getElementById("cartEmptyMessage");
    const sendBtn = document.getElementById("sendOrderBtn");
    if (!listEl) return; // ئەم پەیجە درۆوەری نییە / this page has no drawer

    if (this.items.length === 0) {
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.style.display = "block";
      if (sendBtn) sendBtn.disabled = true;
    } else {
      if (emptyEl) emptyEl.style.display = "none";
      if (sendBtn) sendBtn.disabled = false;
      listEl.innerHTML = this.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">${this.formatPrice(item.price)} / کیلۆ</p>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="Cart.decrease(${item.id})" aria-label="کەمکردنەوە">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.increase(${item.id})" aria-label="زیادکردن">+</button>
          </div>
          <button class="cart-item-remove" onclick="Cart.remove(${item.id})" aria-label="سڕینەوە">✕</button>
        </div>
      `).join("");
    }

    if (totalEl) totalEl.textContent = this.formatPrice(this.totalPrice());
  },

  // کردنەوە/داخستنی درۆوەری سەبەتە / Open or close the cart drawer
  toggleDrawer(forceOpen) {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");
    if (!drawer) return;
    const shouldOpen = forceOpen !== undefined ? forceOpen : !drawer.classList.contains("open");
    drawer.classList.toggle("open", shouldOpen);
    if (overlay) overlay.classList.toggle("visible", shouldOpen);
    document.body.style.overflow = shouldOpen ? "hidden" : "";
  },

  /* -----------------------------------------------------------------------
     ناردنی داواکاری بۆ واتساپ (Build & send WhatsApp order message)
     ----------------------------------------------------------------------- */
  sendOrder() {
    if (this.items.length === 0) return;

    const customerName = document.getElementById("customerName")?.value.trim() || "";
    const customerPhone = document.getElementById("customerPhone")?.value.trim() || "";
    const customerAddress = document.getElementById("customerAddress")?.value.trim() || "";

    let message = "سڵاو،%0Aدەمەوێت داواکاری ئەم بەرهەمانە بکەم:%0A%0A";

    this.items.forEach(item => {
      message += `• ${item.name} — ${item.qty} کیلۆ — ${this.formatPrice(item.price * item.qty)}%0A`;
    });

    message += `%0Aکۆی گشتی: ${this.formatPrice(this.totalPrice())}%0A%0A`;
    message += `ناو: ${customerName || "..."}%0A`;
    message += `ژمارەی تەلەفۆن: ${customerPhone || "..."}%0A`;
    message += `ناونیشان: ${customerAddress || "..."}%0A%0A`;
    message += "سوپاس بۆ کات و بایەختان.";

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${message}`;
    window.open(url, "_blank");
  },

  init() {
    this.load();
    this.updateBadge();
    this.renderDrawer();
  }
};

document.addEventListener("DOMContentLoaded", () => Cart.init());
