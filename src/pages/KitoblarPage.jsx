import { useEffect, useMemo, useState } from 'react';
import kitoblar from '../data/kitoblar.json';
import BookSpine from '../components/kitoblar/BookSpine.jsx';
import PageHero from '../components/common/PageHero.jsx';
import OrnamentDivider from '../components/common/OrnamentDivider.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import { Link } from 'react-router-dom';

// Spines are 67-127px wide. At gap-3 (12px), 7 books fit comfortably in the
// 1300px container; on tablets 5 keeps the shelf from looking sparse; on
// phones 3 stays readable. Listen for resize so reflowing the window
// recomputes the grouping instead of stranding it at first-paint width.
function pickPerShelf(width) {
  if (width < 640) return 3;
  if (width < 1024) return 5;
  return 7;
}

export default function KitoblarPage() {
  useScrollReveal();

  const [perShelf, setPerShelf] = useState(() =>
    pickPerShelf(typeof window === 'undefined' ? 1280 : window.innerWidth),
  );
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onResize = () => setPerShelf(pickPerShelf(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Filter on title or author (case-insensitive, trims whitespace).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return kitoblar;
    return kitoblar.filter((b) => {
      const hay = `${b.title || ''} ${b.author || ''} ${b.genre || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const shelves = [];
  for (let i = 0; i < filtered.length; i += perShelf) {
    shelves.push(filtered.slice(i, i + perShelf));
  }

  return (
    <>
      <PageHero
        eyebrow="DONOLIK BOG'I"
        title="Kitoblar"
        description="Navoiy g'azallaridan zamonaviy nasrgacha — har sahifa bir olam, har kitob bir umr."
        accent
      />

      {/* Search bar */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1300px] mx-auto pt-4 sm:pt-6 mb-8">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Kitob yoki muallif nomi bo'yicha qidiring..."
          count={filtered.length}
          total={kitoblar.length}
        />
      </section>

      {/* Library shelves */}
      <section className="px-4 sm:px-6 md:px-12 pb-16 sm:pb-20 max-w-[1300px] mx-auto -mt-2">
        {shelves.map((shelf, idx) => (
          <div key={idx} className="mb-10 sm:mb-16 reveal" data-reveal-delay={idx * 100}>
            <div className="relative pt-6 sm:pt-10">
              {/* Books standing on shelf */}
              <div className="flex items-end justify-center gap-2 sm:gap-3 flex-wrap">
                {shelf.map((b, i) => (
                  <BookSpine key={b.id} book={b} index={i} height={i % 2 === 0 ? 360 : 320} />
                ))}
              </div>
              {/* Shelf board */}
              <div className="relative mt-1">
                <div className="h-2 sm:h-3 rounded-sm bg-gradient-to-b from-gold-deep via-gold to-gold-deep shadow-[0_8px_20px_rgba(0,0,0,0.5)]" />
                <div className="h-1.5 sm:h-2 bg-bg-deep" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Featured book section: a "book of the month" preview */}
      <FeaturedBook />
    </>
  );
}

function FeaturedBook() {
  const featured = kitoblar[0];
  return (
    <section className="px-4 sm:px-6 md:px-12 py-14 sm:py-20 border-t border-gold/10 reveal"
             style={{ background: `linear-gradient(180deg, transparent, ${featured.accent}1a, transparent)` }}>
      <div className="max-w-[1200px] mx-auto text-center">
        <OrnamentDivider className="opacity-60 mb-6" />
        <div className="eyebrow mb-3">— OY KITOBI —</div>
        <h2 className="section-title mb-3">Bugun O'qing</h2>
        <p className="font-serif italic text-cream-soft/80 max-w-xl mx-auto mb-8 sm:mb-10 px-2">
          Har oy biz bir asarni alohida diqqat bilan tanlaymiz va sizga taklif etamiz.
        </p>
      </div>
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 sm:gap-8 lg:gap-12 items-center">
        <div className="mx-auto">
          <BookSpine book={featured} index={0} height={420} />
        </div>
        <div className="text-center lg:text-left">
          <h3 className="font-serif text-cream text-2xl sm:text-3xl md:text-4xl mb-2">{featured.title}</h3>
          <p className="text-cream-soft/70 mb-4 text-sm sm:text-base">— {featured.author} ({featured.year}) —</p>
          <p className="text-cream-soft text-base sm:text-lg leading-relaxed mb-6">{featured.annotation}</p>
          <Link to={`/kitoblar/${featured.slug}`} className="gold-cta">
            <span>Mutolaani boshlash</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
