import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useProgress from '../../hooks/useProgress.js';
import MuhrIcon from './MuhrIcon.jsx';

// Each challenge ships with a `verify(state)` that scans today's activity log
// to confirm the user actually did the work. The Bajardim button is disabled
// until verify() returns true. This was the #1 exploit: before, the button
// just gave 50 pts + 5 bronze on click with no checks.
const CHALLENGES = [
  {
    id: 'visit-alloma',
    label: "Allomalar bo'limidan 1 ta yangi alloma haqida o'qing",
    icon: '📜',
    link: '/allomalar',
    cta: 'Allomalar',
    verify: (state, todayStart) =>
      (state.recentActivity || []).some(
        (a) =>
          a.type === 'visit' && a.payload?.section === 'allomalar' && a.at >= todayStart,
      ),
    hint: "Bugun yangi alloma sahifasiga kiring.",
  },
  {
    id: 'visit-muzey',
    label: 'Bir muzeyda 360° sayohatga chiqing',
    icon: '🏛',
    link: '/muzeylar',
    cta: 'Muzeylar',
    verify: (state, todayStart) =>
      (state.recentActivity || []).some(
        (a) =>
          a.type === 'visit' && a.payload?.section === 'muzeylar' && a.at >= todayStart,
      ),
    hint: "Muzey sahifasida 360° sayohatni kamida 75% ko'rib chiqing.",
  },
  {
    id: 'visit-musiqa',
    label: "1 ta mumtoz musiqa asarini tinglang",
    icon: '🎵',
    link: '/musiqa',
    cta: 'Musiqa',
    verify: (state, todayStart) =>
      (state.recentActivity || []).some(
        (a) =>
          a.type === 'visit' && a.payload?.section === 'musiqa' && a.at >= todayStart,
      ),
    hint: "Karaoke yoki tinglash uchun bir qo'shiq oching.",
  },
  {
    id: 'visit-kino',
    label: "Bitta o'zbek filmini ko'rib chiqing",
    icon: '🎬',
    link: '/kinolar',
    cta: 'Kinolar',
    verify: (state, todayStart) =>
      (state.recentActivity || []).some(
        (a) =>
          a.type === 'visit' && a.payload?.section === 'kinolar' && a.at >= todayStart,
      ),
    hint: "Film sahifasida videoning kamida 70% ko'rib chiqing.",
  },
  {
    id: 'read-kitob',
    label: "Bir kitobning kamida 5 sahifasini o'qing",
    icon: '📖',
    link: '/kitoblar',
    cta: 'Kitoblar',
    verify: (state, todayStart) => {
      const pagesToday = (state.recentActivity || [])
        .filter((a) => a.type === 'reading' && a.at >= todayStart)
        .reduce((sum, a) => sum + (a.payload?.newPages || 0), 0);
      return pagesToday >= 5;
    },
    hint: "Mutolaa rejimida kamida 5 ta yangi sahifani aylantiring.",
  },
  {
    id: 'take-quiz',
    label: "Har qaysi viktorinada qatnashing",
    icon: '✓',
    link: '/allomalar',
    cta: 'Viktorinalar',
    verify: (state, todayStart) =>
      (state.recentActivity || []).some((a) => a.type === 'quiz' && a.at >= todayStart),
    hint: "Istalgan sahifadagi viktorinani boshlab javob bering.",
  },
  {
    id: 'leave-comment',
    label: "Har qaysi sahifaga sharh qoldiring",
    icon: '✎',
    link: '/allomalar',
    cta: 'Boshlash',
    verify: (state, todayStart) =>
      (state.recentActivity || []).some(
        (a) => a.type === 'comment-added' && a.at >= todayStart,
      ),
    hint: "Detal sahifasida pastdagi 'Sharhlar' bo'limiga yozing.",
  },
];

function dayIndex(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function startOfTodayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function DailyChallenge() {
  const { state, completeDailyChallenge } = useProgress();
  const today = new Date().toISOString().slice(0, 10);
  const isCompleted = state.daily?.completedDays?.includes(today);

  const challenge = useMemo(() => {
    const idx = dayIndex() % CHALLENGES.length;
    return CHALLENGES[idx];
  }, []);

  // Verify the underlying work was actually done today.
  const verified = useMemo(() => {
    if (isCompleted) return true;
    return challenge.verify(state, startOfTodayMs());
  }, [challenge, state, isCompleted]);

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

        <div className="flex flex-col gap-3 mt-5 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-cream-soft/70 text-xs tracking-[2px] uppercase">Mukofot:</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 border border-gold/40 rounded-full text-xs">
                <span className="text-gold">+50</span>
                <span className="text-cream-soft/60">ball</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 border border-gold/40 rounded-full text-xs">
                <MuhrIcon type="bronze" size={14} />
                <span className="font-serif tabular-nums">2</span>
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
                onClick={() => verified && completeDailyChallenge(challenge.id)}
                disabled={!verified}
                className={`px-4 py-2 border rounded-full text-xs tracking-[2px] uppercase transition ${
                  verified
                    ? 'border-gold/60 text-gold hover:bg-gold hover:text-bg-deep'
                    : 'border-gold/15 text-cream-soft/30 cursor-not-allowed'
                }`}
                title={
                  verified
                    ? "Mukofotni olish"
                    : "Avval vazifani bajaring — keyin bu tugma faollashadi"
                }
              >
                {verified ? '✓ Mukofotni olish' : 'Bajarish kerak'}
              </button>
            </div>
          )}
        </div>

        {/* Hint shown while the challenge isn't yet verifiable, so users know
            what specifically counts as "done" for today. */}
        {!isCompleted && !verified && (
          <p className="mt-3 text-cream-soft/55 text-[11px] italic leading-relaxed">
            {challenge.hint}
          </p>
        )}

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
