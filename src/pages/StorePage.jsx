import { useState } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../hooks/useProgress.js';
import heroes from '../data/heroes.json';
import HeroCard from '../components/store/HeroCard.jsx';
import PackReveal from '../components/store/PackReveal.jsx';

const TABS = [
  { id: 'bozor', label: 'Bozor' },
  { id: 'paketlar', label: 'Paketlar' },
  { id: 'afsonaviy', label: 'Afsonaviy' },
  { id: 'toplam', label: "To'plam" },
];

const PACKS = [
  {
    id: 'common',
    name: 'Oddiy Paket',
    cost: 80,
    description: "1 ta tasodifiy kartochka: 75% Oddiy, 25% Kamyob",
    odds: { common: 75, rare: 25 },
    accent: '#d4a574',
  },
  {
    id: 'rare',
    name: 'Kamyob Paket',
    cost: 250,
    description: "1 ta tasodifiy kartochka: 60% Kamyob, 40% Oddiy",
    odds: { rare: 60, common: 40 },
    accent: '#7c3aed',
  },
];

function rollPack(packType, ownedIds) {
  const common = heroes.filter((h) => h.rarity === 'common' && !ownedIds.includes(h.id));
  const rare = heroes.filter((h) => h.rarity === 'rare' && !ownedIds.includes(h.id));
  const rand = Math.random();

  let pool, fallback;
  if (packType === 'common') {
    pool = rand < 0.75 ? common : rare;
    fallback = rand < 0.75 ? rare : common;
  } else {
    pool = rand < 0.60 ? rare : common;
    fallback = rand < 0.60 ? common : rare;
  }

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  if (pool.length > 0) return pick(pool);
  if (fallback.length > 0) return pick(fallback);
  return null;
}

