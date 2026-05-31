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

export default function LibraryExperience({ books }) {
  // Featured book defaults to the first book. We resync if the parent
  // (KitoblarPage) filters the list down — that way searching for a single
  // title makes that book the featured one automatically.
  const [featured, setFeatured] = useState(books[0]);

  useEffect(() => {
    if (!books.length) return;
    setFeatured((curr) => (books.find((b) => b.id === curr?.id) ? curr : books[0]));
  }, [books]);

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

        <Bookshelf books={books} onFeature={setFeatured} />
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
