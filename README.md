# 💕 Valentine Cinematic Experience — Ultimate Edition

A premium, cinematic Valentine interactive web experience built with **pure HTML, CSS & Vanilla JavaScript**. No frameworks, no libraries, no build tools.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💌 Personalized Entry | Name input with localStorage + URL `?name=` support |
| 🌟 Neon Name Reveal | Cinematic neon glow with sparkle particles |
| 💕 Love Quiz | 5 romantic questions with heart progress bar |
| 🎮 Mini Game | 10-second catch-the-hearts game |
| 💍 Forever Question | Interactive YES/NO with moving NO button |
| 📸 Memory Slideshow | Ken Burns zoom + crossfade transitions |
| 🔐 Secret Lock | Numeric keypad with hints + URL `?code=` override |
| ✉️ Envelope Animation | 3D envelope open + love letter reveal |
| 📱 QR Code | Pure JS QR generator — no libraries |
| 🔊 Music System | Fade-in, toggle, volume control |
| 📤 Share | Web Share API + clipboard fallback |
| 📲 PWA | Service worker + install prompt + offline support |

## 📁 Project Structure

```
valentine/
├── index.html          ← Main page
├── favicon.ico         ← Tab icon
├── manifest.json       ← PWA manifest
├── service-worker.js   ← Offline cache
├── css/
│   └── style.css       ← Design system (~600 lines)
├── js/
│   └── script.js       ← Game logic + QR (~700 lines)
├── assets/
│   ├── romantic.mp3    ← Background music (add your own)
│   ├── hearts.svg      ← Animated heart icon
│   ├── stars.png       ← Optional decorative stars
│   └── memories/
│       ├── memory1.jpg ← Your photo (add your own)
│       ├── memory2.jpg ← Your photo (add your own)
│       └── memory3.jpg ← Your photo (add your own)
└── README.md
```

## 🚀 Deploy

1. **Add your assets:**
   - Drop your `romantic.mp3` into `assets/romantic.mp3`
   - Add your photos as `assets/memories/memory1.jpg`, `memory2.jpg`, `memory3.jpg`

2. **Deploy to Vercel:**
   - Push to GitHub
   - Import project on [Vercel](https://vercel.com)
   - Deploy
   - Done ✅

3. **Share:**
   - Send the link with `?name=TheirName` to personalize
   - Example: `https://your-site.vercel.app/?name=Sarah`

## 🔐 Secret Code

The default lock code is `0214` (February 14th).
Override via URL: `?code=1234`

## 🛠 Tech Stack

- **HTML5** — Semantic, accessible, SEO meta + Open Graph
- **CSS3** — Custom properties, glassmorphism, keyframe animations, `clamp()`, responsive
- **Vanilla JS** — IIFE module, Canvas 2D, Web Audio API, localStorage, Service Worker
- **Fonts** — Playfair Display + Poppins (Google Fonts)
- **Zero dependencies** — No frameworks, no npm, no build step

## 📱 Compatibility

- Chrome, Firefox, Safari, Edge (modern versions)
- Mobile-first responsive design
- `prefers-reduced-motion` support
- PWA installable on mobile

---

*Made with 💕*
