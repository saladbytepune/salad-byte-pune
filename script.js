/* ══════════════════════════════════════════════
   SALAD BYTE v2 – script.js
══════════════════════════════════════════════ */
'use strict';

/* ── CONFIG ──────────────────────────────── */
const CONFIG = {
  WHATSAPP_NUMBER: '918233787904',
  PRICE: 175,
  ORDER_CUTOFF_HOUR: 9, // 9am
  DELIVERY_AREAS: ['Kharadi', 'Magarpatta', 'Amanora'],
};

/* ── MENU DATA ───────────────────────────── */
const SALADS = [
  {
    id: 1,
    name: 'Mix Sprout Power Salad',
    subtitle: 'Fresh Mint Fusion',
    emoji: '💪',
    art: '🌱🥗🌿',
    img: 'images/salad1.jpg',
    ingredients: 'Mixed sprouts, paneer, lettuce, purple cabbage, cucumber, cherry tomato, carrot, beetroot, zucchini, baby corn · Mint dressing',
  },
  {
    id: 2,
    name: 'Rajma & Tofu Protein Salad',
    subtitle: 'Asian Crunch',
    emoji: '🔥',
    art: '🫘🥢🔥',
    img: 'images/salad2.jpg',
    ingredients: 'Rajma, tofu, lettuce, cabbage, bell peppers, capsicum, zucchini · Peanut dressing',
  },
  {
    id: 3,
    name: 'Chatpata Chana Salad',
    subtitle: 'Desi Crunch',
    emoji: '🌶️',
    art: '🌶️🥜🍋',
    img: 'images/salad3.jpg',
    ingredients: 'Kala chana, peanuts, lettuce, cabbage, cherry tomato, cucumber, carrot, beetroot · Lemon masala',
  },
  {
    id: 4,
    name: 'Soya Chunks & Paneer Salad',
    subtitle: 'Green Crunch',
    emoji: '⭐',
    art: '🥦🧀⭐',
    img: 'images/salad4.jpg',
    ingredients: 'Soya chunks, paneer, lettuce, purple cabbage, broccoli, zucchini · Honey mustard dressing',
  },
  {
    id: 5,
    name: 'Exotic Mix Veg Salad',
    subtitle: 'Premium Bowl',
    emoji: '🥦',
    art: '🥦🫑🥕',
    img: 'images/salad5.jpg',
    ingredients: 'Tofu, broccoli, zucchini, baby corn, bell peppers, carrot, beetroot, lettuce · Olive oil dressing',
  },
  {
    id: 6,
    name: 'Quinoa Veggie Salad',
    subtitle: 'Fresh Balance',
    emoji: '🌾',
    art: '🌾🫛🍅',
    img: 'images/salad6.jpg',
    ingredients: 'Quinoa, chickpeas, lettuce, purple cabbage, cherry tomato, cucumber, zucchini · Lemon olive dressing',
  },
];

/* ── DELIVERY SLOTS ──────────────────────── */
function buildSlots() {
  const slots = [];
  const now = new Date();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  for (let d = 0; d < 6; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);

    // Skip today if past cutoff
    if (d === 0 && now.getHours() >= CONFIG.ORDER_CUTOFF_HOUR) continue;

    const dayLabel = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : days[date.getDay()];
    const dateStr = `${date.getDate()} ${months[date.getMonth()]}`;

    slots.push({
      value: `${dayLabel} ${dateStr} · 12:00pm – 2:30pm`,
      label: `${dayLabel}, ${dateStr} · 12pm – 2:30pm`,
    });
  }
  return slots;
}

/* ── CART ────────────────────────────────── */
let cart = {};

function loadCart() {
  try { const s = localStorage.getItem('sb2_cart'); if (s) cart = JSON.parse(s); } catch(_) { cart = {}; }
}
function saveCart() {
  try { localStorage.setItem('sb2_cart', JSON.stringify(cart)); } catch(_) {}
}
function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
function cartTotal() { return cartCount() * CONFIG.PRICE; }

function addItem(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart(); syncUI(); syncCards();
  const s = SALADS.find(s => s.id === id);
  showToast(`${s.emoji} ${s.name.split(' ').slice(0,2).join(' ')} added`);
}
function removeItem(id) {
  if (!cart[id]) return;
  cart[id]--;
  if (cart[id] <= 0) delete cart[id];
  saveCart(); syncUI(); syncCards();
}

