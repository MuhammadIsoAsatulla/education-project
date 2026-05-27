import { useEffect, useMemo, useState } from 'react';
import musiqa from '../data/musiqa.json';
import SongCard from '../components/musiqa/SongCard.jsx';
import KaraokeView from '../components/musiqa/KaraokeView.jsx';
import PageHero from '../components/common/PageHero.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import useProgress from '../hooks/useProgress.js';

export default function MusiqaPage() {
  useScrollReveal();
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState('');
  const { visit } = useProgress();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return musiqa;
    return musiqa.filter((s) => {
      const hay = `${s.title || ''} ${s.artist || ''} ${s.genre || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  useEffect(() => {
    if (active) visit('musiqa', active.id, { points: 5, achievement: 'maqomshunos' });
  }, [active, visit]);

  // Lock scroll when karaoke open
  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  return (
    <>
      <PageHero
        eyebrow="MAQOM VA KARAOKE"
        title="Musiqa"
        description="Shashmaqomdan xalq qo'shiqlarigacha — har bir ohang dilning ko'zgusi. Karaoke rejimida o'zingiz ham qo'shing."
        accent
      />

      <section className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto pt-4 sm:pt-6 mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Qo'shiq, ijrochi yoki janr bo'yicha qidiring..."
          count={filtered.length}
          total={musiqa.length}
        />
      </section>

      <section className="px-6 md:px-12 pb-32 max-w-[1400px] mx-auto -mt-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((s, i) => (
            <SongCard key={s.id} song={s} index={i} onOpen={setActive} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-cream-soft/60 italic font-serif text-xl py-20">
            Qidiruvga mos qo'shiq topilmadi.
          </p>
        )}
      </section>

      {active && <KaraokeView song={active} onClose={() => setActive(null)} />}
    </>
  );
}