export default function StorePage() {
  const { state, buyHero, addToCollection } = useProgress();
  const [tab, setTab] = useState('bozor');
  const [packResult, setPackResult] = useState(null);
  const [packCoinsDeducted, setPackCoinsDeducted] = useState(false);

  const owned = state.collection || [];
  const coins = state.coins || 0;

  const commonHeroes = heroes.filter((h) => h.rarity === 'common');
  const legendaryHeroes = heroes.filter((h) => h.rarity === 'legendary');

  function handleBuy(hero) {
    if (owned.includes(hero.id) || coins < hero.cost) return;
    buyHero(hero.id, hero.cost);
  }

  function handleOpenPack(pack) {
    if (coins < pack.cost) return;
    const rolled = rollPack(pack.id, owned);
    if (!rolled) {
      buyHero('__none__', pack.cost);
      return;
    }
    buyHero(rolled.id, pack.cost);
    setPackResult(rolled);
    setPackCoinsDeducted(true);
  }

  function handleAcceptPack() {
    setPackResult(null);
    setPackCoinsDeducted(false);
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-10 sm:py-14">
          <div className="text-gold/40 text-[10px] tracking-[5px] uppercase mb-3">Qahramonlar</div>
          <h1 className="font-serif text-4xl sm:text-5xl text-cream mb-3">Do'kon</h1>
          <p className="text-cream/50 max-w-sm mx-auto text-sm">
            Tarixiy qahramonlarning kartochkalarini yig'ing. Har bir kartochka — yangi kuch.
          </p>
          <div className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-gold/10 border border-gold/30 rounded-full">
            <CoinIcon size={18} />
            <span className="text-gold font-semibold">{coins} tanga</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-8 border border-white/10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${tab === t.id ? 'bg-gold text-bg-deep' : 'text-cream/60 hover:text-cream'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Pack reveal modal */}
        {packResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-bg-deep border border-gold/30 rounded-2xl p-6 max-w-sm w-full mx-4">
              <h3 className="text-gold font-serif text-2xl text-center mb-2">Yangi kartochka!</h3>
              <PackReveal hero={packResult} onAccept={handleAcceptPack} />
            </div>
          </div>
        )}

        {/* Tab: Bozor */}
        {tab === 'bozor' && (
          <div>
            <p className="text-cream/50 text-sm mb-5">Oddiy kartochkalarni to'g'ridan-to'g'ri tanga evaziga sotib oling.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {commonHeroes.map((hero) => {
                const isOwned = owned.includes(hero.id);
                const canAfford = coins >= hero.cost;
                return (
                  <div key={hero.id} className="flex flex-col gap-2">
                    <HeroCard hero={hero} owned={isOwned} />
                    {isOwned ? (
                      <div className="text-center text-emerald-400 text-xs font-medium py-1.5">
                        Mavjud
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuy(hero)}
                        disabled={!canAfford}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all
                          ${canAfford
                            ? 'bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25'
                            : 'bg-white/5 border border-white/10 text-cream/30 cursor-not-allowed'
                          }`}
                      >
                        <CoinIcon size={12} />
                        {hero.cost}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Paketlar */}
        {tab === 'paketlar' && (
          <div>
            <p className="text-cream/50 text-sm mb-5">
              Paketlardan kamyob kartochkalar chiqishi mumkin. Omad egasiga yordam beradi!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PACKS.map((pack) => {
                const canAfford = coins >= pack.cost;
                const allOwned = heroes
                  .filter((h) => ['common', 'rare'].includes(h.rarity))
                  .every((h) => owned.includes(h.id));
                return (
                  <div
                    key={pack.id}
                    className="p-5 rounded-xl border border-white/10 bg-white/[0.03]"
                    style={{ borderColor: `${pack.accent}40` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-cream font-semibold">{pack.name}</h3>
                      <div className="flex items-center gap-1 text-gold text-sm font-semibold">
                        <CoinIcon size={14} />
                        {pack.cost}
                      </div>
                    </div>
                    <p className="text-cream/50 text-xs mb-4 leading-relaxed">{pack.description}</p>
                    <div className="flex gap-2 mb-4">
                      {Object.entries(pack.odds).map(([rarity, pct]) => (
                        <div key={rarity} className="flex-1 text-center">
                          <div className="text-xs text-cream/40 mb-1">
                            {rarity === 'common' ? 'Oddiy' : rarity === 'rare' ? 'Kamyob' : 'Afsonaviy'}
                          </div>
                          <div
                            className="text-sm font-bold"
                            style={{ color: rarity === 'rare' ? '#a78bfa' : '#d4a574' }}
                          >
                            {pct}%
                          </div>
                        </div>
                      ))}
                    </div>
                    {allOwned ? (
                      <div className="text-center text-cream/40 text-xs py-2">Barcha kartochkalar mavjud</div>
                    ) : (
                      <button
                        onClick={() => handleOpenPack(pack)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all
                          ${canAfford
                            ? 'bg-gold text-bg-deep hover:bg-gold/90'
                            : 'bg-white/5 text-cream/30 cursor-not-allowed border border-white/10'
                          }`}
                      >
                        {canAfford ? 'Ochish' : "Yetarli tanga yo'q"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-cream/30 text-xs text-center mt-5">
              Afsonaviy kartochkalar paketdan chiqmaydi — ularni alohida usulda qo'lga kiriting.
            </p>
          </div>
        )}

        {/* Tab: Afsonaviy */}
        {tab === 'afsonaviy' && (
          <div className="flex flex-col gap-5">
            <p className="text-cream/50 text-sm">
              Afsonaviy kartochkalar faqat maxsus sinov yoki tadbirlar orqali olinadi.
            </p>
            {legendaryHeroes.map((hero) => {
              const isOwned = owned.includes(hero.id);
              return (
                <div
                  key={hero.id}
                  className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl border"
                  style={{
                    borderColor: `${hero.accent}50`,
                    background: `linear-gradient(135deg, #0d2b3e 0%, ${hero.accent}12 100%)`,
                  }}
                >
                  <div className="w-36 flex-shrink-0">
                    <HeroCard hero={hero} owned={isOwned} />
                  </div>
                  <div className="flex flex-col gap-3 flex-1 justify-center">
                    <div>
                      <h3 className="text-cream font-semibold text-lg">{hero.name}</h3>
                      <p className="text-cream/50 text-sm">{hero.title}</p>
                    </div>
                    <p className="text-cream/60 text-sm leading-relaxed">{hero.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {hero.unlockType?.includes('test') && (
                        isOwned ? (
                          <div className="px-4 py-2 bg-emerald-900/40 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium">
                            Sinov o'tildi ✓
                          </div>
                        ) : (
                          <Link
                            to={`/sinov/${hero.testId}`}
                            className="px-4 py-2 bg-amber-900/30 border border-amber-400/40 rounded-lg text-amber-300 text-sm font-medium hover:bg-amber-900/50 transition-colors"
                          >
                            Sinovdan o'tish →
                          </Link>
                        )
                      )}
                      {hero.unlockType?.includes('event') && (
                        <div className="px-4 py-2 bg-red-900/20 border border-red-500/20 rounded-lg text-red-300/60 text-sm">
                          Maxsus tadbir — Tez kunda
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab: To'plam */}
        {tab === 'toplam' && (
          <div>
            <p className="text-cream/50 text-sm mb-5">
              {owned.length}/{heroes.length} ta kartochka yig'ildi.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {heroes.map((hero) => {
                const isOwned = owned.includes(hero.id);
                return (
                  <div key={hero.id} className={`transition-all duration-300 ${isOwned ? '' : 'opacity-40 grayscale'}`}>
                    <HeroCard hero={hero} owned={isOwned} />
                    {!isOwned && (
                      <p className="text-center text-cream/30 text-[11px] mt-1.5">
                        {hero.rarity === 'legendary'
                          ? 'Sinov yoki tadbir'
                          : hero.packOnly
                          ? 'Paketdan'
                          : `${hero.cost} tanga`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CoinIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-gold flex-shrink-0">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v10M9 9.5C9 8.12 10.34 7 12 7s3 1.12 3 2.5S13.66 12 12 12s-3 1.12-3 2.5S10.34 17 12 17s3-1.12 3-2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
