/* ══════════════════════════════════════════════
   SALAD BYTE – script.js
   Cart · Checkout · WhatsApp · PWA
══════════════════════════════════════════════ */

'use strict';

/* ── CONFIG ──────────────────────────────── */
const CONFIG = {
  WHATSAPP_NUMBER: '918233787904',   // Replace with actual number
  GOOGLE_FORM_URL: 'https://forms.gle/YOUR_FORM_ID', // Replace with actual form
  PRICE_PER_SALAD: 175,
};

/* ── MENU DATA ───────────────────────────── */
const SALADS = [
  {
    id: 1,
    name: 'Mix Sprout Power Salad',
    shortName: 'Sprout Power',
    desc: 'Moong, moth, chana with refreshing mint dressing',
    weight: '225g',
    price: 175,
    imgClass: 'img-sprout',
    emoji: '🌱',
  },
  {
    id: 2,
    name: 'Rajma & Tofu Protein Salad',
    shortName: 'Rajma Tofu',
    desc: 'Tossed with rich peanut dressing',
    weight: '225g',
    price: 175,
    imgClass: 'img-rajma',
    emoji: '🫘',
  },
  {
    id: 3,
    name: 'Chatpata Chana Salad',
    shortName: 'Chatpata Chana',
    desc: 'Tangy, spicy & full of Indian flavors',
    weight: '225g',
    price: 175,
    imgClass: 'img-chana',
    emoji: '🌶️',
  },
  {
    id: 4,
    name: 'Soya Chunks & Paneer Salad',
    shortName: 'Soya Paneer',
    desc: 'Honey, coriander, mint & mustard sauce',
    weight: '225g',
    price: 175,
    imgClass: 'img-soya',
    emoji: '🧀',
  },
  {
    id: 5,
    name: 'Exotic Mix Veg Salad',
    shortName: 'Exotic Mix Veg',
    desc: 'Fresh veggies with olive oil dressing',
    weight: '225g',
    price: 175,
    imgClass: 'img-exoticveg',
    emoji: '🥦',
  },
  {
    id: 6,
    name: 'Quinoa Veggie Salad',
    shortName: 'Quinoa Veggie',
    desc: 'Light, healthy & nutrient-rich',
    weight: '225g',
    price: 175,
    imgClass: 'img-quinoa',
    emoji: '🌾',
  },
];

/* ── DELIVERY SLOTS ──────────────────────── */
function generateDeliverySlots() {
  const slots = [];
  const now = new Date();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  for (let d = 0; d < 5; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const label = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : days[date.getDay()];
    const dateStr = `${date.getDate()} ${months[date.getMonth()]}`;

    // Only add today if current time is before 11am
    if (d === 0 && now.getHours() >= 11) continue;

    slots.push({
      value: `${dateStr} · 12:00 PM – 2:30 PM`,
      label: `${label}, ${dateStr} · 12pm – 2:30pm`,
    });
  }

  return slots;
}

/* ── CART STATE ──────────────────────────── */
let cart = {};

