import { useEffect, useState } from 'react';
import OrnamentDivider from '../common/OrnamentDivider.jsx';
import FeaturedBook from './FeaturedBook.jsx';
import Bookshelf from './Bookshelf.jsx';

/** Deterministic dust motes (no Math.random → stable across renders). */
const DUST = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 67) % 100}%`,
  bottom: `${(i * 23) % 60}%`,
  size: 1.5 + ((i * 7) % 4),
  dur: 14 + ((i * 5) % 12),
  delay: (i % 7) * 1.4,
}));

// Books-per-shelf scales with viewport. The shelf overlaps each book ~22 %
// over its neighbour, so 7 books at 174 px wide collapse to ~960 px — fits
// the 1240 px container with breathing room.
//
// Phones (<640): 3 books — every title readable.
// iPad portrait (640–1023): 4 books — fits 768 px iPad without overflow.
// iPad Pro portrait / small laptop (1024–1279): 5 books — fits 1024 px.
// Desktop (≥1280): 7 books — full shelf at large viewports.
function pickPerShelf(width) {
  if (width < 640) return 3;
  if (width < 1024) return 4;
  if (width < 1280) return 5;
  return 7;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function LibraryExperience({ books }) {
  // Featured book defaults to the first book. We resync if the parent
  // (KitoblarPage) filters the list down — that way searching for a single
  // title makes that book the featured one automatically.
  const [featured, setFeatured] = useState(books[0]);

  // Track viewport width so we can re-chunk shelves on resize. SSR-safe
  // initial value (1280) means the first paint assumes desktop and corrects
  // on hydration if needed.
  const [perShelf, setPerShelf] = useState(() =>
    pickPerShelf(typeof window === 'undefined' ? 1280 : window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => setPerShelf(pickPerShelf(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!books.length) return;
    setFeatured((curr) => (books.find((b) => b.id === curr?.id) ? curr : books[0]));
  }, [books]);

  const shelves = chunk(books, perShelf);

  if (!books.length) {
    return (
      <section className="relative">
        <div className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1320px] mx-auto pt-2 pb-24 text-center">
          <p className="font-serif italic text-cream-soft/70 text-base sm:text-lg">
            Hech qanday kitob topilmadi.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      {/* Background — atmospheric dust motes only; the page's GlobalBackground
          provides the starry sky beneath. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 top-8 -translate-x-1/2 w-[85%] h-[460px] blur-3xl rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(212,165,116,0.10), transparent 70%)' }}
        />
        {DUST.map((d, i) => (
          <span
            key={i}
            className="lib-dust absolute rounded-full"
            style={{
              left: d.left,
              bottom: d.bottom,
              width: d.size,
              height: d.size,
              background: 'rgba(232,200,152,0.5)',
              animation: `libFloatDust ${d.dur}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1320px] mx-auto pt-2 pb-24">
        {/* Featured */}
        <div className="text-center mb-9 sm:mb-12">
          <OrnamentDivider className="opacity-60 mb-4" />
          <p className="eyebrow text-[11px] sm:text-sm">— TANLANGAN ASAR —</p>
        </div>
        <FeaturedBook book={featured} />

        {/* Shelf intro */}
        <div className="text-center mt-20 sm:mt-24 mb-2">
          <p className="eyebrow text-[11px] sm:text-sm mb-2">— KUTUBXONA —</p>
          <p className="font-serif italic text-cream-soft/70 text-sm sm:text-base">
            Kitob ustiga keling — javondan oling.
          </p>
        </div>

        {/* Multi-row bookshelf — every row is its own wooden plank, so the
            collection reads as a real library with depth. Hovering a book on
            any shelf re-features it; the rest of the shelves stay
            independent (no cross-shelf neighbour shifting, which is the
            physically correct behaviour). */}
        <div className="space-y-3 sm:space-y-3 md:space-y-4">
          {shelves.map((shelf, idx) => (
            <Bookshelf
              key={idx}
              books={shelf}
              onFeature={setFeatured}
              compact={perShelf === 3}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes libFloatDust {
          0%   { transform: translateY(0); opacity: 0; }
          12%  { opacity: 0.55; }
          88%  { opacity: 0.4; }
          100% { transform: translateY(-140px); opacity: 0; }
        }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .lib-dust { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
