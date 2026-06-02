import { Link } from 'react-router-dom';

/**
 * Editorial 7-section grid on a 6-column underlying grid.
 *
 * Layout (md+):
 *   ┌─────────────┬─────────────┐
 *   │  Allomalar  │   Jadidlar  │     featured pair (½ + ½)
 *   ├──────┬──────┼──────┬──────┤
 *   │ Muz. │ Mus. │ Kin. │      │     equal trio (⅓ + ⅓ + ⅓)
 *   ├──────┴──────┴──┬───┴──────┤
 *   │   Kitoblar      │  Profil │     wide banner (⅔) + compact (⅓)
 *   └─────────────────┴─────────┘
 *
 * Three card variants:
 *   - `featured` (col-span-3 of 6, slightly larger title) — Allomalar, Jadidlar
 *   - `banner`   (col-span-4 of 6, horizontal layout)    — Kitoblar
 *   - default    (col-span-2 of 6)                       — Muzeylar, Musiqa, Kinolar, Profil
 */

const SECTIONS = [
  {
    to: '/allomalar',
    title: 'Allomalar',
    cta: 'Tanish',
    description:
      "Beruniy, Ibn Sino, Ulug'bek, Cho'lpon, Behbudiy — har bir alloma o'z hayoti, asarlari va ta'limoti haqida shaxsan hikoya qiladi.",
    span: 'featured',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M32 8 L32 16 M28 12 L36 12" />
        <path d="M20 20 Q20 18 22 18 L42 18 Q44 18 44 20 L44 50 Q44 52 42 52 L22 52 Q20 52 20 50 Z" />
        <circle cx="32" cy="30" r="6" />
        <path d="M24 44 Q32 38 40 44" />
        <path d="M16 24 L20 24 M16 32 L20 32 M16 40 L20 40" />
        <path d="M44 24 L48 24 M44 32 L48 32 M44 40 L48 40" />
      </svg>
    ),
  },
  {
    to: '/jadidlar',
    title: 'Jadidlar',
    cta: 'O\'qish',
    description:
      "Behbudiy, Fitrat, Cho'lpon, Munavvar Qori — XX asr boshidagi ma'rifatparvarlar harakati. Yangi maktab, yangi matbuot, yangi millat.",
    span: 'featured',
    // Torch ("mash'al") icon — symbol of ma'rifat (enlightenment), the
    // movement's core metaphor.
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* Flame */}
        <path d="M32 6 C26 14 22 20 22 28 C22 34 26 38 32 38 C38 38 42 34 42 28 C42 20 38 14 32 6 Z" />
        <path d="M32 14 C29 19 27 23 27 28 C27 31 29 33 32 33" />
        {/* Handle */}
        <path d="M28 38 L28 50 L36 50 L36 38" />
        {/* Base / decorative crossbar */}
        <path d="M24 42 L40 42" />
        <path d="M26 50 L38 50 L36 58 L28 58 Z" />
      </svg>
    ),
  },
  {
    to: '/muzeylar',
    title: 'Muzeylar',
    cta: 'Sayohat',
    description:
      "Registon maydonidan Ichan Qal'agacha — ekraningiz orqali O'zbekistonning eng buyuk yodgorliklarini 360° kezib chiqing.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 56 L56 56" />
        <path d="M12 56 L12 24 M52 56 L52 24" />
        <path d="M20 56 L20 28 M28 56 L28 28 M36 56 L36 28 M44 56 L44 28" />
        <path d="M8 24 L56 24 L32 8 Z" />
        <circle cx="32" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    to: '/musiqa',
    title: 'Musiqa',
    cta: 'Tinglash',
    description:
      "An'anaviy maqomlar, xalq qo'shiqlari va zamonaviy ijodlar. Qo'shing — karaoke rejimi sizni kutmoqda.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <ellipse cx="20" cy="48" rx="8" ry="6" />
        <ellipse cx="44" cy="44" rx="8" ry="6" />
        <path d="M28 48 L28 16 L52 12 L52 44" />
        <path d="M28 24 L52 20" />
        <circle cx="40" cy="8" r="2" fill="currentColor" />
        <path d="M40 8 L40 16" />
      </svg>
    ),
  },
  {
    to: '/kinolar',
    title: 'Kinolar',
    cta: "Ko'rish",
    description:
      "\"O'tgan kunlar\", \"Mahallada duv-duv gap\", \"Tohir va Zuhra\" — o'zbek kinosining oltin xazinasi.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="8" y="12" width="48" height="40" rx="2" />
        <circle cx="14" cy="18" r="2" />
        <circle cx="22" cy="18" r="2" />
        <circle cx="14" cy="46" r="2" />
        <circle cx="22" cy="46" r="2" />
        <circle cx="42" cy="18" r="2" />
        <circle cx="50" cy="18" r="2" />
        <circle cx="42" cy="46" r="2" />
        <circle cx="50" cy="46" r="2" />
        <path d="M28 24 L28 40 L40 32 Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    to: '/kitoblar',
    title: 'Kitoblar',
    cta: 'Mutolaa',
    description:
      "Navoiy g'azallaridan Cho'lpon she'rlarigacha. Qadimiy hikmatlar yangi formatda — o'qish va tinglash.",
    span: 'banner',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 12 L8 52 Q32 46 56 52 L56 12 Q32 18 8 12 Z" />
        <path d="M32 18 L32 50" />
        <path d="M14 22 L26 25 M14 28 L26 31 M14 34 L26 37" />
        <path d="M38 25 L50 22 M38 31 L50 28 M38 37 L50 34" />
      </svg>
    ),
  },
  {
    to: '/profil',
    title: 'Mening Ziyom',
    cta: 'Kirish',
    description:
      "Bilim nishonlari, tugatilgan bo'limlar va keyingi maqsadlar.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M32 8 L36 24 L52 24 L40 34 L44 50 L32 40 L20 50 L24 34 L12 24 L28 24 Z" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
    ),
  },
];

