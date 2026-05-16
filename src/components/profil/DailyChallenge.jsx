import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../../hooks/useProgress.js';
import MuhrIcon from './MuhrIcon.jsx';

const CHALLENGES = [
  {
    id: 'visit-alloma',
    label: 'Allomalar bo\'limidan 1 ta yangi alloma haqida o\'qing',
    icon: '📜',
    link: '/allomalar',
    cta: 'Allomalar',
  },
  {
    id: 'visit-muzey',
    label: 'Bir muzeyda 360° sayohatga chiqing',
    icon: '🏛',
    link: '/muzeylar',
    cta: 'Muzeylar',
  },
  {
    id: 'visit-musiqa',
    label: '1 ta mumtoz musiqa asarini tinglang',
    icon: '🎵',
    link: '/musiqa',
    cta: 'Musiqa',
  },
  {
    id: 'visit-kino',
    label: 'Bitta o\'zbek filmini ko\'rib chiqing',
    icon: '🎬',
    link: '/kinolar',
    cta: 'Kinolar',
  },
  {
    id: 'read-kitob',
    label: 'Bir kitobning kamida 5 sahifasini o\'qing',
    icon: '📖',
    link: '/kitoblar',
    cta: 'Kitoblar',
  },
  {
    id: 'take-quiz',
    label: 'Har qaysi viktorinada qatnashing',
    icon: '✓',
    link: '/allomalar',
    cta: 'Viktorinalar',
  },
  {
    id: 'leave-comment',
    label: 'Har qaysi sahifaga sharh qoldiring',
    icon: '✎',
    link: '/allomalar',
    cta: 'Boshlash',
  },
];

function dayIndex(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function DailyChallenge() {
  const { state, completeDailyChallenge } = useProgress();
  const today = new Date().toISOString().slice(0, 10);
  const isCompleted = state.daily?.completedDays?.includes(today);

  const challenge = useMemo(() => {
    const idx = dayIndex() % CHALLENGES.length;
    return CHALLENGES[idx];
  }, []);

  return (
    <div
      className="relative p-5 sm:p-6 border border-gold/30 rounded-sm overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 70% 30%, rgba(212,165,116,0.18), rgba(10,31,46,0.6) 70%)',
      }}
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 bg-girih opacity-20 pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="eyebrow text-[10px] mb-1">— BUGUNGI VAZIFA —</div>
            <h3 className="font-serif text-gold-gradient text-xl sm:text-2xl leading-tight">
              {isCompleted ? 'Vazifa bajarildi!' : challenge.label}
            </h3>
          </div>
          <span className="text-3xl sm:text-4xl flex-shrink-0">{challenge.icon}</span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-5 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-cream-soft/70 text-xs tracking-[2px] uppercase">Mukofot:</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 border border-gold/40 rounded-full text-xs">
                <span className="text-gold">+50</span>
                <span className="text-cream-soft/60">ball</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 border border-gold/40 rounded-full text-xs">
                <MuhrIcon type="bronze" size={14} />
                <span className="font-serif tabular-nums">5</span>
              </span>
            </div>
          </div>

          {isCompleted ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 border border-gold/60 bg-gold/15 text-gold rounded-full text-xs tracking-[2px] uppercase">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Bajarildi
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <Link to={challenge.link} className="gold-cta">
                <span>{challenge.cta} ga o'tish</span>
              </Link>
              <button
                onClick={() => completeDailyChallenge(challenge.id)}
                className="px-4 py-2 border border-gold/40 text-cream-soft hover:text-gold hover:border-gold rounded-full text-xs tracking-[2px] uppercase transition"
                title="Qo'lda bajarilgan deb belgilang"
              >
                Bajardim
              </button>
            </div>
          )}
        </div>

        {state.daily?.challengeStreak > 0 && (
          <div className="mt-4 pt-4 border-t border-gold/15 flex items-center gap-2 text-xs tracking-[1px]">
            <span className="text-gold">✧</span>
            <span className="text-cream-soft/70">
              Kunlik streak:{' '}
              <span className="text-gold font-serif tabular-nums">
                {state.daily.challengeStreak}
              </span>{' '}
              kun
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
