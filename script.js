/* ══════════════════════════════════════════════
   SALAD BYTE – script.js
   Day-scheduled menu · Sunday closed · Smart slots
══════════════════════════════════════════════ */
'use strict';

/* ── CONFIG ──────────────────────────────────── */
const CONFIG = {
  WHATSAPP_NUMBER: '918233787904',
  PRICE:           175,
  CUTOFF_HOUR:     9,   // 9 am – order window closes
};

/* ── DAY → SALAD SCHEDULE (0=Sun … 6=Sat) ──── */
const SCHEDULE = {
  0: null, // Sunday   – CLOSED
  1: 1,    // Monday   – Mix Sprout Power Salad
  2: 2,    // Tuesday  – Rajma & Tofu Protein Salad
  3: 3,    // Wednesday– Chatpata Chana Salad
  4: 4,    // Thursday – Soya Chunks & Paneer Salad
  5: 5,    // Friday   – Exotic Mix Veg Salad
  6: 6,    // Saturday – Quinoa Veggie Salad
};

const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ── MENU DATA ───────────────────────────────── */
const SALADS = [
  { id:1, day:1, name:'Mix Sprout Power Salad',      subtitle:'Fresh Mint Fusion', emoji:'💪', art:'🌱🥗🌿', img:'images/salad1.jpg',
    ingredients:'Mixed sprouts, paneer, lettuce, purple cabbage, cucumber, cherry tomato, carrot, beetroot, zucchini, baby corn · Mint dressing' },
  { id:2, day:2, name:'Rajma & Tofu Protein Salad',  subtitle:'Asian Crunch',      emoji:'🔥', art:'🫘🥢🔥', img:'images/salad2.jpg',
    ingredients:'Rajma, tofu, lettuce, cabbage, bell peppers, capsicum, zucchini · Peanut dressing' },
  { id:3, day:3, name:'Chatpata Chana Salad',         subtitle:'Desi Crunch',       emoji:'🌶️', art:'🌶️🥜🍋', img:'images/salad3.jpg',
    ingredients:'Kala chana, peanuts, lettuce, cabbage, cherry tomato, cucumber, carrot, beetroot · Lemon masala' },
  { id:4, day:4, name:'Soya Chunks & Paneer Salad',  subtitle:'Green Crunch',      emoji:'⭐', art:'🥦🧀⭐', img:'images/salad4.jpg',
    ingredients:'Soya chunks, paneer, lettuce, purple cabbage, broccoli, zucchini · Honey mustard dressing' },
  { id:5, day:5, name:'Exotic Mix Veg Salad',         subtitle:'Premium Bowl',      emoji:'🥦', art:'🥦🫑🥕', img:'images/salad5.jpg',
    ingredients:'Tofu, broccoli, zucchini, baby corn, bell peppers, carrot, beetroot, lettuce · Olive oil dressing' },
  { id:6, day:6, name:'Quinoa Veggie Salad',          subtitle:'Fresh Balance',     emoji:'🌾', art:'🌾🫛🍅', img:'images/salad6.jpg',
    ingredients:'Quinoa, chickpeas, lettuce, purple cabbage, cherry tomato, cucumber, zucchini · Lemon olive dressing' },
];

/* ══════════════════════════════════════════════
   SCHEDULE HELPERS
══════════════════════════════════════════════ */

function saladIdForDate(date) {
  return SCHEDULE[date.getDay()] ?? null;
}
function isSunday(date) { return date.getDay() === 0; }
function todayWindowOpen() { return new Date().getHours() < CONFIG.CUTOFF_HOUR; }

/**
 * Which salad should be ACTIVE on the menu right now?
 * – Today (if not Sunday + window open) → today's salad
 * – Else → next available weekday's salad
 */
function getActiveSaladId() {
  const now = new Date();
  if (!isSunday(now) && todayWindowOpen()) return saladIdForDate(now);
  for (let d = 1; d <= 7; d++) {
    const next = new Date(now);
    next.setDate(now.getDate() + d);
    if (!isSunday(next)) return saladIdForDate(next);
  }
  return 1;
}

