import { useMemo, useState } from 'react';
import kitoblar from '../data/kitoblar.json';
import PageHero from '../components/common/PageHero.jsx';
import { KitoblarIcon } from '../components/common/SectionIcons.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import LibraryExperience from '../components/kitoblar/LibraryExperience.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function KitoblarPage() {
  useScrollReveal();

  const [query, setQuery] = useState('');

  // Filter on title, author, or genre (case-insensitive, trims whitespace).
  // LibraryExperience uses the filtered list as both the featured pool and
  // the shelf — so searching for one title focuses everything on it.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return kitoblar;
    return kitoblar.filter((b) => {
      const hay = `${b.title || ''} ${b.author || ''} ${b.genre || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <>
      <PageHero
        eyebrow="DONOLIK BOG'I"
        title="Kitoblar"
        description="Navoiy g'azallaridan zamonaviy nasrgacha — har sahifa bir olam, har kitob bir umr."
        accent
        sectionIcon={<KitoblarIcon />}
      />

      {/* Search bar — A's enhancement (B's library page didn't have one).
          Kept above the shelf so users can jump straight to a title. */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 max-w-[1300px] mx-auto pt-4 sm:pt-6 mb-8">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Kitob yoki muallif nomi bo'yicha qidiring..."
          count={filtered.length}
          total={kitoblar.length}
        />
      </section>

      {/* 3D animated library — featured book on top, interactive bookshelf below */}
      <LibraryExperience books={filtered} />
    </>
  );
}
