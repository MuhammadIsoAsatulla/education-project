import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import useProgress from '../../hooks/useProgress.js';
import OrnamentDivider from '../common/OrnamentDivider.jsx';
import GameModal from '../oyinlar/GameModal.jsx';
import DailyQuiz from '../oyinlar/DailyQuiz.jsx';
import WordPuzzle from '../oyinlar/WordPuzzle.jsx';
import MemoryMatch from '../oyinlar/MemoryMatch.jsx';
import TimelineSort from '../oyinlar/TimelineSort.jsx';

const GAMES = [
  {
    id: 'quiz',
    title: 'Bilim Bellashuvi',
    hint: '5 savol · 10 tanga/javob',
    maxCoins: 50,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'soz',
    title: "So'z O'yini",
    hint: '5 harf · 6 urinish',
    maxCoins: 50,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    id: 'xotira',
    title: "Xotira O'yini",
    hint: '8 juft · kam harakat = ko\'proq tanga',
    maxCoins: 60,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
        <rect x="2" y="5" width="9" height="11" rx="1.5" />
        <rect x="13" y="8" width="9" height="11" rx="1.5" />
        <path d="M6.5 5V3M17.5 8V6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'vaqt',
    title: "Vaqt Chizig'i",
    hint: 'Voqealarni tartibga soling',
    maxCoins: 60,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
        <path d="M3 12h18" strokeLinecap="round" />
        <circle cx="7" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.4" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.7" />
        <circle cx="17" cy="12" r="2" fill="currentColor" stroke="none" />
        <path d="M7 8v3M12 7v4M17 6v5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
];

const GAME_COMPONENTS = {
  quiz: DailyQuiz,
  soz: WordPuzzle,
  xotira: MemoryMatch,
  vaqt: TimelineSort,
};

const TOTAL_COINS = GAMES.reduce((s, g) => s + g.maxCoins, 0);

export default function DailyChallenge() {
  const { state, completeDailyGame } = useProgress();
  const [activeGame, setActiveGame] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const todayData = state.dailyGames?.[today] || {};
  const doneCount = Object.keys(todayData).length;
  const earnedToday = Object.values(todayData).reduce((s, g) => s + (g.coins || 0), 0);

  const activeGameMeta = activeGame ? GAMES.find((g) => g.id === activeGame) : null;
  const ActiveGameComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;

  function handleComplete(coins) {
    completeDailyGame(activeGame, coins);
    setActiveGame(null);
  }

  return (
    <>
      <section className="py-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-14 reveal">
          <OrnamentDivider className="opacity-60 mb-6" />
          <div className="eyebrow mb-4">— KUNLIK VAZIFA —</div>
          <h2 className="section-title mb-4">Bugungi Bellashuv</h2>
          <p className="font-serif italic text-xl text-cream-soft max-w-xl mx-auto opacity-80 mb-8">
            To'rtta sinovdan o'ting, bilimingizni sinang, tanga yig'ing.
          </p>

          {/* Progress row */}
          <div className="inline-flex items-center gap-6 px-6 py-3 border border-gold/20 rounded-sm bg-gold/5">
            <div className="text-center">
              <div className="text-gold font-semibold text-lg leading-none">{doneCount}/4</div>
              <div className="text-cream/40 text-[10px] tracking-[2px] uppercase mt-1">Bajarildi</div>
            </div>
            <div className="w-px h-8 bg-gold/20" />
            <div className="text-center">
              <div className="text-gold font-semibold text-lg leading-none flex items-center gap-1">
                <CoinIcon size={16} />
                {earnedToday}
              </div>
              <div className="text-cream/40 text-[10px] tracking-[2px] uppercase mt-1">
                / {TOTAL_COINS} max
              </div>
            </div>
            {doneCount === 4 && (
              <>
                <div className="w-px h-8 bg-gold/20" />
                <div className="text-emerald-400 text-[11px] tracking-[2px] uppercase">
                  ✓ Hammasi bajarildi
                </div>
              </>
            )}
          </div>
        </div>

        {/* Game cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GAMES.map((game) => {
            const done = !!todayData[game.id];
            const earned = todayData[game.id]?.coins ?? 0;
            return (
              <button
                key={game.id}
                onClick={() => !done && setActiveGame(game.id)}
                disabled={done}
                className={`group relative text-left overflow-hidden border transition-all duration-500 ease-out p-7 min-h-[220px] flex flex-col justify-between rounded-sm reveal ${
                  done
                    ? 'border-emerald-500/20 cursor-default'
                    : 'border-gold/20 hover:border-gold cursor-pointer'
                }`}
                style={{
                  background: done
                    ? 'linear-gradient(135deg, rgba(16,32,24,0.8) 0%, rgba(6,78,59,0.12) 100%)'
                    : 'linear-gradient(135deg, var(--bg-mid) 0%, var(--teal) 100%)',
                  transitionTimingFunction: 'var(--ease-out-expo)',
                }}
              >
                {/* hover shimmer */}
                {!done && (
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at top right, rgba(212,165,116,0.15), transparent 60%)',
                    }}
                  />
                )}
                {/* bottom gold line on hover */}
                {!done && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}

                <div className="relative z-10">
                  <div
                    className={`mb-4 transition-transform duration-500 ${
                      done ? 'opacity-30' : 'text-gold group-hover:scale-110 group-hover:-rotate-6'
                    }`}
                    style={{ color: done ? '#6ee7b7' : undefined }}
                  >
                    {game.icon}
                  </div>
                  <h3
                    className={`font-serif text-xl tracking-wide mb-1 ${
                      done ? 'text-cream/40' : 'text-cream'
                    }`}
                  >
                    {game.title}
                  </h3>
                  <p className="text-[12px] text-cream/40 tracking-wide">{game.hint}</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-4">
                  {done ? (
                    <>
                      <span className="text-[11px] text-emerald-400 tracking-[2px] uppercase">
                        ✓ Bajarildi
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                        <CoinIcon size={13} className="text-emerald-400" />+{earned}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-gold/60 text-xs">
                        <CoinIcon size={13} />
                        max {game.maxCoins}
                      </span>
                      <span className="text-gold/50 text-xs tracking-[2px] group-hover:gap-5 transition-all">
                        O'ynash →
                      </span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {activeGame && activeGameMeta && ActiveGameComponent && (
          <GameModal
            key={activeGame}
            game={activeGameMeta}
            GameComponent={ActiveGameComponent}
            onComplete={handleComplete}
            onClose={() => setActiveGame(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CoinIcon({ size = 16, className = 'text-gold' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 ${className}`}>
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