/** Salad id for whichever slot is currently selected in checkout dropdown */
function getSlotSaladId() {
  const sel = document.getElementById('deliveryTime');
  if (!sel || !sel.options.length) return null;
  const dayNum = parseInt(sel.options[sel.selectedIndex]?.dataset.day, 10);
  return isNaN(dayNum) ? null : (SCHEDULE[dayNum] ?? null);
}

/** Info about the next non-Sunday delivery day */
function nextAvailableInfo() {
  const now = new Date();
  for (let d = 1; d <= 7; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    if (!isSunday(date)) {
      const salad = SALADS.find(s => s.id === saladIdForDate(date));
      return {
        label:   `${d === 1 ? 'Tomorrow' : DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`,
        dayName: DAY_NAMES[date.getDay()],
        salad,
      };
    }
  }
  return { label: 'Monday', dayName: 'Monday', salad: SALADS[0] };
}

/* ══════════════════════════════════════════════
   SUNDAY CLOSED SCREEN
══════════════════════════════════════════════ */
function renderSundayScreen() {
  const next   = nextAvailableInfo();
  const heroEl = document.getElementById('heroSection');
  if (heroEl) {
    heroEl.innerHTML = `
      <div class="sunday-screen">
        <div class="sunday-icon">😴</div>
        <h2 class="sunday-title">We're Closed Today</h2>
        <p class="sunday-sub">Sundays are our prep day so we can serve<br/>fresh bowls all week!</p>
        <div class="sunday-next">
          <span class="sunday-next-label">Next delivery</span>
          <span class="sunday-next-day">${next.label}</span>
          <span class="sunday-next-item">${next.salad ? next.salad.emoji + ' ' + next.salad.name : '🌱 Mix Sprout Power Salad'}</span>
        </div>
        <p class="sunday-note">But you can still pre-order below for the week ahead 👇</p>
      </div>`;
  }
  // Show a warning banner instead of hiding the menu
  const banner = document.getElementById('cutoffBanner');
  if (banner) {
    banner.innerHTML = `
      <div class="cutoff-msg warn">
        <span class="banner-row"><strong>😴 Closed today (Sunday)</strong> — Pre-order for the week ahead!</span>
        <span class="banner-row small">📍 Kharadi · Magarpatta · Amanora · Delivery 12pm–2:30pm</span>
      </div>`;
  }
}

/* ══════════════════════════════════════════════
   INFO BANNER
══════════════════════════════════════════════ */
function renderBanner() {
  const banner = document.getElementById('cutoffBanner');
  if (!banner) return;
  const now        = new Date();
  const todaySalad = SALADS.find(s => s.id === saladIdForDate(now));
  const dayName    = DAY_NAMES[now.getDay()];

  if (todayWindowOpen()) {
    banner.innerHTML = `
      <div class="cutoff-msg">
        <span class="banner-row"><strong>Today · ${dayName}:</strong> ${todaySalad ? todaySalad.emoji + ' ' + todaySalad.name : '—'}</span>
        <span class="banner-row small">Order before 9am · Delivery 12pm–2:30pm · 📍 Kharadi · Magarpatta · Amanora</span>
      </div>`;
  } else {
    const next = nextAvailableInfo();
    banner.innerHTML = `
      <div class="cutoff-msg warn">
        <span class="banner-row"><strong>⏰ Today's order window is closed.</strong> Pre-ordering for ${next.label}</span>
        <span class="banner-row small">${next.salad ? next.salad.emoji + ' ' + next.salad.name : ''} · 📍 Kharadi · Magarpatta · Amanora</span>
      </div>`;
  }
}

