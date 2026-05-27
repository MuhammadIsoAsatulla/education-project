import { useMemo, useState } from 'react';
import allomalar from '../data/allomalar.json';
import AllomaCard from '../components/allomalar/AllomaCard.jsx';
import PageHero from '../components/common/PageHero.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function AllomalarPage() {
  useScrollReveal();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allomalar;
    return allomalar.filter((a) => {
      const hay = `${a.name || ''} ${a.fullName || ''} ${a.field || ''} ${a.birthplace || ''} ${a.era || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <>
      <PageHero
        eyebrow="BUYUK AQL SOHIBLARI"
        title="Allomalar"
        description="Asrlardan oshib kelgan beshta aql sohibi. Har birining hayoti — bir kitob, asarlari — bir olam."
        accent
      />

      <section className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto pt-4 sm:pt-6 mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Olim ismi, sohasi yoki tug'ilgan joyi bo'yicha qidiring..."
          count={filtered.length}
          total={allomalar.length}
        />
      </section>

      <section className="px-6 md:px-12 pb-32 max-w-[1400px] mx-auto -mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((a, i) => (
            <AllomaCard key={a.id} alloma={a} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-cream-soft/60 italic font-serif text-xl py-20">
            Qidiruvga mos alloma topilmadi.
          </p>
        )}
      </section>
    </>
  );
}
