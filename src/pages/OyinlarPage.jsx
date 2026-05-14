import { useState } from 'react';
import useProgress from '../hooks/useProgress.js';
import DailyQuiz from '../components/oyinlar/DailyQuiz.jsx';
import WordPuzzle from '../components/oyinlar/WordPuzzle.jsx';
import MemoryMatch from '../components/oyinlar/MemoryMatch.jsx';
import TimelineSort from '../components/oyinlar/TimelineSort.jsx';

const GAMES = [
  {
    id: 'quiz',
    title: 'Bilim Bellashuvi',
    description: "Buyuk allomalar haqida 5 ta savol. Har bir to'g'ri javob 10 tanga!",
    maxCoins: 50,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-7 h-7">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'soz',
    title: "So'z O'yini",
    description: "Madaniy merosimizga oid 5 harfli so'zni 6 ta urinishda toping.",
    maxCoins: 50,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    id: 'xotira',
    title: "Xotira O'yini",
    description: "Allomalar va ularning asarlarini juftlashtiring. Kam harakatlarsangiz ko'proq tanga!",
    maxCoins: 60,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-7 h-7">
        <rect x="2" y="5" width="9" height="11" rx="1.5" />
        <rect x="13" y="8" width="9" height="11" rx="1.5" />
        <path d="M6.5 5V3M17.5 8V6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'vaqt',
    title: "Vaqt Chizig'i",
    description: "Tarixiy voqealarni to'g'ri ketma-ketlikda joylashtiring.",
    maxCoins: 60,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-7 h-7">
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

export default function OyinlarPage() {
  const { state, completeDailyGame } = useProgress();
  const [activeGame, setActiveGame] = useState(null);

  const today = new Date().toISOString().slice(0, 10);

  function isDoneToday(gameId) {
    return !!state.dailyGames?.[today]?.[gameId];
  }

  function getTodayCoins(gameId) {
    return state.dailyGames?.[today]?.[gameId]?.coins ?? 0;
  }

  function handleGameComplete(gameId, coins) {
    completeDailyGame(gameId, coins);
    setActiveGame(null);
  }

  const ActiveGameComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;
  const activeGameMeta = activeGame ? GAMES.find((g) => g.id === activeGame) : null;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-10 sm:py-14">
          <div className="text-gold/40 text-[10px] tracking-[5px] uppercase mb-3">Kunlik Vazifalar</div>
          <h1 className="font-serif text-4xl sm:text-5xl text-cream mb-3">O'yinlar</h1>
          <p className="text-cream/50 max-w-sm mx-auto text-sm">
            Har kuni yangi vazifalar. O'ynang, bilim oling, tanga yig'ing.
          </p>
          <div className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-gold/10 border border-gold/30 rounded-full">
            <CoinIcon size={18} />
            <span className="text-gold font-semibold">{state.coins ?? 0} tanga</span>
          </div>
        </div>

        {activeGame ? (
          <div>
            <button
              onClick={() => setActiveGame(null)}
              className="flex items-center gap-2 text-cream/50 hover:text-gold text-sm mb-5 transition-colors"
            >
              <span>←</span> Ortga
            </button>
            <div className="mb-4">
              <h2 className="text-cream font-semibold text-xl">{activeGameMeta?.title}</h2>
            </div>
            <div className="p-5 sm:p-7 bg-white/[0.03] border border-white/10 rounded-2xl">
              <ActiveGameComponent
                onComplete={(coins) => handleGameComplete(activeGame, coins)}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GAMES.map((game) => {
              const done = isDoneToday(game.id);
              const earned = getTodayCoins(game.id);
              return (
                <div
                  key={game.id}
                  onClick={() => !done && setActiveGame(game.id)}
                  className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                    done
                      ? 'bg-emerald-900/10 border-emerald-500/20'
                      : 'bg-white/[0.03] border-white/10 hover:border-gold/30 hover:bg-white/[0.06] cursor-pointer'
                  }`}
                >
                  {done && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-emerald-900/50 border border-emerald-500/30 rounded-full text-emerald-400 text-[11px] font-medium">
                      Bajarildi
                    </div>
                  )}
                  <div className={`text-gold mb-3 ${done ? 'opacity-40' : ''}`}>{game.icon}</div>
                  <h3 className={`font-semibold text-base mb-1 ${done ? 'text-cream/50' : 'text-cream'}`}>
                    {game.title}
                  </h3>
                  <p className="text-cream/50 text-xs leading-relaxed mb-4">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs">
                      <CoinIcon size={14} />
                      {done ? (
                        <span className="text-emerald-400 font-medium">+{earned} tanga olindi</span>
                      ) : (
                        <span className="text-gold/70">max {game.maxCoins} tanga</span>
                      )}
                    </div>
                    {!done && (
                      <span className="text-gold/50 text-xs">O'ynash →</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CoinIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="text-gold flex-shrink-0"
    >
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