function loadCart() {
  try {
    const saved = localStorage.getItem('sb_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) { cart = {}; }
}

function saveCart() {
  try { localStorage.setItem('sb_cart', JSON.stringify(cart)); } catch (e) {}
}

function cartCount() {
  return Object.values(cart).reduce((s, q) => s + q, 0);
}

function cartTotal() {
  return cartCount() * CONFIG.PRICE_PER_SALAD;
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCartUI();
  updateMenuCards();
  showToast(`Added to cart 🥗`);
}

function removeFromCart(id) {
  if (!cart[id]) return;
  cart[id]--;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  updateCartUI();
  updateMenuCards();
}

function setQty(id, qty) {
  if (qty <= 0) { delete cart[id]; }
  else { cart[id] = qty; }
  saveCart();
  updateCartUI();
  updateMenuCards();
}

/* ── UPDATE UI ───────────────────────────── */
function updateCartUI() {
  const count = cartCount();
  const total = cartTotal();

  // Badge
  const badge = document.getElementById('cartBadge');
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);

  const navBadge = document.getElementById('navBadge');
  navBadge.textContent = count;
  navBadge.classList.toggle('show', count > 0);

  // Cart body
  const cartEmpty = document.getElementById('cartEmpty');
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalAmt = document.getElementById('cartTotalAmt');

  if (count === 0) {
    cartEmpty.style.display = 'block';
    cartItemsEl.innerHTML = '';
    cartFooter.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    cartTotalAmt.textContent = `₹${total}`;

    cartItemsEl.innerHTML = '';
    SALADS.forEach(salad => {
      const qty = cart[salad.id] || 0;
      if (qty === 0) return;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-img ${salad.imgClass}" style="width:52px;height:52px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:26px;">${salad.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${salad.shortName}</div>
          <div class="cart-item-price">₹${salad.price} × ${qty} = ₹${salad.price * qty}</div>
        </div>
        <div class="cart-item-ctrl">
          <button class="qty-btn" onclick="removeFromCart(${salad.id})" aria-label="Decrease">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="addToCart(${salad.id})" aria-label="Increase">+</button>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });
  }

  // Checkout total
  document.getElementById('checkoutTotal').textContent = `₹${total}`;
}

function updateMenuCards() {
  SALADS.forEach(salad => {
    const ctrl = document.getElementById(`ctrl-${salad.id}`);
    if (!ctrl) return;
    const qty = cart[salad.id] || 0;
    if (qty === 0) {
      ctrl.innerHTML = `<button class="card-add-btn" onclick="addToCart(${salad.id})">+ Add</button>`;
    } else {
      ctrl.innerHTML = `
        <div class="card-qty-ctrl">
          <button class="qty-btn" onclick="removeFromCart(${salad.id})" aria-label="Decrease">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="addToCart(${salad.id})" aria-label="Increase">+</button>
        </div>
      `;
    }
  });
}

/* ── RENDER MENU ─────────────────────────── */
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';

  SALADS.forEach((salad, i) => {
    const card = document.createElement('div');
    card.className = 'salad-card';
    card.style.animationDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="card-img-wrap">
        <div class="${salad.imgClass}" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:52px;">
          <span class="img-emoji">${salad.emoji}</span>
        </div>
        <div class="card-veg-dot"></div>
      </div>
      <div class="card-body">
        <div class="card-name">${salad.name}</div>
        <div class="card-desc">${salad.desc}</div>
        <div class="card-meta">
          <span class="card-weight">${salad.weight}</span>
          <span class="card-price">₹${salad.price}</span>
        </div>
        <div id="ctrl-${salad.id}">
          <button class="card-add-btn" onclick="addToCart(${salad.id})">+ Add</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ── CART DRAWER ─────────────────────────── */
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
  document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
  document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ── CHECKOUT ────────────────────────────── */
function openCheckout() {
  if (cartCount() === 0) { showToast('Your cart is empty!'); return; }
  closeCart();

  // Build order summary
  const summaryEl = document.getElementById('orderSummaryMini');
  let summaryHTML = '<div class="osi-title">🛒 Your Order</div>';
  SALADS.forEach(salad => {
    const qty = cart[salad.id] || 0;
    if (qty === 0) return;
    summaryHTML += `<div class="osi-item"><span class="osi-item-name">${salad.shortName} × ${qty}</span><span class="osi-item-price">₹${salad.price * qty}</span></div>`;
  });
  summaryEl.innerHTML = summaryHTML;

  // Populate delivery slots
  const select = document.getElementById('deliveryTime');
  select.innerHTML = '';
  const slots = generateDeliverySlots();
  slots.forEach(slot => {
    const opt = document.createElement('option');
    opt.value = slot.value;
    opt.textContent = slot.label;
    select.appendChild(opt);
  });
  if (slots.length === 0) {
    const opt = document.createElement('option');
    opt.value = 'Tomorrow · 12:00 PM – 2:30 PM';
    opt.textContent = 'Tomorrow · 12pm – 2:30pm';
    select.appendChild(opt);
  }

  const overlay = document.getElementById('checkoutOverlay');
  overlay.style.display = 'flex';
  setTimeout(() => overlay.classList.add('active'), 10);
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  overlay.classList.remove('active');
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
}

/* ── ORDER FORM ──────────────────────────── */
function validateForm() {
  let valid = true;
  const fields = [
    { id: 'custName', test: v => v.trim().length >= 2 },
    { id: 'custPhone', test: v => /^[+]?[\d\s\-]{10,13}$/.test(v.trim()) },
    { id: 'custAddress', test: v => v.trim().length >= 10 },
    { id: 'deliveryTime', test: v => v !== '' },
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const ok = f.test(el.value);
    el.classList.toggle('error', !ok);
    if (!ok) valid = false;
  });

  return valid;
}

function buildOrderSummaryText() {
  const lines = [];
  SALADS.forEach(salad => {
    const qty = cart[salad.id] || 0;
    if (qty > 0) lines.push(`${salad.name} × ${qty} = ₹${salad.price * qty}`);
  });
  return lines.join(', ');
}

function buildWhatsAppMessage(name, phone, address, time) {
  const items = buildOrderSummaryText();
  const total = cartTotal();
  const msg =
    `🥗 *New Salad Byte Order!*\n\n` +
    `👤 *Customer:* ${name}\n` +
    `📱 *Phone:* ${phone}\n` +
    `📦 *Items:* ${items}\n` +
    `💰 *Total:* ₹${total} (COD)\n` +
    `📍 *Address:* ${address}\n` +
    `⏰ *Delivery Slot:* ${time}\n\n` +
    `Prep ASAP! 🍃\n_Salad Byte – Pure Veg Power_`;
  return encodeURIComponent(msg);
}

let waURL = '';

function handleOrderSubmit(e) {
  e.preventDefault();
  if (!validateForm()) { showToast('Please fill all required fields'); return; }

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const time = document.getElementById('deliveryTime').value;
  const total = cartTotal();

  // Build WhatsApp URL
  const msgEncoded = buildWhatsAppMessage(name, phone, address, time);
  waURL = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msgEncoded}`;

  // Build success details
  const successDetails = document.getElementById('successDetails');
  let detailsHTML = `<strong>📋 Order Summary</strong><br/>`;
  SALADS.forEach(salad => {
    const qty = cart[salad.id] || 0;
    if (qty > 0) detailsHTML += `${salad.shortName} × ${qty}<br/>`;
  });
  detailsHTML += `<br/><strong>Total: ₹${total}</strong><br/>`;
  detailsHTML += `Delivery: ${time}<br/>`;
  detailsHTML += `To: ${address}`;
  successDetails.innerHTML = detailsHTML;

  // Close checkout
  closeCheckout();

  // Show success
  setTimeout(() => {
    const overlay = document.getElementById('successOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
  }, 300);

  // Auto-open WhatsApp after brief delay
  setTimeout(() => {
    window.open(waURL, '_blank');
  }, 1800);

  // Clear cart
  cart = {};
  saveCart();
  updateCartUI();
  updateMenuCards();
}

function closeSuccess() {
  const overlay = document.getElementById('successOverlay');
  overlay.classList.remove('active');
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  // Reset form
  document.getElementById('orderForm').reset();
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(el => el.classList.remove('error'));
}

/* ── SCROLL & NAV ────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });

  // Update active nav
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const section = id === 'heroSection' ? 'hero' : 'menu';
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.section === section) item.classList.add('active');
  });
}

/* ── TOAST ───────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ── PWA INSTALL ─────────────────────────── */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  // Could show an install banner here
});

/* ── SWIPE TO CLOSE CART ─────────────────── */
function initSwipeToClose() {
  const drawer = document.getElementById('cartDrawer');
  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  drawer.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  drawer.addEventListener('touchmove', e => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      drawer.style.transform = `translateY(${diff}px)`;
    }
  }, { passive: true });

  drawer.addEventListener('touchend', () => {
    isDragging = false;
    const diff = currentY - startY;
    if (diff > 100) {
      closeCart();
    }
    drawer.style.transform = '';
  });
}

/* ── INTERSECTION OBSERVER FOR NAV ──────── */
function initScrollSpy() {
  const hero = document.getElementById('heroSection');
  const menu = document.getElementById('menuSection');
  const navItems = document.querySelectorAll('.nav-item[data-section]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => item.classList.remove('active'));
        if (id === 'heroSection') {
          document.querySelector('[data-section="hero"]')?.classList.add('active');
        } else if (id === 'menuSection') {
          document.querySelector('[data-section="menu"]')?.classList.add('active');
        }
      }
    });
  }, { threshold: 0.5 });

  if (hero) observer.observe(hero);
  if (menu) observer.observe(menu);
}

/* ── INIT ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderMenu();
  updateCartUI();
  initSwipeToClose();
  initScrollSpy();

  // Event listeners
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('closeCartBtn').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
  document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckout);
  document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
  document.getElementById('successWaBtn').addEventListener('click', () => window.open(waURL, '_blank'));
  document.getElementById('successBackBtn').addEventListener('click', closeSuccess);
  document.getElementById('heroCtaBtn').addEventListener('click', () => scrollToSection('menuSection'));

  // Clear errors on input
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
});
