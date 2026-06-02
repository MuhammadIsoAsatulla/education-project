import { useMemo, useState } from 'react';
import muzeylar from '../data/muzeylar.json';
import MuseumCard from '../components/muzeylar/MuseumCard.jsx';
import PageHero from '../components/common/PageHero.jsx';
import { MuzeylarIcon } from '../components/common/SectionIcons.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function MuzeylarPage() {
  useScrollReveal();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return muzeylar;
    return muzeylar.filter((m) => {
      const hay = `${m.name || ''} ${m.city || ''} ${m.century || ''} ${m.shortDescription || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <>
      <PageHero
        eyebrow="VIRTUAL SAYOHAT"
        title="Muzeylar"
        description="Registon maydonidan Ichan Qal'agacha — tarixiy yodgorliklarni 360° rejimda kashf eting."
        accent
        sectionIcon={<MuzeylarIcon />}
      />

      <section className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto pt-4 sm:pt-6 mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Muzey nomi yoki shahar bo'yicha qidiring..."
          count={filtered.length}
          total={muzeylar.length}
        />
      </section>

      <section className="px-3 sm:px-6 md:px-12 pb-32 max-w-[1400px] mx-auto -mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((m, i) => (
            <MuseumCard key={m.id} muzey={m} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-cream-soft/60 italic font-serif text-xl py-20">
            Qidiruvga mos muzey topilmadi.
          </p>
        )}
      </section>
    </>
  );
}