const CARD_SHADOW =
  '0 24px 48px -16px rgba(0,0,0,0.55), 0 4px 14px -6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)';
const CARD_HOVER_SHADOW =
  '0 32px 72px -16px rgba(0,0,0,0.65), 0 8px 22px -8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)';

function CardArrow() {
  return (
    <svg
      viewBox="0 0 20 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-4 h-3 translate-x-0 group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      aria-hidden="true"
    >
      <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
    </svg>
  );
}

function SectionCard({ section }) {
  const { to, title, description, cta, icon, span } = section;
  const isFeatured = span === 'featured';
  const isBanner = span === 'banner';

  // 6-col underlying grid. Mobile collapses to a single column.
  const spanClass = isFeatured
    ? 'md:col-span-3'
    : isBanner
    ? 'md:col-span-4'
    : 'md:col-span-2';

  // Banner: horizontal layout (icon left, text middle, CTA right) on md+.
  if (isBanner) {
    return (
      <Link
        to={to}
        className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] hover:border-gold/30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 reveal ${spanClass}`}
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)',
          boxShadow: CARD_SHADOW,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = CARD_HOVER_SHADOW)}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = CARD_SHADOW)}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(70% 60% at 0% 50%, rgba(212,165,116,0.12), transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:gap-7 sm:p-7 md:p-10 min-h-[180px] sm:min-h-[220px]">
          <div
            className="w-14 h-14 md:w-16 md:h-16 text-gold/85 flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
            aria-hidden="true"
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-2xl md:text-[28px] text-cream leading-tight mb-2">
              {title}
            </h3>
            <p className="text-cream-soft/65 text-[15px] leading-[1.55] max-w-xl">
              {description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-2.5 text-gold group-hover:text-gold-bright transition-colors font-medium text-sm">
              {cta}
              <CardArrow />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] hover:border-gold/30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 reveal ${spanClass}`}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)',
        boxShadow: CARD_SHADOW,
        minHeight: isFeatured ? 320 : 270,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = CARD_HOVER_SHADOW)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = CARD_SHADOW)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isFeatured
            ? 'radial-gradient(60% 50% at 100% 0%, rgba(212,165,116,0.14), transparent 65%)'
            : 'radial-gradient(70% 50% at 50% 0%, rgba(212,165,116,0.10), transparent 70%)',
        }}
      />

      <div className={`relative z-10 flex flex-col h-full ${isFeatured ? 'p-6 sm:p-9 md:p-11' : 'p-7 md:p-8'}`}>
        <div
          className={`text-gold/85 mb-7 transition-transform duration-500 group-hover:scale-105 ${
            isFeatured ? 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14' : 'w-10 h-10'
          }`}
          aria-hidden="true"
        >
          {icon}
        </div>

        <h3
          className={`font-serif text-cream leading-tight mb-3 ${
            isFeatured ? 'text-3xl md:text-[34px]' : 'text-2xl md:text-[25px]'
          }`}
        >
          {title}
        </h3>

        <p
          className={`text-cream-soft/65 leading-[1.55] ${
            isFeatured ? 'text-[15px] md:text-base max-w-md' : 'text-sm md:text-[14.5px]'
          }`}
        >
          {description}
        </p>

        <span className="mt-auto pt-8 inline-flex items-center gap-2.5 text-gold group-hover:text-gold-bright transition-colors font-medium text-sm">
          {cta}
          <CardArrow />
        </span>
      </div>
    </Link>
  );
}

export default function SectionsGrid() {
  return (
    <>
      <div id="bolimlar" className="text-center pt-24 pb-12 px-6 reveal">
        <span aria-hidden="true" className="block mx-auto w-12 h-px bg-gold/40 mb-6" />
        <p className="text-gold/75 text-[11px] tracking-[5px] uppercase font-medium mb-5">
          Yetti Hazina
        </p>
        <h2
          className="font-serif text-cream leading-[1.05] mb-5 mx-auto max-w-3xl"
          style={{ fontSize: 'clamp(24px, 4vw, 56px)' }}
        >
          Madaniyat Saroyi
        </h2>
        <p className="text-cream-soft/65 max-w-xl mx-auto leading-relaxed text-base md:text-lg">
          Har bir bo'lim — yangi olam. Qaysi eshikdan kirishni o'zingiz tanlang.
        </p>
      </div>

      <section className="px-4 sm:px-6 md:px-10 pb-28 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">
          {SECTIONS.map((s) => (
            <SectionCard key={s.to} section={s} />
          ))}
        </div>
      </section>
    </>
  );
}
