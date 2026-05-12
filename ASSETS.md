# MEROS — Yig'iladigan Fayllar Ro'yxati

> 🚨 **MUHIM:** Fayllar `public/` ichidagi tegishli papkaga **to'g'ridan-to'g'ri** qo'yiladi (masalan: `public/allomalar/beruniy.jpg`). `images/` deb alohida papka kerak emas.

Sayt ishlashi uchun quyidagi fayllarni internetdan topib, **aniq nom va papka** bilan qo'ying. Fayl yo'q bo'lsa — sayt buzilmaydi, chiroyli **lotin-harf fallback** ko'rsatiladi.

---

## 1. ALLOMALAR — `public/allomalar/` ✅ TAYYOR

| Fayl nomi | Holat |
|---|---|
| `beruniy.jpg` | ✅ |
| `ibn-sino.jpg` | ✅ |
| `ulugbek.jpg` | ✅ |
| `cholpon.jpg` | ✅ |
| `behbudiy.jpg` | ✅ |

---

## 2. MUZEYLAR — `public/muzeylar/` ✅ TAYYOR

| Fayl nomi | Holat |
|---|---|
| `registon.jpg` | ✅ |
| `amir-temur.jpg` | ✅ |
| `ichan-qala.jpg` | ✅ |
| `shahi-zinda.jpg` | ✅ |
| `buxoro.jpg` | ✅ |

---

## 3. MUSIQA — `public/musiqa/` (audio) + `public/musiqa/` (cover)

### Audio + Lyrics
Har qo'shiq uchun **2 fayl** kerak — audio va vaqtga sinxron matn:

| Fayl nomi | Qo'shiq |
|---|---|
| `munojot.mp3` + `munojot.lrc` | Munojot Yo'lchiyeva — Munojot |
| `yallama-yorim.mp3` + `yallama-yorim.lrc` | Sherali Jo'rayev — Yallama yorim |
| `ushshoq.mp3` + `ushshoq.lrc` | Turg'un Alimatov — Ushshoq |
| `lazgi.mp3` + `lazgi.lrc` | Xorazm Lazgi |
| `andijon-polkasi.mp3` + `andijon-polkasi.lrc` | Andijon Polkasi |
| `buxoro-tanovari.mp3` + `buxoro-tanovari.lrc` | Tanovar |

**LRC formati:**
```
[ti:Munojot]
[ar:Munojot Yo'lchiyeva]
[00:00.00] Yo Robbim, ko'nglim shaydodir,
[00:06.50] Jonim sening yo'lingda fido.
```

Onlayn editor: `lrc-maker.github.io` — audio fayl yuklab, matnni vaqtga sinxron joylaysiz.

### Bonus: muqova rasmlar (ixtiyoriy)
| `munojot.jpg` · `yallama-yorim.jpg` · `ushshoq.jpg` · `lazgi.jpg` · `andijon-polkasi.jpg` · `buxoro-tanovari.jpg` |

---

## 4. KINOLAR — `public/kinolar/`

### Posterlar (vertikal 2:3)
| Fayl nomi | Film |
|---|---|
| `otkan-kunlar.jpg` | O'tgan kunlar (1969) |
| `mahallada-duv-duv-gap.jpg` | Mahallada duv-duv gap (1960) |
| `tohir-zuhra.jpg` | Tohir va Zuhra (1945) |
| `maftuningman.jpg` | Maftuningman (1958) |
| `suyunchi.jpg` | Suyunchi (1982) |
| `alpomish.jpg` | Alpomish (2000) |
| `qutlugh-qon.jpg` | Qutlug' qon (1958) |

### YouTube videolar
YouTube'dagi rasmiy uploadlarni topib **video ID**'ini bering:
```
otkan-kunlar: <YOUTUBE_ID>
mahallada-duv-duv-gap: <YOUTUBE_ID>
...
```

ID bo'lmasa — sayt **"YouTube'da qidirish"** tugmasini avtomatik ko'rsatadi.

---

## 5. KITOBLAR — `public/kitoblar/`

| Fayl nomi | Asar |
|---|---|
| `boburnoma.jpg` | Boburnoma — Bobur |
| `navoiy-gazallari.jpg` | Xazoyin ul-Maoniy — Navoiy |
| `otkan-kunlar.jpg` | O'tkan kunlar — Qodiriy (roman) |
| `kecha-va-kunduz.jpg` | Kecha va kunduz — Cho'lpon |
| `mehrobdan-chayon.jpg` | Mehrobdan chayon — Qodiriy |
| `sarob.jpg` | Sarob — Qahhor |

---

## YIG'ISH TARTIBI

1. Loyiha ichida `public/` papkasiga kiring
2. Tegishli papkani toping yoki yarating: `allomalar/`, `muzeylar/`, `musiqa/`, `kinolar/`, `kitoblar/`
3. Faylni **aynan yuqoridagi nom bilan** joylang
4. Saytni ochib yangilang — rasm avtomatik ko'rinadi (Vite HMR)

Hozir tugallangan: ✅ Allomalar (5/5) · ✅ Muzeylar (5/5)
Kutilmoqda: 🎵 Musiqa (audio+lrc) · 🎬 Kinolar (poster+YouTube ID) · 📚 Kitoblar (muqova)