/* ══════════════════════════════════════════════
   RENDER MENU CARDS
══════════════════════════════════════════════ */
function renderMenu() {
  const list = document.getElementById('menuList');
  list.innerHTML = '';
  SALADS.forEach((s, i) => {
    const div = document.createElement('div');
    div.id    = `card-${s.id}`;
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
        <div class="card-day-badge" id="daybadge-${s.id}"></div>
      </div>
      <div class="card-content">
        <div class="card-name">${s.name}</div>
        <div class="card-subtitle">${s.subtitle} ${s.emoji}</div>
        <div class="card-ingredients">${s.ingredients}</div>
        <div class="card-bottom">
          <div class="card-price-wrap">
            <span class="card-price">₹${CONFIG.PRICE}</span>
            <span class="card-weight">225g</span>
          </div>
          <div class="card-ctrl" id="ctrl-${s.id}"></div>
        </div>
        <div class="card-unavail-msg" id="unavail-${s.id}" style="display:none"></div>
      </div>`;
    list.appendChild(div);
  });
  applyCardStates();
}

/**
 * applyCardStates(overrideId?)
 * Highlights the salad for the active day, greys out others.
 * Pass overrideId when checkout slot changes.
 */
function applyCardStates(overrideId) {
  const activeId = overrideId ?? getActiveSaladId();

  SALADS.forEach(s => {
    const card    = document.getElementById(`card-${s.id}`);
    const badge   = document.getElementById(`daybadge-${s.id}`);
    const unavail = document.getElementById(`unavail-${s.id}`);
    const ctrl    = document.getElementById(`ctrl-${s.id}`);
    if (!card) return;

    const isActive = s.id === activeId;

    // Day badge on image
    if (badge) {
      badge.textContent = DAY_NAMES[s.day];
      badge.className   = `card-day-badge ${isActive ? 'badge-active' : 'badge-inactive'}`;
    }

    // Grey/ungrey entire card
    card.classList.toggle('card-greyed', !isActive);

    // "Available on Xdays" message
    if (unavail) {
      unavail.style.display = isActive ? 'none' : 'block';
      unavail.textContent   = `Available on ${DAY_NAMES[s.day]}s`;
    }

    // Add / qty buttons
    if (!ctrl) return;
    if (!isActive) {
      ctrl.innerHTML = `<button class="add-btn add-btn-disabled" disabled>Not Today</button>`;
    } else {
      const qty = cart[s.id] || 0;
      ctrl.innerHTML = qty === 0
        ? `<button class="add-btn" onclick="addItem(${s.id})">+ Add</button>`
        : `<div class="qty-ctrl">
             <button class="qty-btn" onclick="removeItem(${s.id})">−</button>
             <span class="qty-num">${qty}</span>
             <button class="qty-btn" onclick="addItem(${s.id})">+</button>
           </div>`;
    }
  });
}

/* ══════════════════════════════════════════════
   CART
══════════════════════════════════════════════ */
let cart = {};

function loadCart() {
  try {
    const saved = localStorage.getItem('sb_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (_) { cart = {}; }
  // Only purge items whose salad day has already passed today (stale orders)
  // Items for today or future days are kept
  const now = new Date();
  const todayDay = now.getDay();
  Object.keys(cart).forEach(k => {
    const salad = SALADS.find(s => s.id === parseInt(k));
    if (!salad) { delete cart[k]; }
    // If it's past cutoff today and item is today's salad, keep it — they may have pre-ordered
    // Only delete if salad day was yesterday or earlier this week and window is closed
  });
}
function saveCart() { try { localStorage.setItem('sb_cart', JSON.stringify(cart)); } catch (_) {} }
function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
function cartTotal()  { return cartCount() * CONFIG.PRICE; }

function addItem(id) {
  const activeId = getActiveSaladId();
  if (id !== activeId) {
    const s = SALADS.find(s => s.id === id);
    showToast(`${s.name} is available on ${DAY_NAMES[s.day]}s only`);
    return;
  }
  cart[id] = (cart[id] || 0) + 1;
  saveCart(); syncUI(); applyCardStates();
  const s = SALADS.find(s => s.id === id);
  showToast(`${s.emoji} Added to cart!`);
}

function removeItem(id) {
  if (!cart[id]) return;
  cart[id]--;
  if (cart[id] <= 0) delete cart[id];
  saveCart(); syncUI(); applyCardStates();
}

/* ══════════════════════════════════════════════
   SYNC UI  (badges + cart drawer)
══════════════════════════════════════════════ */
function syncUI() {
  const count = cartCount();
  const total = cartTotal();

  ['cartBadge','navBadge'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count;
    el.classList.toggle('show', count > 0);
  });

  const empty    = document.getElementById('cartEmpty');
  const itemsEl  = document.getElementById('cartItems');
  const footer   = document.getElementById('cartFooter');
  const totalAmt = document.getElementById('cartTotalAmt');

  if (count === 0) {
    if (empty)   empty.style.display = 'block';
    if (itemsEl) itemsEl.innerHTML   = '';
    if (footer)  footer.classList.remove('show');
  } else {
    if (empty)    empty.style.display = 'none';
    if (footer)   footer.classList.add('show');
    if (totalAmt) totalAmt.textContent = `₹${total}`;
    if (itemsEl) {
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
  }
  const ct = document.getElementById('checkoutTotal');
  if (ct) ct.textContent = `₹${total}`;
}

/* ══════════════════════════════════════════════
   DELIVERY SLOTS  (skip Sundays, respect cutoff)
══════════════════════════════════════════════ */
function buildSlots() {
  const slots = [];
  const now   = new Date();
  for (let d = 0; d < 9; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    if (isSunday(date)) continue;
    if (d === 0 && !todayWindowOpen()) continue;
    const dayLabel = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : DAY_NAMES[date.getDay()];
    const dateStr  = `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
    const saladId  = saladIdForDate(date);
    const salad    = SALADS.find(s => s.id === saladId);
    slots.push({
      value:   `${dayLabel} ${dateStr} · 12:00pm–2:30pm`,
      label:   `${dayLabel}, ${dateStr} – ${salad ? salad.name : ''}`,
      dayNum:  date.getDay(),
      saladId,
    });
  }
  return slots;
}

/* ══════════════════════════════════════════════
   CART DRAWER
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   CHECKOUT
══════════════════════════════════════════════ */
function openCheckout() {
  if (cartCount() === 0) { showToast('Add a salad first!'); return; }
  closeCart();

  // Mini order summary
  const mini = document.getElementById('orderMini');
  let html = `<div class="order-mini-title">Your Order</div>`;
  SALADS.forEach(s => {
    const q = cart[s.id] || 0;
    if (q) html += `<div class="order-mini-item"><span>${s.name} × ${q}</span><span>₹${CONFIG.PRICE * q}</span></div>`;
  });
  mini.innerHTML = html;

  // Build delivery slots
  const sel   = document.getElementById('deliveryTime');
  const slots = buildSlots();
  sel.innerHTML = '';
  if (!slots.length) {
    const next = nextAvailableInfo();
    const o = document.createElement('option');
    o.value = `${next.label} · 12:00pm–2:30pm`;
    o.textContent  = `${next.label} – ${next.salad?.name ?? ''}`;
    o.dataset.day  = next.salad?.day ?? 1;
    sel.appendChild(o);
  } else {
    slots.forEach(sl => {
      const o = document.createElement('option');
      o.value          = sl.value;
      o.textContent    = sl.label;
      o.dataset.day    = sl.dayNum;
      o.dataset.saladId = sl.saladId;
      sel.appendChild(o);
    });
  }

  // When slot changes → update card highlight + mini summary, DO NOT touch cart
  sel.onchange = () => {
    const newSaladId = getSlotSaladId();
    applyCardStates(newSaladId);

    // Refresh mini summary to show what's in cart (unchanged)
    let h = `<div class="order-mini-title">Your Order</div>`;
    const hasItems = SALADS.some(s => cart[s.id]);
    if (hasItems) {
      SALADS.forEach(s => {
        const q = cart[s.id] || 0;
        if (q) h += `<div class="order-mini-item"><span>${s.name} × ${q}</span><span>₹${CONFIG.PRICE * q}</span></div>`;
      });
    } else {
      const salad = SALADS.find(s => s.id === newSaladId);
      h += `<div class="order-mini-item" style="color:var(--text-3)"><span>Go back and add ${salad?.name ?? 'the salad for this day'}</span></div>`;
    }
    mini.innerHTML = h;
    document.getElementById('checkoutTotal').textContent = `₹${cartTotal()}`;
  };

  document.getElementById('checkoutTotal').textContent = `₹${cartTotal()}`;
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
  applyCardStates(); // restore to real today/next view
}

/* ══════════════════════════════════════════════
   FORM SUBMIT
══════════════════════════════════════════════ */
let waURL = '';

function validateForm() {
  let ok = true;
  [
    { id:'custName',     fn: v => v.trim().length >= 2 },
    { id:'custPhone',    fn: v => /^[+\d\s\-]{10,13}$/.test(v.trim()) },
    { id:'custArea',     fn: v => v !== '' },
    { id:'custAddress',  fn: v => v.trim().length >= 8 },
    { id:'deliveryTime', fn: v => v !== '' },
  ].forEach(r => {
    const el   = document.getElementById(r.id);
    const pass = r.fn(el.value);
    el.classList.toggle('err', !pass);
    if (!pass) ok = false;
  });
  if (cartCount() === 0) { showToast('Your cart is empty!'); return false; }
  return ok;
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  loadCart();
  renderMenu();
  syncUI();

  // Sunday: show closed notice in hero + banner, but keep full menu for pre-ordering
  if (isSunday(new Date())) {
    renderSundayScreen();
  } else {
    renderBanner();
  }

  initSwipe();
  initScrollSpy();

  document.querySelectorAll('#orderForm input, #orderForm textarea, #orderForm select')
    .forEach(el => el.addEventListener('input', () => el.classList.remove('err')));

  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('closeCartBtn').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
  document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckout);
  document.getElementById('heroCtaBtn').addEventListener('click', () => scrollToSection('menuSection'));

  document.getElementById('orderForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) { showToast('Please fill in all fields correctly'); return; }

    const name    = document.getElementById('custName').value.trim();
    const phone   = document.getElementById('custPhone').value.trim();
    const area    = document.getElementById('custArea').value;
    const address = document.getElementById('custAddress').value.trim();
    const slot    = document.getElementById('deliveryTime').value;
    const total   = cartTotal();

    const itemLines = SALADS
      .filter(s => cart[s.id])
      .map(s => `${s.name} × ${cart[s.id]} (₹${CONFIG.PRICE * cart[s.id]})`)
      .join(', ');

    waURL = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `🥗 *New Salad Byte Order!*\n\n` +
      `👤 *Name:* ${name}\n📱 *Phone:* ${phone}\n📍 *Area:* ${area}\n` +
      `🏠 *Address:* ${address}\n🛒 *Items:* ${itemLines}\n` +
      `💰 *Total:* ₹${total} (Cash on Delivery)\n⏰ *Slot:* ${slot}\n\nPlease confirm ASAP! 🍃`
    )}`;

    let detail = `<strong>Order Summary</strong><br/>`;
    SALADS.filter(s => cart[s.id]).forEach(s => { detail += `${s.name} × ${cart[s.id]}<br/>`; });
    detail += `<br/><strong>Total: ₹${total}</strong><br/>Slot: ${slot}<br/>${area} – ${address}`;
    document.getElementById('successDetail').innerHTML = detail;

    closeCheckout();
    setTimeout(() => {
      const ov = document.getElementById('successOverlay');
      ov.style.display = 'flex';
      requestAnimationFrame(() => ov.classList.add('active'));
      document.body.style.overflow = 'hidden';
    }, 300);
    setTimeout(() => window.open(waURL, '_blank'), 1600);

    cart = {}; saveCart(); syncUI(); applyCardStates();
    document.getElementById('orderForm').reset();
  });

  document.getElementById('successWaBtn').addEventListener('click', () => window.open(waURL, '_blank'));
  document.getElementById('successBackBtn').addEventListener('click', () => {
    const ov = document.getElementById('successOverlay');
    ov.classList.remove('active');
    setTimeout(() => { ov.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
  });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
});

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function scrollToSection(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }

let toastT;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

function initSwipe() {
  const drawer = document.getElementById('cartDrawer');
  let startY = 0, curY = 0, dragging = false;
  drawer.addEventListener('touchstart', e => { startY = e.touches[0].clientY; dragging = true; }, { passive:true });
  drawer.addEventListener('touchmove',  e => {
    if (!dragging) return;
    curY = e.touches[0].clientY;
    const d = curY - startY;
    if (d > 0) drawer.style.transform = `translateY(${d}px)`;
  }, { passive:true });
  drawer.addEventListener('touchend', () => {
    dragging = false;
    if (curY - startY > 90) closeCart();
    drawer.style.transform = '';
  });
}

function initScrollSpy() {
  const map = { heroSection:'home', menuSection:'menu' };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const key = map[e.target.id];
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`.nav-btn[data-nav="${key}"]`)?.classList.add('active');
    });
  }, { threshold: 0.5 });
  Object.keys(map).forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
}
