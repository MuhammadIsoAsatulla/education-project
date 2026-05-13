import { useState } from 'react';
import { Link } from 'react-router-dom';
import allomalar from '../../data/allomalar.json';
import muzeylar from '../../data/muzeylar.json';
import musiqa from '../../data/musiqa.json';
import kinolar from '../../data/kinolar.json';
import kitoblar from '../../data/kitoblar.json';
import SmartImage from '../common/SmartImage.jsx';
import FavoriteButton from '../common/FavoriteButton.jsx';

const TABS = [
  { key: 'allomalar', label: 'Allomalar', data: allomalar, route: '/allomalar', imageKey: 'image' },
  { key: 'muzeylar', label: 'Muzeylar', data: muzeylar, route: '/muzeylar', imageKey: 'image' },
  { key: 'musiqa', label: 'Musiqa', data: musiqa, route: '/musiqa', imageKey: 'image' },
  { key: 'kinolar', label: 'Kinolar', data: kinolar, route: '/kinolar', imageKey: 'poster' },
  { key: 'kitoblar', label: 'Kitoblar', data: kitoblar, route: '/kitoblar', imageKey: 'cover' },
];

export default function FavoritesGallery({ favorites }) {
  const totalCount = TABS.reduce((s, t) => s + (favorites?.[t.key]?.length || 0), 0);
  const [activeKey, setActiveKey] = useState(
    TABS.find((t) => (favorites?.[t.key]?.length || 0) > 0)?.key || 'allomalar',
  );

  const active = TABS.find((t) => t.key === activeKey) || TABS[0];
  const ids = favorites?.[active.key] || [];
  const items = ids
    .map((id) => active.data.find((it) => it.id === id))
    .filter(Boolean);

  if (totalCount === 0) {
    return (
      <div className="p-8 sm:p-10 text-center border border-gold/20 rounded-sm bg-bg-mid/40">
        <p className="font-serif italic text-cream-soft text-lg sm:text-xl mb-3">
          Hali sevimli element yo'q
        </p>
        <p className="text-cream-soft/60 text-sm">
          Istalgan kartochkadagi ❤ tugmasini bosib o'zingizga ma'qul allomalar, muzeylar, kitoblar va kinolarni saqlab qo'ying.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {TABS.map((t) => {
          const count = favorites?.[t.key]?.length || 0;
          const isActive = t.key === activeKey;
          return (
            <button
              key={t.key}
              onClick={() => setActiveKey(t.key)}
              disabled={count === 0}
              className={`px-4 py-2 rounded-full text-xs tracking-[2px] uppercase transition-all ${
                isActive
                  ? 'bg-gold text-bg-deep border border-gold'
                  : count === 0
                    ? 'border border-gold/15 text-cream-soft/40 cursor-not-allowed'
                    : 'border border-gold/30 text-cream-soft/80 hover:text-gold hover:border-gold/70'
              }`}
            >
              {t.label}
              {count > 0 && <span className="ml-2 opacity-80">{count}</span>}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-cream-soft/60 italic py-8">Bu bo'limda hali sevimli yo'q.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.id} className="relative group">
              <Link
                to={`${active.route}/${it.slug}`}
                className="block aspect-[3/4] rounded-sm overflow-hidden border border-gold/20 hover:border-gold/70 transition"
              >
                <SmartImage
                  src={it[active.imageKey]}
                  alt={it.name || it.title}
                  initial={it.initial}
                  accent={it.accent}
                  objectPosition={it.imagePosition || 'center top'}
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-bg-deep to-transparent">
                  <p className="font-serif text-cream text-sm leading-tight">
                    {it.name || it.title}
                  </p>
                  {it.years && (
                    <p className="text-gold/70 text-[10px] tracking-[2px] mt-1">{it.years}</p>
                  )}
                </div>
              </Link>
              <div className="absolute top-2 right-2 z-10">
                <FavoriteButton section={active.key} itemId={it.id} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
