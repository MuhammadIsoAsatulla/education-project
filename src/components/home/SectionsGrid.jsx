import { Link } from 'react-router-dom';
import OrnamentDivider from '../common/OrnamentDivider.jsx';

const SECTIONS = [
  {
    num: '— I —',
    to: '/allomalar',
    title: 'Allomalar',
    subtitle: '— Buyuk Aql Sohiblari —',
    cta: 'Tanish',
    description:
      "Beruniy, Ibn Sino, Ulug'bek, Cho'lpon, Behbudiy — har bir alloma o‘z hayoti, asarlari va ta’limoti haqida shaxsan hikoya qiladi.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    num: '— II —',
    to: '/muzeylar',
    title: 'Muzeylar',
    subtitle: '— Virtual Sayohat —',
    cta: 'Sayohat',
    description:
      "Registon maydonidan Ichan Qal'agacha — ekraningiz orqali O‘zbekistonning eng buyuk yodgorliklarini 360° kezib chiqing.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 56 L56 56" />
        <path d="M12 56 L12 24 M52 56 L52 24" />
        <path d="M20 56 L20 28 M28 56 L28 28 M36 56 L36 28 M44 56 L44 28" />
        <path d="M8 24 L56 24 L32 8 Z" />
        <circle cx="32" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: '— III —',
    to: '/musiqa',
    title: 'Musiqa',
    subtitle: '— Maqom va Karaoke —',
    cta: 'Tinglash',
    description:
      "An'anaviy maqomlar, xalq qo‘shiqlari va zamonaviy ijodlar. Qo‘shing — karaoke rejimi sizni kutmoqda.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    num: '— IV —',
    to: '/kinolar',
    title: 'Kinolar',
    subtitle: '— Klassik Asarlar —',
    cta: "Ko‘rish",
    description:
      "“O‘tgan kunlar”, “Mahallada duv-duv gap”, “Tohir va Zuhra” — o‘zbek kinosining oltin xazinasi.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    num: '— V —',
    to: '/kitoblar',
    title: 'Kitoblar',
    subtitle: "— Donolik Bog‘i —",
    cta: 'Mutolaa',
    description:
      "Navoiy g‘azallaridan Cho‘lpon she'rlarigacha. Qadimiy hikmatlar yangi formatda — o‘qish va tinglash.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 12 L8 52 Q32 46 56 52 L56 12 Q32 18 8 12 Z" />
        <path d="M32 18 L32 50" />
        <path d="M14 22 L26 25 M14 28 L26 31 M14 34 L26 37" />
        <path d="M38 25 L50 22 M38 31 L50 28 M38 37 L50 34" />
      </svg>
    ),
  },
  {
    num: '— VI —',
    to: '/profil',
    title: 'Mening Ziyom',
    subtitle: '— Shaxsiy Yutuqlar —',
    cta: 'Kirish',
    description:
      "Bilim nishonlari, tugatilgan bo‘limlar va keyingi maqsadlar. O‘qituvchilar uchun maxsus panel.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M32 8 L36 24 L52 24 L40 34 L44 50 L32 40 L20 50 L24 34 L12 24 L28 24 Z" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
    ),
  },
];

export default function SectionsGrid() {
  return (
    <>
      {/* Section divider header */}
      <div id="bolimlar" className="text-center py-20 px-6 reveal">
        <OrnamentDivider className="opacity-60 mb-6" />
        <div className="eyebrow mb-4">— OLTI HAZINA —</div>
        <h2 className="section-title mb-4">Madaniyat Saroyi</h2>
        <p className="font-serif italic text-xl text-cream-soft max-w-2xl mx-auto opacity-80">
          Har bir bo‘lim — yangi olam. Qaysi eshikdan kirishni o‘zingiz tanlang.
        </p>
      </div>

      <section className="px-6 md:px-12 pb-32 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SECTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group relative overflow-hidden border border-gold/20 hover:border-gold transition-all duration-500 ease-out p-12 min-h-[360px] flex flex-col justify-between rounded-sm reveal"
              style={{
                background: 'linear-gradient(135deg, var(--bg-mid) 0%, var(--teal) 100%)',
                transitionTimingFunction: 'var(--ease-out-expo)',
              }}
            >
              {/* Hover overlay */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at top right, rgba(212, 165, 116, 0.15), transparent 60%)',
                }}
              />
              {/* Bottom gold line */}
              <span className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="relative z-10 group-hover:-translate-y-1 transition-transform duration-500">
                <div className="font-serif text-sm text-gold tracking-[4px] mb-6 opacity-70">{s.num}</div>
                <div className="w-16 h-16 mb-6 text-gold transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  {s.icon}
                </div>
                <h3 className="font-serif text-3xl md:text-4xl font-semibold text-cream tracking-wide mb-3">
                  {s.title}
                </h3>
                <p className="font-amiri text-[13px] text-gold tracking-[3px] uppercase mb-5">{s.subtitle}</p>
                <p className="text-[15px] text-cream-soft/85 leading-relaxed">{s.description}</p>
              </div>

              <div className="relative z-10 mt-6 inline-flex items-center gap-3 text-gold text-xs tracking-[2px] uppercase font-semibold group-hover:gap-5 transition-[gap] duration-300">
                {s.cta}
                <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-3">
                  <path d="M0 6 L18 6 M13 1 L18 6 L13 11" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
