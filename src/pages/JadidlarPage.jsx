import { useMemo, useState } from 'react';
import jadidlar from '../data/jadidlar.json';
import AllomaCard from '../components/allomalar/AllomaCard.jsx';
import PageHero from '../components/common/PageHero.jsx';
import { JadidlarIcon } from '../components/common/SectionIcons.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

// Reuses AllomaCard with the jadid base path + section, so favorites and
// links route to /jadidlar/:slug instead of /allomalar/:slug.
export default function JadidlarPage() {
  useScrollReveal();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jadidlar;
    return jadidlar.filter((j) => {
      const hay = `${j.name || ''} ${j.fullName || ''} ${j.field || ''} ${j.birthplace || ''} ${j.era || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <>
      <PageHero
        eyebrow="MILLIY UYG'ONISH AVLODI"
        title="Jadidlar"
        description="XIX asr oxiri va XX asr boshida ma'rifat va o'zlik uchun kurashgan o'zbek ziyolilari. Ko'pchiligi qatag'on shahidlari."
        accent
        sectionIcon={<JadidlarIcon />}
      />

      <section className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto pt-4 sm:pt-6 mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Jadid ismi, sohasi yoki tug'ilgan joyi bo'yicha qidiring..."
          count={filtered.length}
          total={jadidlar.length}
        />
      </section>

      <section className="px-3 sm:px-6 md:px-12 pb-32 max-w-[1400px] mx-auto -mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((j, i) => (
            <AllomaCard
              key={j.id}
              alloma={j}
              index={i}
              basePath="/jadidlar"
              section="jadidlar"
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-cream-soft/60 italic font-serif text-xl py-20">
            Qidiruvga mos jadid topilmadi.
          </p>
        )}
      </section>
    </>
  );
}
