import { useEffect, useState } from 'react';
import musiqa from '../data/musiqa.json';
import SongCard from '../components/musiqa/SongCard.jsx';
import KaraokeView from '../components/musiqa/KaraokeView.jsx';
import PageHero from '../components/common/PageHero.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import useProgress from '../hooks/useProgress.js';

export default function MusiqaPage() {
  useScrollReveal();
  const [active, setActive] = useState(null);
  const { visit } = useProgress();

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

      <section className="px-6 md:px-12 pb-32 max-w-[1400px] mx-auto -mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {musiqa.map((s, i) => (
            <SongCard key={s.id} song={s} index={i} onOpen={setActive} />
          ))}
        </div>
      </section>

      {active && <KaraokeView song={active} onClose={() => setActive(null)} />}
    </>
  );
}
