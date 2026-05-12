import { useMemo, useState } from 'react';
import kinolar from '../data/kinolar.json';
import MoviePoster from '../components/kinolar/MoviePoster.jsx';
import PageHero from '../components/common/PageHero.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

const FILTERS = ['Hammasi', 'Drama', 'Komediya', 'Tarixiy', 'Doston'];

export default function KinolarPage() {
  useScrollReveal();
  const [filter, setFilter] = useState('Hammasi');

  const filtered = useMemo(() => {
    if (filter === 'Hammasi') return kinolar;
    return kinolar.filter((m) => m.genre.toLowerCase().includes(filter.toLowerCase()));
  }, [filter]);

  return (
    <>
      <PageHero
        eyebrow="KLASSIK ASARLAR"
        title="Kinolar"
        description="O'zbek kinematografiyasining eng yorqin sahifalari — har bir film o'z davrining oynasidir."
        accent
      />

      <section className="px-6 md:px-12 max-w-[1400px] mx-auto -mt-4 mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs tracking-[2px] uppercase transition-all ${
                filter === f
                  ? 'bg-gold text-bg-deep border border-gold'
                  : 'border border-gold/30 text-cream-soft/80 hover:text-gold hover:border-gold/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
          {filtered.map((m, i) => (
            <MoviePoster key={m.id} movie={m} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-cream-soft/60 italic font-serif text-xl py-20">
            Bu janrda hozircha film yo'q.
          </p>
        )}
      </section>
    </>
  );
}
