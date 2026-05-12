# MEROS — Yig'iladigan Fayllar Ro'yxati

Sayt ishlashi uchun quyidagi fayllarni internetdan topib, **aniq nom va papka** bilan menga yuboring. Men ularni to'g'ri joyga joylashtirib, sayt to'liq ishlashini ta'minlayman.

> Eslatma: hech qaysi fayl majburiy emas. Fayl yo'q bo'lsa, sayt avtomatik chiroyli **lotin harf** karta dizayniga tushadi (arabcha emas). Fayl qo'shilsa, darhol shu joyda ko'rinadi.

---

## 1. ALLOMALAR — rasmlar (`public/images/allomalar/`)

JPG yoki PNG formatda, **kvadrat yoki vertikal** (3:4) o'lchamda eng yaxshi. Wikipedia / Wikimedia Commons'dan olishingiz mumkin.

| Fayl nomi (aniq shu nom bo'lsin) | Kim uchun | Tavsiya |
|---|---|---|
| `beruniy.jpg` | Abu Rayhon Beruniy | Sovet 1973 yodgorlik markasi yoki bust haykali |
| `ibn-sino.jpg` | Abu Ali ibn Sino | XIII asr fors miniatyurasi yoki Buxorodagi haykal |
| `ulugbek.jpg` | Mirzo Ulug'bek | Samarqand rasadxonasi haykali yoki portret |
| `cholpon.jpg` | Cho'lpon (A. Sulaymon) | 1920-yillardagi haqiqiy fotosurat |
| `behbudiy.jpg` | Mahmudxo'ja Behbudiy | XX asr boshidagi fotosurat |

---

## 2. MUZEYLAR — rasmlar (`public/images/muzeylar/`)

Kenglik bo'yicha (16:9 yoki 3:2) eng yaxshi — muzey old tomonining go'zal manzarasi.

| Fayl nomi | Joy |
|---|---|
| `registon.jpg` | Samarqand Registon maydoni |
| `amir-temur.jpg` | Toshkent Amir Temur muzeyi |
| `ichan-qala.jpg` | Xiva Ichan Qal'a |
| `shahi-zinda.jpg` | Samarqand Shohi Zinda |
| `buxoro.jpg` | Buxoro umumiy ko'rinishi (Po'i Kalon yoki minorai Kalon) |

---

## 3. MUSIQA — audio + lyrics (`public/audio/musiqa/`)

