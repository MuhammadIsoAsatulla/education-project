# MEROS — Raqamli Madaniy Meros Platformasi

Raqamli ta'lim platformasi — o'zbek xalqining ma'naviy va madaniy merosini zamonaviy, interaktiv va estetik tarzda yangi avlodga yetkazish uchun.

> "Yil o'qituvchisi" tanlovida ishtirok etayotgan ustozimizga bag'ishlanadi.

---

## Xususiyatlar

**6 ta bo'lim, har biri o'z wow-effekti bilan:**

- **Allomalar** — 5 ta buyuk shaxs (Beruniy, Ibn Sino, Ulug'bek, Cho'lpon, Behbudiy). Detail sahifada parallax portret, typewriter biografiya, interaktiv vaqt chizig'i, Web Speech API orqali ovozli o'qish.
- **Muzeylar** — interaktiv 360°-uslubli virtual sayohat (sichqoncha bilan suriladi, hotspot nuqtalar bosilganda ma'lumot beradi).
- **Musiqa** — Spotify uslubidagi grid + to'liq ekranli karaoke rejimi (vaqt bo'yicha sinxronlangan matn, audio player, Howler.js bilan).
- **Kinolar** — Netflix uslubidagi posterlar gridi, janr filtrlari, YouTube embed bilan tafsilot.
- **Kitoblar** — virtual kutubxona javoni (kitob "tikkasiga" turadi), 3D flip orqali "ochiladi", parchalarni o'qish va tinglash mumkin.
- **Profil / Gamifikatsiya** — LocalStorage asosidagi shaxsiy yutuqlar, daraja, sayohat xronikasi, 8 ta ochilishi mumkin bo'lgan nishonlar.

**Bonus:** Bosh sahifada yulduzli osmon, Registon siluyeti, "Bugungi alloma" har kun avtomatik o'zgaradi (kun raqami bo'yicha).

---

## Texnik stack

- **React 18** + **Vite 5** — tez build, HMR
- **Tailwind CSS 3.4** — custom palitra (gold/teal/cream/lapis/crimson) va Cormorant Garamond, Manrope, Amiri shriftlari
- **React Router 6** — 11 ta route, har sahifa kod-splitting tayyor
- **Framer Motion** — kelgusi animatsiyalar uchun (hozircha CSS-asosida)
- **Howler.js** — audio playback (karaoke)
- **Lucide React** — ikonalar
- **LocalStorage** — foydalanuvchi yutuqlari uchun

Backend yo'q — barcha kontent `src/data/*.json` fayllarida. Bu loyihani statik xosting (Vercel, Netlify) orqali deploy qilish imkonini beradi.

---

## Loyihani ishga tushirish

```bash
npm install
npm run dev
```

Brauzer avtomatik ochiladi: `http://localhost:5173`

Production build:
```bash
npm run build
npm run preview
```

---

## Loyiha strukturasi

```
src/
├── components/
│   ├── common/        # Navbar, Footer, OrnamentDivider, StarsLayer, RegistanSilhouette, PageHero, ScrollToTop
│   ├── home/          # Hero, SectionsGrid, DailyFigure, Stats
│   ├── allomalar/     # AllomaCard, Typewriter, Timeline
│   ├── muzeylar/      # MuseumCard, VirtualTour
│   ├── musiqa/        # SongCard, KaraokeView
│   ├── kinolar/       # MoviePoster
│   ├── kitoblar/      # BookSpine
│   └── profil/        # AchievementBadge
├── pages/             # 11 ta sahifa (har bo'lim uchun list + detail + 404)
├── data/              # JSON kontent (allomalar, muzeylar, musiqa, kinolar, kitoblar, achievements)
├── hooks/             # useLocalStorage, useScrollReveal, useTextToSpeech, useProgress
├── styles/            # tokens.css (CSS o'zgaruvchilari) + globals.css (Tailwind)
├── App.jsx
└── main.jsx
```

---

## Kontentni almashtirish

JSON fayllarni to'g'ridan-to'g'ri tahrirlang:
- Yangi alloma qo'shish — `src/data/allomalar.json`
- Yangi muzey/film/kitob/qo'shiq — tegishli JSON
- Yangi nishon — `src/data/achievements.json`

Audio fayllar uchun: qo'shiq JSON'ida `audio` maydoni `/audio/musiqa/...` yo'liga ishora qilsin va faylni `public/audio/` ga joylang. `audio` bo'sh bo'lsa, karaoke avtomatik **demo rejimi**ga tushadi (LRC vaqt bo'yicha matn yondiriladi).

YouTube videolar uchun: kino JSON'idagi `youtubeId` ga video ID joylang (`?v=` parametridan keyin keladigan qiymat).

360° panoramalar uchun: `public/panoramas/` papkasiga rasm joylang. Hozirgi `VirtualTour` komponenti SVG-asosli prosedural sahnani chizadi va istalgan vaqtda haqiqiy Pannellum/Marzipano integratsiyasiga almashtirilishi mumkin.

---

## Dizayn falsafasi

- **Neo-Sharq estetikasi**: chuqur tungi ko'k osmon + oltin gradientlar + nozik islimi naqshlar
- **Cormorant Garamond** sarlavhalar uchun (klassik), **Manrope** asosiy matn uchun (zamonaviy), **Amiri** aksent matnlar uchun
- **Hech qanday Bootstrap, Material UI, stock fotosurat yo'q** — har bir pixel maqsadli

Ranglar (`src/styles/tokens.css`):
- `--bg-deep` (#0a1f2e) chuqur tungi ko'k
- `--gold` (#d4a574) asosiy oltin
- `--teal` (#0f4c5c) feruza
- `--cream` (#f5ebd6) issiq oq

---

## Keyingi qadamlar

- [ ] Haqiqiy 360° panoramalarni Pannellum bilan ulash
- [ ] Audio fayllarni qo'shish (xalq qo'shiqlari, maqomlar)
- [ ] YouTube ID'larni real videolarga almashtirish
- [ ] AI-suhbat (Claude API) — alloma bilan suhbatlashish
- [ ] Mini-testlar va viktorinalar
- [ ] O'qituvchi paneli (darslar, topshiriqlar)
- [ ] Rus va Ingliz tillari

---

MEROS © 2026 — Raqamli Madaniy Meros Platformasi
