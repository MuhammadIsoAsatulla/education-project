import { useMemo, useState } from 'react';
import kinolar from '../data/kinolar.json';
import MoviePoster from '../components/kinolar/MoviePoster.jsx';
import PageHero from '../components/common/PageHero.jsx';
import { KinolarIcon } from '../components/common/SectionIcons.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

const FILTERS = ['Hammasi', 'Drama', 'Komediya', 'Tarixiy', 'Doston'];

export default function KinolarPage() {
  useScrollReveal();
  const [filter, setFilter] = useState('Hammasi');
  const [query, setQuery] = useState('');

  // Genre chip narrows the category, the search box does free-text matching
  // on title/director/genre/synopsis. Both filters compose (genre AND query).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return kinolar.filter((m) => {
      const genreMatch =
        filter === 'Hammasi' || (m.genre || '').toLowerCase().includes(filter.toLowerCase());
      if (!genreMatch) return false;
      if (!q) return true;
      const hay = `${m.title || ''} ${m.director || ''} ${m.genre || ''} ${m.synopsis || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filter, query]);

  return (
    <>
      <PageHero
        eyebrow="KLASSIK ASARLAR"
        title="Kinolar"
        description="O'zbek kinematografiyasining eng yorqin sahifalari — har bir film o'z davrining oynasidir."
        accent
        sectionIcon={<KinolarIcon />}
      />

      <section className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto pt-4 sm:pt-6 mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Film, rejissyor yoki janr bo'yicha qidiring..."
          count={filtered.length}
          total={kinolar.length}
        />
      </section>

      <section className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-5 py-2.5 sm:py-2 rounded-full text-xs sm:text-xs tracking-[2px] uppercase transition-all ${
                filter === f
                  ? 'bg-gold text-bg-deep border border-gold shadow-[0_0_20px_rgba(212,165,116,0.3)]'
                  : 'bg-bg-deep/60 backdrop-blur border border-gold/30 text-cream-soft hover:text-gold hover:border-gold/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="px-3 sm:px-6 md:px-12 pb-32 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
          {filtered.map((m, i) => (
            <MoviePoster key={m.id} movie={m} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-cream-soft/60 italic font-serif text-xl py-20">
            {query.trim() ? "Qidiruvga mos film topilmadi." : "Bu janrda hozircha film yo'q."}
          </p>
        )}
      </section>
    </>
  );
}