/* ── RENDER MENU ─────────────────────────── */
function renderMenu() {
  const list = document.getElementById('menuList');
  list.innerHTML = '';
  SALADS.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'salad-card';
    div.style.animationDelay = `${i * 0.06}s`;
    div.innerHTML = `
      <div class="card-img-col">
        <div class="card-art card-art-${s.id}">
          <img class="card-real-img" src="${s.img}" alt="${s.name}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="card-art-emojis" style="display:none">${s.art}</div>
        </div>
        <div class="veg-dot"></div>
      </div>
      <div class="card-content">
        <div class="card-name">${s.name}</div>
        <div class="card-subtitle">${s.subtitle} ${s.emoji}</div>
        <div class="card-ingredients">${s.ingredients}</div>
        <div class="card-bottom">
          <div class="card-price-wrap">
            <span class="card-price">₹${s.price || CONFIG.PRICE}</span>
            <span class="card-weight">225g</span>
          </div>
          <div class="card-ctrl" id="ctrl-${s.id}"></div>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

function syncCards() {
  SALADS.forEach(s => {
    const ctrl = document.getElementById(`ctrl-${s.id}`);
    if (!ctrl) return;
    const qty = cart[s.id] || 0;
    if (qty === 0) {
      ctrl.innerHTML = `<button class="add-btn" onclick="addItem(${s.id})">+ Add</button>`;
    } else {
      ctrl.innerHTML = `
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="removeItem(${s.id})">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="addItem(${s.id})">+</button>
        </div>`;
    }
  });
}

/* ── SYNC GLOBAL UI ──────────────────────── */
function syncUI() {
  const count = cartCount();
  const total = cartTotal();

  // Header badge
  const badge = document.getElementById('cartBadge');
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);

  // Nav badge
  const navB = document.getElementById('navBadge');
  navB.textContent = count;
  navB.classList.toggle('show', count > 0);

  // Cart drawer
  const empty = document.getElementById('cartEmpty');
  const itemsEl = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const totalAmt = document.getElementById('cartTotalAmt');

  if (count === 0) {
    empty.style.display = 'block';
    itemsEl.innerHTML = '';
    footer.classList.remove('show');
  } else {
    empty.style.display = 'none';
    footer.classList.add('show');
    totalAmt.textContent = `₹${total}`;

    itemsEl.innerHTML = '';
    SALADS.forEach(s => {
      const qty = cart[s.id] || 0;
      if (!qty) return;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-thumb card-art card-art-${s.id}">
          <img class="card-real-img" src="${s.img}" alt="${s.name}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="card-art-emojis" style="display:none;font-size:18px">${s.art}</div>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${s.name}</div>
          <div class="cart-item-price">₹${CONFIG.PRICE} × ${qty} = ₹${CONFIG.PRICE * qty}</div>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="removeItem(${s.id})">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="addItem(${s.id})">+</button>
        </div>`;
      itemsEl.appendChild(el);
    });
  }

  // Checkout total
  document.getElementById('checkoutTotal').textContent = `₹${total}`;
}

/* ── CUTOFF BANNER ──────────────────────── */
function renderCutoffBanner() {
  const banner = document.getElementById('cutoffBanner');
  const now = new Date();
  const h = now.getHours();

  if (h < CONFIG.ORDER_CUTOFF_HOUR) {
    banner.innerHTML = `<div class="cutoff-msg">✅ Order before 9am · Lunch delivery 12pm–2:30pm · 📍 Kharadi · Magarpatta · Amanora</div>`;
  } else {
    banner.innerHTML = `<div class="cutoff-msg warn">⏰ Today's order window is closed — pre-order for tomorrow's lunch! 📍 Kharadi · Magarpatta · Amanora</div>`;
  }
}

/* ── CART DRAWER ─────────────────────────── */
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

/* ── CHECKOUT ────────────────────────────── */
function openCheckout() {
  if (cartCount() === 0) { showToast('Add some salads first!'); return; }
  closeCart();

  // Mini order summary
  const mini = document.getElementById('orderMini');
  let html = `<div class="order-mini-title">Your Order</div>`;
  SALADS.forEach(s => {
    const q = cart[s.id] || 0;
    if (q) html += `<div class="order-mini-item"><span>${s.name} × ${q}</span><span>₹${CONFIG.PRICE * q}</span></div>`;
  });
  mini.innerHTML = html;

  // Delivery slots
  const sel = document.getElementById('deliveryTime');
  sel.innerHTML = '';
  const slots = buildSlots();
  if (!slots.length) {
    const o = document.createElement('option');
    o.value = 'Tomorrow · 12:00pm – 2:30pm';
    o.textContent = 'Tomorrow · 12pm – 2:30pm';
    sel.appendChild(o);
  } else {
    slots.forEach(sl => {
      const o = document.createElement('option');
      o.value = sl.value; o.textContent = sl.label;
      sel.appendChild(o);
    });
  }

  const overlay = document.getElementById('checkoutOverlay');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('active'));
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  overlay.classList.remove('active');
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
}

