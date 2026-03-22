# 🥗 Salad Byte – Pure Veg Power Salads

A mobile-first food ordering PWA for Pune IT professionals.

## 📁 File Structure

```
salad-byte/
├── index.html       # Main app (single file)
├── style.css        # All styles (mobile-first)
├── script.js        # Cart, checkout, WhatsApp, PWA logic
├── manifest.json    # PWA manifest
├── sw.js            # Service Worker (offline support)
├── icons/
│   ├── icon-192.png # PWA icon (192×192)
│   └── icon-512.png # PWA icon (512×512)
└── README.md        # This file
```

## ⚙️ Setup Before Launch

### 1. Set Your WhatsApp Number
In `script.js`, line 11:
```js
WHATSAPP_NUMBER: '918233787904',  // ← Change to your number (91 + 10 digits, no +)
```

### 2. Set Your Google Form URL (optional)
In `script.js`, line 12:
```js
GOOGLE_FORM_URL: 'https://forms.gle/YOUR_FORM_ID',  // ← Your Google Form link
```

### 3. Add PWA Icons
Place two PNG icons in the `icons/` folder:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

Use a green background (`#1a3a1a`) with the 🥗 emoji for branding.

## 🚀 Deploy to GitHub Pages

```bash
# 1. Create a new repo on GitHub

# 2. Push files
git init
git add .
git commit -m "🥗 Initial Salad Byte deploy"
git remote add origin https://github.com/YOUR_USERNAME/salad-byte.git
git push -u origin main

# 3. Go to Repo Settings → Pages → Source: main branch → Save
# Site goes live at: https://YOUR_USERNAME.github.io/salad-byte/
```

## 🌐 Deploy to Netlify (even easier)

1. Go to https://netlify.com
2. Drag & drop the `salad-byte/` folder
3. Done! Your site is live instantly.

## 📱 Features

- ✅ Mobile-first responsive design (375px optimized)
- ✅ App-like bottom navigation
- ✅ Swipeable cart drawer
- ✅ Cart with quantity controls (+/-)
- ✅ LocalStorage cart persistence
- ✅ WhatsApp order notification
- ✅ Delivery slot picker (12pm–2:30pm)
- ✅ Form validation
- ✅ PWA installable (add to home screen)
- ✅ Service Worker for offline support
- ✅ CSS animations & micro-interactions
- ✅ No frameworks, no build tools needed

## 📲 How Orders Work

1. Customer adds salads → taps **Proceed to Order**
2. Fills Name, Phone, Address, Delivery Slot
3. Taps **Place Order**
4. Success screen appears
5. WhatsApp auto-opens with pre-filled order message to your number
6. Customer gets confirmation

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#1a3a1a` (Deep Forest Green) |
| Accent | `#ff6b2b` (Vibrant Orange) |
| Highlight | `#ffd43b` (Warm Yellow) |
| Font Display | Syne (Google Fonts) |
| Font Body | DM Sans (Google Fonts) |

## 📞 Contact & Support

Salad Byte – Pune's freshest pure veg salads
Phone: +91-82337-87904
