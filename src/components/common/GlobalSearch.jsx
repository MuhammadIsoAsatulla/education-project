import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import allomalar from '../../data/allomalar.json';
import jadidlar from '../../data/jadidlar.json';
import muzeylar from '../../data/muzeylar.json';
import musiqa from '../../data/musiqa.json';
import kinolar from '../../data/kinolar.json';
import kitoblar from '../../data/kitoblar.json';

// Each "source" is one section. `match(item, q)` is per-section because the
// fields that should be searchable differ (alloma has a `field`, kitob has an
// `author`, etc.). `format` converts a hit into a uniform shape the result
// list can render.
const SOURCES = [
  {
    key: 'allomalar',
    label: 'Allomalar',
    data: allomalar,
    basePath: '/allomalar',
    match: (a, q) =>
      `${a.name} ${a.fullName} ${a.field} ${a.birthplace} ${a.era} ${(a.tags || []).join(' ')}`
        .toLowerCase()
        .includes(q),
    format: (a) => ({ id: a.id, slug: a.slug, title: a.name, subtitle: `${a.field} · ${a.years}`, accent: a.accent, initial: a.initial }),
  },
  {
    key: 'jadidlar',
    label: 'Jadidlar',
    data: jadidlar,
    basePath: '/jadidlar',
    match: (j, q) =>
      `${j.name} ${j.fullName} ${j.field} ${j.birthplace} ${j.era} ${(j.tags || []).join(' ')}`
        .toLowerCase()
        .includes(q),
    format: (j) => ({ id: j.id, slug: j.slug, title: j.name, subtitle: `${j.field} · ${j.years}`, accent: j.accent, initial: j.initial }),
  },
  {
    key: 'kitoblar',
    label: 'Kitoblar',
    data: kitoblar,
    basePath: '/kitoblar',
    match: (b, q) =>
      `${b.title} ${b.author} ${b.genre} ${b.annotation} ${(b.themes || []).join(' ')}`
        .toLowerCase()
        .includes(q),
    format: (b) => ({ id: b.id, slug: b.slug, title: b.title, subtitle: `${b.author} · ${b.year}`, accent: b.accent, initial: b.initial }),
  },
  {
    key: 'kinolar',
    label: 'Kinolar',
    data: kinolar,
    basePath: '/kinolar',
    match: (m, q) =>
      `${m.title} ${m.director} ${m.genre} ${m.synopsis}`.toLowerCase().includes(q),
    format: (m) => ({ id: m.id, slug: m.slug, title: m.title, subtitle: `${m.director} · ${m.year}`, accent: m.accent, initial: m.initial }),
  },
  {
    key: 'muzeylar',
    label: 'Muzeylar',
    data: muzeylar,
    basePath: '/muzeylar',
    match: (m, q) =>
      `${m.name} ${m.city} ${m.century} ${m.shortDescription}`.toLowerCase().includes(q),
    format: (m) => ({ id: m.id, slug: m.slug, title: m.name, subtitle: `${m.city} · ${m.century}`, accent: m.accent, initial: m.initial }),
  },
  {
    key: 'musiqa',
    label: 'Musiqa',
    data: musiqa,
    basePath: '/musiqa',
    match: (s, q) =>
      `${s.title} ${s.artist} ${s.genre} ${s.about || ''}`.toLowerCase().includes(q),
    format: (s) => ({ id: s.id, slug: s.slug, title: s.title, subtitle: `${s.artist} · ${s.genre}`, accent: s.accent, initial: s.initial }),
  },
];

const PER_SECTION_LIMIT = 5;

function runSearch(rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return { groups: [], totalHits: 0 };
  const groups = SOURCES.map((src) => {
    const hits = src.data.filter((item) => src.match(item, q)).slice(0, PER_SECTION_LIMIT);
    return { ...src, hits };
  }).filter((g) => g.hits.length > 0);
  const totalHits = groups.reduce((sum, g) => sum + g.hits.length, 0);
  return { groups, totalHits };
}

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Reset query each time we open; autofocus the input.
  useEffect(() => {
    if (open) {
      setQuery('');
      // Allow the input to mount before focusing.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Lock body scroll while open + listen for Esc.
  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const { groups, totalHits } = useMemo(() => runSearch(query), [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center px-2 sm:px-4 py-4 sm:py-10 xl:py-20"
      role="dialog"
      aria-modal="true"
      aria-label="Umumiy qidiruv"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Yopish"
        onClick={onClose}
        className="absolute inset-0 bg-bg-deep/85 backdrop-blur-md cursor-default"
      />

      {/* Panel */}
      <div className="relative w-full max-w-[calc(100%-16px)] md:max-w-2xl bg-bg-mid/95 backdrop-blur-xl border border-gold/30 rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[80vh]">
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-gold/15">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-gold/80 flex-shrink-0"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Alloma, kitob, film, qo'shiq, muzey..."
            className="flex-1 bg-transparent text-cream text-base font-serif placeholder:text-cream-soft/40 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] tracking-[1px] text-cream-soft/50 border border-gold/20 rounded">
            ESC
          </kbd>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="w-8 h-8 rounded-full flex items-center justify-center text-cream-soft/60 hover:text-gold hover:bg-gold/10 transition sm:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {query.trim().length === 0 ? (
            <EmptyHint />
          ) : totalHits === 0 ? (
            <p className="px-5 py-12 text-center font-serif italic text-cream-soft/60">
              Hech narsa topilmadi. Boshqacha so'z bilan urinib ko'ring.
            </p>
          ) : (
            <ul className="divide-y divide-gold/10">
              {groups.map((group) => (
                <li key={group.key}>
                  <div className="px-4 sm:px-5 py-2 bg-bg-deep/40">
                    <span className="text-[10px] tracking-[3px] uppercase font-amiri text-gold/70">
                      — {group.label} —
                    </span>
                    <span className="ml-2 text-[10px] text-cream-soft/40">
                      {group.hits.length}{group.hits.length === PER_SECTION_LIMIT ? '+' : ''}
                    </span>
                  </div>
                  {group.hits.map((raw) => {
                    const r = group.format(raw);
                    return (
                      <Link
                        key={`${group.key}-${r.id}`}
                        to={`${group.basePath}/${r.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gold/10 transition-colors group"
                      >
                        <span
                          className="w-9 h-9 rounded-sm border border-gold/30 flex items-center justify-center font-serif text-base flex-shrink-0"
                          style={{ background: `${r.accent}22`, color: r.accent }}
                        >
                          {r.initial}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-serif text-cream text-sm sm:text-base group-hover:text-gold transition truncate">
                            {r.title}
                          </span>
                          <span className="block text-cream-soft/60 text-[11px] sm:text-xs truncate">
                            {r.subtitle}
                          </span>
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="w-4 h-4 text-gold/40 group-hover:text-gold group-hover:translate-x-1 transition flex-shrink-0"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Link>
                    );
                  })}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyHint() {
  return (
    <div className="px-5 py-10 text-center">
      <p className="font-serif italic text-cream-soft/70 mb-4">
        Saytdagi har qanday narsani qidiring — alloma, jadid, kitob, film, muzey yoki qo'shiq.
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-[11px]">
        {['Navoiy', 'Boburnoma', 'Samarqand', 'O\'tgan kunlar', 'Maqom'].map((t) => (
          <span
            key={t}
            className="px-3 py-1 border border-gold/20 rounded-full text-cream-soft/60 font-amiri tracking-[1px]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