/* ── ORDER SUBMIT ────────────────────────── */
let waURL = '';

function validate() {
  let ok = true;
  const rules = [
    { id: 'custName',    fn: v => v.trim().length >= 2 },
    { id: 'custPhone',   fn: v => /^[+\d\s\-]{10,13}$/.test(v.trim()) },
    { id: 'custArea',    fn: v => v !== '' },
    { id: 'custAddress', fn: v => v.trim().length >= 8 },
    { id: 'deliveryTime',fn: v => v !== '' },
  ];
  rules.forEach(r => {
    const el = document.getElementById(r.id);
    const pass = r.fn(el.value);
    el.classList.toggle('err', !pass);
    if (!pass) ok = false;
  });
  return ok;
}

document.addEventListener('DOMContentLoaded', () => {

  loadCart();
  renderMenu();
  syncUI();
  syncCards();
  renderCutoffBanner();
  initSwipe();
  initScrollSpy();

  /* Form: clear error on input */
  document.querySelectorAll('#orderForm input, #orderForm textarea, #orderForm select').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('err'));
  });

  /* Header */
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('closeCartBtn').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
  document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckout);
  document.getElementById('heroCtaBtn').addEventListener('click', () => scrollToSection('menuSection'));

  /* Order form */
  document.getElementById('orderForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) { showToast('Please fill in all fields correctly'); return; }

    const name    = document.getElementById('custName').value.trim();
    const phone   = document.getElementById('custPhone').value.trim();
    const area    = document.getElementById('custArea').value;
    const address = document.getElementById('custAddress').value.trim();
    const slot    = document.getElementById('deliveryTime').value;
    const total   = cartTotal();

    // Build item list
    const itemLines = SALADS
      .filter(s => cart[s.id])
      .map(s => `${s.name} × ${cart[s.id]} (₹${CONFIG.PRICE * cart[s.id]})`)
      .join(', ');

    // WhatsApp message
    const msg = encodeURIComponent(
      `🥗 *New Salad Byte Order!*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📱 *Phone:* ${phone}\n` +
      `📍 *Area:* ${area}\n` +
      `🏠 *Address:* ${address}\n` +
      `🛒 *Items:* ${itemLines}\n` +
      `💰 *Total:* ₹${total} (Cash on Delivery)\n` +
      `⏰ *Slot:* ${slot}\n\n` +
      `Please confirm ASAP! 🍃`
    );
    waURL = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`;

    // Success detail
    let detail = `<strong>Order Summary</strong><br/>`;
    SALADS.filter(s => cart[s.id]).forEach(s => {
      detail += `${s.name} × ${cart[s.id]}<br/>`;
    });
    detail += `<br/><strong>Total: ₹${total}</strong><br/>`;
    detail += `Slot: ${slot}<br/>`;
    detail += `${area} – ${address}`;
    document.getElementById('successDetail').innerHTML = detail;

    closeCheckout();

    setTimeout(() => {
      const ov = document.getElementById('successOverlay');
      ov.style.display = 'flex';
      requestAnimationFrame(() => ov.classList.add('active'));
      document.body.style.overflow = 'hidden';
    }, 300);

    // Auto-open WA
    setTimeout(() => window.open(waURL, '_blank'), 1600);

    // Clear cart
    cart = {}; saveCart(); syncUI(); syncCards();
    document.getElementById('orderForm').reset();
  });

  /* Success buttons */
  document.getElementById('successWaBtn').addEventListener('click', () => window.open(waURL, '_blank'));
  document.getElementById('successBackBtn').addEventListener('click', () => {
    const ov = document.getElementById('successOverlay');
    ov.classList.remove('active');
    setTimeout(() => { ov.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
  });

  /* PWA */
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
});

/* ── HELPERS ─────────────────────────────── */
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

let toastT;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

/* Swipe-to-close cart */
function initSwipe() {
  const drawer = document.getElementById('cartDrawer');
  let startY = 0, curY = 0, dragging = false;
  drawer.addEventListener('touchstart', e => { startY = e.touches[0].clientY; dragging = true; }, { passive: true });
  drawer.addEventListener('touchmove', e => {
    if (!dragging) return;
    curY = e.touches[0].clientY;
    const d = curY - startY;
    if (d > 0) drawer.style.transform = `translateY(${d}px)`;
  }, { passive: true });
  drawer.addEventListener('touchend', () => {
    dragging = false;
    if (curY - startY > 90) closeCart();
    drawer.style.transform = '';
  });
}

/* Scroll spy for bottom nav */
function initScrollSpy() {
  const sections = { heroSection: 'home', menuSection: 'menu' };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const key = sections[e.target.id];
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.nav-btn[data-nav="${key}"]`)?.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  Object.keys(sections).forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
}
