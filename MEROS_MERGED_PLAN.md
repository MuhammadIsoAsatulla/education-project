# MEROS — Profil Ekotizimi: MERGED MASTER PLAN

**Manba**: Claude Code Plan N2 (asos) + Strategic vision (kreativ kengaytirishlar) + foydalanuvchining `Muhr` g'oyasi.

---

# 0. ENG MUHIM O'ZGARISHLAR (Plan N2 ga nisbatan)

## 0.1. ❗ Valyuta nomi: `Tilla` → `MUHR`

**Sabab**: Foydalanuvchida SVG formatdagi maxsus **muhr** dizayni bor. Muhr — Sharq madaniyatining eng kuchli ramzlaridan biri:
- Tarixiy: Sohibqiron muhri, Olim muhri, Amir muhri (Buxoro/Xiva/Qo'qon xonliklari)
- Universal — gender farqi yo'q, har kim ishlata oladi
- Vizual jihatdan unique — boshqa hech qaysi ta'lim platformasida ishlatilmagan
- MEROS palitrasi (oltin/feruza) ga juda yaxshi mos keladi
- "Muhr bosildi" iborasi → tasdiqlash, qadr, daraja ramzi

**Foydalanuvchi shu SVG faylni `/public/icons/muhr.svg` ga joylashtiradi.**

**Konversiya**: Plan N2 dagi 50 ball = 1 Tilla **saqlanadi**, lekin endi 50 ball = **1 Muhr**.

**3 darajali Muhr (yangi g'oya):**
| Daraja | Vizual | Qanday olinadi |
|---|---|---|
| 🥉 Bronza Muhr | Asosiy SVG, mat bronza filter | 50 ball jamlasa 1 ta |
| 🥈 Kumush Muhr | Kumush rangli variant + light glow | 10 Bronza = 1 Kumush |
| 🥇 Tilla Muhr | Oltin gradient + animatsion porlash | 10 Kumush = 1 Tilla |

Bu progress depth qo'shadi — Muhrlar kumush/oltinga aylanadi, statusni ko'rsatadi.

## 0.2. ❗ Tier tizimi: 5 → 6 daraja

Plan N2 da 5 tier bor. Yangi qo'shildi: **Sohibqiron** (eng yuqori, Mythic'dan ham yuqorida).

| Tier | Uz nom | Rang | Animatsiya | Border |
|---|---|---|---|---|
| Common | Oddiy | Bronza (#b8893f) | yo'q | oddiy chiziq |
| Rare | Nodir | Kumush (#cbd5e1) | mayda glow | nozik islimi |
| Epic | Buyuk | Lojuvard (#1e3a8a) | aylanma nur | girih naqshi |
| Legendary | Afsonaviy | Oltin (#d4a574) | pulsatsiya + uchqun | murakkab islimi |
| Mythic | Asotirim | Kamalak gradient | shimmer + zarrachalar | dinamik animatsiyali |
| **Sohibqiron** | **Sohibqiron** | **olov + binafsha** | **olov nurlari + orbital halqalar + ovoz** | **alohida — Amir Temur muhri uslubida** |

Sohibqiron unvon faqat eng yuqori yutuqlar uchun (masalan, barcha bo'limlar 100% + 100 kunlik streak + barcha Mythic'lar). Bu **ekstra wow** beradi — hakamlar so'rasa "eng yuqori darajaga yetish ham mumkin" deb ko'rsatishingiz mumkin.

## 0.3. ❗ Plan N2 ga qo'shimcha 8 ta zo'r g'oya

Quyidagilar **integratsiya qilinadi** (alohida emas):

1. **🎴 Allomalar Kolleksiyasi (Karta to'plami)** — Pokemon uslubida, lekin sharqona
2. **🌅 Kun So'zi** — har kuni eski o'zbek so'zi (yangi micro-content)
3. **🛤 Ipak Yo'li sayohati** — virtual shaharlar bo'ylab progress
4. **🌳 Bilim Bog'i** — friends bilan o'sadigan virtual bog'
5. **🏛 Madrasa qurish** — kollektiv ulkan loyiha (long-term)
6. **👨‍🏫 Ustozlik tizimi** — yuqori daraja Q&A
7. **🎭 Mavsumiy tadbirlar** — Navro'z, Mustaqillik, Ramazon
8. **📚 Mening sahifam** — o'quv jurnali + PDF eksport

Bularning aksariyati **Phase 1 da emas**, lekin **arxitekturada joy qoldiriladi** (data shape, route'lar).

---

# 1. UMUMIY KONTEKST

## 1.1. Hozirgi holat (Plan N2 dan)

✓ ProfilPage asosi bor: avatar, streak, sevimlilar, allomalar viktorinasi (5×3), 16 ta achievement
✓ `useProgress` hook LocalStorage bilan ishlaydi
✓ 5 ta bo'lim sahifalari mavjud, detail page'lari bor
✓ Navbar to'liq mobile/desktop optimallashtirilgan
✓ BookReader, kinolar, muzeylar — hammasi ishlayapti

## 1.2. Maqsad

Profil bo'limini **mukammal ekotizimga** aylantirish:
1. Foydalanuvchi har kuni qaytib kelishi uchun sabab beradi
2. Sotsial element bilan virusli effect
3. O'yin mexanikasi bilan motivatsiya
4. Hakamlar "wow" deydigan darajada chuqurlik

## 1.3. Vaqt cheklovi

**Tanlovga 2-3 kun.** Demak:
- **Phase 1 — tanlov uchun MAJBURIY** (1.5-2 kun)
- **Phase 2-4 — tanlovdan keyin** (lekin **arxitekturada joy qoldirilgan**, foundation tayyor)

---

# 2. PHASE 1 — TANLOV UCHUN (1.5-2 kun)

Bu butun bo'lim **LocalStorage**'da ishlaydi — login majbur emas. Hakamlarga to'liq ko'rsatish uchun yetadi.

## 2.1. Har bo'lim uchun chuqurroq Viktorinalar

### 2.1.1. Yangi viktorina fayllari

`src/data/viktorinalar/` papkasini yaratish:
```
src/data/viktorinalar/
├── allomalar.json    (mavjud, kengaytirish)
├── muzeylar.json     (yangi)
├── musiqa.json       (yangi)
├── kinolar.json      (yangi)
├── kitoblar.json     (yangi)
└── aralash.json      (yangi — barcha bo'limlardan)
```

### 2.1.2. Savol miqdori va tipi

| Bo'lim | Savol soni | Savol turlari |
|---|---|---|
| Allomalar | 5 × 8 = 40 | Standard, iqtibos, timeline drag-drop, asar topish, "nima yetishmaydi" |
| Muzeylar | 5 × 6 = 30 | Rasm asosida, tarix, me'morchilik, sulola |
| Musiqa | 6 × 5 = 30 | Audio (qaysi maqom?), cholg'u tanish, ijrochi, davr |
| Kinolar | 7 × 5 = 35 | Kadr asosida, aktyor, syujet, rejissor, manbaa asar |
| Kitoblar | 6 × 6 = 36 | Iqtibos kim aytdi, muallif, qahramon, janr, sahifa raqami |
| **Jami** | **171 savol** | + Aralash quiz (10 random) |

### 2.1.3. Savol JSON format (universal)

```json
{
  "id": "alloma-beruniy-001",
  "category": "allomalar",
  "subcategory": "biografiya",
  "type": "multiple-choice",
  "difficulty": "easy",
  "points": 5,
  "question": "Abu Rayhon Beruniy qaysi yili tug'ilgan?",
  "options": ["970", "973", "975", "980"],
  "correctIndex": 1,
  "explanation": "Beruniy 973-yili Xorazmda tug'ilgan...",
  "media": null
}
```

Yangi tiplar:
- `"type": "audio"` — audio fayli bilan (musiqa uchun)
- `"type": "image"` — rasm bilan (muzey, kino uchun)
- `"type": "timeline-order"` — drag-drop, sanalarni tartibga keltirish
- `"type": "quote-match"` — iqtibos → muallif moslash
- `"type": "true-false"` — to'g'ri/noto'g'ri

### 2.1.4. Viktorina mexanikasi

**Universal Quiz komponenti** (`src/components/quiz/Quiz.jsx`):
- 3 daraja: Oson (5 ball), O'rta (10), Qiyin (20)
- **Streak bonus**: 5 ta to'g'ri ketma-ket = +50%
- **Tezlik bonus**: 10 soniyada javob = +25%
- **Mukammal natija** (100%): +2 Bronza Muhr
- Noto'g'ri = ball yo'qotilmaydi, lekin streak buziladi
- Tushuntirish (`explanation`) har javobdan keyin

**Integratsiya joylari**:
- `KitobDetailPage` — "Asar parchalari" bo'limidan keyin → "Kitobni qanchalik bildingiz?" tugmasi
- `KinoDetailPage` — "Aktyorlar" dan keyin → "Film bo'yicha test"
- `MuzeyDetailPage` — "Highlights" dan keyin → "Muzey bilan tanishuv testi"
- `MusiqaPage` — har qo'shiq detail/modal'da → "Maqom bilimi"
- `AllomaDetailPage` — biografiya tugagach → "Alloma haqida test"

**Profile sahifasida 2 ta katta tugma**:
- **🎲 Aralash Viktorina** — 10 random savol barcha bo'limlardan
- **🔥 Kunlik Viktorina** — har kun yangi 5 savol (Daily Challenge)

## 2.2. Muhr valyuta tizimi (Plan N2 dagi Tilla o'rniga)

### 2.2.1. Data structure (useProgress hook'da)

```js
// useProgress hook ga qo'shish
{
  // ... mavjud state
  
  muhr: {
    bronze: 0,        // Bronza muhrlar soni
    silver: 0,        // Kumush muhrlar soni
    gold: 0,          // Tilla muhrlar soni
  },
  muhrHistory: [
    {
      id: 'mh-001',
      type: 'earned',         // 'earned' | 'spent' | 'converted'
      muhrType: 'bronze',
      amount: 1,
      reason: 'Beruniy viktorinasi yutildi',
      timestamp: 1730000000000,
    }
  ],
  shopPurchases: [],   // sotib olingan narsalar
}
```

### 2.2.2. Hooklar

```js
// src/hooks/useMuhr.js (yoki useProgress ichida)
function earnMuhr(type, amount, reason) { ... }
function spendMuhr(type, amount, itemId) { ... }
function convertMuhr(fromType, toType) { ... }  // 10 bronza → 1 kumush
```

### 2.2.3. Avtomatik konversiya

- Har 50 ball → 1 Bronza Muhr (avtomatik, animatsiya bilan)
- 10 Bronza → 1 Kumush (foydalanuvchi qo'lda tasdiqlaydi, modal bilan)
- 10 Kumush → 1 Tilla Muhr (qo'lda)
- Konversiya — wow effekt: muhrlar birga qo'shilib, yangi muhr "bosilgan" effekti

### 2.2.4. Muhr Balance komponenti

`src/components/profil/MuhrBalance.jsx`:
- 3 ta muhr (bronza, kumush, tilla) yonma-yon
- Har birining ostida raqam
- Bosilganda — `MuhrHistory` modal ochiladi
- "Konversiya" tugmasi ham bor

### 2.2.5. SVG muhr ishlatish

Foydalanuvchining muhr SVG'si universal — uchta variant CSS filter orqali olinadi:

```css
.muhr-bronze { filter: sepia(1) saturate(2) hue-rotate(-10deg) brightness(0.7); }
.muhr-silver { filter: grayscale(1) brightness(1.5) contrast(0.9); }
.muhr-gold {
  filter: sepia(1) saturate(3) hue-rotate(0deg) brightness(1.2);
  animation: muhrShine 3s ease-in-out infinite;
}

@keyframes muhrShine {
  0%, 100% { filter: sepia(1) saturate(3) brightness(1.2); }
  50% { filter: sepia(1) saturate(4) brightness(1.5) drop-shadow(0 0 8px #d4a574); }
}
```

## 2.3. Achievement tier tizimi (6 daraja)

### 2.3.1. Data o'zgartirish

`src/data/achievements.json` har achievement'ga `tier` qo'shish:

```json
{
  "id": "kitobxon",
  "tier": "rare",
  "title": "Kitobxon",
  "description": "10 ta kitob varaqlangan",
  ...
}
```

### 2.3.2. Yangi achievementlar (har tier uchun)

| Tier | Mavjud | Yangi | Misol |
|---|---|---|---|
| Common | 3 | + 2 | "Birinchi Qadam", "Yangi Kashfiyot" |
| Rare | 7 | + 3 | "Tanqidchi" (5 sharh), "Do'st" (1 follow) |
| Epic | 4 | + 4 | "Ulug'bek Shogirdi" (allomalar 100%), "Sayyoh" (barcha muzeylar) |
| Legendary | 2 | + 3 | "Mutafakkir" (50 viktorina mukammal), "Maqomshunos" |
| Mythic | 0 | + 5 | "Bilim Imperatori", "Asotirim Sayyoh", "100 Kunlik Davomiylik" |
| **Sohibqiron** | 0 | + 1 | "Sohibqiron" — barcha narsa 100% + 100 kun streak |

**Jami: ~16 → ~34 achievement**

### 2.3.3. Tier vizual effektlar

`src/components/profil/AchievementBadge.jsx` qayta dizayn:

```jsx
const TIER_STYLES = {
  common: {
    border: '#b8893f',
    bg: 'rgba(184, 137, 63, 0.1)',
    animation: '',
  },
  rare: {
    border: '#cbd5e1',
    bg: 'rgba(203, 213, 225, 0.1)',
    animation: 'rare-glow 4s ease-in-out infinite',
  },
  epic: {
    border: '#1e3a8a',
    bg: 'rgba(30, 58, 138, 0.15)',
    animation: 'epic-rotate 6s linear infinite',  // aylanuvchi gradient
  },
  legendary: {
    border: '#d4a574',
    bg: 'radial-gradient(circle, rgba(212,165,116,0.3), transparent)',
    animation: 'legendary-pulse 2s ease-in-out infinite',
    particles: true,  // SVG sparkles
  },
  mythic: {
    border: 'gradient',  // animatsiyali kamalak gradient
    bg: 'animated-rainbow',
    animation: 'mythic-shimmer 3s linear infinite',
    particles: true,
    extraEffects: ['orbital-rings'],
  },
  sohibqiron: {
    border: 'flame-gradient',  // qizil-binafsha
    bg: 'radial-fire',
    animation: 'sohibqiron-aura 4s ease-in-out infinite',
    particles: true,
    sound: true,  // ochilganda
    extraEffects: ['flame-rays', 'orbital-rings', 'crown'],
  },
};
```

### 2.3.4. CSS keyframes — yangi fayl

`src/styles/tiers.css`:

```css
@keyframes rare-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(203, 213, 225, 0.3); }
  50% { box-shadow: 0 0 20px rgba(203, 213, 225, 0.6); }
}

@keyframes epic-rotate {
  from { background-position: 0% 50%; }
  to { background-position: 200% 50%; }
}

@keyframes legendary-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px #d4a574; }
  50% { transform: scale(1.03); box-shadow: 0 0 40px #d4a574; }
}

@keyframes mythic-shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.mythic-border {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffe66d, #a8e6cf, #c7ceea);
  background-size: 300% 300%;
  animation: mythic-shimmer 3s linear infinite;
}

@keyframes sohibqiron-aura {
  0%, 100% {
    box-shadow:
      0 0 30px #d4a574,
      0 0 60px #8b2635,
      inset 0 0 20px rgba(212, 165, 116, 0.3);
  }
  50% {
    box-shadow:
      0 0 50px #e8c898,
      0 0 100px #c7384c,
      inset 0 0 30px rgba(212, 165, 116, 0.5);
  }
}
```

### 2.3.5. Particle effects

`src/components/profil/TierParticles.jsx` — SVG zarrachalar:
- Legendary: 5-8 oltin uchqun, ko'tarilib so'nadi
- Mythic: 12-15 ranglar aralashmasi, dinamik
- Sohibqiron: olov tomchilari + orbital halqalar

## 2.4. Profil sahifasi kengayishi

### 2.4.1. Yangi tuzilma (tartibda)

```
ProfilPage
├── 1. Hero karta (avatar + ism + level + tier)
│      └── Muhr balansi (3 muhr yonma-yon) + Konversiya tugmasi
├── 2. Daily Challenge bloki (yangi)
│      └── Bugungi vazifa + qancha vaqt qoldi countdown
├── 3. Daily streak (mavjud) + 7-day calendar visualization
├── 4. Stat overview (yangi)
│      └── 4 ta katta raqam: ball, viktorina yutilgan, kitob o'qigan, streak
├── 5. Section Progress (mavjud, lekin grafik bilan kengaytirish)
├── 6. Quick Actions (yangi)
│      ├── 🎲 Aralash Viktorina
│      ├── 🔥 Kunlik Viktorina
│      ├── 🛒 Do'kon (Shop)
│      └── 🏆 Reyting (Leaderboard mock)
├── 7. Achievements (yangi tier tuzilmasi)
│      └── 6 ta tab: Common, Rare, Epic, Legendary, Mythic, Sohibqiron
├── 8. Sevimlilar (mavjud)
├── 9. Mening kolleksiyam (yangi — allomalar kartalari placeholder)
└── 10. Recent Activity (yangi)
       └── Oxirgi 10 ta voqea (achievement, viktorina, ko'rilgan kontent)
```

### 2.4.2. Quick Stats vizualizatsiyasi

To'rt katta raqam — animatsiyali (count-up):
- 📊 Jami ball
- 🎯 Mukammal viktorinalar
- 📚 O'qilgan kitoblar
- 🔥 Streak (kun)

### 2.4.3. Section Progress yangi vizualizatsiya

Har bo'lim uchun:
- Progress bar (foiz)
- Tugatilgan ball/jami ball
- Yutilgan achievement'lar
- Eng yaqin keyingi achievement teaser ("Yana 3 ta kitob → Kitobxon Plus")

## 2.5. Do'kon (Shop) tizimi

### 2.5.1. Do'kon kategoriyalari

`src/data/shopItems.json`:

```json
{
  "categories": [
    {
      "id": "experience",
      "name": "Yagona Tajribalar",
      "items": [
        {
          "id": "alloma-chat-beruniy",
          "name": "Beruniy bilan suhbat",
          "description": "1 marotaba, AI script bilan",
          "price": { "type": "silver", "amount": 5 },
          "icon": "...",
          "available": true,
          "type": "experience"
        },
        ...
      ]
    },
    {
      "id": "cosmetic",
      "name": "Bezaklar",
      "items": [
        {
          "id": "frame-gold",
          "name": "Oltin profil ramkasi",
          "price": { "type": "bronze", "amount": 10 }
        },
        {
          "id": "theme-day",
          "name": "Kunduzgi tema",
          "price": { "type": "silver", "amount": 3 }
        },
        ...
      ]
    },
    {
      "id": "boosters",
      "name": "Kuchaytirgichlar",
      "items": [
        {
          "id": "boost-2x-24h",
          "name": "24 soat ikki barobar ball",
          "price": { "type": "bronze", "amount": 15 }
        },
        {
          "id": "streak-shield",
          "name": "Streak Qalqoni",
          "description": "1 kun yo'qlik kechirilsin",
          "price": { "type": "silver", "amount": 2 }
        }
      ]
    },
    {
      "id": "documents",
      "name": "Hujjatlar",
      "items": [
        {
          "id": "certificate-pdf",
          "name": "Meros Vorisi Sertifikati",
          "description": "Chiroyli PDF, print uchun tayyor",
          "price": { "type": "gold", "amount": 1 }
        }
      ]
    }
  ]
}
```

### 2.5.2. Shop komponenti

`src/components/profil/Shop.jsx`:
- Modal sifatida ochiladi (full-screen mobile, modal desktop)
- Yuqorida: Muhr balansi (3 turi)
- Tab'lar: Tajribalar | Bezaklar | Kuchaytirgichlar | Hujjatlar
- Card grid (2 col mobile, 4 col desktop)
- Har card: ikon, nom, narx, "Sotib olish" tugma
- Yetarli muhr yo'q bo'lsa — tugma disabled + "yana 5 ta kerak"
- Sotib olganda — animatsiya (muhr "bosilish" effekti)
- Sotib olingan narsa — `shopPurchases` ga qo'shiladi

## 2.6. Daily Challenge tizimi

### 2.6.1. Mexanika

`src/hooks/useDailyChallenge.js`:
- Har kuni 00:00 da yangilanadi (foydalanuvchi mahalliy vaqti)
- Tasodifiy generatsiya (lekin har kuni bir xil — sana asosida hash):
  - "Bugun Beruniy haqida 3 savolga javob ber"
  - "Bir kitob 5 sahifa o'qing"
  - "2 ta muzeyga tashrif buyuring"
  - "Kunlik viktorinada 80%+ natija"
- Tugatilsa: +5 Bronza Muhr + 50 ball + "Daily Champion" badge (24 soat)
- 7 kun ketma-ket = +1 Kumush Muhr bonusi
- 30 kun = +1 Tilla Muhr bonusi

### 2.6.2. UI

Profil sahifasida katta karta:
- Yuqorida: bugungi sana + "Bugungi Vazifa"
- O'rta: Vazifa matni + ikon
- Progress (agar bo'lakli bo'lsa)
- Pastda: countdown "Yana 8 soat 23 daqiqa qoldi"
- Tugatilgan bo'lsa: "✓ Bajardingiz! Ertaga yana qaytib keling"

## 2.7. Kunlik kontent (yangi micro-features)

### 2.7.1. "Bugungi Hikmat" (Daily Quote)

`src/data/dailyQuotes.json` — 365 ta iqtibos:
- Bosh sahifada va profil sahifasida ko'rinadi
- O'qib chiqsa: +5 ball
- Iqtibos kuni → keyingi kun yangisi

### 2.7.2. "Kun So'zi" (Word of the Day)

`src/data/dailyWords.json` — 200+ ta eski o'zbek so'zi:
- So'z + ma'no + misol + audio (talaffuz)
- "Bilaman" / "Bilmayman" — bilmagan so'zlarni saqlaydi
- 10 ta yangi so'z = +1 Bronza Muhr

## 2.8. Mahalliy Sharhlar tizimi (LocalStorage)

### 2.8.1. Data structure

`src/hooks/useComments.js`:

```js
{
  comments: {
    'kitoblar/otkan-kunlar': [
      {
        id: 'c-001',
        author: { name: 'Anvar', avatar: 'avatar-1', tier: 'rare' },
        text: 'Juda ajoyib asar...',
        rating: 5,
        likes: 12,
        liked: false,    // bu user'ning liki
        replies: [],
        createdAt: 1730000000000,
      }
    ],
    'allomalar/beruniy': [...],
    ...
  }
}
```

### 2.8.2. UI — Uzum.uz uslubida

`src/components/common/Comments.jsx`:
- Content sahifa oxirida
- **Faqat 3 ta preview** ko'rinadi (eng top liked)
- "Barchasini ko'rish (124)" tugmasi → `CommentsPage` ga o'tadi (yangi route)
- Yangi sharh forma:
  - 5 yulduz reyting
  - Matn maydoni
  - "Sharh qoldirish" tugmasi
- Har sharhda:
  - Avatar + ism + tier badge
  - Yulduz reytingi
  - Matn
  - "❤️ 12" like tugmasi (Instagram uslubidagi yurakcha animatsiyasi)
  - "↪️ Javob" tugmasi
  - Vaqt ("3 soat oldin")

### 2.8.3. CommentsPage (alohida sahifa)

`src/pages/CommentsPage.jsx`:
- URL: `/sharhlar/:contentType/:contentId`
- Yuqorida: kontent kichik card (kitob qopqog'i + nomi)
- Filtr/Sort:
  - "Eng ko'p like" / "Eng yangi" / "Eng yuqori reyting"
- Pastda: sharh qoldirish formasi (full-width)
- Sharhlar to'liq ko'rinishda
- Pagination (10 tadan)

### 2.8.4. Like animatsiyasi

Instagram-style:
- Bosishda: yurakcha kattalashadi (1 → 1.3 → 1)
- Rang: kulrang → qizil-pushti
- Mayda zarrachalar atrofiga sochiladi (5-6 ta uchqun)
- Raqam +1 ga o'sadi (count-up animatsiyasi)

## 2.9. Mock Leaderboard

### 2.9.1. Static demo data

`src/data/mockLeaderboard.json`:
- 20 ta mock foydalanuvchi (turli darajada)
- Foydalanuvchi (siz) ham ro'yxatga avtomatik joylashtiriladi
- Filter: Haftalik | Oylik | Umumiy
- Top 3 — alohida vizual (oltin/kumush/bronza karta)

### 2.9.2. Leaderboard UI

- Yuqori 3 ta — katta kartalar (podium)
- 4-20 — list ko'rinishi
- Foydalanuvchining o'z o'rni — alohida ajratilgan
- Har row'da: o'rin, avatar, ism, tier, ball, streak

## 2.10. Phase 1 — Files Checklist

### Yangi fayllar (28 ta):

**Data**:
- `src/data/viktorinalar/muzeylar.json`
- `src/data/viktorinalar/musiqa.json`
- `src/data/viktorinalar/kinolar.json`
- `src/data/viktorinalar/kitoblar.json`
- `src/data/viktorinalar/aralash.json`
- `src/data/shopItems.json`
- `src/data/mockLeaderboard.json`
- `src/data/dailyQuotes.json`
- `src/data/dailyWords.json`

**Hooks**:
- `src/hooks/useMuhr.js` (yoki useProgress ichida)
- `src/hooks/useDailyChallenge.js`
- `src/hooks/useComments.js`
- `src/hooks/useDailyContent.js`

**Components — profil**:
- `src/components/profil/MuhrBalance.jsx`
- `src/components/profil/MuhrHistory.jsx`
- `src/components/profil/MuhrConversion.jsx`
- `src/components/profil/Shop.jsx`
- `src/components/profil/DailyChallenge.jsx`
- `src/components/profil/MixedQuiz.jsx`
- `src/components/profil/Leaderboard.jsx`
- `src/components/profil/StatOverview.jsx`
- `src/components/profil/RecentActivity.jsx`
- `src/components/profil/TierParticles.jsx`

**Components — common**:
- `src/components/common/Comments.jsx`
- `src/components/common/CommentCard.jsx`
- `src/components/common/CommentForm.jsx`
- `src/components/common/DailyQuote.jsx`
- `src/components/common/DailyWord.jsx`

**Components — quiz**:
- `src/components/quiz/Quiz.jsx` (universal)
- `src/components/quiz/QuizQuestion.jsx`
- `src/components/quiz/QuizResult.jsx`

**Pages**:
- `src/pages/CommentsPage.jsx`

**Styles**:
- `src/styles/tiers.css`
- `src/styles/muhr.css`

**Public**:
- `public/icons/muhr.svg` (foydalanuvchi tomonidan)

### O'zgartirilgan fayllar (10 ta):

- 🔄 `src/hooks/useProgress.js` — muhr, comments, daily challenge state
- 🔄 `src/data/achievements.json` — tier maydoni + 18 yangi achievement
- 🔄 `src/data/viktorinalar/allomalar.json` — kengaytirish 15 → 40 savol
- 🔄 `src/pages/ProfilPage.jsx` — to'liq qayta yozish
- 🔄 `src/pages/AllomaDetailPage.jsx` — Quiz va Comments qo'shish
- 🔄 `src/pages/KitobDetailPage.jsx` — Quiz va Comments qo'shish
- 🔄 `src/pages/KinoDetailPage.jsx` — Quiz va Comments qo'shish
- 🔄 `src/pages/MuzeyDetailPage.jsx` — Quiz va Comments qo'shish
- 🔄 `src/pages/MusiqaPage.jsx` — Quiz va Comments qo'shish
- 🔄 `src/components/profil/AchievementBadge.jsx` — tier ranglar va animatsiyalar
- 🔄 `src/App.jsx` — `/sharhlar/:type/:id` route qo'shish

---

# 3. PHASE 2 — AUTH VA BACKEND (Tanlovdan keyin)

## 3.1. Firebase sozlash

- Firebase Console'da yangi loyiha
- Google OAuth provider yoqish
- Firestore Database — Production mode, security rules tayyorlash
- `npm install firebase`
- `.env` faylda kalitlar:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3.2. Firestore collections

```
users/{uid}
  - username, avatar, email
  - points, muhr, achievements, streak
  - createdAt, lastActive

comments/{commentId}
  - contentType, contentId
  - authorUid, text, rating
  - likes, likedBy (array of uids)
  - createdAt

follows/{followId}
  - followerUid, followingUid
  - createdAt

userActivities/{activityId}
  - userUid, type, payload
  - createdAt

dailyChallenges/{date}_{uid}
  - completed, completedAt
  - challengeType
```

## 3.3. Login sahifasi

`src/pages/LoginPage.jsx`:
- Route: `/login` (ixtiyoriy)
- Hero-style dizayn: yulduzli osmon + Registon siluyeti
- Markazda:
  - "MEROS" logo
  - "Sayohatni saqlang, do'stlar topshing"
  - **Katta tugma**: "🔵 Google bilan kirish"
  - Yoki: "Mehmon sifatida davom etish" (link sifatida pastda)
- Pastda: kirish foydasi (bullet list):
  - ☁️ Cross-device sinxronizatsiya
  - 👥 Do'stlar va follow
  - 💬 Sharh qoldirish
  - 🏆 Global reyting

## 3.4. Migratsiya: LocalStorage → Firestore

Birinchi login'da modal:
> "Sizning mahalliy sayohatingiz topildi (47 ball, 3 achievement). Cloud'ga ko'chiraylikmi?"
- "Ha, ko'chir" → barcha state Firestore'ga
- "Yo'q, yangi boshlash" → bo'sh akkount

## 3.5. UserProfilePage (boshqalarni ko'rish)

`src/pages/UserProfilePage.jsx`:
- Route: `/u/:username`
- Komponent: avatar, ism, tier badge, follow tugma
- Tab'lar:
  - **Yutuqlar** — achievement'lar (faqat ko'rinadigan)
  - **Sharhlar** — yozgan sharhlari
  - **Do'stlar** — kim'ni follow qiladi
- Muhr balansi **ko'rinmaydi** (shaxsiy ma'lumot)
- Streak, level, statistika **ko'rinadi**

## 3.6. Follow tizimi

- "Kuzatish" tugmasi har profilda
- `src/hooks/useFollow.js`
- Followers/Following soni
- `FriendsPage` (`/dostlar`) — list, qidiruv

## 3.7. Real sharhlar

- Firestore listeners (real-time)
- Like — atomic counter
- Top algoritmi: likes DESC, then createdAt DESC

## 3.8. Real leaderboard

- Top 10 weekly (Cloud Function yoki client-side query)
- Top 100 all-time
- Foydalanuvchi joyi alohida

## 3.9. Phase 2 — Files

**Yangi**:
- `src/lib/firebase.js`
- `src/hooks/useAuth.js`
- `src/hooks/useFirestoreSync.js`
- `src/hooks/useFollow.js`
- `src/pages/LoginPage.jsx`
- `src/pages/UserProfilePage.jsx`
- `src/pages/FriendsPage.jsx`
- `src/components/social/UserCard.jsx`
- `src/components/social/FollowButton.jsx`
- `src/components/social/UserSearch.jsx`
- `src/components/auth/MigrationModal.jsx`
- `firestore.rules` (security)
- `.env` va `.env.example`

**O'zgartirilgan**:
- `src/App.jsx` — yangi route'lar
- `src/components/common/Navbar.jsx` — Login/Logout + avatar
- `src/hooks/useProgress.js` — Firestore sync
- `src/hooks/useComments.js` — Firestore integration

---

# 4. PHASE 3 — AI VA TAJRIBA (Tanlovdan keyin)

## 4.1. Alloma bilan suhbat (Scripted MVP)

`src/data/dialogues/beruniy.json`:
```json
{
  "intro": "Salom, ey ilm izlovchi! Men Abu Rayhon Muhammad ibn Ahmad al-Beruniyman...",
  "topics": [
    {
      "id": "yer-radiusi",
      "question": "Yer sharining radiusini qanday hisoblagansiz?",
      "answer": "Hindistondagi Nandana qal'asi tepasidan...",
      "followUps": ["matematika", "asbob"]
    },
    ...
  ]
}
```

5 ta alloma × 15-20 savol-javob = 75-100 dialog node.

UI: `AllomaChat.jsx`:
- Full-screen modal
- Chap: alloma portreti (animatsion)
- O'ng: matn typewriter effekti bilan
- Pastda: 3 ta tanlash mumkin bo'lgan savollar
- Background: allomaning ranglari + girih
- Ovoz: Web Speech API (yoki tayyor mp3)

Narx: **5 Kumush Muhr** / sessiya (15-20 dialog)

## 4.2. AI versiya (Claude API — optional)

- Server-side endpoint (Vercel serverless function)
- API kalit yashirin
- System prompt:
```
Sen Abu Rayhon Beruniysan. XI asrda yashagansan. 
Astronom, matematik, tarixchi va etnografmas.
"Hindiston" va "Qadimgi xalqlardan qolgan yodgorliklar" asarlarini yozgansan.
Sokin, hurmatli, ilmiy uslubda javob ber.
Faqat o'sha davrgacha bo'lgan bilim'larni ishlat.
Foydalanuvchini o'qishga undash, savol berishga undash.
```

Narx: 10 Kumush Muhr = 5 savol-javob

## 4.3. Animated portrets

`src/components/allomalar/AnimatedPortrait.jsx`:
- SVG yoki PNG sprite
- Ko'z miltirashi (CSS keyframes)
- Yengil tebranish
- Lablar harakati (gapirayotganda)

## 4.4. Voice greetings

`public/audio/greetings/beruniy.mp3`:
- Profilga kirganda mayda audio
- 3-5 soniyali tabriklar
- Toggle: o'chirish mumkin

---

# 5. PHASE 4 — POLISH (Tanlovdan keyin)

## 5.1. Sertifikat (PDF)

- `npm install jspdf html2canvas`
- "Meros Vorisi Sertifikati" — dizayn islimi naqshlar bilan
- Foydalanuvchi ismi + sana + yutuqlar ro'yxati + QR kod (profilga link)
- 1 Tilla Muhr evaziga

## 5.2. Allomalar Kolleksiyasi (Pokemon-style)

`src/data/allomaCards.json` — 30 ta karta (kelajakda 99 ga yetadi):
- 4 darajadagi rarity (common, rare, epic, legendary)
- Karta sotib olish: 1 Bronza Muhr = 1 random karta
- Booster pack: 3 Bronza = 5 karta (1 ta rare kafolat)
- `CollectionPage` (`/kolleksiya`) — to'plagan kartalari

## 5.3. Bilim Bog'i

`src/pages/BogPage.jsx` (`/bog`):
- Virtual bog' (SVG bilan)
- Har achievement → bog'da o'simlik o'sadi
- Do'stlarning bog'iga tashrif
- Daraxtlar interaktiv (bosilsa — achievement)

## 5.4. Ipak Yo'li Sayohati

`src/pages/IpakYoliPage.jsx` (`/ipak-yoli`):
- Xarita (SVG): Samarqand → Buxoro → Xiva → Toshkent
- Har shaharda 5-10 "ziyorat" joyi
- Muhrlar to'planadi (shahar muhri)
- 4 shahar to'liq tugatilsa: "Sayyoh" mythic achievement

## 5.5. Mavsumiy tadbirlar

`src/data/seasonalEvents.json`:
- Navro'z (21 mart) — maxsus viktorina, ramka, achievement
- Mustaqillik kuni (1 sentabr)
- Ramazon
- Har tadbir — alohida bezak

## 5.6. Hidden Easter Eggs

5 ta yashirin element saytda:
- Muzey hotspot ostida yulduzcha
- Bosh sahifa logoda 7 marta bosish
- Boshqa joylar (sizning xohlovingiz)
- Topish: +3 Bronza Muhr + "Kashfiyotchi" badge

## 5.7. Tema almashtirish

- Tungi (hozirgi)
- Kunduzgi (krem fon + oltin)
- Sahar (qizil-binafsha gradient)
- 3 Kumush Muhr har biri

## 5.8. Sound design

- Click sound (oltin "ting")
- Achievement unlock (chime)
- Muhr "bosilish" (qog'oz + muhr ovozi)
- Page flip
- Master volume

## 5.9. Mosaic Profile

Profil sahifasining yangi tab'i:
- Barcha sevimli element'lar — bitta mozaik
- Galaxy aylanish effekti
- Avatar markazda, atrofida — kontentlar

---

# 6. ARXITEKTURA QARORLAR

## 6.1. LocalStorage → Firestore migratsiyasi

Phase 1 oxirida: barcha state LocalStorage'da
Phase 2 da Firebase qo'shilganda: 

```js
const useProgress = () => {
  const { user } = useAuth();
  const [localState, setLocalState] = useLocalStorage('meros:progress', DEFAULT);
  const [cloudState, setCloudState] = useFirestoreDoc(
    user ? `users/${user.uid}` : null
  );
  
  return {
    state: user ? cloudState : localState,
    update: user ? setCloudState : setLocalState,
    // ...
  };
};
```

## 6.2. Bundle optimizatsiya

Yangi kutubxonalar (Phase 2-4):
- `firebase`: ~150 KB (gzip) — Phase 2
- `jspdf` + `html2canvas`: ~120 KB — Phase 4 (lazy load)
- `@anthropic-ai/sdk`: ~50 KB — Phase 3 (lazy load)

Strategiya: **dynamic import** har joyda

```js
const Shop = lazy(() => import('./components/profil/Shop'));
const Certificate = lazy(() => import('./components/profil/Certificate'));
```

## 6.3. Mobil moslashtirish

Har yangi sahifa va komponent — mobile-first:
- Login: full-screen overlay
- Shop: 2-col mobile, 4-col desktop
- Comments: card stack mobile, list desktop
- Quiz: bitta savol full-width mobile
- Leaderboard: list mobile, table desktop

## 6.4. Animatsiyalar — Framer Motion vs CSS

- **CSS keyframes** — tier glow, particles, muhr animatsiyasi
- **Framer Motion** — Page transitions, modal opening, card flip
- Performance: `will-change`, `transform` afzal

---

# 7. ISH TARTIBI (Detailed Order)

## Day 1 (8 soat)

**Morning (4 soat)**:
1. (30 min) — Loyihani branch'lash, plan o'qish
2. (1 soat) — `useProgress` ni kengaytirish: muhr, daily challenge, comments
3. (1 soat) — `src/styles/tiers.css` va `muhr.css` — barcha animatsiyalar
4. (1.5 soat) — `MuhrBalance`, `MuhrHistory`, `MuhrConversion` komponentlari

**Afternoon (4 soat)**:
5. (1.5 soat) — `Quiz.jsx` universal komponent (har bo'lim uchun)
6. (2 soat) — Viktorina ma'lumotlari (5 bo'lim × 25-35 savol)
7. (30 min) — `achievements.json` ni tier'lar bilan kengaytirish

## Day 2 (8 soat)

**Morning (4 soat)**:
1. (1 soat) — `AchievementBadge` qayta yozish (6 tier + animatsiyalar + particles)
2. (1.5 soat) — Detail page'larga Quiz integratsiyasi (5 ta sahifa)
3. (1.5 soat) — `Shop.jsx` + `shopItems.json`

**Afternoon (4 soat)**:
4. (1.5 soat) — `Comments.jsx` (LocalStorage) + detail page'lar
5. (1 soat) — `DailyChallenge.jsx` + `useDailyChallenge.js`
6. (1 soat) — `Leaderboard.jsx` mock
7. (30 min) — `DailyQuote` va `DailyWord` micro-components

## Day 3 (4 soat — final day)

**Morning (4 soat)**:
1. (2 soat) — `ProfilPage.jsx` to'liq qayta yozish (yangi tuzilma)
2. (1 soat) — `CommentsPage.jsx` alohida sahifa
3. (1 soat) — Build, debug, mobile test, polish

---

# 8. VERIFIKATSIYA CHECKLIST

## 8.1. Phase 1 — TANLOV UCHUN MAJBURIY

### Viktorinalar
- [ ] Allomalar: 40 savol (5 alloma × 8)
- [ ] Muzeylar: 30 savol
- [ ] Musiqa: 30 savol (audio bilan)
- [ ] Kinolar: 35 savol (image bilan)
- [ ] Kitoblar: 36 savol
- [ ] Aralash viktorina ishlaydi
- [ ] Har detail page'da quiz integratsiyasi
- [ ] Streak bonus, tezlik bonus ishlaydi

### Muhr tizimi
- [ ] 3 daraja muhr (bronza/kumush/tilla) ko'rinmaqda
- [ ] SVG muhr to'g'ri filtrlar bilan
- [ ] Konversiya 10→1 ishlaydi
- [ ] Muhr History ko'rinadi
- [ ] Animatsiyalar silliq

### Achievements
- [ ] 6 tier (common → sohibqiron)
- [ ] Har tier o'ziga xos animatsiya
- [ ] ~34 ta achievement
- [ ] Particles legendary+ uchun ishlaydi
- [ ] Sohibqiron — alohida wow

### Profil
- [ ] Yangi tuzilma 10 ta section bilan
- [ ] Stat overview (4 raqam, count-up)
- [ ] Quick actions tugmalar ishlaydi
- [ ] Recent activity ko'rinadi

### Shop
- [ ] 4 kategoriya, 15+ predmet
- [ ] Sotib olish ishlaydi
- [ ] Muhr yetarli emas — disabled holat
- [ ] Sotib olish animatsiyasi

### Daily features
- [ ] Daily Challenge har 24 soatda
- [ ] Bugungi Hikmat ko'rinadi
- [ ] Kun So'zi ishlaydi
- [ ] 7-day streak calendar

### Sharhlar
- [ ] Har detail page'da Comments bloki
- [ ] Top 3 preview ko'rinadi
- [ ] "Barchasi" → CommentsPage
- [ ] Like animatsiyasi (Instagram-style)
- [ ] Reyting va sort ishlaydi

### Leaderboard
- [ ] Mock data 20 user
- [ ] Top 3 podium
- [ ] Foydalanuvchi joyi alohida
- [ ] Filter ishlaydi

### Texnik
- [ ] Bundle main chunk < 500 KB
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Build muvaffaqiyatli

## 8.2. Phase 2 (post-tanlov)
- [ ] Google bilan kirish
- [ ] LocalStorage → Firestore migratsiya
- [ ] Boshqa user profili (`/u/:username`)
- [ ] Real follow
- [ ] Real sharhlar (real-time)
- [ ] Real leaderboard
- [ ] Friends sahifasi

## 8.3. Phase 3
- [ ] Alloma chat (scripted)
- [ ] 5 alloma × 15-20 dialog
- [ ] AI version (optional)
- [ ] Animated portraits
- [ ] Voice greetings

## 8.4. Phase 4
- [ ] Sertifikat PDF
- [ ] Allomalar kolleksiyasi
- [ ] Bilim bog'i
- [ ] Ipak yo'li
- [ ] Easter eggs (5 ta)
- [ ] Tema almashtirish
- [ ] Sound design
- [ ] Mosaic profile

---

# 9. FOYDALANUVCHIDAN KERAK BO'LADIGAN NARSALAR

## 9.1. Phase 1 boshlanishidan oldin:
1. ✅ **Muhr SVG fayli** — `public/icons/muhr.svg` ga joylashtirish
2. ⏳ Ovoz fayllari (audio quiz uchun):
   - 5-10 ta maqom namuna (10-15 soniya)
   - 3-5 cholg'u asbob namunasi
   - Yoki: AI orqali yaratish (ElevenLabs)
3. ⏳ Rasm fayllari:
   - Muzey rasmlari (Pixabay/Wikimedia)
   - Kino kadrlari (YouTube screenshotlar)
   - Asarlar/qopqoqlar

## 9.2. Phase 2 uchun (keyinroq):
- Firebase loyihasi yaratish (Anvar buni qiladi yoki ko'rsatma beradi)
- Google OAuth sozlash
- Domain (optional — meros.uz yoki vercel.app subdomain)

## 9.3. Content qarorlar:
- **Tilla Muhr** narxlash — yuqorida taklif qilingan, lekin tuzatish mumkin
- Achievement matnlari (uzbekcha) — Claude Code yozadi, foydalanuvchi tasdiqlaydi
- Daily quotes 365 ta — boshlanishda 30-50 ta ham yetadi, keyin to'ldiriladi

---

# 10. ESKI PLAN N2 GA NISBATAN O'ZGARISHLAR XULOSASI

| Element | Plan N2 | Yangi (merged) | Sabab |
|---|---|---|---|
| Valyuta nomi | Tilla | **Muhr** | Foydalanuvchi SVG'si |
| Valyuta darajalari | 1 (Tilla) | **3** (Bronza/Kumush/Tilla Muhr) | Progress chuqurligi |
| Tier soni | 5 | **6** (+ Sohibqiron) | Eng yuqori wow uchun |
| Achievement | 16+ | **~34** | Tier'lar bo'yicha balans |
| Daily content | Daily Challenge | + **Bugungi Hikmat**, **Kun So'zi** | Daily engagement |
| Sharhlar | Inline only | + **Alohida sahifa** (Uzum-style) | Foydalanuvchi talabi |
| Phase 4 polish | 7 ta | **9 ta** (+ Kolleksiya, Ipak yo'li) | Long-term content |
| Quiz savol | 30 (allomalar) | **171** (barcha bo'lim) | "Chuqurroq" talabi |
| Phase 1 fayllar | 12+ | **38** yangi/o'zgartirilgan | To'liq integratsiya |

---

# 11. EKSTRA KREATIV G'OYALAR (BACKLOG)

Vaqt va resurs bo'lsa qo'shiladi:

- 📜 **Tarixiy vaqt o'qi** — interaktiv timeline (X-XX asr)
- 🤝 **Guruh viktorinasi** — 4 odam birga, realtime
- 📡 **Live event'lar** — ma'lum kunda barcha birga o'qiyish
- 🎭 **Rolda bo'lish** — siz alloma bo'lib boshqalarga javob bering
- 🌍 **Til tanlash** — Rus, Ingliz
- 📊 **Personal Dashboard** — chart'lar, analytics
- 🏆 **Oylik tanlovlar** — sovrinlar bilan
- 📱 **PWA** — install qilinadigan, offline mode
- 🎁 **Sovg'a tizimi** — friends'ga muhr yuborish
- 🌳 **Madrasa qurish** — kollektiv ulkan loyiha
- 👨‍🏫 **Ustozlik tizimi** — Q&A, yuqori daraja

---

# XULOSA

Bu reja Plan N2 ning **professional asosini saqlab qoladi**, lekin:
1. ✅ **Muhr** valyutasiga to'liq o'tish (3 darajali)
2. ✅ Sohibqiron tier qo'shilishi (6 darajali tizim)
3. ✅ 5 marta ko'p viktorina savollari
4. ✅ 9 ta yangi kreativ g'oya integratsiyasi
5. ✅ Aniq ish tartibi (3 kun, soat-soatlik)
6. ✅ To'liq fayllar ro'yxati (Phase 1 da 38 ta fayl)

**Tanlov uchun Phase 1 yetadi** — hakamlar buni ko'rib "wow" deydi.
Phase 2-4 — tanlovdan keyin, lekin **arxitektura tayyor**.

🚀 Boshlashga tayyormiz!