Har qo'shiq uchun **2 ta fayl**:
- `<slug>.mp3` — audio (YouTube'dan yuklasangiz `yt-dlp` yoki `4k Video Downloader` orqali)
- `<slug>.lrc` — vaqtga sinxron matn (LRC format)

### LRC fayl formati:
```
[ti:Munojot]
[ar:Munojot Yo'lchiyeva]
[00:00.00] Yo Robbim, ko'nglim shaydodir,
[00:06.50] Jonim sening yo'lingda fido.
[00:13.20] Bu dunyoning sirin anglagil,
...
```
Vaqt formati: `[daqiqa:soniya.kasr]`. Onlayn LRC editorlar (masalan: `lrc-maker.github.io`) bilan oson tuzasiz.

### Kerakli fayllar:

| Fayl nomi (audio + lyrics juftligi) | Qo'shiq |
|---|---|
| `munojot.mp3` + `munojot.lrc` | Munojot Yo'lchiyeva — Munojot |
| `yallama-yorim.mp3` + `yallama-yorim.lrc` | Sherali Jo'rayev — Yallama yorim |
| `ushshoq.mp3` + `ushshoq.lrc` | Turg'un Alimatov — Ushshoq |
| `lazgi.mp3` + `lazgi.lrc` | Xorazm Lazgi (xalq qo'shig'i) |
| `andijon-polkasi.mp3` + `andijon-polkasi.lrc` | Andijon Polkasi |
| `buxoro-tanovari.mp3` + `buxoro-tanovari.lrc` | Tanovar (Buxoro maqomi) |

### MUHIM:
- LRC fayl bo'lmasa — qo'shiq oddiy player rejimida tinglanadi (matn yo'q, audio bor)
- MP3 bo'lmasa — sayt avtomatik **YouTube'da qidirish** tugmasini ko'rsatadi (foydalanuvchi YouTube'dan tinglaydi)
- LRC vaqtlarini aniq sozlash uchun audio fayl bilan birga LRC editorda sinxronlang

### Bonus: muqova rasmlar (`public/images/musiqa/`)
Ixtiyoriy — qo'shiq plitkasida ko'rinadi:

| Fayl nomi |
|---|
| `munojot.jpg` |
| `yallama-yorim.jpg` |
| `ushshoq.jpg` |
| `lazgi.jpg` |
| `andijon-polkasi.jpg` |
| `buxoro-tanovari.jpg` |

---

## 4. KINOLAR — posterlar + YouTube ID (`public/images/kinolar/`)

### Poster rasmlari (vertikal 2:3)

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

YouTube'dagi rasmiy uploadlarni topib, **video ID**'ini bering. Misol: `https://www.youtube.com/watch?v=dQw4w9WgXcQ` — bu yerda ID = `dQw4w9WgXcQ`.

Video ID'larni quyidagi formatda yuboring:
```
otkan-kunlar: <YOUTUBE_ID>
mahallada-duv-duv-gap: <YOUTUBE_ID>
...
```

Yoki men `src/data/kinolar.json` faylida `youtubeId` maydonlariga to'g'ridan-to'g'ri yozib qo'yaman.

> Eslatma: ID bo'lmasa — sayt avtomatik **"YouTube'da qidirish"** tugmasini ko'rsatadi. Foydalanuvchi 1 marta bossin — YouTube'da kerakli filmlar ro'yxati ochiladi.

---

## 5. KITOBLAR — muqovalar (`public/images/kitoblar/`)

Vertikal (3:4 yoki 2:3) — muqova rasm sifatida.

| Fayl nomi | Asar |
|---|---|
| `boburnoma.jpg` | Boburnoma — Bobur |
| `navoiy-gazallari.jpg` | Xazoyin ul-Maoniy — Navoiy |
| `otkan-kunlar.jpg` | O'tkan kunlar — Qodiriy (roman muqova) |
| `kecha-va-kunduz.jpg` | Kecha va kunduz — Cho'lpon |
| `mehrobdan-chayon.jpg` | Mehrobdan chayon — Qodiriy |
| `sarob.jpg` | Sarob — Qahhor |

---

## SIZ MENGA QANDAY YUBORASIZ?

Eng oson usul:
1. Bitta Google Drive yoki **bir folder** oching
2. Ichida **yuqoridagi struktura bilan** to'rt papka qiling: `allomalar`, `muzeylar`, `musiqa`, `kinolar`, `kitoblar`
3. Har papkaga tegishli fayllarni **aynan ushbu nomlar bilan** joylang
4. Folder havolasini menga bering yoki fayllarni to'g'ridan-to'g'ri menga yuboring

Men har faylni `public/images/...` yoki `public/audio/...` ichidagi to'g'ri joyga ko'chiraman. Sahifalar avtomatik yangi rasmlar bilan ishlay boshlaydi (Vite HMR — saytni yangilash kerak emas).

---

## TEKSHIRISH

Faylni qo'shgandan keyin sayt qaerda ko'rinadi:
- **Allomalar rasmi** → `/allomalar` ro'yxat sahifasidagi karta + `/allomalar/<slug>` detail sahifa
- **Muzey rasmi** → `/muzeylar` ro'yxat + `/muzeylar/<slug>` hero
- **Audio + LRC** → `/musiqa` da qo'shiq bosilsa, karaoke avtomatik yoqiladi
- **Kino YouTube ID** → `/kinolar/<slug>` da iframe ko'rinadi
- **Kitob muqovasi** → `/kitoblar` javon + `/kitoblar/<slug>` detail

Hech qaysi fayl bo'lmasa, sayt **buzilmaydi** — chiroyli lotin-harf fallback ko'rinadi.
