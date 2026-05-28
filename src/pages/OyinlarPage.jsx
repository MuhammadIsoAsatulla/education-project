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
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-9 h-9">
        <circle cx="24" cy="24" r="18" />
        <path d="M18 20a6 6 0 0 1 11.66 2c0 4-6 6-6 6" strokeLinecap="round" />
        <circle cx="24" cy="34" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'soz',
    title: "So'z O'yini",
    description: "Madaniy merosimizga oid 5 harfli so'zni 6 ta urinishda toping.",
    maxCoins: 50,
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-9 h-9">
        <rect x="6" y="6" width="36" height="36" rx="2" />
        <path d="M6 18h36M6 30h36M18 6v36M30 6v36" />
      </svg>
    ),
  },
  {
    id: 'xotira',
    title: "Xotira O'yini",
    description: "Allomalar va ularning asarlarini juftlashtiring. Kam harakatlarsangiz ko'proq tanga!",
    maxCoins: 60,
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-9 h-9">
        <rect x="4" y="10" width="18" height="22" rx="2" />
        <rect x="26" y="16" width="18" height="22" rx="2" />
        <path d="M13 10V7M35 16V13" strokeLinecap="round" />
        <path d="M8 21h10M30 27h10" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'vaqt',
    title: "Vaqt Chizig'i",
    description: "Tarixiy voqealarni to'g'ri ketma-ketlikda joylashtiring.",
    maxCoins: 60,
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-9 h-9">
        <path d="M6 24h36" strokeLinecap="round" />
        <circle cx="14" cy="24" r="3" fill="currentColor" stroke="none" opacity="0.35" />
        <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" opacity="0.65" />
        <circle cx="34" cy="24" r="3" fill="currentColor" stroke="none" />
        <path d="M14 18v5M24 14v9M34 10v13" strokeLinecap="round" opacity="0.45" />
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
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 130% 60% at 50% 0%, rgba(155,90,20,0.18) 0%, #0a1f2e 22%, #071a2e 50%, #040f1c 100%)',
      }}
    >
      {/* Girih texture */}
      <div className="absolute inset-0 bg-girih opacity-25 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute pointer-events-none" style={{
        top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,165,116,0.07) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center gap-5 justify-center mb-7">
            <div style={{ flex: 1, maxWidth: '130px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.4))' }} />
            <span style={{ fontFamily: 'var(--font-amiri)', color: 'rgba(212,165,116,0.55)', letterSpacing: '5px', fontSize: '11px', textTransform: 'uppercase' }}>
              Kunlik Vazifalar
            </span>
            <div style={{ flex: 1, maxWidth: '130px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(212,165,116,0.4))' }} />
          </div>
          <h1
            className="font-serif text-cream mb-4"
            style={{ fontSize: 'clamp(38px, 6vw, 56px)', letterSpacing: '5px' }}
          >
            O'yinlar
          </h1>
          <p style={{ color: 'rgba(245,235,210,0.45)', maxWidth: '320px', margin: '0 auto 1.5rem', fontSize: '14px', lineHeight: 1.7 }}>
            Har kuni yangi vazifalar. O'ynang, bilim oling, tanga yig'ing.
          </p>
          <div
            className="inline-flex items-center gap-2.5"
            style={{
              padding: '10px 28px',
              border: '1px solid rgba(212,165,116,0.3)',
              background: 'rgba(212,165,116,0.07)',
            }}
          >
            <CoinIcon size={17} />
            <span style={{ color: '#d4a574', fontWeight: 600, letterSpacing: '1px', fontSize: '15px' }}>
              {state.coins ?? 0} tanga
            </span>
          </div>
        </div>

        {/* Active game view */}
        {activeGame ? (
          <div>
            <button
              onClick={() => setActiveGame(null)}
              style={{ color: 'rgba(245,235,210,0.45)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = '#d4a574'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,235,210,0.45)'}
            >
              ← Ortga
            </button>
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-amiri)', color: 'rgba(212,165,116,0.55)', letterSpacing: '5px', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}>
                Kunlik Vazifa
              </p>
              <h2 className="font-serif text-cream" style={{ fontSize: '22px', letterSpacing: '1px' }}>
                {activeGameMeta?.title}
              </h2>
            </div>
            <div style={{
              border: '1px solid rgba(212,165,116,0.2)',
              background: 'rgba(212,165,116,0.04)',
              boxShadow: '0 0 50px rgba(212,165,116,0.05)',
              padding: '2rem 2rem 2rem',
            }}>
              <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.35), transparent)', marginBottom: '2rem' }} />
              <ActiveGameComponent onComplete={(coins) => handleGameComplete(activeGame, coins)} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GAMES.map((game) => {
              const done = isDoneToday(game.id);
              const earned = getTodayCoins(game.id);
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  done={done}
                  earned={earned}
                  onClick={() => !done && setActiveGame(game.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function GameCard({ game, done, earned, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => !done && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '1.6rem 1.5rem',
        border: done
          ? '1px solid rgba(52,211,153,0.2)'
          : hovered
          ? '1px solid rgba(212,165,116,0.4)'
          : '1px solid rgba(212,165,116,0.18)',
        background: done
          ? 'rgba(52,211,153,0.04)'
          : hovered
          ? 'rgba(212,165,116,0.07)'
          : 'rgba(212,165,116,0.03)',
        cursor: done ? 'default' : 'pointer',
        transition: 'border-color 0.3s ease, background 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Hover glow */}
      {!done && hovered && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 80% at 25% 30%, rgba(212,165,116,0.08), transparent)',
        }} />
      )}

      {/* Done badge */}
      {done && (
        <div style={{
          position: 'absolute', top: '1rem', right: '1rem',
          display: 'flex', alignItems: 'center', gap: '5px',
          color: 'rgba(52,211,153,0.75)', fontSize: '11px',
        }}>
          <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
            <path d="M13.7 3.3a1 1 0 0 0-1.4 0L6 9.6 3.7 7.3a1 1 0 0 0-1.4 1.4l3 3a1 1 0 0 0 1.4 0l7-7a1 1 0 0 0 0-1.4z" />
          </svg>
          Bajarildi
        </div>
      )}

      {/* Icon */}
      <div style={{ color: done ? 'rgba(212,165,116,0.28)' : '#d4a574', marginBottom: '1.1rem', transition: 'color 0.3s' }}>
        {game.icon}
      </div>

      {/* Title */}
      <h3 className="font-serif" style={{
        fontSize: '19px',
        letterSpacing: '0.5px',
        color: done ? 'rgba(245,235,210,0.35)' : 'rgba(245,235,210,0.95)',
        marginBottom: '0.5rem',
      }}>
        {game.title}
      </h3>

      {/* Description */}
      <p style={{
        color: 'rgba(245,235,210,0.42)',
        fontSize: '13px',
        lineHeight: 1.7,
        marginBottom: '1.3rem',
      }}>
        {game.description}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CoinIcon size={13} />
          {done ? (
            <span style={{ color: 'rgba(52,211,153,0.8)', fontSize: '12px', fontWeight: 500 }}>
              +{earned} tanga olindi
            </span>
          ) : (
            <span style={{ color: 'rgba(212,165,116,0.55)', fontSize: '12px' }}>
              max {game.maxCoins} tanga
            </span>
          )}
        </div>
        {!done && (
          <span style={{
            color: hovered ? '#d4a574' : 'rgba(212,165,116,0.4)',
            fontSize: '12px',
            letterSpacing: '1px',
            transition: 'color 0.3s',
          }}>
            O'ynash →
          </span>
        )}
      </div>
    </div>
  );
}

function CoinIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color: '#d4a574', flexShrink: 0 }}>
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
